import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);
const {build}=require(process.env.ESBUILD_MODULE||'esbuild');
const scratch=await mkdtemp(path.join(tmpdir(),'vogue-preview-tests-'));
await build({entryPoints:['src/always-on/preview-image.ts'],bundle:true,platform:'node',format:'esm',outfile:path.join(scratch,'preview.mjs')});
const {verifyPreviewImage,PreviewImageUnavailable,stagePreviewOrigin}=await import(pathToFileURL(path.join(scratch,'preview.mjs')));
test.after(()=>rm(scratch,{recursive:true,force:true}));
const initial={request_id:'same-request',status:'COMPLETE',image:{url:'https://example.test/missing.webp'}};
const noWait=async()=>{};
test('delivery delay refreshes the same request and returns only a decoded asset',async()=>{
 const reads=[],decoded=[];
 const url=await verifyPreviewImage(initial,async id=>{reads.push(id);return {...initial,image:{url:'https://example.test/ready.webp'}}},{wait:noWait,decode:async url=>{decoded.push(url);if(url.includes('missing'))throw Error('404')}});
 assert.equal(url,'https://example.test/ready.webp');assert.deepEqual(reads,['same-request']);assert.equal(decoded.length,2);
});
test('persistent missing images stop after bounded refreshes and retain request ID',async()=>{
 let reads=0,decodes=0;
 await assert.rejects(verifyPreviewImage(initial,async()=>{reads++;return initial},{wait:noWait,decode:async()=>{decodes++;throw Error('404')}}),error=>error instanceof PreviewImageUnavailable&&error.requestId==='same-request');
 assert.equal(reads,3);assert.equal(decodes,4);
});
test('manual recovery without a URL resolves the existing request rather than a substitute',async()=>{
 const reads=[];
 const url=await verifyPreviewImage({request_id:'same-request'},async id=>{reads.push(id);return {...initial,image:{url:'https://example.test/recovered.webp'}}},{wait:noWait,decode:async()=>{}});
 assert.deepEqual(reads,['same-request']);assert.equal(url,'https://example.test/recovered.webp');
});
test('an API failure remains recoverable without exposing its raw error',async()=>{
 let reads=0;
 await assert.rejects(verifyPreviewImage(initial,async()=>{reads++;throw Error('private service detail')},{wait:noWait,decode:async()=>{throw Error('404')}}),error=>error.requestId==='same-request'&&!error.message.includes('private'));
 assert.equal(reads,3);
});
test('failed or still-processing results never count as a ready image',async()=>{
 let decodes=0;
 await assert.rejects(verifyPreviewImage({...initial,status:'FAILED'},async()=>initial,{wait:noWait,decode:async()=>{decodes++}}),PreviewImageUnavailable);
 await assert.rejects(verifyPreviewImage({...initial,status:'PROCESSING'},async()=>({...initial,status:'PROCESSING'}),{wait:noWait,decode:async()=>{decodes++}}),PreviewImageUnavailable);
 assert.equal(decodes,0);
});
test('a valid image does not cause unnecessary service refreshes',async()=>{
 const url=await verifyPreviewImage(initial,async()=>{assert.fail('unnecessary refresh')},{decode:async()=>{}});assert.equal(url,initial.image.url);
});

const rid='01234567-89ab-cdef-0123-456789abcdef',uid='fedcba98-7654-3210-fedc-ba9876543210';
const cdn='https://cdn-minio.stage.spreeai.com/users/'+uid+'/'+rid+'.webp';
const origin='https://api-minio.stage.spreeai.com/users/'+uid+'/'+rid+'.webp';
test('staging delivery recovery loads the identical render from its known origin',async()=>{
 const decoded=[];
 const url=await verifyPreviewImage({request_id:rid,status:'COMPLETE',image:{url:cdn}},async()=>{assert.fail('no refresh needed')},{allowStageOrigin:true,decode:async url=>{decoded.push(url);if(url===cdn)throw Error('404')}});
 assert.equal(url,origin);assert.deepEqual(decoded,[cdn,origin]);
});
test('origin recovery is explicitly opt-in and does not alter unrelated service URLs',async()=>{
 const decoded=[];
 await assert.rejects(verifyPreviewImage({request_id:rid,status:'COMPLETE',image:{url:cdn}},async()=>{assert.fail('no refresh configured')},{delays:[],decode:async url=>{decoded.push(url);throw Error('404')}}),PreviewImageUnavailable);
 assert.deepEqual(decoded,[cdn]);
});
test('origin recovery rejects signed links, foreign hosts, inputs and mismatched render IDs',()=>{
 for(const bad of [cdn+'?X-Amz-Signature=example',cdn+'#fragment',cdn.replace('https:','http:'),cdn.replace('cdn-minio.stage.spreeai.com','untrusted.test'),cdn.replace('/users/','/avatars/'),cdn.replace('/'+rid+'.webp','/tryon-inputs/'+rid+'.png'),cdn.replace(rid,uid),cdn.replace('.webp','.txt'),cdn.replace('https://','https://user:password@')])assert.equal(stagePreviewOrigin(bad,rid),null);
 assert.equal(stagePreviewOrigin(cdn,'not-a-request-id'),null);assert.equal(stagePreviewOrigin(cdn,rid),origin);
});
test('both delivery paths failing never produce a ready preview',async()=>{
 const decoded=[];
 await assert.rejects(verifyPreviewImage({request_id:rid,status:'COMPLETE',image:{url:cdn}},async()=>{assert.fail('no refresh configured')},{delays:[],allowStageOrigin:true,decode:async url=>{decoded.push(url);throw Error('404')}}),error=>error instanceof PreviewImageUnavailable&&error.requestId===rid);
 assert.deepEqual(decoded,[cdn,origin]);
});

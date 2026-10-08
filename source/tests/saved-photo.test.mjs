import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url),{build}=require(process.env.ESBUILD_MODULE||'esbuild');
const scratch=await mkdtemp(path.join(tmpdir(),'vogue-photo-tests-'));
await build({entryPoints:['src/always-on/saved-photo.ts'],bundle:true,platform:'node',format:'esm',outfile:path.join(scratch,'photo.mjs')});
const {recoverSavedPhoto,stagePhotoOrigin}=await import(pathToFileURL(path.join(scratch,'photo.mjs')));
test.after(()=>rm(scratch,{recursive:true,force:true}));
test('a displayable saved upload needs no lookup',async()=>{
 const decoded=[];assert.equal(await recoverSavedPhoto('current',async()=>assert.fail('unnecessary lookup'),{decode:async url=>{decoded.push(url)},expired:()=>false}),'current');assert.deepEqual(decoded,['current']);
});
test('an expired link is renewed before it is shown',async()=>{
 const decoded=[];assert.equal(await recoverSavedPhoto('expired',async()=>'fresh',{decode:async url=>{decoded.push(url)},expired:url=>url==='expired'}),'fresh');assert.deepEqual(decoded,['fresh']);
});
test('a failed upload URL recovers through the same-photo resolver',async()=>{
 const decoded=[];let reads=0;assert.equal(await recoverSavedPhoto('broken',async()=>{reads++;return 'renewed'},{decode:async url=>{decoded.push(url);if(url==='broken')throw Error('404')},expired:()=>false}),'renewed');assert.equal(reads,1);assert.deepEqual(decoded,['broken','renewed']);
});
test('retry bypasses the broken URL and never treats another failed URL as ready',async()=>{
 let reads=0;const decoded=[];await assert.rejects(recoverSavedPhoto('broken',async()=>{reads++;return 'still-broken'},{forceRefresh:true,decode:async url=>{decoded.push(url);throw Error('404')},expired:()=>false}));assert.equal(reads,1);assert.deepEqual(decoded,['still-broken']);
});
test('a missing or expired renewed photo fails without loading an unverified image',async()=>{
 for(const fresh of ['', 'expired'])await assert.rejects(recoverSavedPhoto('broken',async()=>fresh,{forceRefresh:true,decode:async()=>assert.fail('must not decode invalid link'),expired:url=>url==='expired'}));
});

const id='01234567-89ab-cdef-0123-456789abcdef',user='fedcba98-7654-3210-fedc-ba9876543210';
const cdn='https://cdn-minio.stage.spreeai.com/users/'+user+'/tryon-inputs/'+id+'.jpg',origin=cdn.replace('cdn-minio','api-minio');
test('Vogue can recover the exact selected upload at the known staging origin',async()=>{
 const decoded=[];const result=await recoverSavedPhoto(cdn,async()=>assert.fail('no refresh needed'),{photoId:id,allowStageOrigin:true,decode:async url=>{decoded.push(url);if(url===cdn)throw Error('404')}});assert.equal(result,origin);assert.deepEqual(decoded,[cdn,origin]);
});
test('upload origin recovery is opt-in and rejects signed or mismatched links',async()=>{
 for(const bad of [cdn+'?X-Amz-Signature=example',cdn+'#fragment',cdn.replace(id,user),cdn.replace('/tryon-inputs/','/'),cdn.replace('https:','http:'),cdn.replace('cdn-minio.stage.spreeai.com','example.test'),cdn.replace('https://','https://username:password@')])assert.equal(stagePhotoOrigin(bad,id),null);
 assert.equal(stagePhotoOrigin(cdn,'invalid'),null);assert.equal(stagePhotoOrigin(cdn,id),origin);
 const decoded=[];await assert.rejects(recoverSavedPhoto(cdn,undefined,{photoId:id,decode:async url=>{decoded.push(url);throw Error('404')}}));assert.deepEqual(decoded,[cdn]);
});
test('a failed origin is not displayed and still attempts same-photo link renewal',async()=>{
 const decoded=[];let reads=0;await assert.rejects(recoverSavedPhoto(cdn,async()=>{reads++;return cdn},{photoId:id,allowStageOrigin:true,decode:async url=>{decoded.push(url);throw Error('404')}}));assert.equal(reads,1);assert.deepEqual(decoded,[cdn,origin,cdn,origin]);
});

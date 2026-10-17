import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const temp=await mkdtemp(path.join(tmpdir(),'vogue-save-pose-'));
await build({entryPoints:['src/partner-demo/saved-looks.ts','src/always-on/pose-preview.ts'],outdir:temp,bundle:true,platform:'node',format:'esm',outExtension:{'.js':'.mjs'}});
const saves=await import(pathToFileURL(path.join(temp,'partner-demo/saved-looks.mjs'))),poses=await import(pathToFileURL(path.join(temp,'always-on/pose-preview.mjs')));
test.after(()=>rm(temp,{recursive:true,force:true}));
const catalog=[{id:'a',name:'Jacket'},{id:'b',name:'Bag'},{id:'c',name:'Skirt'}],slug='vogue';
function store(values={}){const data=new Map(Object.entries(values));return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}}
test('old ribbon favorites and saved outfits migrate together without duplicates',()=>{
 const s=store({voguewishlist:'["a","b","unknown"]','vogue:saved-outfits:v1':JSON.stringify([{id:'model:a',items:['a'],name:'Old title',created:2},{id:'model:b-a',items:['b','a'],created:3},{id:'other:a-b',items:['a','b'],created:4},{items:['unknown']}])});
 const list=saves.readSavedLooks(s,catalog,slug);assert.equal(list.length,3);assert.deepEqual(list.map(x=>x.id).sort(),['look:a','look:a|b','look:b']);
 assert.equal(saves.toggleSavedLook(s,catalog,slug,['a']),false);assert.equal(saves.readSavedLooks(s,catalog,slug).some(x=>x.id==='look:a'),false);
 assert.equal(saves.readSavedLooks(s,catalog,slug).length,2);assert.equal(s.getItem('voguewishlist'),'["b"]');
});
test('saved piece persists after remount and toggles independently of model identity',()=>{
 const s=store();assert.equal(saves.toggleSavedLook(s,catalog,slug,['a'],'Olivia'),true);assert.equal(saves.readSavedLooks(s,catalog,slug)[0].name,'Jacket');
 assert.equal(saves.toggleSavedLook(s,catalog,slug,['a'],'Other model'),false);assert.deepEqual(saves.readSavedLooks(s,catalog,slug),[]);
});
test('outfit order is immaterial and removing an outfit preserves separate piece saves',()=>{
 const s=store();saves.toggleSavedLook(s,catalog,slug,['a']);saves.toggleSavedLook(s,catalog,slug,['b','a']);assert.equal(saves.readSavedLooks(s,catalog,slug).length,2);
 assert.equal(saves.toggleSavedLook(s,catalog,slug,['a','b']),false);assert.deepEqual(saves.readSavedLooks(s,catalog,slug).map(x=>x.items),[['a']]);
});
test('malformed legacy data is ignored and invalid saves are rejected',()=>{
 const s=store({voguewishlist:'{}','vogue:saved-outfits:v1':'not json'});assert.deepEqual(saves.readSavedLooks(s,catalog,slug),[]);
 assert.throws(()=>saves.toggleSavedLook(s,catalog,slug,[]));assert.throws(()=>saves.toggleSavedLook(s,catalog,slug,['unknown']));
});
test('storage failures never report a successful save',()=>{const s={getItem:()=>null,setItem:()=>{throw Error('Quota')}};assert.throws(()=>saves.toggleSavedLook(s,catalog,slug,['a']),/Quota/)});
test('pose choices map to the verified SPREEAI presets and independent cache keys',()=>{
 assert.deepEqual(poses.posePresets.map(p=>p.label),['Straight-on','Side profile','Three-quarter']);
 assert.deepEqual(poses.poseRequestOptions('editorial'),{pose_preset:'editorial',do_not_use_cache:true});assert.deepEqual(poses.poseRequestOptions('three_quarter'),{pose_preset:'three_quarter',do_not_use_cache:true});assert.deepEqual(poses.poseRequestOptions(),{});
 assert.notEqual(poses.poseCacheSuffix('editorial'),poses.poseCacheSuffix('three_quarter'));assert.equal(poses.poseCacheSuffix(''),'');
});
test('a repeated front result cannot masquerade as an alternate pose, even after URL renewal',()=>{
 assert.equal(poses.isRepeatedFrontPreview('editorial','https://images.test/front.jpg?signature=new','https://images.test/front.jpg?signature=old'),true);
 assert.equal(poses.isRepeatedFrontPreview('three_quarter','https://images.test/quarter.jpg','https://images.test/front.jpg'),false);
 assert.equal(poses.isRepeatedFrontPreview('','same','same'),false);
});

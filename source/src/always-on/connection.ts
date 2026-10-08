import {PreviewImageUnavailable} from './preview-image';
import {tryonRetryDelay} from './retry-after';
import {clearShoppingState} from './useShoppingState';
import {createTwinCatalog} from './twin-catalog';
import {clearPreviews} from './preview-cache';
import {beginLoading} from './loading';
import {useSyncExternalStore} from 'react';
import {clearHistory} from './history';
export const API=window.PARTNER_DEMO?.api||'https://api.dev.spreeai.com';
export const PARTNER=window.PARTNER_DEMO?.partnerId||'demo-site';
export const CLIENT='0176d724-9f01-0000-0100-6d3312d5c396';
type Session={access_token:string;refresh_token:string;expires_in:string;expiresAt:number};
export type Identity={id:string;url:string;name:string;kind:'twin'|'photo';height:number;weight:number;bodyType:'Feminine'|'Masculine';usualSize?:string};
export type ConnectedProfile={identity:Identity|null;authenticated:boolean;name:string;version:number};
const key=PARTNER+':spree-dev-session-v1',profileKey=PARTNER+':spree-dev-profile-v1';
function read<T>(k:string,fallback:T):T{try{return JSON.parse(sessionStorage.getItem(k)||'null')||fallback}catch{return fallback}}
let session=read<Session|null>(key,null),profile=read<ConnectedProfile>(profileKey,{identity:null,authenticated:false,name:'',version:0});
if(profile.identity?.kind==='photo'&&!read<string[]>(PARTNER+':spree-session-upload-ledger',[]).includes(profile.identity.id))profile={...profile,identity:null};
if(window.PARTNER_DEMO?.theme==='vogue'&&profile.identity&&!profile.identity.url)profile={...profile,identity:null};
if(!session)profile={identity:null,authenticated:false,name:'',version:0};
let flight:Promise<Session>|null=null,epoch=0;
const listeners=new Set<()=>void>();
function save(){try{sessionStorage.setItem(key,JSON.stringify(session));sessionStorage.setItem(profileKey,JSON.stringify(profile))}catch{}listeners.forEach(f=>f())}
export function useConnectedProfile(){return useSyncExternalStore(f=>{listeners.add(f);return()=>{listeners.delete(f)}},()=>profile)}
export function currentProfile(){return profile}
export function currentSessionRevision(){return epoch}
export function selectIdentity(identity:Identity|null){profile={...profile,identity,version:profile.version+1};save()}
const uploadLedgerKey=PARTNER+':spree-session-upload-ledger';
function uploadLedger():string[]{return read<string[]>(uploadLedgerKey,[])}
export function forgetSessionPhotos(){sessionStorage.removeItem(uploadLedgerKey)}
export function clearConnectedSession(){forgetSessionPhotos();for(const key of Object.keys(sessionStorage))if(key.startsWith('ao-looks:'))sessionStorage.removeItem(key);clearShoppingState();clearHistory();clearPreviews();epoch++;session=null;flight=null;productionSession=null;productionFlight=null;productionIdentities.clear();demoTwinImages.clear();profile={identity:null,authenticated:false,name:'',version:profile.version+1};save()}
async function raw(path:string,method:string,body?:unknown,token?:string,base=API,rateRetry=0):Promise<any>{const finishLoading=beginLoading();try{const r=await fetch(base+path,{method,headers:{...(body instanceof FormData?{}:{'Content-Type':'application/json'}),...(token?{Authorization:'Bearer '+token}:{})},body:body===undefined?undefined:body instanceof FormData?body:JSON.stringify(body),signal:AbortSignal.timeout(body instanceof FormData?60000:30000)});const d=await r.json().catch(()=>null);if(r.status===429&&rateRetry===0&&window.PARTNER_DEMO?.theme==='vogue'&&method==='POST'&&/^\/v3(?:\.1)?\/store-experience\/tryon$/.test(path)){const delay=tryonRetryDelay(r.headers.get('Retry-After'),d?.errors?.[0]?.retry_after,rateRetry);if(delay!==null){await new Promise(resolve=>setTimeout(resolve,delay));return raw(path,method,body,token,base,1)}}if(!r.ok)throw Object.assign(new Error(r.status===429&&window.PARTNER_DEMO?.theme==='vogue'?'The preview service is busy. Please wait a moment, then retry.':d?.error==='garment_not_ready'?(d?.variant_status==='FAILED'?'This piece needs to be prepared again before live try-on is available.':'This piece is still being prepared. Please try another piece.'):d?.errors?.[0]?.message||d?.message||`SPREEAI could not complete this request (${r.status}).`),{httpStatus:r.status,serviceCode:d?.error,variantStatus:d?.variant_status});return d}finally{finishLoading()}}
export async function ensureSession(){if(session&&session.expiresAt>Date.now()+60000)return session;if(flight)return flight;const start=epoch;flight=(async()=>{let d;try{d=await raw(session?'/v1/auth/refresh':'/v1/user/guest','POST',session?{refresh_token:session.refresh_token,partner_id:PARTNER}:{partner_id:PARTNER,language:'en'})}catch(error){if(!session||![400,401].includes((error as {httpStatus:number}).httpStatus))throw error;session=null;if(profile.identity?.kind==='photo')profile={...profile,identity:null,version:profile.version+1};d=await raw('/v1/user/guest','POST',{partner_id:PARTNER,language:'en'})}if(epoch!==start)throw Error('Your session changed. Please try again.');if(!d?.access_token)throw Error('Unable to start your SPREEAI session.');session={...d,expiresAt:Date.now()+Number(d.expires_in)*1000};save();return session!})().finally(()=>{if(epoch===start)flight=null});return flight}
export async function request<T>(path:string,method='GET',body?:unknown,base=API):Promise<T>{const start=epoch,s=await ensureSession();if(start!==epoch)throw Error('Your session changed.');let d;try{d=await raw(path,method,body,s.access_token,base)}catch(error){if((error as {httpStatus?:number}).httpStatus!==401||base!==API)throw error;session=null;flight=null;const fresh=await ensureSession();d=await raw(path,method,body,fresh.access_token,base)}if(start!==epoch)throw Error('Your session changed. Please try again.');return d}
export async function login(email:string,password:string){const start=epoch;const d=await raw('/v1/auth/login','POST',{email,password,partner_id:PARTNER,client_id:CLIENT});if(start!==epoch)throw Error('Your session changed.');acceptSession(d)}
function acceptSession(d:Session){clearShoppingState();clearHistory();clearPreviews();if(!d?.access_token)throw Error('Sign-in did not return a session.');epoch++;session={...d,expiresAt:Date.now()+Number(d.expires_in)*1000};profile={identity:null,authenticated:true,name:'',version:profile.version+1};save()}
export async function createAccount(email:string,password:string){await raw('/v2/user','POST',{email,password,partner_id:PARTNER,language:'en'})}
export async function confirmAccount(email:string,code:string){acceptSession(await raw('/v1/user/confirmsignup','POST',{email,confirmation_code:code}))}
export const forgotPassword=(email:string)=>raw('/v1/auth/forgotpassword','POST',{email});
export type Avatar={id:string;name:string;url:string;sex:string;user_height_centimeters:number;user_weight_kilograms:number;user_tshirt_size:string};
function verifiedTwins(rows:Avatar[]){if(window.PARTNER_DEMO?.theme!=='vogue')return rows;const usable=rows.filter(a=>a.url&&/^https?:/.test(a.url));if(!usable.length)throw Error('Twins are temporarily unavailable while SPREEAI restores their images. You can still add your own photo or browse the edit.');return usable}
const twinPath='/v1/avatars?partnerID='+encodeURIComponent(PARTNER)+'&inheritpartner=true&inheritdefault=true';
export const listTwins=createTwinCatalog<Avatar>(
 async()=> verifiedTwins((await request<{avatars:Avatar[]}>(twinPath)).avatars),
 async()=>{const guest=await raw('/v1/user/guest','POST',{partner_id:PARTNER,language:'en'});if(!guest?.access_token)throw Error('Unable to load Twins. Please try again.');return verifiedTwins((await raw(twinPath,'GET',undefined,guest.access_token)).avatars)}
);
export const avatarIdentity=(a:Avatar):Identity=>({id:a.id,url:a.url,name:a.name,kind:'twin',height:a.user_height_centimeters,weight:a.user_weight_kilograms,bodyType:a.sex==='M'?'Masculine':'Feminine',usualSize:a.user_tshirt_size});
export async function saveMeasurements(identity:Identity){if(!Number.isFinite(identity.height)||identity.height<100||identity.height>230||!Number.isFinite(identity.weight)||identity.weight<30||identity.weight>250)throw Error('Enter a height between 100 and 230 cm and a weight between 30 and 250 kg.');const version=profile.version;await request('/v2/user','PUT',{height_centimeters:identity.height,weight_kilograms:identity.weight,body_type:identity.bodyType});if(profile.version!==version)throw Error('Your profile changed. Please try again.');selectIdentity(identity)}
export async function uploadPhoto(file:File){const f=new FormData();f.append('user_image',file);f.append('source','web-sdk');f.append('is_uploaded','true');const photo=await request<{id:string;url:string}>('/v2/store-experience/user-images','POST',f);if(!validPhoto(photo))throw Error('Your photo upload returned an incomplete result. Please choose your photo again.');sessionStorage.setItem(uploadLedgerKey,JSON.stringify([...new Set([...uploadLedger(),photo.id])]));return photo}
function validPhoto(photo:unknown):photo is {id:string;url:string}{if(!photo||typeof photo!=='object')return false;const p=photo as {id?:unknown;url?:unknown};if(typeof p.id!=='string'||!p.id.trim()||typeof p.url!=='string')return false;try{return ['https:','http:'].includes(new URL(p.url).protocol)}catch{return false}}
export async function listPhotos(){const result=await request<{images:unknown[]}>('/v2/store-experience/user-images');if(!Array.isArray(result?.images)||result.images.some(photo=>!validPhoto(photo)))throw Error('Saved photos could not be verified. Choose a photo from your device.');const images=result.images as {id:string;url:string}[];if(new Set(images.map(p=>p.id)).size!==images.length)throw Error('Saved photos could not be verified. Choose a photo from your device.');return {images:images.filter(photo=>uploadLedger().includes(photo.id))}}

export const getUser=()=>request<{height_centimeters?:number;weight_kilograms?:number;body_type?:string;first_name?:string}>('/v2/user');
export type Render={request_id:string;status:string;image?:{url:string};detail?:string;sizing?:{size?:string;smaller_size?:string;larger_size?:string}};
export async function poll<T>(path:string,done:(d:T)=>boolean,failed:(d:T)=>boolean,signal:AbortSignal,ms=180000):Promise<T>{const start=Date.now();while(!signal.aborted){const d=await request<T>(path);if(signal.aborted)throw Error('Cancelled');if(failed(d))throw Error('SPREEAI could not generate this view. Please try another piece or photo.');if(done(d))return d;if(Date.now()-start>ms)throw Error('This is taking longer than expected. Please try again shortly.');await new Promise(r=>setTimeout(r,2000))}throw Error('Cancelled')}
// Re-register approved catalog Twins in the current staging guest session.
// Keep this distinct from shopper uploads and never put Twin images in the photo ledger.
const demoTwinImages=new Map<string,Promise<string>>();
async function connectedTwinImage(identity:Identity,signal:AbortSignal){
 if(window.PARTNER_DEMO?.theme!=='vogue'||identity.kind!=='twin')return identity.id;
 const scope=epoch,key=scope+':'+identity.id;
 if(!demoTwinImages.has(key))demoTwinImages.set(key,(async()=>{
  const catalog=await listTwins();const twin=catalog.find(a=>a.id===identity.id);
  if(!twin?.url)throw Error('This Twin is unavailable. Please choose a Twin again.');
  const response=await fetch(twin.url,{signal});if(!response.ok)throw Error('This Twin photo could not be loaded. Please choose a Twin again.');
  const blob=await response.blob();if(!blob.type.startsWith('image/'))throw Error('This Twin photo could not be verified.');
  if(scope!==epoch||signal.aborted)throw Error('Your session changed. Please try again.');
  const form=new FormData();form.append('user_image',blob,'approved-twin.png');form.append('source','web-sdk');form.append('is_uploaded','true');
  const uploaded=await request<{id:string;url:string}>('/v2/store-experience/user-images','POST',form);
  if(scope!==epoch||!validPhoto(uploaded))throw Error('This Twin could not be connected to live try-on. Please try again.');return uploaded.id;
 })().catch(error=>{demoTwinImages.delete(key);throw error}));
 return demoTwinImages.get(key)!;
}
export async function render(garmentId:string|string[],identity:Identity,signal:AbortSignal,view='front',size?:string,baseSize?:string){const start=profile.version;const imageId=await connectedTwinImage(identity,signal);if(profile.version!==start||signal.aborted)throw Error('Your profile changed. Create a new view.');const d=await request<{request_id:string}>(`/${view==='back'||size?'v3.1':'v3'}/store-experience/tryon`,'POST',{garment_set:{garments:(Array.isArray(garmentId)?garmentId:[garmentId]).map(garment_id=>({garment_id}))},partner_id:PARTNER,image_id:imageId,source:'web-sdk',no_remove_background:false,...(view==='back'?{view}:{}),...(size&&baseSize?{size,base_size:baseSize}:{})});const result=await poll<Render>('/v1/user-assets/tryon/'+encodeURIComponent(d.request_id),d=>d.status==='COMPLETE',d=>d.status==='FAILED',signal);if(profile.version!==start)throw Error('Your profile changed. Create a new view.');if(!result.image?.url)throw Object.assign(new PreviewImageUnavailable(d.request_id),{environment:'dev'});return {...result,request_id:d.request_id}}
export type Sizing={request_id:string;status?:string;result?:string;sizing?:{size?:string;smaller_size?:string;larger_size?:string;available_sizes?:string[]}};
export async function sizing(garmentId:string,identity:Identity,signal:AbortSignal){const start=profile.version;const d=await request<{request_id:string}>('/v2/store-experience/sizing','POST',{garment_id:garmentId,height_centimeters:identity.height,weight_kilograms:identity.weight,body_type:identity.bodyType,source:'web-sdk'});const result=await poll<Sizing>('/v1/user-assets/sizing/'+encodeURIComponent(d.request_id),d=>d.sizing!==undefined||[d.status,d.result].some(s=>s==='COMPLETE'||s==='SUCCESS'||/^\d{4}$/.test(s||'')),d=>[d.status,d.result].some(s=>['FAILED','FAILURE','ERROR'].includes((s||'').toUpperCase())),signal);if(profile.version!==start)throw Error('Your profile changed. Please check your size again.');return result}
export type Turn={turn_id:string;status:string;video_url?:string};
export async function turn(front:string,back:string,signal:AbortSignal){let d=await request<Turn>('/v3.1/store-experience/tryon/turn','POST',{front_image_url:front,back_image_url:back,direction:'to_back'});if(d.status!=='ready')d=await poll<Turn>('/v3.1/store-experience/tryon/turn/'+encodeURIComponent(d.turn_id),d=>d.status==='ready',d=>d.status==='failed',signal,240000);if(!d.video_url)throw Error('No video was returned.');return d.video_url}
export type FitMap={recommended?:string;sizes:{size:string;zones:{point:string;size_in:number;body_in?:number;verdict?:string;source?:string}[]}[]};
export const hasFitConnection=()=>location.hostname==='127.0.0.1'||location.hostname==='localhost'||location.hostname==='demo-store.dev.spreeai.com';
export async function fitMap(garmentId:string,identity:Identity,name:string,category:string,sizes:string[]){if(!hasFitConnection())throw Error('Detailed fit maps are available in the connected development preview.');return request<FitMap>('/api/size-recommendation/garment/'+encodeURIComponent(garmentId)+'/fit','POST',{profile:{gender:identity.bodyType==='Masculine'?'male':'female',height_cm:identity.height,weight_kg:identity.weight},usual_size:identity.kind==='twin'?identity.usualSize:undefined,garment:{name,category},available_sizes:sizes},'')}

// Production has its own guest session. Never send development credentials to it.
const PROD_API='https://api.spreeai.com';
let productionSession:Session|null=null,productionFlight:Promise<Session>|null=null;
export async function productionRequest<T>(path:string,method='GET',body?:unknown):Promise<T>{
 const start=epoch;
 if(!productionSession||productionSession.expiresAt<Date.now()+60000){if(!productionFlight)productionFlight=raw('/v1/user/guest','POST',{partner_id:PARTNER,language:'en'},undefined,PROD_API).then(d=>{if(epoch!==start)throw Error('Your session changed.');if(!d?.access_token)throw Error('Unable to connect to the public demo.');productionSession={...d,expiresAt:Date.now()+Number(d.expires_in)*1000};return productionSession!}).finally(()=>{if(epoch===start)productionFlight=null});await productionFlight}
 if(epoch!==start)throw Error('Your session changed.');const result=await raw(path,method,body,productionSession!.access_token,PROD_API);if(epoch!==start)throw Error('Your session changed.');return result;
}
const productionIdentities=new Map<string,Promise<Identity>>();
export async function productionIdentity(identity:Identity){
 const identityEpoch=epoch;const key=profile.version+':'+identity.id;
 if(!productionIdentities.has(key))productionIdentities.set(key,(async()=>{
  if(identity.kind==='twin'){const list=await productionRequest<{avatars:Avatar[]}>('/v1/avatars?partnerID=demo-site&inheritpartner=true&inheritdefault=true');const match=list.avatars?.find(a=>a.name.toLowerCase()===identity.name.toLowerCase());if(match)return {...identity,id:match.id}}
  const response=await fetch(identity.url);if(!response.ok)throw Error('Your photo could not be connected to this collection.');const blob=await response.blob();if(epoch!==identityEpoch)throw Error('Your session changed.');const form=new FormData();form.append('user_image',blob,'profile.jpg');form.append('source','web-sdk');form.append('is_uploaded','true');const uploaded=await productionRequest<{id:string}>('/v2/store-experience/user-images','POST',form);return {...identity,id:uploaded.id};
 })().catch(e=>{productionIdentities.delete(key);throw e}));return productionIdentities.get(key)!;
}
export async function productionRender(ids:string[],identity:Identity,signal:AbortSignal,size?:string,baseSize?:string){const version=profile.version;const linked=await productionIdentity(identity);if(profile.version!==version)throw Error('Your profile changed.');const d=await productionRequest<{request_id:string}>(`/${size?'v3.1':'v3'}/store-experience/tryon`,'POST',{garment_set:{garments:ids.map(garment_id=>({garment_id}))},partner_id:PARTNER,image_id:linked.id,source:'web-sdk',no_remove_background:false,...(size&&baseSize?{size,base_size:baseSize}:{})});const result=await productionPoll<Render>('/v1/user-assets/tryon/'+encodeURIComponent(d.request_id),signal,d=>d.status==='COMPLETE',d=>d.status==='FAILED');if(profile.version!==version)throw Error('Your profile changed. Create a new view.');if(!result.image?.url)throw Object.assign(new PreviewImageUnavailable(d.request_id),{environment:'prod'});return {...result,request_id:d.request_id}}
async function productionPoll<T>(path:string,signal:AbortSignal,done:(d:T)=>boolean,failed:(d:T)=>boolean):Promise<T>{const start=Date.now();while(!signal.aborted){const d=await productionRequest<T>(path);if(failed(d))throw Error('This personal view is temporarily unavailable.');if(done(d))return d;if(Date.now()-start>180000)throw Error('This is taking longer than expected.');await new Promise(r=>setTimeout(r,2000))}throw Error('Cancelled')}
export async function productionSizing(garmentId:string,identity:Identity,signal:AbortSignal){const d=await productionRequest<{request_id:string}>('/v2/store-experience/sizing','POST',{garment_id:garmentId,height_centimeters:identity.height,weight_kilograms:identity.weight,body_type:identity.bodyType,source:'web-sdk'});return productionPoll<Sizing>('/v1/user-assets/sizing/'+encodeURIComponent(d.request_id),signal,d=>!!d.sizing||[d.status,d.result].some(s=>s==='COMPLETE'||s==='SUCCESS'||/^\d{4}$/.test(s||'')),d=>[d.status,d.result].some(s=>['FAILED','FAILURE','ERROR'].includes((s||'').toUpperCase())))}

export type FitAdvice={size?:string;fit_note?:string;smaller_note?:string;larger_note?:string};
export async function fitAdvice(garmentId:string,identity:Identity,name:string,category:string,sizes:string[]){if(!hasFitConnection())throw Error('Detailed fit advice requires the connected preview.');return request<FitAdvice>('/api/size-recommendation/garment/'+encodeURIComponent(garmentId),'POST',{profile:{gender:identity.bodyType==='Masculine'?'male':'female',height_cm:identity.height,weight_kg:identity.weight},garment:{name,category},available_sizes:sizes},'')}

import {loadImage} from './image-readiness';
import {isPresignedUrlExpired} from './presigned';

/** Exact-object recovery for the confirmed staging upload delivery issue. */
export function stagePhotoOrigin(url:string,photoId:string){
 try{
  const parsed=new URL(url),uuid='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
  if(parsed.protocol!=='https:'||parsed.hostname!=='cdn-minio.stage.spreeai.com'||parsed.port||parsed.username||parsed.password||parsed.search||parsed.hash||!new RegExp('^'+uuid+'$').test(photoId))return null;
  const match=new RegExp('^/users/'+uuid+'/tryon-inputs/('+uuid+')\\.(?:jpg|jpeg|png|webp)$').exec(parsed.pathname);
  if(!match||match[1]!==photoId)return null;
  parsed.hostname='api-minio.stage.spreeai.com';return parsed.href;
 }catch{return null}
}
/** Verify a saved upload, then renew only that same upload's link if necessary. */
export async function recoverSavedPhoto(url:string,refresh?:()=>Promise<string>,options:{decode?:(url:string)=>Promise<void>;expired?:(url:string)=>boolean;forceRefresh?:boolean;photoId?:string;allowStageOrigin?:boolean}={}){
 const decode=options.decode||loadImage,expired=options.expired||isPresignedUrlExpired;
 async function delivery(link:string){
  try{await decode(link);return link}catch(error){
   const origin=options.allowStageOrigin&&options.photoId?stagePhotoOrigin(link,options.photoId):null;
   if(!origin)throw error;await decode(origin);return origin;
  }
 }
 if(!options.forceRefresh&&!expired(url)){
  try{return await delivery(url)}catch{/* Renew a failed or expired delivery link. */}
 }
 if(!refresh)throw Error('Your saved photo could not be loaded. Retry or replace it.');
 const fresh=await refresh();
 if(!fresh||expired(fresh))throw Error('Your saved photo could not be refreshed. Retry or replace it.');
 return delivery(fresh);
}

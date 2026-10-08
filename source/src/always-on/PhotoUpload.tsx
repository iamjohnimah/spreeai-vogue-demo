import {useEffect,useRef,useState} from 'react';
import {Camera} from '@phosphor-icons/react/dist/csr/Camera';
import InlineImageZoom from './InlineImageZoom';
import LoadingBar from './LoadingBar';
import {recoverSavedPhoto} from './saved-photo';
export default function PhotoUpload({file,savedPhotoUrl,savedPhotoId,busy,onChange,onRemove,onError,onRefresh,onRecovered}:{file:File|null;savedPhotoUrl?:string;savedPhotoId?:string;onRefresh?:()=>Promise<string>;onRecovered?:(url:string)=>void;busy:boolean;onRemove?:()=>void;onChange:(file:File|null)=>void;onError:(message:string)=>void}){
 const input=useRef<HTMLInputElement>(null);const [preview,setPreview]=useState('');
 useEffect(()=>{if(!file){setPreview('');return}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url)},[file]);const src=file?preview:savedPhotoUrl;
 return <div className="photo-upload"><input ref={input} className="sr-only" aria-label="Choose your photo" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{const next=e.target.files?.[0];e.target.value='';if(!next)return;if(next.size>8*1024*1024||!['image/jpeg','image/png','image/webp'].includes(next.type)){onError('Choose a JPG, PNG or WebP under 8 MB.');return}onChange(next)}}/>{src?<div className="upload-preview">{file?<InlineImageZoom key={src} src={src} alt="Your selected photo"/>:<SavedPhotoPreview key={savedPhotoUrl} url={savedPhotoUrl!} photoId={savedPhotoId} onRefresh={onRefresh} onRecovered={onRecovered}/>}<div className="upload-preview-actions"><button type="button" disabled={busy} onClick={()=>input.current?.click()}>Replace</button><button type="button" disabled={busy} onClick={()=>file?onChange(null):onRemove?.()}>Delete photo</button></div></div>:<button type="button" className="upload-zone" disabled={busy} onClick={()=>input.current?.click()}><Camera size={34}/><strong>Choose your photo</strong><small>JPG, PNG or WebP · Up to 8 MB</small></button>}</div>
}

function SavedPhotoPreview({url,photoId,onRefresh,onRecovered}:{url:string;photoId?:string;onRefresh?:()=>Promise<string>;onRecovered?:(url:string)=>void}){
 const [attempt,setAttempt]=useState(0),[view,setView]=useState<{url?:string;error?:boolean}>({});
 const automaticRetries=useRef(0);
 const callbacks=useRef({onRefresh,onRecovered});callbacks.current={onRefresh,onRecovered};
 useEffect(()=>{
  let active=true;setView({});
  void recoverSavedPhoto(url,callbacks.current.onRefresh,{forceRefresh:attempt>0,photoId,allowStageOrigin:window.PARTNER_DEMO?.theme==='vogue'}).then(ready=>{
   if(!active)return;setView({url:ready});callbacks.current.onRecovered?.(ready);
  }).catch(()=>{if(active)setView({error:true})});
  return()=>{active=false};
 },[url,photoId,attempt]);
 if(view.url)return <InlineImageZoom key={view.url} src={view.url} alt="Your selected photo" onError={()=>{if(automaticRetries.current++===0)setAttempt(n=>n+1);else setView({error:true})}}/>;
 return <div className="saved-photo-state">{view.error?<><h3>Your photo couldn’t load.</h3><p>Retry to refresh it, or choose Replace above.</p><button type="button" onClick={()=>{automaticRetries.current=0;setAttempt(n=>n+1)}}>Retry photo</button></>:<LoadingBar label="Loading your saved photo…"/>}</div>;
}

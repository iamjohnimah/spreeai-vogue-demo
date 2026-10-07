import {useEffect,useRef,useState} from 'react';
import type {VideoHTMLAttributes} from 'react';

const players=new Set<HTMLVideoElement>();
let soundWanted=sessionStorage.getItem('ao-video-sound')!=='off';

export default function AutoVideo({soundClass='autoplay-sound',children,...props}:VideoHTMLAttributes<HTMLVideoElement>&{soundClass?:string}){
 const ref=useRef<HTMLVideoElement>(null);
 const [quiet,setQuiet]=useState(!soundWanted);
 useEffect(()=>{
  const video=ref.current!;players.add(video);let disposed=false;
  const play=async()=>{
   const dialogs=[...document.querySelectorAll('[role="dialog"]')];
   if(dialogs.length&&!dialogs.at(-1)?.contains(video))return;
   for(const other of players)if(other!==video)other.pause();
   video.muted=!soundWanted;
   try{await video.play();if(!disposed)setQuiet(video.muted)}catch{
    if(disposed)return;
    video.muted=true;setQuiet(true);
    void video.play().catch(()=>{});
   }
  };
  const observer=new IntersectionObserver(entries=>{
   if(entries[0].isIntersecting)void play();else video.pause();
  },{threshold:.25});
  observer.observe(video);
  const volume=()=>setQuiet(video.muted);
  video.addEventListener('volumechange',volume);
  return()=>{disposed=true;observer.disconnect();video.removeEventListener('volumechange',volume);video.pause();players.delete(video)};
 },[props.src]);
 const toggle=()=>{
  soundWanted=quiet;sessionStorage.setItem('ao-video-sound',soundWanted?'on':'off');
  for(const video of players){video.muted=!soundWanted;if(video===ref.current){if(video.ended)video.currentTime=0;void video.play().catch(()=>{})}}
 };
 return <><video {...props} ref={ref} autoPlay playsInline controls>{children}</video><button className={soundClass} onClick={toggle} aria-label={quiet?'Enable sound for videos':'Mute videos'}>{quiet?'Enable sound':'Sound on · Mute'}</button></>;
}

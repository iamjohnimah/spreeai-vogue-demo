// Reuse one player so a user-initiated greeting also enables subsequent replies.
export function createStylistPlayer(audio:HTMLAudioElement,events:{speaking:(value:boolean)=>void;ended:()=>void;error:()=>void}){
 let serial=0,timer:ReturnType<typeof setTimeout>|undefined;
 const clear=()=>{if(timer)clearTimeout(timer);timer=undefined};
 function stop(){serial++;clear();audio.onended=null;audio.onerror=null;audio.onplaying=null;audio.pause();events.speaking(false)}
 function play(url:string){
  stop();const id=serial;audio.src=url;audio.preload='auto';
  const fail=()=>{if(id!==serial)return;stop();events.error()};
  audio.onplaying=()=>{if(id===serial){clear();events.speaking(true)}};
  audio.onerror=fail;
  audio.onended=()=>{if(id!==serial)return;clear();events.speaking(false);events.ended()};
  timer=setTimeout(fail,15000);
  void audio.play().catch(fail);
 }
 return {play,stop};
}

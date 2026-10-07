import {useEffect,useRef,useState} from 'react';
import {stylistAudioUrl,type StylistSpeechKey} from './stylist-speech';
import {captureSpeech,type Recognition} from './speech-capture';
import {createStylistPlayer} from './stylist-player';
type SpeechWindow=Window&{SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};
export function useStylistVoice(onText:(text:string)=>void){
 const [muted,setMutedState]=useState(()=>{try{return localStorage.getItem('spree-stylist-muted')==='true'}catch{return false}});
 const mutedRef=useRef(muted);
 function setMuted(value:boolean){mutedRef.current=value;setMutedState(value);try{localStorage.setItem('spree-stylist-muted',String(value))}catch{}if(value)stop()}
 const [speaking,setSpeaking]=useState(false),[listening,setListening]=useState(false),[connecting,setConnecting]=useState(false),[heard,setHeard]=useState(''),[issue,setIssue]=useState(''),[active,setActive]=useState(false);
 const capture=useRef<ReturnType<typeof captureSpeech>|null>(null),callback=useRef(onText),player=useRef<ReturnType<typeof createStylistPlayer>|null>(null),handsFree=useRef(false),watchdog=useRef<ReturnType<typeof setTimeout>|null>(null);callback.current=onText;
 const Ctor=typeof window!=='undefined'?((window as SpeechWindow).SpeechRecognition||(window as SpeechWindow).webkitSpeechRecognition):undefined;
 function clearWatchdog(){if(watchdog.current)clearTimeout(watchdog.current);watchdog.current=null}
 function cancelCapture(){clearWatchdog();capture.current?.cancel();capture.current=null;setConnecting(false);setListening(false)}
 function deactivate(){handsFree.current=false;setActive(false)}
 function stop(){deactivate();player.current?.stop();cancelCapture()}
 useEffect(()=>()=>{handsFree.current=false;clearWatchdog();capture.current?.cancel();player.current?.stop()},[]);
 function beginListening(){
  player.current?.stop();cancelCapture();setIssue('');setHeard('');
  if(!Ctor){deactivate();setIssue('This browser does not support voice input. Open the demo in a browser with speech recognition, or choose a suggestion or type below. Spoken replies are available where supported.');return}
  setConnecting(true);
  try{
   capture.current=captureSpeech(new Ctor(),{
    listening:value=>{setListening(value);setConnecting(false);clearWatchdog();if(value)watchdog.current=setTimeout(()=>capture.current?.finish(),20000)},
    transcript:setHeard,
    submit:value=>{setHeard(value);callback.current(value)},
    error:value=>{deactivate();setConnecting(false);setIssue(value)}
   });
   watchdog.current=setTimeout(()=>{cancelCapture();deactivate();setIssue('The microphone did not connect. Check microphone permission, then retry. You can also choose a suggestion or type below.')},10000);
   capture.current.start();
  }catch{cancelCapture();deactivate();setIssue('The microphone could not start. Please retry, or type your reply below.')}
 }
 function say(key:StylistSpeechKey,_force=false){
  cancelCapture();setIssue('');
  if(mutedRef.current){deactivate();return}
  if(!player.current)player.current=createStylistPlayer(new Audio(),{
   speaking:setSpeaking,
   ended:()=>{if(handsFree.current)beginListening()},
   error:()=>{deactivate();setIssue('Audio could not play. Check your sound and tap Play reply to retry. You can continue with the suggestions or reply field.')}
  });
  player.current.play(stylistAudioUrl(key));
 }
 function listen(){
  if(connecting){stop();return}
  handsFree.current=true;setActive(true);
  if(listening){capture.current?.finish();return}
  beginListening();
 }
 function startConversation(key:StylistSpeechKey='greeting'){handsFree.current=true;setActive(true);say(key,true)}
 return {muted,setMuted,speaking,listening,connecting,heard,issue,active,say,stop,listen,startConversation,canListen:!!Ctor};
}

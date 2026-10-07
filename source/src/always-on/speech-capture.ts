export type SpeechResult = ArrayLike<{transcript:string}> & {isFinal?:boolean};
export type Recognition={lang:string;continuous:boolean;interimResults:boolean;onstart:(()=>void)|null;onresult:((e:{results:ArrayLike<SpeechResult>})=>void)|null;onerror:((e:{error:string})=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void;abort:()=>void};
export function captureSpeech(r:Recognition,handlers:{listening:(value:boolean)=>void;transcript:(value:string)=>void;submit:(value:string)=>void;error:(value:string)=>void},silenceMs=1800){
 let text='',finished=false,failed=false,timer:ReturnType<typeof setTimeout>|undefined;
 const clear=()=>{if(timer)clearTimeout(timer);timer=undefined};
 const finish=()=>{if(finished)return;finished=true;clear();handlers.listening(false);if(!failed){if(text.trim())handlers.submit(text.trim());else handlers.error('No speech was detected. Tap the microphone to try again, or choose a suggestion below.')}};
 r.lang='en-US';r.continuous=false;r.interimResults=true;
 r.onstart=()=>{if(!finished)handlers.listening(true)};
 r.onresult=e=>{if(finished)return;text=Array.from(e.results).map(x=>x[0]?.transcript||'').join(' ').trim();handlers.transcript(text);clear();if(Array.from(e.results).every(x=>x.isFinal!==false))finish();else if(text)timer=setTimeout(()=>{finish();try{r.stop()}catch{}},silenceMs)};
 r.onend=finish;
 r.onerror=e=>{if(finished)return;failed=true;finished=true;clear();handlers.listening(false);const message=e.error==='not-allowed'||e.error==='service-not-allowed'?'Microphone access is blocked. Allow microphone access in your browser, then try again.':e.error==='network'?'The browser’s speech service could not connect. Try Chrome or Safari, or use a suggestion or the reply field.':e.error==='audio-capture'?'No microphone is available. Connect a microphone or use the reply field.':'I couldn’t hear that. Tap the microphone to retry, or use a suggestion.';if(e.error!=='aborted')handlers.error(message)};
 return {start(){try{r.start()}catch{failed=true;finish();handlers.error('The microphone could not start. Please try again or type your reply.')}},finish(){try{r.stop()}catch{}finish()},cancel(){finished=true;clear();r.onstart=null;r.onresult=null;r.onerror=null;r.onend=null;try{r.abort()}catch{}handlers.listening(false)}};
}

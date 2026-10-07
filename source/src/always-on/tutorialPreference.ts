import {useSyncExternalStore} from 'react';
const listeners=new Set<()=>void>();
let enabled=false;

const subscribe=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener)}};
export function useTutorialsEnabled(){return useSyncExternalStore(subscribe,()=>enabled)}
export function toggleTutorials(){enabled=!enabled;try{localStorage.setItem('ao-tutorials-enabled',String(enabled))}catch{/* Keep the current-session preference. */}listeners.forEach(listener=>listener())}

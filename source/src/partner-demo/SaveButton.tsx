import {useState,type ReactNode} from 'react';
export function Ribbon(){return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M7 3h10v18l-5-4-5 4Z"/></svg>}
export default function SaveButton({saved,onToggle,label,className='',children,disabled=false}:{saved:boolean;onToggle:()=>boolean|void;label:string;className?:string;children?:ReactNode;disabled?:boolean}){
 const [burst,setBurst]=useState(0);
 return <button type="button" className={'vogue-save-button '+className} aria-label={label} aria-pressed={saved} disabled={disabled} onClick={()=>{if(onToggle()!==false&&!saved)setBurst(n=>n+1)}}>
  <span className="vogue-save-icon"><Ribbon/></span>{children}
  {burst>0&&<span key={burst} className="vogue-ribbon-float" aria-hidden="true" onAnimationEnd={()=>setBurst(0)}><Ribbon/></span>}
 </button>;
}

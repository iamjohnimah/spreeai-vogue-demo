import {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './experience-welcome.css';
export type WelcomeStep={label:string;title:string;body:string;detail:string;image:string;alt:string};
export default function ExperienceWelcome({channel,audience,steps,open,onClose,onStart,startLabel,footer}:{channel:string;audience:string;steps:WelcomeStep[];open:boolean;onClose:()=>void;onStart:()=>void;startLabel:string;footer:string}){
 const [step,setStep]=useState(0);
 const current=steps[step];
 return <Dialog.Root open={open} onOpenChange={value=>{if(!value)onClose()}}><Dialog.Portal><Dialog.Overlay className="experience-welcome-overlay"/>
 <div className="experience-welcome-viewport"><Dialog.Content className="experience-welcome" data-channel={channel} aria-describedby="experience-welcome-description">
 <Dialog.Close className="experience-welcome-close" aria-label="Close welcome">×</Dialog.Close>
 <aside className="experience-welcome-visual"><img className="experience-welcome-photo" src={current.image} alt={current.alt}/><img className="experience-welcome-wordmark" src="/spreeai-always-on-demo/spreeai-logo.svg" alt="SPREEAI"/><div className="experience-welcome-caption"><span>YOUR PERSPECTIVE. ALWAYS ON.</span><strong>{channel}</strong></div></aside>
 <section className="experience-welcome-content"><div className="experience-welcome-header"><span className="experience-welcome-role">{audience}</span><span className="experience-welcome-count">0{step+1} / 0{steps.length}</span></div>
 <nav className="experience-welcome-steps" aria-label="Walkthrough steps">{steps.map((item,i)=><button key={item.label} aria-label={`Step ${i+1}: ${item.label}`} aria-current={step===i?'step':undefined} onClick={()=>setStep(i)}><span className="experience-step-track"/><span>{item.label}</span></button>)}</nav>
 <div className="experience-welcome-story" aria-live="polite"><p className="experience-welcome-kicker">{channel} · GETTING STARTED</p><Dialog.Title>{current.title.split('\n').map((line,i)=><span key={line}>{i===1?<em>{line}</em>:line}</span>)}</Dialog.Title><Dialog.Description id="experience-welcome-description">{current.body}</Dialog.Description><div className="experience-welcome-detail"><span aria-hidden="true">0{step+1}</span><p>{current.detail}</p></div></div>
 <div className="experience-welcome-footer"><div className="experience-welcome-actions">{step>0&&<button className="experience-welcome-back" onClick={()=>setStep(step-1)}>Back</button>}<button className="experience-welcome-primary" onClick={()=>step<steps.length-1?setStep(step+1):onStart()}>{step<steps.length-1?'Continue':startLabel}</button></div><button className="experience-welcome-skip" onClick={onClose}>Explore first</button><p>{footer}</p></div>
 </section></Dialog.Content></div></Dialog.Portal></Dialog.Root>;
}

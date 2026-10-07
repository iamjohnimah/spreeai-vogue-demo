import {useEffect,useRef,useState} from 'react';
import {ArrowLeft} from '@phosphor-icons/react/dist/csr/ArrowLeft';
import {ShieldCheck} from '@phosphor-icons/react/dist/csr/ShieldCheck';
import {Camera} from '@phosphor-icons/react/dist/csr/Camera';
import type {Identity} from './connection';
import './photo-consent.css';

type Props={file:File|null;photo?:Identity;busy:boolean;error:string;onBack:()=>void;onAgree:()=>void};
export default function PhotoConsent({file,photo,busy,error,onBack,onAgree}:Props){
 const [url,setUrl]=useState(photo?.url||'');
 const [checks,setChecks]=useState([false,false,false]);
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{heading.current?.focus({preventScroll:true});heading.current?.closest('.account-modal,.perspective-sheet')?.scrollTo({top:0})},[]);
 useEffect(()=>{if(!file){setUrl(photo?.url||'');return}const value=URL.createObjectURL(file);setUrl(value);return()=>URL.revokeObjectURL(value)},[file,photo?.url]);
 return <section className="photo-consent" aria-labelledby="photo-consent-title">
  <button className="consent-back" onClick={onBack} disabled={busy}><ArrowLeft size={18}/>Back to my photo</button>
  <div className="consent-heading"><p className="eyebrow"><ShieldCheck size={18} weight="regular" aria-hidden="true"/>YOUR PHOTO. YOUR CHOICE.</p><h2 ref={heading} tabIndex={-1} id="photo-consent-title">Before we make it yours.</h2><p>Review how your photo is used before continuing. No account needed.</p></div>
  <div className="consent-layout"><aside className="consent-photo">{url?<img src={url} alt="Photo you are giving permission to use"/>:<div className="consent-no-photo" aria-hidden="true"><Camera size={28} weight="thin"/></div>}<div className="consent-photo-caption"><strong>{file?'Your selected photo':photo?'Your saved photo':'No photo selected'}</strong><span>{file?'Not uploaded yet':photo?'Already uploaded to SPREEAI':'Go back to choose a photo'}</span><button className="text-link" onClick={onBack} disabled={busy}>{url?'Change photo':'Choose a photo'}</button></div></aside>
  <div className="consent-details">
   <section><span className="consent-section-number" aria-hidden="true">01</span><div><h3>How your photo is used</h3><p>SPREEAI uses your selected photo to create personal clothing previews. Your height, weight and sizing profile support fit guidance. Previews are AI-generated; appearance and fit may vary.</p></div></section>
   <section><span className="consent-section-number" aria-hidden="true">02</span><div><h3>Where it is stored</h3><p>When you continue, your photo is uploaded to SPREEAI’s services, or your saved photo is reused. This demo only lists photos uploaded in this browser session. Photos may be processed for the collections you explore.</p><p>This demo does not specify a retention period. Review the <a href="https://spreeai.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Notice</a> for privacy information and requests.</p></div></section>
   <section><span className="consent-section-number" aria-hidden="true">03</span><div><h3>Changing or removing your photo</h3><p>Before uploading, go back to replace or remove your selected file. After uploading, switching to a Twin changes your active selection; it does not delete the stored photo. Closing the demo does not delete uploaded images. Remove my photo and Reset profile clear local access only. Server deletion is not available here; use the privacy-request instructions in the Privacy Notice.</p></div></section>
  </div>
  <fieldset className="consent-checks" disabled={busy}><legend>Your permission</legend><p className="consent-check-hint">Please confirm all three to continue.</p>{[
   'I am 18 or older, and this is my photo or I have permission to use it.',
   'I agree to SPREEAI processing this photo to create personal try-on previews.',
   'I have reviewed the storage and removal information above.'
  ].map((label,index)=><label key={label}><input type="checkbox" checked={checks[index]} onChange={e=>setChecks(values=>values.map((value,i)=>i===index?e.target.checked:value))}/><span>{label}</span></label>)}</fieldset>
  </div>
  {error&&<p className="connection-error" role="alert">{error}</p>}
  <div className="consent-actions"><p>{file?'Your photo stays on this device until you agree.':photo?'Your saved photo will be used only after you agree here.':'Choose a photo, then review your permissions.'}</p><div><button className="primary" disabled={busy||!url||!checks.every(Boolean)} onClick={onAgree}>{busy?'Saving your photo…':'Agree and use my photo'}</button><button className="text-link" disabled={busy} onClick={onBack}>Not now</button></div></div>
 </section>
}

import {useState,useEffect} from 'react';
import {ArrowLeft} from '@phosphor-icons/react/dist/csr/ArrowLeft';
import {ArrowRight} from '@phosphor-icons/react/dist/csr/ArrowRight';
import PersonalViews from './PersonalViews';
import InlineImageZoom from './InlineImageZoom';
import {useConnectedProfile} from './connection';
import type {Product} from './data';
export default function Gallery({product,selectedSize,requestedSize,sizeRequest}:{product:Product;sizeRequest?:number;selectedSize?:string;requestedSize?:string;onSize?:(size:string)=>void;person:number;active:boolean;who:string;onUnlock:(id:string)=>void;initialId?:string;personalFirst?:boolean;pending?:boolean}){
 const profile=useConnectedProfile();const images=[...new Set([product.image,product.model,...(product.source||[])])];
 const slots=[{src:'',label:'Your try-on',view:'front'},...images.map((src,i)=>({src,label:i===0?'The product':i===1?'Styled on model':'Detail photo',view:''}))];
 const [index,setIndex]=useState(profile.identity?0:1);
 useEffect(()=>{if(profile.identity)setIndex(0)},[profile.identity?.id]);
 useEffect(()=>{if(requestedSize)setIndex(0)},[requestedSize,sizeRequest]);
 const slot=slots[index]||slots[1];
 return <div className="native-gallery feedback-gallery" aria-label="Product gallery" data-personal-view={slot.view||undefined}><div className="gallery-slide-shell">{slot.view?<PersonalViews product={product} selectedSize={selectedSize}/>:<InlineImageZoom key={slot.src} src={slot.src} alt={`${product.name} · ${slot.label}`}/>}</div><div className="gallery-control-row"><button aria-label="Previous product view" disabled={index===0} onClick={()=>setIndex(index-1)}><ArrowLeft size={22}/></button><span>{index+1} / {slots.length}</span><button aria-label="Next product view" disabled={index===slots.length-1} onClick={()=>setIndex(index+1)}><ArrowRight size={22}/></button></div><div className="personal-thumbnails">{slots.map((s,i)=><button key={i} aria-label={s.label} aria-pressed={index===i} onClick={()=>setIndex(i)}>{s.src&&<img src={s.src} alt=""/>}<small>{s.label==='Your try-on'?'On you':s.label==='The product'?'Product':s.label==='Styled on model'?'On model':s.label}</small></button>)}</div><p className="more-views-note">More views coming soon · Back view and video try-on</p></div>
}

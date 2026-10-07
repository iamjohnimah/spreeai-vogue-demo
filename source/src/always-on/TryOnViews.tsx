import MediaThumbnail from './MediaThumbnail';
import {matchingRecordedMedia,mediaDescription} from './recorded-media';
import {useState} from 'react';
import PersonalViews from './PersonalViews';
import {useConnectedProfile} from './connection';
import type {Product} from './data';
import './fit-details.css';
export default function TryOnViews({product,selectedSize}:{product:Product;selectedSize?:string}){
 const [view,setView]=useState('front');const {identity}=useConnectedProfile();
 return <><PersonalViews product={product} selectedSize={selectedSize} initial={view}/><div className="tryon-view-tabs associate-view-tiles" role="group" aria-label="Personal try-on views">{[['front','Front view'],['back','Back view'],['video','Video try-on']].map(([value,label])=><button key={value} aria-label={label} aria-pressed={view===value} onClick={()=>setView(value)}>{value==='front'?(identity&&<img src={identity.url} alt=""/>):<MediaThumbnail view={value} identity={identity} product={product} selectedSize={selectedSize}/>}<span>{label}</span><small>{value==='front'?'Your personal preview':mediaDescription(value,!!matchingRecordedMedia(identity,product,selectedSize))}</small></button>)}</div></>
}

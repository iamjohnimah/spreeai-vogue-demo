import {useEffect,useRef,useState} from 'react';
import {sdkURL,isSdkClose} from './sdk';
import {products} from './data';
import type {Product} from './data';
export default function LiveTryOn({product=products[0],onClose,embedded=false}:{product?:Product;onClose:()=>void;embedded?:boolean}){
 const [loaded,setLoaded]=useState(false),[slow,setSlow]=useState(false);const frame=useRef<HTMLIFrameElement>(null);
 useEffect(()=>{setLoaded(false);setSlow(false);const timer=setTimeout(()=>setSlow(true),15000);return()=>clearTimeout(timer)},[product.garmentId]);
 useEffect(()=>{function receive(e:MessageEvent){if(isSdkClose(e.origin,e.source,frame.current?.contentWindow,e.data))onClose()}window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive)},[onClose]);
 return <div className={embedded?'live-native':'modal-body live-tryon'}>{!embedded&&<><p className="eyebrow">SPREEAI / LIVE TRY-ON</p><h2>{product.name}</h2></>}
 {!loaded&&<p className="live-loading" role="status">Connecting your SPREEAI experience…</p>}
 <iframe key={product.garmentId} ref={frame} src={sdkURL(product.garmentId,product.partnerId)} title={`Live SPREEAI try-on: ${product.name}`} onLoad={()=>setLoaded(true)} sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-downloads" allow="web-share"/>
 <p className="live-service-note">Live SPREEAI · Choose a preset model or use your own photo within SPREEAI.{slow&&<> <a href={sdkURL(product.garmentId,product.partnerId)} target="_blank" rel="noopener noreferrer">Open in a new tab</a></>}</p></div>
}

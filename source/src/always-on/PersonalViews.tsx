import LoadingBar from './LoadingBar';
import InlineImageZoom from './InlineImageZoom';
import {useState} from 'react';
import {Link} from 'react-router';
import type {Product} from './data';
import {useConnectedProfile} from './connection';
import {cachedImage,useSizePreview} from './personalization';
export const cachedPersonalImage=(garmentId:string,_version?:number,_identityId?:string)=>cachedImage(garmentId);
export default function PersonalViews({product,selectedSize=''}:{product:Product;initial?:string;selectedSize?:string;onSize?:(size:string)=>void}){
 const [attempt,setAttempt]=useState(0);const {identity}=useConnectedProfile();const image=useSizePreview(product,selectedSize,attempt);
 if(!identity)return <div className="personal-locked"><h2>See this piece on you.</h2><p>Add your photo or use a Twin to begin.</p><Link className="primary" to="/account">Add your photo or use a Twin</Link></div>;
 return <div className="automatic-view"><div className="preview-person-chip">{identity.name}{image.selected?` · Size ${image.selected}`:''}</div>{image.url?<InlineImageZoom key={image.url} src={image.url} alt={`${identity.name} wearing ${product.name}`}/>:<div className="generation-state" role="status">{!image.reason&&image.status!=='error'&&window.PARTNER_DEMO&&<><img className="partner-loading-photo" src={product.model} alt=""/><LoadingBar label="Generating your look…"/></>}<h3>{image.reason?'Size preview unavailable':image.status==='error'?'Your preview couldn’t load':'Generating your look…'}</h3><p>{image.reason||image.error||`Preparing ${product.name} on ${identity.name}.`}</p>{image.status==='error'&&<button className="secondary" onClick={()=>setAttempt(n=>n+1)}>Retry preview</button>}{image.reason?.includes('profile')&&<Link className="text-link" to="/account">Add measurements for sizing</Link>}</div>}<p className="preview-disclosure">AI-generated preview · Appearance and fit may vary.</p></div>
}

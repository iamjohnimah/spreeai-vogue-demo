import {useState} from 'react';
import FitCompare from '../FitCompare';
import {isOneSize} from '../fit-scale';
import type {Product} from '../data';

export default function AssociateFitComparison({products,sizes,initialProductId,onSize}:{products:Product[];sizes:Record<string,string>;initialProductId?:string;onSize:(product:Product,size:string)=>void}){
 const [chosen,setChosen]=useState(initialProductId||'');
 const pieces=products.filter(p=>p.sizes.length>1&&!isOneSize(p.sizes));
 const product=pieces.find(p=>p.id===chosen)||pieces[0];
 if(!product)return null;
 return <section className="as-compare-access" aria-label="Compare client fits"><div><p className="as-eyebrow">FIND THEIR FIT</p><h3>Two sizes. Side by side.</h3><p>Compare the fit on your client or their selected AI twin.</p>{pieces.length>1?<label>Choose a piece<select aria-label="Piece to compare" value={product.id} onChange={e=>setChosen(e.target.value)}>{pieces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>:<small>{product.name}</small>}</div><FitCompare product={product} selected={sizes[product.id]||''} onSize={size=>onSize(product,size)}/></section>;
}

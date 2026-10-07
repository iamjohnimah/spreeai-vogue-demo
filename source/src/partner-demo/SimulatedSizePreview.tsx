import {usePersonalImage,usePersonalFit} from '../always-on/personalization';
import {useConnectedProfile} from '../always-on/connection';
import LoadingBar from '../always-on/LoadingBar';
import type {Product} from '../always-on/data';
export default function SimulatedSizePreview({product,size}:{product:Product;size:string}){
 const {identity}=useConnectedProfile(),fit=usePersonalFit(product),image=usePersonalImage([product]);
 const base=Math.max(0,product.sizes.indexOf(fit.recommended||product.sizes[Math.floor(product.sizes.length/2)]));
 const step=product.sizes.indexOf(size)-base;
 const width=Math.max(.64,Math.min(1.8,1+step*.16)),height=Math.max(.85,Math.min(1.24,1+step*.045));
 return <div className="simulated-size-view" data-size={size} data-reference-size={product.sizes[base]} data-width-scale={width}>
 <div className="simulated-size-canvas">{image.url?<img src={image.url} alt={`${product.name} on ${identity?.name} — illustrative size ${size}`} style={{transform:`scale(${width},${height})`}}/>:<><img className="partner-loading-photo" src={product.model} alt=""/>{image.status==='error'?<p role="alert">{image.error||'Live try-on unavailable.'}</p>:<LoadingBar label="Preparing your base try-on…"/>}</>}</div>
 <p className="simulated-size-caption">{step===0?'Reference view':step>0?'Larger silhouette illustration':'Smaller silhouette illustration'} · Size {size}</p>
 <small>Simulated image scale. This changes the whole image, including the model; it does not predict garment dimensions, drape or fit.</small></div>
}

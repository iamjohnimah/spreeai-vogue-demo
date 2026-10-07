import {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import ImageZoom from './ImageZoom';
import TryOnBeta from './TryOnBeta';
import MediaThumbnail from './MediaThumbnail';
import {matchingRecordedMedia,recordedExample} from './recorded-media';
import {useConnectedProfile} from './connection';
import type {Product} from './data';
import './fit-details.css';

/** Saved presentation media only: never submits a back/video generation job. */
export default function MediaConcept({initial='back',product,selectedSize}:{initial?:'back'|'video';product:Product;selectedSize?:string}){
 const {identity}=useConnectedProfile();
 const [zoom,setZoom]=useState(false),[failed,setFailed]=useState(false);
 const media=matchingRecordedMedia(identity,product,selectedSize);
 const shown=media||recordedExample,example=!media;
 const title=initial==='video'?'Video try-on':'Back view';
 const description=example
  ? 'This example shows Freja in the Tinos Dress. Your selected person and piece have not changed.'
  : 'Saved media for this twin and garment.';

 return <section className="media-concept">
  <p className="concept-notice">
   <strong>{example?'Recorded example':'Recorded preview'} · {shown.name} in the {shown.productName} · Size {shown.size}</strong>
   <span>{description}</span>
  </p>
  {!failed?<>
   {initial==='back'
    ? <button className="concept-media" onClick={()=>setZoom(true)} aria-label={`Enlarge ${shown.name} back view`}>
       <img src={shown.back} onError={()=>setFailed(true)} alt={`${shown.name} wearing ${shown.productName}, back view, size ${shown.size}`}/>
      </button>
    : <button className="concept-media concept-video" onClick={()=>setZoom(true)} aria-label={`Enlarge ${shown.name} video try-on`}>
       <video key={shown.video} src={shown.video} poster={shown.front} autoPlay muted loop playsInline preload="metadata" onError={()=>setFailed(true)} aria-label={`${shown.name} wearing ${shown.productName}, recorded turn video`}/>
      </button>}
   <p className="concept-caption">{initial==='back'?'See the shape and details from behind.':'Watch the garment as the twin turns.'} Recorded {example?'example':'preview'} of {shown.name} in size {shown.size}.</p>
  </>:<div className="media-pending-panel">
   <MediaThumbnail view={initial} identity={null} product={product}/>
   <p className="eyebrow">{title.toUpperCase()}</p>
   <h2>This preview couldn’t load.</h2>
   <p>Please try again to see {shown.name} in the {shown.productName}.</p>
   <button className="media-example-link" onClick={()=>setFailed(false)}>Try again</button>
  </div>}
  <TryOnBeta/>
  <Dialog.Root open={zoom} onOpenChange={setZoom}><Dialog.Portal>
   <Dialog.Overlay className="overlay"/>
   <Dialog.Content className="native-zoom personal-zoom concept-zoom" aria-describedby="concept-media-description">
    <Dialog.Title className="sr-only">{example?'Recorded example':'Recorded preview'} · {shown.name} · {title}</Dialog.Title>
    <div className="zoom-toolbar tryon-viewer-toolbar"><div className="tryon-viewer-title"><small>{example?'RECORDED EXAMPLE':'RECORDED PREVIEW'} · SIZE {shown.size}</small><h2>{shown.name} · {shown.productName} · {title}</h2></div><Dialog.Close aria-label="Close preview viewer">×</Dialog.Close></div>
    <Dialog.Description id="concept-media-description" className="concept-caption">{description}</Dialog.Description>
    {initial==='back'
     ? <ImageZoom allowOriginal src={shown.back} alt={`${shown.name}, ${shown.productName}, back view`}/>
     : <video className="tryon-video-expanded" src={shown.video} poster={shown.front} autoPlay muted loop controls playsInline preload="metadata" aria-label="Recorded turn video"/>}
    <TryOnBeta/>
   </Dialog.Content>
  </Dialog.Portal></Dialog.Root>
 </section>;
}

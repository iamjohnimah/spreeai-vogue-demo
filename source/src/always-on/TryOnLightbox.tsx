import * as Dialog from '@radix-ui/react-dialog';
import {useRef} from 'react';
import ImageZoom from './ImageZoom';
import './tryon-lightbox.css';

export default function TryOnLightbox({src,alt,open,onOpenChange}:{src:string;alt:string;open:boolean;onOpenChange:(open:boolean)=>void}){
 const returnFocus=useRef<HTMLElement|null>(null);
 return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="tryon-lightbox-overlay"/><Dialog.Content className="tryon-image-lightbox" onOpenAutoFocus={()=>{returnFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null}} onCloseAutoFocus={e=>{e.preventDefault();if(returnFocus.current?.isConnected)returnFocus.current.focus()}}><header><div><small>YOUR LOOK, UP CLOSE</small><Dialog.Title>{alt}</Dialog.Title></div><Dialog.Close aria-label="Close enlarged try-on">×</Dialog.Close></header><Dialog.Description className="sr-only">Full-body try-on image. Use the zoom controls to inspect details, or Escape to return to your fitting room.</Dialog.Description><ImageZoom key={src} src={src} alt={alt}/><p>AI-generated preview · Appearance and fit may vary.</p></Dialog.Content></Dialog.Portal></Dialog.Root>
}

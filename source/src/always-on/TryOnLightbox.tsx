import * as Dialog from '@radix-ui/react-dialog';
import ImageZoom from './ImageZoom';
import './tryon-lightbox.css';

export default function TryOnLightbox({src,alt,open,onOpenChange}:{src:string;alt:string;open:boolean;onOpenChange:(open:boolean)=>void}){
 return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="tryon-lightbox-overlay"/><Dialog.Content className="tryon-image-lightbox"><header><div><small>YOUR LOOK, UP CLOSE</small><Dialog.Title>{alt}</Dialog.Title></div><Dialog.Close aria-label="Close enlarged try-on">×</Dialog.Close></header><Dialog.Description className="sr-only">Full-body try-on image. Use the zoom controls to inspect details, or Escape to return to your fitting room.</Dialog.Description><ImageZoom key={src} src={src} alt={alt}/><p>AI-generated preview · Appearance and fit may vary.</p></Dialog.Content></Dialog.Portal></Dialog.Root>
}

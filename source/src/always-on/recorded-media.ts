import type {Identity} from './connection';
import type {Product} from './data';

// Reviewed, saved media only. Never infer a match from a person's display name.
export const recordedExample = {
 identityId: '78106f59-a001-0000-1700-64b915e181fd',
 name: 'Freja', garmentId: 'tinos-dress', productName: 'Tinos Dress', size: 'S',
 front: '/spreeai-always-on-demo/online/media/try-on-concepts/freja-tinos-front.webp',
 back: '/spreeai-always-on-demo/online/media/try-on-concepts/freja-tinos-back.webp',
 video: '/spreeai-always-on-demo/online/media/try-on-concepts/freja-tinos-turn.mp4',
};
export function matchingRecordedMedia(identity:Identity|null, product:Product, size?:string) {
 return identity?.kind==='twin' && identity.id===recordedExample.identityId
  && (product.environment||'dev')==='dev' && product.garmentId===recordedExample.garmentId
  && (!size || size===recordedExample.size) ? recordedExample : null;
}
export const mediaDescription=(view:string, available:boolean)=>view==='back'
 ? available?'See the look from behind':'Your look, from behind · Coming soon'
 : available?'See the look in motion':'Your look in motion · Coming soon';

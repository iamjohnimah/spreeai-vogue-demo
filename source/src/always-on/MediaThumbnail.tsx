import type {Identity} from './connection';
import type {Product} from './data';
/** Keep the original navigation symbols; media is displayed after selection. */
export default function MediaThumbnail({view}:{view:string;identity:Identity|null;product:Product;selectedSize?:string}){
 return <span className="profile-view-thumbnail media-icon-thumbnail" aria-hidden="true"><span className="media-view-symbol">{view==='back'?'↶':'▷'}</span></span>;
}

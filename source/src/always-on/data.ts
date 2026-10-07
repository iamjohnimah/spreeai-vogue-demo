import photoBackgrounds from './photo-backgrounds.json';
export const photoBackground=(src:string)=>(photoBackgrounds as Record<string,string>)[src]||'#f4f4f2';
import {useSyncExternalStore} from 'react';
import {request,productionRequest} from './connection';
import productionCatalog from './production-catalog.json';
import catalog from './live-catalog.json';
import imageCache from './catalog-images.json';
const imageURL=(url:string)=>(imageCache as Record<string,string>)[url]||url;
export type Mode='out'|'twin'|'personal';
export type Product={environment?:'dev'|'prod';id:string;garmentId:string;partnerId:string;name:string;category:string;price:number;priceLabel:string;currency:string;color:string;row:number;description:string;details:string;material:string;image:string;model:string;sizes:string[];retailerUrl?:string;source?:string[];preview?:'core'|'look'|'imported'};
export const twins=[{name:'Yuna',height:168,weight:57,size:'S'},{name:'Alex',height:183,weight:77,size:'M'},{name:'Sofia',height:170,weight:86,size:'XL'},{name:'Ravi',height:178,weight:73,size:'M'},{name:'Noa',height:175,weight:64,size:'S'},{name:'Amara',height:172,weight:89,size:'XL'}];
type CatalogGarment={description?:string;buy_link?:string;id:string;title:string;partner_id:string;categories?:{name:string}[];variants?:{color?:{name?:string};size_groups?:{sizes:string[]}[];price?:{amount?:string;currency?:string};images?:{tag?:string|null;url:string}[]}[]};
export function normalizeCatalog(rows:CatalogGarment[],environment:'dev'|'prod'='dev'):Product[]{return rows.flatMap(g=>{
 if(!g||typeof g.id!=='string'||typeof g.title!=='string'||!Array.isArray(g.variants))return [];
 const v=g.variants[0],images=g.variants.flatMap(v=>v.images||[]).filter(i=>/^https:\/\/(api-minio\.(?:dev|prod)\.spreeai\.com|assets\.spreeai\.com)\//.test(i.url))||[];
 if(!images.length)return [];
 const flat=images.find(i=>i.tag==='flat')||images[0],model=images.find(i=>i.tag==='model')||flat;
 const names=(g.categories||[]).map(c=>c.name);const n=g.title.toLowerCase();
 const category=names.includes('Dress')?'Dresses':names.includes('Footwear')?'Shoes':names.includes('Bottom')?'Bottoms':names.some(x=>['Bracelet','Scarf','Earrings','Accessory','Accessories','Bag'].includes(x))||/earring|clutch|bag|poppy/.test(n)?'Accessories':/jacket|blazer|coat/.test(n)?'Outerwear':/knit|sweater|cardigan/.test(n)?'Knitwear':/shirt|blouse/.test(n)?'Shirts':'Tops';
 const rawPrice=v.price?.amount||'';const price=Number(rawPrice.replace(/[^\d.]/g,''))||0;const priceLabel=/\d/.test(rawPrice)?new Intl.NumberFormat('en-US',{style:'currency',currency:v.price?.currency||'USD',minimumFractionDigits:Number.isInteger(price)?0:2,maximumFractionDigits:2}).format(price):'Price on request';
 const sizes=[...new Set(g.variants.flatMap(x=>(x.size_groups||[]).flatMap(s=>s.sizes)).filter(x=>typeof x==='string'))];
 return [{environment,id:'spree-'+g.id,garmentId:g.id,partnerId:g.partner_id||'demo-site',name:g.title,category,price,priceLabel,currency:v.price?.currency||'USD',color:v.color?.name||'As shown',row:-1,description:g.description&&!/^https?:/.test(g.description)?g.description:`${g.title}. Discover this ${category.toLowerCase()==='accessories'?'accessory':(category==='Dresses'?'dress':category.toLowerCase().replace(/s$/,''))} in ${v.color?.name||'the color shown'}, available in ${sizes.join(', ')}. Explore the original product photography and your personal preview.`,details:'Product imagery, available demo sizes and listed price are supplied by the official SPREEAI demo catalog.',retailerUrl:g.buy_link&&/^https:\/\//.test(g.buy_link)?g.buy_link:undefined,material:g.description?.match(/(?:Materials?|Composition|Fabric):[^\n]+/i)?.[0]||'Composition and care details are confirmed by the retailer.',image:imageURL(flat.url),model:imageURL(model.url),source:images.map(i=>imageURL(i.url)),sizes}];
})}
export const products:Product[]=window.PARTNER_DEMO?.products||[...normalizeCatalog(catalog),...normalizeCatalog(productionCatalog,'prod')];
let status='snapshot',revision=0,pending:Promise<void>|undefined;
const listeners=new Set<()=>void>();
export function useCatalog(){useSyncExternalStore(fn=>{listeners.add(fn);return()=>{listeners.delete(fn)}},()=>revision);return status}
export function refreshCatalog(){if(pending)return pending;pending=(async()=>{try{
 const results=await Promise.allSettled([request<{garments:CatalogGarment[]}>('/v3/protea/garments'),productionRequest<{garments:CatalogGarment[]}>('/v3/protea/garments')]);
 const next=results.flatMap((result,index)=>{const environment=index?'prod':'dev';if(result.status==='rejected'||!Array.isArray(result.value.garments))return products.filter(p=>(p.environment||'dev')===environment);return normalizeCatalog(result.value.garments.filter(g=>!g.partner_id||g.partner_id.toLowerCase()==='demo-site'),environment)});
 if(!next.length)throw Error('Empty catalog');products.splice(0,products.length,...next);status=results.every(r=>r.status==='fulfilled')?'live':'snapshot';
 }catch{status='snapshot'}finally{revision++;listeners.forEach(fn=>fn())}})();return pending}
export const categories=['All','Shirts','Tops','Bottoms','Outerwear','Knitwear','Dresses','Shoes','Accessories'];
// Local account previews never substitute generated sample people for real catalog garments.
export const personalImage=(_p:Product,_person:number,_pose='front'):string|null=>null;
export const brandPerson=(_p:Product)=>0;
export const displayImage=(p:Product,_person:number,_active:boolean,_personalFirst=true)=>p.model;
export const editorialImage=(p:Product,_person:number,_active:boolean)=>p.image;
export const money=(value:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(value);
export const asset=(person:number,row:number)=>`/always-on-assets/person-${person}-${row}.webp`;
export const sampleProfile={name:'Alex',height:183,weight:77,gender:'Male',fit:'Regular',photo:'sample',consent:true};
export type Profile=typeof sampleProfile;

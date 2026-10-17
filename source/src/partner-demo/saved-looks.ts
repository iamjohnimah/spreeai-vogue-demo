export type SavedLook={id:string;items:string[];name:string;person:string;created:number};
type Piece={id:string;name:string};
type Store=Pick<Storage,'getItem'|'setItem'>;
export const savedLooksKey='vogue:saved-outfits:v2';
export const savedLookID=(ids:string[])=>'look:'+ [...new Set(ids)].sort().join('|');
function rows(storage:Store,key:string):unknown[]{try{const value=JSON.parse(storage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch{return []}}
export function readSavedLooks(storage:Store,catalog:Piece[],slug:string):SavedLook[]{
 const current=storage.getItem(savedLooksKey),raw=current===null?rows(storage,'vogue:saved-outfits:v1'):rows(storage,savedLooksKey);
 const result=new Map<string,SavedLook>();
 for(const value of raw){const l=value as SavedLook;if(!l||!Array.isArray(l.items)||!l.items.length||!l.items.every(id=>catalog.some(p=>p.id===id)))continue;const items=[...new Set(l.items)],id=savedLookID(items);result.set(id,{id,items,name:items.map(id=>catalog.find(p=>p.id===id)!.name).join(' + '),person:typeof l.person==='string'?l.person:'My edit',created:Number.isFinite(l.created)?l.created:0})}
 // One-time migration includes the ribbons saved by older builds.
 if(current===null)for(const id of rows(storage,slug+'wishlist')){const p=catalog.find(p=>p.id===id);if(p&&!result.has(savedLookID([p.id])))result.set(savedLookID([p.id]),{id:savedLookID([p.id]),items:[p.id],name:p.name,person:'My edit',created:0})}
 return [...result.values()].sort((a,b)=>b.created-a.created);
}
export function writeSavedLooks(storage:Store,looks:SavedLook[],slug:string){
 // This is the single authoritative write. Legacy mirrors are best-effort only.
 storage.setItem(savedLooksKey,JSON.stringify(looks));
 try{storage.setItem(slug+'wishlist',JSON.stringify(looks.filter(l=>l.items.length===1).map(l=>l.items[0])))}catch{}
}
export function toggleSavedLook(storage:Store,catalog:Piece[],slug:string,items:string[],person='My edit'){
 const selected=[...new Set(items)];if(!selected.length||!selected.every(id=>catalog.some(p=>p.id===id)))throw Error('Choose a piece to save.');
 const looks=readSavedLooks(storage,catalog,slug),id=savedLookID(selected),saved=looks.some(l=>l.id===id);
 writeSavedLooks(storage,saved?looks.filter(l=>l.id!==id):[{id,items:selected,name:selected.map(id=>catalog.find(p=>p.id===id)!.name).join(' + '),person,created:Date.now()},...looks],slug);
 return !saved;
}

type ImageFilename={garments:string[];title?:string;person?:string;size?:string;view?:number};
const clean=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'');
export function imageFilename({garments,title='',person='',size='',view}:ImageFilename){
 const garment=garments.map(clean).filter(Boolean).join('-and-')||clean(title)||'Look';
 const name=[garment.slice(0,120).replace(/-+$/,''),clean(person).slice(0,30),size?'Size-'+clean(size).slice(0,15):'',view?'View-'+view:'','SPREEAI'].filter(Boolean).join('-');
 return name+'.png';
}

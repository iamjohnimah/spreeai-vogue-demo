import {loadImage} from './image-readiness';

type Preview={request_id:string;status?:string;image?:{url:string}};
type Options={decode?:(url:string)=>Promise<void>;wait?:(ms:number)=>Promise<void>;delays?:number[];allowStageOrigin?:boolean};

/** Only the exact, unsigned render key may use the known staging image origin.
 * Never rewrite signed URLs, arbitrary hosts, shopper inputs or another render.
 */
export function stagePreviewOrigin(url:string,requestId:string):string|null{
 try{
  const asset=new URL(url),uuid=/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
  if(asset.protocol!=='https:'||asset.hostname!=='cdn-minio.stage.spreeai.com'||asset.port||asset.username||asset.password||asset.search||asset.hash||!uuid.test(requestId))return null;
  const parts=asset.pathname.split('/');
  if(parts.length!==4||parts[1]!=='users'||!uuid.test(parts[2])||!['webp','png','jpg','jpeg'].some(ext=>parts[3]===requestId+'.'+ext))return null;
  asset.hostname='api-minio.stage.spreeai.com';return asset.href;
 }catch{return null}
}

export class PreviewImageUnavailable extends Error{
 environment?:'dev'|'prod';
 constructor(readonly requestId:string){super('This preview image is temporarily unavailable. Please retry in a moment.');this.name='PreviewImageUnavailable'}
}

/** A completed render is usable only once the browser can decode its image.
 * Refresh the same request during delivery delays; never substitute another view.
 */
export async function verifyPreviewImage(initial:Preview,read:(id:string)=>Promise<Preview>,options:Options={}):Promise<string>{
 const decode=options.decode||loadImage,wait=options.wait||(ms=>new Promise(resolve=>setTimeout(resolve,ms)));
 const delays=options.delays||[2000,5000,10000];let result=initial;
 for(let attempt=0;attempt<=delays.length;attempt++){
  if(result.status==='FAILED')throw new PreviewImageUnavailable(initial.request_id);
  if(result.image?.url&&(!result.status||result.status==='COMPLETE')){
   try{await decode(result.image.url);return result.image.url}catch{}
   const origin=options.allowStageOrigin?stagePreviewOrigin(result.image.url,initial.request_id):null;
   if(origin){try{await decode(origin);return origin}catch{}}
  }
  if(attempt===delays.length)break;
  await wait(delays[attempt]);
  try{result=await read(initial.request_id)}catch{result={request_id:initial.request_id}}
 }
 throw new PreviewImageUnavailable(initial.request_id);
}

export const posePresets=[{id:'',label:'Straight-on'},{id:'editorial',label:'Side profile'},{id:'three_quarter',label:'Three-quarter'}] as const;
export function poseRequestOptions(preset?:string){return preset?{pose_preset:preset,do_not_use_cache:true}:{}}
export const poseCacheSuffix=(preset:string)=>preset?':pose:'+preset+':vogue-v1':'';
export function isRepeatedFrontPreview(preset:string,pose?:string,front?:string){
 if(!preset||!pose||!front)return false;
 if(pose===front)return true;
 try{const a=new URL(pose),b=new URL(front);return a.origin===b.origin&&a.pathname===b.pathname}catch{return false}
}

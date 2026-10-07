export const SDK_ORIGIN='https://vton.dev.spreeai.com';
/** Public production client ID and parameters used by demo-store.spreeai.com. */
export function sdkURL(garmentId:string,partnerId='demo-site'){
 const q=new URLSearchParams({garments:JSON.stringify([{garmentId}]),partnerId,lng:'EN',partnerConfig:JSON.stringify({spree_accounts_enabled:true,avatars_enabled:true,background_removal_enabled:false,photocapture_enabled:false,photoupload_enabled:true}),clientId:'0176d724-9f01-0000-0100-6d3312d5c396',isDemo:'true',enableProteaGarments:'true',enableAddToCart:'false',legacyAspectRatio:'false',enableIntelligentFit:'true',enableNextGenTryOn:'true'});
 return SDK_ORIGIN+'/?'+q;
}
export function isSdkClose(origin:string,source:unknown,expected:unknown,data:unknown){return expected!=null&&origin===SDK_ORIGIN&&source===expected&&!!data&&typeof data==='object'&&'code' in data&&data.code==='00001'}

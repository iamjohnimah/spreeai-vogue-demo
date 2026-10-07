export type WardrobeSource='gmail'|'pinterest'|'instagram'|'retailer';
export type WardrobeEntry={id:string;source:WardrobeSource;text:string;kind:'owned'|'inspiration'};
// Manual, review-first extraction. Raw receipt text never leaves the browser.
export function reviewWardrobeText(text:string,source:WardrobeSource):WardrobeEntry[]{
 const words=/\b(dress(?:es)?|gowns?|shirts?|blouses?|tees?|tops?|trousers?|pants|jeans|shorts|skirt|jackets?|blazers?|coats?|cardigans?|sweaters?|knit|shoes?|sneakers?|boot|heels?|sandals?|bag|linen|cotton|silk|wool|tailor|navy|floral|minimal|relaxed)\b/i;
 const lines=[...new Set(text.split(/[\n;]+/).map(s=>s.trim()).filter(s=>s&&words.test(s)))].slice(0,20);
 return lines.map<WardrobeEntry>((s,i)=>({id:`${source}-${i}-${Date.now()}`,source,kind:source==='gmail'||source==='retailer'?'owned':'inspiration',text:s.replace(/https?:\/\/\S+|[\w.+-]+@[\w.-]+\.\w+/g,'').trim().slice(0,160)})).filter(x=>x.text);
}
export function wardrobeContext(notes:string,entries:WardrobeEntry[]){return [notes.trim(),...entries.map(e=>(e.kind==='owned'?'Already own: ':'Style inspiration: ')+e.text)].filter(Boolean).join('\n')}

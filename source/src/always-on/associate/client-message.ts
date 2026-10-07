import {PREVIEW_GUIDANCE,SIZING_GUIDANCE} from '../preview-guidance';
export type SizeNote={name:string;selected?:string;recommended?:string;source?:string};
export function clientMessage(name:string,notes:SizeNote[],avatar:boolean){
 const greeting=name.trim()?`Hi ${name.trim()},`:'Hello,';
 const sizes=notes.map(p=>`${p.name}: ${p.recommended?`${p.source==='twin'?'avatar starting size':p.source==='one'?'available size':'recommended size'} ${p.recommended}`:'personal size guidance pending'}${p.selected&&p.selected!==p.recommended?`; selected size ${p.selected}`:''}.`).join('\n');
 return `${greeting} I’ve put together a look I thought you’d love. ${avatar?'The image shows it on your selected AI twin.':'Here’s your personal try-on preview.'}\n\n${sizes}\n\nWould you like me to prepare any of these pieces for your next visit?\n\n${PREVIEW_GUIDANCE}\n${SIZING_GUIDANCE}`;
}

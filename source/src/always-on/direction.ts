import type {Product} from './data';
import editorialPoses from './editorial-poses.json';
export const directedPoses=(p:Product)=>editorialPoses[p.id as keyof typeof editorialPoses];
export function garmentDirection(p:Product){
 const selected=directedPoses(p);
 const poses=['Front-facing view',...(selected?.labels||['Brand pose 1','Brand pose 2']),'Simulated back view — unseen details are illustrative'];
 if(p.category==='Dresses')return {title:'Let the silhouette move.',poses,action:'Gently hold the skirt and turn side to side to reveal its shape and movement.',context:'For bridal, a partner could direct a slow skirt lift and turn; other dresses can use movement suited to their cut.'};
 if(/leather.*biker|leather-jacket/.test(p.name.toLowerCase()+' '+p.id))return {title:'Show the attitude of the piece.',poses,action:'Lean naturally against a wall, then step forward and turn to reveal the leather and jacket structure.',context:'Your creative team sets the environment, stance, and movement that express this jacket.'};
 if(/sweat|relaxed|t-shirt|cargo|shorts/.test(p.name.toLowerCase()))return {title:'Designed to move with you.',poses,action:'Walk or lightly jog, with natural arm movement, to show the garment in an active everyday moment.',context:'A partner can choose walking, running, stretching, or a calmer action based on the garment’s intended use.'};
 if(p.category==='Shoes')return {title:'See every step.',poses,action:'Take a few natural steps, pause, and pivot to reveal the footwear from the side and back.',context:'The partner chooses the pace, surface, framing, and steps appropriate to each style of footwear.'};
 if(p.category==='Accessories')return {title:'Bring the detail into view.',poses,action:/scarf/i.test(p.name)?'Adjust the scarf gently, then turn to show its drape.':'Make a restrained hand or body movement to bring the accessory’s shape and finish into view.',context:'The partner chooses close-up framing and styling gestures appropriate to the accessory.'};
 if(p.category==='Bottoms')return {title:'Reveal the line and drape.',poses,action:'Walk a few steps, pause, and turn to show the line, drape, and ease of the piece.',context:'The partner can direct standing, sitting, walking, or more active movement based on the garment.'};
 return {title:'A presentation shaped by your brand.',poses,action:'Use a natural turn and a small styling gesture to show the garment’s shape and texture.',context:'The partner determines the poses, camera framing, environment, and action for this garment—not a fixed universal sequence.'};
}

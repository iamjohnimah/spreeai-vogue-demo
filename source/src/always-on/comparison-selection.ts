export const MAX_COMPARISON=3;
export function addComparison(current:string[],id:string){return current.includes(id)||current.length>=MAX_COMPARISON?current:[...current,id]}
export function toggleComparison(current:string[],id:string){return current.includes(id)?current.filter(x=>x!==id):addComparison(current,id)}

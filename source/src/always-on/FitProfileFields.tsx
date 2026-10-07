import {TShirt} from '@phosphor-icons/react/dist/csr/TShirt';
export type PersonalFitDetails = {
 bustCm?:number; chestCm?:number; waistCm?:number; hipsCm?:number;
 fitPreference?:'fitted'|'regular'|'relaxed';
};
const fitOptions=[
 {value:'fitted',label:'Fitted',hint:'Close to the body'},
 {value:'regular',label:'Natural',hint:'An easy, classic fit'},
 {value:'relaxed',label:'Relaxed',hint:'A little more room'},
] as const;
export default function FitProfileFields({value,onChange,bodyType,unit}:{value:PersonalFitDetails;onChange:(value:PersonalFitDetails)=>void;bodyType:'Feminine'|'Masculine';unit:string}){
 const metric=unit==='metric';
 const fields: {key:'bustCm'|'chestCm'|'waistCm'|'hipsCm';label:string;hint:string}[]=bodyType==='Feminine'?[
  {key:'bustCm',label:'Bust',hint:'Around the fullest part'},
  {key:'waistCm',label:'Waist',hint:'Around your natural waist'},
  {key:'hipsCm',label:'Hips',hint:'Around the fullest part of your seat'},
 ]:[{key:'chestCm',label:'Chest',hint:'Around the chest, under your arms'},{key:'waistCm',label:'Waist',hint:'Where your trousers sit'}];
 return <div className="personal-fit-fields">
  <fieldset className="body-measurements"><legend>Body measurements <span>Optional</span></legend><p className="fit-section-hint">A few details to make your profile more personal.</p>
   <div className="body-measurement-grid">{fields.map(({key,label,hint})=><label key={key}><span>{label} <small>({metric?'cm':'in'})</small></span><input aria-label={`${label} (${metric?'cm':'in'})`} aria-describedby={`hint-${key}`} type="number" inputMode="decimal" step="any" min={metric?50:50/2.54} max={metric?200:200/2.54} placeholder="—" value={value[key]===undefined?'':Math.round(value[key]!/(metric?1:2.54)*10)/10} onChange={e=>onChange({...value,[key]:e.target.value===''?undefined:Number(e.target.value)*(metric?1:2.54)})}/><small id={`hint-${key}`}>{hint}</small></label>)}</div>
   <details className="measurement-help"><summary>How to measure</summary><p>Use a soft tape over light clothing. Keep it level and comfortably snug, without pulling tight. Enter the full circumference. You can leave any measurement blank.</p></details>
  </fieldset>
  <fieldset className="fit-preference"><legend>Your preferred fit <span>Optional</span></legend><p className="fit-section-hint">How do you like your clothes to feel?</p><div className="fit-preference-options">{fitOptions.map(option=><label key={option.value} className={value.fitPreference===option.value?'selected':''}><input type="radio" name="personal-fit-preference" value={option.value} checked={value.fitPreference===option.value} onChange={()=>onChange({...value,fitPreference:option.value})}/><TShirt className={`preference-shirt preference-shirt-${option.value}`} size={29} weight="thin" aria-hidden="true"/><strong>{option.label}</strong><small>{option.hint}</small></label>)}</div>{value.fitPreference&&<button className="fit-clear" type="button" onClick={()=>onChange({...value,fitPreference:undefined})}>Clear preference</button>}</fieldset>
 </div>
}

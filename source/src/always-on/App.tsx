import {publicSite} from './brand-links';
import useShoppingState from './useShoppingState';
import './neutral-palette.css';
import {toggleComparison,MAX_COMPARISON} from './comparison-selection';
import {useTheme} from './theme';
import BrandFooter from './BrandFooter';
import {configure,readJourney,togglePiece} from '../../../journey/store.js';
import Journey, {useJourney} from './Journey';
import CheckoutCelebration from './CheckoutCelebration';
import {useState,useEffect} from 'react';
import type {FormEvent,CSSProperties} from 'react';
import {Link,useLocation,useNavigate} from 'react-router';
import * as Dialog from '@radix-ui/react-dialog';
import {products,photoBackground,twins,asset,money,sampleProfile,categories,editorialImage,useCatalog,refreshCatalog} from './data';
import type {Mode,Profile} from './data';
import './style.css';
import './luxury.css';
import {brand} from './brand';
import CampaignHero from './CampaignHero';
import './online.css';
import PersonalViews from './PersonalViews';
import ConnectedAccount from './ConnectedAccount';
import {useConnectedProfile} from './connection';
import './connected.css';
import './shopping.css';
import './account-studio.css';
import './theme.css';
import './mobile-polish.css';
import './partner-cta.css';
import './size-controls.css';
import './feedback-review.css';
import IdentityPortrait from './IdentityPortrait';
import {MagnifyingGlass} from '@phosphor-icons/react/dist/csr/MagnifyingGlass';
import {Check} from '@phosphor-icons/react/dist/csr/Check';
import {Plus} from '@phosphor-icons/react/dist/csr/Plus';
import {Sparkle} from '@phosphor-icons/react/dist/csr/Sparkle';
import {Columns} from '@phosphor-icons/react/dist/csr/Columns';
import Welcome from './Welcome';
import FitSelector from './FitSelector';
import SizeDropdown from './SizeDropdown';
import CompareLooks from './CompareLooks';
import CompleteLook from './CompleteLook';
import {usePersonalFit} from './personalization';
import Stylist from './Stylist';
import Gallery from './Gallery';
import FeatureNote from './FeatureNote';
import Guide from './Guide';
const spreeLogo='/spreeai-logo.svg';
import {wardrobe} from './wardrobe';

type Panel='account'|'menu'|'sizes'|'live'|'journey'|'checkout'|'developer'|'guide'|'unlock'|'twins'|'signin'|'profile'|'why'|'compare'|'bag'|'stylist'|'saved'|'colors'|'recommendations'|null;
function read<T,>(key:string,fallback:T):T {try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
export default function App(){
 const nav=useNavigate(),location=useLocation();
 const {dark,toggleTheme}=useTheme();
 useJourney();
 const connected=useConnectedProfile();
 const catalogStatus=useCatalog();
 useEffect(()=>{void refreshCatalog()},[]);
 useEffect(()=>configure(products),[catalogStatus]);
 const [pendingJourneyPiece,setPendingJourneyPiece]=useState('');
 const [filterOpen,setFilterOpen]=useState(false);
 const [mode,setMode]=useState<Mode>(()=>{try{return sessionStorage.getItem('ao-review-mode') as Mode||'out'}catch{return 'out'}});
 const [signedIn,setSignedIn]=useState(()=>{try{return sessionStorage.getItem('ao-review-account')==='sample'}catch{return false}});
 const [person,setPerson]=useState(()=>read('ao-person',1));
 const [profile,setProfile]=useState<Profile>(sampleProfile);
 const [accountStart,setAccountStart]=useState(false);
 const [accountSource,setAccountSource]=useState<'photo'|'twin'|undefined>();
 const [showMeasurements,setShowMeasurements]=useState(false);
 useEffect(()=>{const receive=()=>{setAccountSource('photo');setAccountTab(undefined);setShowMeasurements(true);setPanel('account')};window.addEventListener('spree-open-measurements',receive);return()=>window.removeEventListener('spree-open-measurements',receive)},[]);
 const [accountTab,setAccountTab]=useState<'saved'|'history'|undefined>();
 const [panel,setPanel]=useState<Panel>(null);
 const [welcomeRun,setWelcomeRun]=useState(0);
 const [step,setStep]=useState(0);
 const [initialMedia,setInitialMedia]=useState('');
 const mediaOrder='model';
 const [measure,setMeasure]=useState({height:profile.height,weight:profile.weight});
 const [search,setSearch]=useState(''),[limit,setLimit]=useState(12),[voice]=useState<'director'|'advisor'>('director');
 const [previousPath,setPreviousPath]=useState(location.pathname);
 const [chosenTwin,setChosenTwin]=useState(person),[sizeSelections,setSizeSelections]=useShoppingState<Record<string,string>>('sizes',{}),[sizeRequest,setSizeRequest]=useState(0),[filter,setFilter]=useState('All'),[sort,setSort]=useState('featured');
 useEffect(()=>{const category=new URLSearchParams(location.search).get('category');if(category&&categories.includes(category)){setFilter(category);setSearch('');setLimit(12)}},[location.search]);
 const [compare,setCompare]=useShoppingState<string[]>('compare',[]),[bag,setBag]=useShoppingState<{id:string,size:string}[]>('bag',[]),[toast,setToast]=useState('');
 const [unit,setUnit]=useState('metric'),[photo,setPhoto]=useState(profile.photo),[age,setAge]=useState('adult');
 const [error,setError]=useState('');
 const routePath=location.pathname.replace(/\/$/,'')||'/';
 const product=products.find(p=>routePath===`/product/${p.id}`);
 const fit=usePersonalFit(product);
 const manualSize=sizeSelections[routePath]||'';
 const setSize=(value:string)=>setSizeSelections(old=>({...old,[routePath]:value}));
 const size=manualSize||fit.recommended||'';

 const account=routePath==='/account';
 useEffect(()=>{if(account)setPanel('account');else setPanel(current=>current==='account'?null:current)},[location.pathname]);
 const home=routePath==='/';
 const active=!!connected.identity;
 const isJourneySample=mode==='personal'&&profile.name==='Alex'&&profile.photo==='sample';
 const personalPending=mode==='personal'&&profile.photo!=='sample';
 function startJourney(){switchMode('personal');if(pendingJourneyPiece&&!readJourney().items.some(x=>x.id===pendingJourneyPiece))togglePiece(pendingJourneyPiece);setPendingJourneyPiece('');setPanel('journey')}

 const who=connected.identity?.name||(mode==='personal'?profile.name:twins[person].name);
 const generationKey=`${mode}:${person}`;
 if(previousPath!==location.pathname){setPreviousPath(location.pathname);setInitialMedia('');setError('')}
 useEffect(()=>{try{sessionStorage.setItem('ao-review-mode',profile.photo==='sample'?mode:'out');sessionStorage.setItem('ao-review-account',signedIn&&profile.photo==='sample'?'sample':'');localStorage.setItem('ao-person',JSON.stringify(person))}catch{}},[mode,person,generationKey,profile.photo,signedIn]);
 useEffect(()=>{window.scrollTo(0,0)},[location.pathname]);
 useEffect(()=>{const receive=(e:Event)=>setToast((e as CustomEvent<string>).detail);window.addEventListener('spree-feedback-toast',receive);return()=>window.removeEventListener('spree-feedback-toast',receive)},[]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),3500);return()=>clearTimeout(timer)},[toast]);
 function open(value:Panel){if(['profile','signin','twins','unlock'].includes(value||'')){setAccountStart(false);setPanel('account');return}setError('');if(value==='profile'){setPhoto(profile.photo);setMeasure({height:profile.height,weight:profile.weight});setUnit('metric')}setPanel(value)}
 function close(){setAccountStart(false);setShowMeasurements(false);if(account)nav('/collection',{replace:true});setPanel(null);setPendingJourneyPiece('')}
 function switchMode(next:Mode){setMode(next);if(next==='out')setSignedIn(false);if(next==='personal')setSignedIn(true);setInitialMedia('');if(next==='personal'){setProfile(sampleProfile);setPerson(1)}if(next==='twin')setPerson(chosenTwin);setToast(next==='out'?'Signed-out experience':next==='twin'?'Twin experience':'Demo account loaded. Live try-on is available on every garment.')}
 function toggleCompare(id:string){if(!compare.includes(id)&&compare.length>=MAX_COMPARISON){setToast('Your comparison has three pieces. Remove one to add another.');return}setCompare(current=>toggleComparison(current,id))}
 function compareOpen(){open('compare')}
 function finishProfile(e:FormEvent<HTMLFormElement>){e.preventDefault();const data=new FormData(e.currentTarget);if(age!=='adult'){setError('Personal photo profiles are available to adults in this demo. Please use a Twin.');return}if(!photo){setError('Add a photo or use the sample profile to continue.');return}if(!data.get('consent')){setError('Please confirm that you want to enable your visualization profile.');return}const value:Profile={name:String(data.get('name')).trim()||'Alex',height:Number(data.get('height'))*(unit==='imperial'?2.54:1),weight:Number(data.get('weight'))*(unit==='imperial'?0.453592:1),gender:String(data.get('gender')),fit:String(data.get('fit')),photo,consent:true};setProfile(value);setSignedIn(true);setMode('personal');setPerson(1);close();setToast(photo==='sample'?'Demo account saved. Use live SPREEAI on any product to try it on.':'Profile saved in this tab. Personal image generation requires a connected retailer account.')}
 const photoView=(row:number,idx=person,className='')=><img className={className} src={asset(idx,row)} alt={`${twins[idx].name}, ${row===1||row===3?'back':'front'} view in ${row<2?'leather biker jacket':'burgundy knit polo'}`} />;
 const badge=<span className="powered">✧ Powered by SPREEAI</span>;

 const recommendationRail=(_title:string)=><section className="recommendation-section"><div className="section-head"><div><p className="eyebrow">SELECTED BY THE SPREEAI CREATIVE STUDIO</p><h2>Continue discovering.</h2></div><button className="text-link" onClick={()=>open('stylist')}>Chat with a stylist</button></div><p>Discover more from the live SPREEAI collection.</p><FeatureNote panel="recommendations" inline/><div className="recommendation-rail">{products.filter(p=>p.id!==product?.id).slice(0,5).map(p=><article key={p.id}><Link to={`/product/${p.id}`}><img loading="lazy" src={editorialImage(p,person,active)} alt={p.name}/><span className="rail-tag">LIVE COLLECTION</span><h3>{p.name}</h3></Link><p>{p.priceLabel||money(p.price)}</p><button className="text-link" disabled={compare.length>=MAX_COMPARISON&&!compare.includes(p.id)} onClick={()=>toggleCompare(p.id)}>{compare.includes(p.id)?'✓ In comparison':compare.length>=MAX_COMPARISON?'Comparison full':'+ Compare'}</button></article>)}</div></section>;
 return <>
  <Welcome key={welcomeRun} onAccount={source=>{setAccountSource(source);setAccountTab(undefined);open('account')}} onExplore={()=>nav('/collection')}/>
  <a className="skip" href="#content">Skip to content</a>
  <header className={home?'store-header home-header':'store-header'}>
   <div className="header-side header-signup"><button className="active-person" onClick={()=>{setAccountSource(undefined);setAccountTab(undefined);open('account')}}>{connected.identity?<><IdentityPortrait identity={connected.identity}/><span>{connected.identity.name}<small>Change {connected.identity.kind==='twin'?'Twin':'photo'}</small></span></>:<span>See it on you<small>Add your photo or use a Twin</small></span>}</button></div>
   <a href={publicSite+"/"} className="wordmark" aria-label="SPREEAI home"><img src={spreeLogo} alt="SPREEAI"/></a>
   <div className="header-side right"><button onClick={()=>open('bag')} aria-label={`Shopping bag, ${bag.length} items`}><svg viewBox="0 0 24 24"><path d="M5 7h14l1 14H4L5 7Z M9 8V5a3 3 0 0 1 6 0v3"/></svg>{bag.length>0&&<small>{bag.length}</small>}</button><button onClick={()=>open('account')} aria-label="Your profile"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/></svg></button><button aria-label="Search collection" onClick={()=>{nav('/collection');setFilterOpen(true);setTimeout(()=>document.querySelector<HTMLInputElement>('.catalog-search input')?.focus(),50)}}><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg></button><button aria-label="Open menu" onClick={()=>open('menu')}><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg><span>MENU</span></button></div>
  </header>
  <main id="content">
  {home&&<CampaignHero onSignIn={()=>open('account')} onShop={()=>{nav('/collection');setFilter('All')}}/>}

  {!product&&<>

   <section className="collection-intro"><h1>The collection</h1></section>
   <label className="mobile-category">Collection<select aria-label="Collection category" value={filter} onChange={e=>{setFilter(e.target.value);setLimit(12)}}>{categories.map(c=><option key={c} value={c}>{c==='All'?'Shop All':c}</option>)}</select></label><nav className="mainnav" aria-label="Collection navigation"><button className={filter==='All'?'current':''} onClick={()=>{setFilter('All');setLimit(12)}}>Shop All</button>{['Outerwear','Knitwear','Bottoms','Shoes','Accessories','Dresses'].map(c=><button className={filter===c?'current':''} key={c} onClick={()=>{setFilter(c);setLimit(12)}}>{c}</button>)}</nav>
   <section id="collection" className="collection"><div className="collection-toolbar"><span>{products.filter(p=>(filter==='All'||filter===p.category)&&p.name.toLowerCase().includes(search.toLowerCase())).length} pieces</span><div><button aria-label="Search pieces" aria-expanded={filterOpen} onClick={()=>setFilterOpen(!filterOpen)}><MagnifyingGlass size={21}/><span className="sr-only">Search</span></button><details className="catalog-sort"><summary>{sort==='featured'?'Recommended':sort==='price'?'Price: low to high':'Price: high to low'}<span aria-hidden="true">⌄</span></summary><div>{[['featured','Recommended'],['price','Price: low to high'],['high','Price: high to low']].map(([value,label])=><button key={value} aria-pressed={sort===value} onClick={e=>{setSort(value);setLimit(12);e.currentTarget.closest('details')?.removeAttribute('open')}}>{label}{sort===value&&<Check size={17}/>}</button>)}</div></details></div></div>{filterOpen&&<label className="catalog-search"><input autoFocus type="search" aria-label="Search collection" placeholder="Find a piece…" value={search} onChange={e=>{setSearch(e.target.value);setLimit(12)}}/></label>}
    <div className="product-grid">{products.filter(p=>(filter==='All'||filter===p.category)&&p.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>sort==='price'?a.price-b.price:sort==='high'?b.price-a.price:0).slice(limit-12,limit).map(p=><article className="product-card" key={p.id}>
     <Link className="product-image" style={{'--photo-background':photoBackground(p.image),'--model-background':photoBackground(p.model)} as CSSProperties} to={`/product/${p.id}`}><img loading="lazy" src={p.image} alt={p.name}/><img className="hover-model" loading="lazy" src={p.model} alt={`${p.name} on the collection model`}/><span className="discover">{active?"See on you":"Explore this piece"}</span></Link>
     <div className="product-info"><div><Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link><p>{p.color} · {p.category}</p></div><span>{p.priceLabel||money(p.price)}</span></div>
     <div className="card-bottom"><span>{`${p.sizes.length} sizes`}</span><button disabled={compare.length>=MAX_COMPARISON&&!compare.includes(p.id)} aria-pressed={compare.includes(p.id)} onClick={()=>toggleCompare(p.id)}>{compare.includes(p.id)?'✓ Added to comparison':compare.length>=MAX_COMPARISON?'Comparison full':'+ Compare'}</button></div>


    </article>)}</div><div className="catalog-more"><button className="secondary" disabled={limit<=12} onClick={()=>setLimit(limit-12)}>Previous page</button><span>Page {limit/12}</span><p>{products.filter(p=>(filter==='All'||p.category===filter)&&p.name.toLowerCase().includes(search.toLowerCase())).length} matching pieces</p>{limit<products.filter(p=>(filter==='All'||p.category===filter)&&p.name.toLowerCase().includes(search.toLowerCase())).length&&<button className="secondary" onClick={()=>setLimit(limit+12)}>Next page</button>}</div>
   </section>
   {recommendationRail(mode==='personal'?'Recommended for you.':mode==='twin'?`The brand’s edit. Seen on ${who}.`:'The creative studio’s edit.')}
  </>}
  {product&&<>
   <div className="breadcrumb"><Link to="/collection">The collection</Link><span>/</span><Link to={`/collection?category=${encodeURIComponent(product.category)}`}>{product.category}</Link></div>
   <section className="pdp"><Gallery selectedSize={size} requestedSize={manualSize} sizeRequest={sizeRequest} onSize={s=>{setSize(s);setToast(`Size ${s} selected`)}} key={`${product.id}-${person}-${mode}-${mediaOrder}`} product={product} person={person} active={active} who={who} pending={personalPending} initialId={initialMedia} personalFirst={active} onUnlock={i=>{setInitialMedia(i);open('unlock')}}/>
   <div className="product-details"><div className="product-description"><p className="eyebrow">ALWAYS ON</p><h1>{product.name}</h1><p className="price">{product.priceLabel||money(product.price)}</p><p className="color">{product.color}</p><h2 className="detail-label">PRODUCT DESCRIPTION</h2><p className="description">{product.description.split(/(?<=[.!?])\s|\n/)[0]}</p><details><summary>Read more <span>＋</span></summary><p className="full-description">{product.description}</p></details><details><summary>Product details <span>⌄</span></summary><p>{product.details}</p><dl className="product-facts"><dt>Color</dt><dd>{product.color}</dd><dt>Available sizes</dt><dd>{product.sizes.join(' · ')}</dd><dt>Collection</dt><dd>{product.category}</dd><dt>Product reference</dt><dd>{product.garmentId}</dd></dl><p>{product.material}</p>{product.retailerUrl&&<a href={product.retailerUrl} target="_blank" rel="noreferrer" className="text-link">Full retailer specifications and dimensions</a>}</details><details><summary>Our commitment <span>＋</span></summary><p>Thoughtfully chosen pieces. Clear product information. A more personal way to discover your style, with previews and fit guidance that help you explore with confidence.</p><p className="fine">Illustrative retailer commitment for this demo. Materials, sourcing certifications and service policies are confirmed by each retailer.</p></details><details><summary>Delivery & returns <span>⌄</span></summary><p>This is an interactive demo. Delivery, availability and returns would be provided by the retailer.</p></details></div>
   <div className="product-purchase"><div className="purchase-title"><p className="eyebrow">THE COLLECTION</p><h1>{product.name}</h1><p>{product.priceLabel||money(product.price)}</p><small>{product.color}</small></div><SizeDropdown product={product} size={size} onSize={s=>{setSize(s);setSizeRequest(n=>n+1)}}/><p className="demo-bag-note">Demo — no checkout, orders or payments.</p><button className="primary full" onClick={()=>{if(!size){const control=document.querySelector<HTMLDetailsElement>('.size-studio details');if(control){control.open=true;control.querySelector('summary')?.focus()}return}setBag([...bag,{id:product.id,size}]);setToast('Added to your local shopping bag')}}>{size?'Add to bag':'Select size'}</button>{error&&<p role="alert" className="error">{error}</p>}
   <div className="native-services">{!active&&<button onClick={()=>open('unlock')}><span className="service-icon" aria-hidden="true">◈</span><span>Your profile</span></button>}<button onClick={()=>{if(!compare.includes(product.id)&&compare.length>=MAX_COMPARISON){setToast('Your comparison has three pieces. Remove one to add another.');open('compare');return}setCompare(current=>current.includes(product.id)?current:[...current,product.id]);open('compare')}}><span className="service-icon" aria-hidden="true"><Columns size={22}/></span><span>Compare on you</span></button><button onClick={()=>document.getElementById('product-outfit-builder')?.scrollIntoView({behavior:'smooth'})}><span className="service-icon" aria-hidden="true"><Plus size={22}/></span><span>Build the outfit</span></button><button onClick={()=>open('stylist')}><span className="service-icon" aria-hidden="true"><Sparkle size={22}/></span><span>Chat with a stylist</span></button>{product.id==='knit-polo'&&<button onClick={()=>open(active?'colors':'unlock')}><span className="service-icon" aria-hidden="true">◯</span><span>Explore colors</span></button>}</div><p className="fine purchase-disclosure">Interactive demonstration · No orders or payments.</p></div>
   </div></section><section id="product-outfit-builder" className="product-outfit-section" aria-label={`Outfit builder for ${product.name}`}><CompleteLook key={product.id} product={product} selectedSize={size} onSize={setSize} onBag={items=>{setBag([...bag,...items]);setToast('Your outfit was added to your bag')}}/></section>{recommendationRail('Continue your story.')}
  </>}
  </main>
  <BrandFooter/>
  {compare.length>0&&!panel&&<div className="compare-tray"><span>Your comparison · {compare.length} of 3</span><button onClick={compareOpen}>Compare on you</button><button aria-label="Clear comparison" onClick={()=>setCompare([])}>×</button></div>}
  {toast&&<div className="toast" role="status">✓ {toast}</div>}
  <Dialog.Root open={!!panel} onOpenChange={v=>{if(!v)close()}}><Dialog.Portal><Dialog.Overlay className="overlay"/><Dialog.Content className={`modal ${['profile','menu'].includes(panel||'')?'drawer':''} ${['account','sizes','why','live','journey','twins','compare','stylist','saved','colors'].includes(panel||'')?'wide':''} ${panel==='account'?'account-modal':''} ${panel==='stylist'?'voice-stylist-modal':''} ${panel==='guide'?'guide-modal':''} ${panel==='checkout'?'checkout-modal':''}`} aria-describedby="modal-description"><Dialog.Close className="close" aria-label="Close dialog">×</Dialog.Close>
   <Dialog.Title className="sr-only">{panel==='account'?'Your profile':panel==='menu'?'Collection menu':panel==='sizes'?'Select a size':panel==='live'?'Connected try-on':panel==='journey'?'Your connected edit':panel==='checkout'?'Your Always On checkout moment':panel==='developer'?'Developer sandbox':panel==='guide'?'Your Always On guide':panel==='unlock'?'Unlock your perspective':panel==='twins'?'Choose your Twin':panel==='profile'?'Your personal profile':panel==='signin'?'Sign in to SPREEAI':panel==='why'?'Your size explained':panel==='bag'?'Your shopping bag':panel==='stylist'?'Your AI stylist':panel==='saved'?'Your saved looks':panel==='colors'?'Compare colors':'Compare your edit'}</Dialog.Title><Dialog.Description id="modal-description" className="sr-only">{panel==='guide'?'A guided introduction to the local Always On experience.':'Explore the local SPREEAI partner demo.'}</Dialog.Description>
   {!['account','journey','stylist','saved','menu','sizes','live'].includes(panel||'')&&<FeatureNote key={`tutorial-${panel}`} panel={panel}/>}
   {panel==='menu'&&<div className="modal-body menu-body"><p className="eyebrow">{brand} / COLLECTION</p><h2>Explore.</h2><a className="menu-partner-card" href="https://spreeai.com/create-account" target="_blank" rel="noopener noreferrer"><span className="menu-partner-eyebrow">FOR BRANDS & RETAILERS</span><strong>Become a Partner</strong><span className="menu-partner-copy">Bring a more personal shopping experience to your customers.</span><span className="menu-partner-action">Get started</span></a><button className="menu-how-it-works" onClick={()=>{close();setWelcomeRun(run=>run+1)}}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 2-2.5 3.5M12 16v.1"/></svg><span>How It Works<small>A quick guide to your Online experience</small></span></button><p className="menu-collection-label">THE COLLECTION</p>{categories.map(c=><button key={c} onClick={()=>{setFilter(c);setLimit(12);close();nav('/collection')}}>{c==='All'?'Shop All':c}</button>)}<nav className="menu-experiences" aria-label="Choose your experience"><p className="eyebrow">CHOOSE YOUR EXPERIENCE</p><a href="/spreeai-always-on-demo/online/" aria-current="page"><span>Online</span><small>Current</small></a><a href="/spreeai-always-on-demo/associate/in-store/"><span>In-Store</span></a><a href="/spreeai-always-on-demo/associate/vic/"><span>VIC Clienteling</span></a></nav><div className="menu-appearance"><span>Appearance<small>{dark?'Dark':'Light'} mode</small></span><button className="theme-switch" role="switch" aria-label="Dark mode" aria-checked={dark} onClick={toggleTheme}><span/></button></div></div>}
   {panel==='account'&&<ConnectedAccount showMeasurements={showMeasurements} initialSource={accountSource} initialTab={accountTab} startWithSignup={accountStart} onSaved={()=>{close();if(home)nav('/collection')}} onDone={close} savedLooks={<Stylist currentProduct={product} voice={voice} person={person} savedOnly embedded onProduct={()=>setPanel(null)} onBag={items=>setBag([...bag,...items])}/>}/>}
   {panel==='sizes'&&product&&<FitSelector product={product} size={size} onSize={setSize}/>}
   {panel==='live'&&<PersonalViews product={product||products[0]}/>}
   {panel==='journey'&&<Journey isSample={isJourneySample} onStart={startJourney} onClose={close}/>}
   {panel==='developer'&&<div className="modal-body developer-placeholder"><p className="eyebrow">SPREEAI / DEVELOPER MODE</p><span className="concept">COMING SOON</span><h2>Your sandbox.<br/>Room to experiment.</h2><p>A dedicated space for your development team to explore SPREEAI features and experiment with storefront experiences.</p><div className="developer-preview"><span aria-hidden="true">〈 / 〉</span><strong>Sandbox under construction</strong><p>Developer tools and configuration controls will live here. This is a preview placeholder; the sandbox is not available yet.</p></div><button className="primary full" onClick={close}>Return to the demo →</button></div>}
   {panel==='guide'&&<Guide step={step} setStep={setStep} onClose={close} onAccount={()=>{open(mode==='personal'?'profile':'signin')}} onTwin={()=>{open('twins')}}/>}
   {panel==='unlock'&&<div className="modal-body"><p className="eyebrow">YOUR PERSPECTIVE, ALWAYS ON</p><h2>See it your way.</h2><p>Two ways to bring this piece to life.<br/>Choose what feels right for you.</p><button className="unlock-option" onClick={()=>open('signin')}><span>01</span><div><h3>Sign in to see yourself</h3><p>Your photo, your fit, your perspective.</p><small>Set up inside Your profile</small></div></button><button className="unlock-option" onClick={()=>{setChosenTwin(person);open('twins')}}><span>02</span><div><h3>Use a Twin</h3><p>Choose a preset person. See it instantly.</p><small>No account or photo needed</small></div></button>{badge}</div>}
   {panel==='twins'&&<div className="modal-body"><p className="eyebrow">NO ACCOUNT NEEDED</p><h2>Find your perspective.</h2><p>Choose a Twin to explore the collection.<br/>Preset measurements describe the twin, not your personal fit.</p><div className="twin-grid">{twins.map((t,i)=><button key={t.name} className={chosenTwin===i?'selected':''} aria-pressed={chosenTwin===i} onClick={()=>setChosenTwin(i)}>{photoView(0,i)}<strong>{t.name}{chosenTwin===i?' ✓':''}</strong><small>{t.height} cm · {t.weight} kg</small><small>Sample size {t.size}</small></button>)}</div><div className="modal-actions">{badge}<button className="primary" onClick={()=>{setPerson(chosenTwin);setMode('twin');close();setToast(`Prepared views now use ${twins[chosenTwin].name}`)}}>Continue with {twins[chosenTwin].name} →</button></div></div>}
   {panel==='signin'&&<div className="modal-body"><p className="eyebrow">MY ACCOUNT</p><h2>A familiar place.<br/>A personal experience.</h2><p>Enable Always On in the account you already use to shop.</p><div className="signin-demo"><strong>Partner account simulation</strong><p>Continue as Alex to explore sign-in, or create a new local profile. No password required.</p></div><button className="primary full" onClick={()=>{switchMode('personal');close()}}>Continue as Alex</button><button className="secondary full" onClick={()=>{setProfile({...sampleProfile,name:'',photo:''});setPhoto('');setMeasure({height:sampleProfile.height,weight:sampleProfile.weight});setUnit('metric');setPanel('profile')}}>Create a local account</button><button className="text-link" onClick={()=>open('twins')}>Continue without an account</button>{badge}</div>}
   {panel==='profile'&&<form className="modal-body profile-form" onSubmit={finishProfile}><p className="eyebrow">MY ACCOUNT / POWERED BY SPREEAI</p><h2>Your perspective,<br/>saved.</h2><p>Your retailer account stays at the center. These additional details switch on your personal shopping experience.</p><label>Age group<select value={age} onChange={e=>{setAge(e.target.value);setPhoto('')}}><option value="adult">18 or older</option><option value="teen">13–17</option><option value="child">Under 13</option></select></label>{age==='child'?<p className="error">SPREEAI is not available to children under 13.</p>:age==='teen'?<><p>Personal uploads are unavailable for ages 13–17. This prototype contains adult sample twins only; age-appropriate twins are not included yet.</p><button type="button" className="secondary full" onClick={close}>Return to collection</button></>:<>
    <div className="photo-input">{photo&&<img src={photo==='sample'?asset(1,0):photo} alt="Your selected profile photo"/>}<div><strong>Your photo</strong><p>A clear, full-body photo in fitted clothing.</p><label className="text-link">Upload photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){setError('Choose a JPG, PNG or WebP smaller than 8 MB.');return}const reader=new FileReader();reader.onload=()=>{setPhoto(String(reader.result));setError('')};reader.readAsDataURL(file)}}/></label><button type="button" className="text-link" onClick={()=>setPhoto('sample')}>Use sample photo</button></div></div>
    <p className="fine">Uploads stay in this tab and are not sent anywhere. Sample visuals represent personalization; your photo is not transformed.</p>
    <label>First name<input name="name" defaultValue={profile.name} required maxLength={40}/></label><div className="unit-toggle"><button type="button" className={unit==='metric'?'selected':''} onClick={()=>setUnit('metric')}>Metric</button><button type="button" className={unit==='imperial'?'selected':''} onClick={()=>setUnit('imperial')}>Imperial</button></div><div className="form-row" key={unit}><label>Height ({unit==='metric'?'cm':'in'})<input name="height" type="number" required min={unit==='metric'?100:39} max={unit==='metric'?230:91} step="0.1" value={Math.round((unit==='metric'?measure.height:measure.height/2.54)*10)/10} onChange={e=>setMeasure({...measure,height:Number(e.target.value)*(unit==='imperial'?2.54:1)})}/></label><label>Weight ({unit==='metric'?'kg':'lb'})<input name="weight" type="number" required min={unit==='metric'?30:66} max={unit==='metric'?250:551} step="0.1" value={Math.round((unit==='metric'?measure.weight:measure.weight/0.453592)*10)/10} onChange={e=>setMeasure({...measure,weight:Number(e.target.value)*(unit==='imperial'?.453592:1)})}/></label></div><label>Sizing profile<select name="gender" defaultValue={profile.gender}><option>Male</option><option>Female</option></select><small>Current model input; does not limit which collection you browse.</small></label><label>Preferred fit<select name="fit" defaultValue={profile.fit}><option>Close</option><option>Regular</option><option>Relaxed</option></select></label><label className="checkbox"><input type="checkbox" name="consent" required defaultChecked={mode==='personal'}/><span>Enable visualization and fit previews with my local profile.</span></label>{error&&<p className="error" role="alert">{error}</p>}<button className="primary full" type="submit">Save profile & turn Always On →</button><p className="fine">Your photo and measurements stay in this tab. They are cleared when you reload. No upload or generation occurs from this form.</p></>}</form>}
   {panel==='why'&&product&&<FitSelector product={product} size={size} onSize={setSize}/>}
   {panel==='compare'&&<CompareLooks initial={compare} onChange={setCompare} product={product} selectedSize={size} onSize={setSize}/>}
   {panel==='checkout'&&<CheckoutCelebration itemCount={bag.length} onBack={()=>open('bag')} onExplore={()=>{close();nav('/collection')}}/>}
   {panel==='bag'&&<div className="modal-body"><p className="eyebrow">MY ACCOUNT</p><h2>Your shopping bag.</h2>{bag.length?bag.map((item,i)=>{const p=products.find(p=>p.id===item.id)||wardrobe.find(p=>p.id===item.id)!;return <div className="bag-item" key={i}><img src={p.image} alt={p.name}/><div><strong>{p.name}</strong><p>Size {item.size} · {p.priceLabel||money(p.price)}</p><button className="text-link" onClick={()=>setBag(bag.filter((_,j)=>j!==i))}>Remove</button></div></div>}):<p>Your next favorite piece is waiting in the collection.</p>}<p>Local demo only. No payment or order will be placed.</p>{bag.length>0&&<button className="primary full" onClick={()=>open('checkout')}>Preview demo checkout</button>}<button className="secondary full" onClick={()=>{close();nav('/collection')}}>Continue exploring</button></div>}
   {(panel==='stylist'||panel==='saved')&&<Stylist key={panel} currentProduct={product} voice={voice} person={person} savedOnly={panel==='saved'} onProduct={()=>setPanel(null)} onBag={items=>setBag([...bag,...items])}/>}
   {panel==='colors'&&<div className="modal-body"><p className="eyebrow">ONE PIECE / TWO PERSPECTIVES</p><h2>Find your color.</h2><p>The merino polo, on {mode==='personal'?'your sample profile':who}.</p><div className="comparison"><div>{photoView(2)}<h3>Bordeaux</h3></div><div><img src={`/always-on-assets/style-0-${person}.webp`} alt={`${who} wearing an ivory polo`}/><h3>Ivory</h3></div></div><p className="fine">Sample color comparison. Ivory is an editorial preview and is not a purchasable variant in this local catalog.</p>{badge}</div>}
  </Dialog.Content></Dialog.Portal></Dialog.Root>
 </>;
}

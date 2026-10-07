import {useState} from 'react';
import {InstagramLogo} from '@phosphor-icons/react/dist/csr/InstagramLogo';
import {LinkedinLogo} from '@phosphor-icons/react/dist/csr/LinkedinLogo';
import {XLogo} from '@phosphor-icons/react/dist/csr/XLogo';
import {YoutubeLogo} from '@phosphor-icons/react/dist/csr/YoutubeLogo';
import {TiktokLogo} from '@phosphor-icons/react/dist/csr/TiktokLogo';
import {ThreadsLogo} from '@phosphor-icons/react/dist/csr/ThreadsLogo';
import {publicSite as site} from './brand-links';
import './brand-footer.css';
import {ALWAYS_ON_BUILD} from './release';
const socials=[{label:'Instagram',url:'https://www.instagram.com/spreeai/',Icon:InstagramLogo},{label:'LinkedIn',url:'https://www.linkedin.com/company/spreeai',Icon:LinkedinLogo},{label:'X',url:'https://twitter.com/SpreeAI',Icon:XLogo},{label:'YouTube',url:'https://www.youtube.com/channel/UCwqmYq9Cp-JE4iOU-LtRTPg',Icon:YoutubeLogo},{label:'TikTok',url:'https://www.tiktok.com/@spreeai',Icon:TiktokLogo},{label:'Threads',url:'https://www.threads.com/@spreeai',Icon:ThreadsLogo}];

const explore=[['Try Always On','/spreeai-always-on-demo/online/'],['Platform','/product'],['Design','/design'],['Developers','/developers'],['Partner','/partner'],['In the News','/blog'],['Our Team','/team'],['CEO Letter','/ceo-note'],['History','/history']];
const connect=[['Contact Us','/contact-us'],['FAQ','/faq'],['Become a Partner','/partner#start'],['Partner Workspace','https://partner.spreeai.com/'],['Press & Media','/press-media'],['Careers','/team#careers'],['Leadership','/team#leadership']];
function link(path:string){return path.startsWith('https:')||path.startsWith('/spreeai-always-on-demo/')?path:site+path}
export default function BrandFooter(){const [languages,setLanguages]=useState(false);return <footer className="brand-footer site-footer">
<div className="footer-thesis"><h2>See it. Know it. Style it.</h2></div>
<div className="footer-grid"><section className="footer-column"><h2>Explore</h2><nav aria-label="Footer navigation">{explore.map(([label,path])=><a key={path} href={link(path)}>{label}</a>)}</nav></section>
<section className="footer-column"><h2>Connect</h2><nav aria-label="Footer company navigation">{connect.map(([label,path])=><a key={path} href={link(path)}>{label}</a>)}</nav></section>
</div>
<div className="footer-follow"><h2>Follow Us</h2><nav className="footer-socials" aria-label="SPREEAI social media">{socials.map(({label,url,Icon})=><a key={label} href={url} aria-label={`SPREEAI on ${label}`} target="_blank" rel="noopener noreferrer"><Icon size={17} weight={label==='YouTube'||label==='LinkedIn'?'fill':'regular'} aria-hidden="true"/></a>)}</nav><div className="footer-language"><button className="language-trigger" type="button" aria-expanded={languages} onClick={()=>setLanguages(!languages)}>English <span aria-hidden="true">⌄</span></button>{languages&&<nav aria-label="Website languages"><span>Experience language: English</span><a href={site+'/'}>Visit SPREEAI website</a></nav>}</div></div>
<a className="footer-logo" href={site+'/'} aria-label="SPREEAI home"><img src="/spreeai-always-on-demo/spreeai-logo.svg" alt="SPREEAI"/></a>
<div className="footer-legal"><div className="footer-release"><p>Copyright © {new Date().getFullYear()} SPREEAI Inc. All rights reserved.</p><p className="footer-build">Build {ALWAYS_ON_BUILD}</p></div><nav aria-label="Legal">{[['Terms of Service','/terms'],['Privacy Notice','/privacy'],['Terms and Conditions','/terms-conditions'],['Cookie Settings','/cookies']].map(([label,path])=><a key={path} href={site+path}>{label}</a>)}</nav></div></footer>}

import {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {Camera} from '@phosphor-icons/react/dist/csr/Camera';
import IdentityPortrait from './IdentityPortrait';
import ConnectedAccount from './ConnectedAccount';
import {useConnectedProfile} from './connection';
import './change-perspective.css';

export default function ChangePerspective(){
 const {identity}=useConnectedProfile();
 const [open,setOpen]=useState(false);
 return <Dialog.Root open={open} onOpenChange={setOpen}>
  <div className="perspective-shortcut">
   <div className="perspective-person">{identity?<IdentityPortrait identity={identity}/>:<span className="perspective-guest-icon"><Camera size={20} aria-hidden="true"/></span>}<span><small>YOUR PERSPECTIVE</small><strong>{!identity?'Make this look yours':identity.kind==='twin'?`${identity.name} · Twin`:'You · Your photo'}</strong></span></div>
   <Dialog.Trigger className="perspective-change"><span className="perspective-camera"><Camera size={18}/></span><span>Change photo or twin</span></Dialog.Trigger>
  </div>
  <Dialog.Portal><Dialog.Overlay className="perspective-overlay"/>
   <Dialog.Content className="perspective-sheet" aria-describedby="perspective-description">
    <header className="perspective-sheet-heading"><div><p>YOUR PERSONAL VIEW</p><Dialog.Title>Make this look yours.</Dialog.Title></div><Dialog.Close className="perspective-sheet-close" aria-label="Close photo or twin editor">×</Dialog.Close></header>
    <Dialog.Description id="perspective-description">Switch to your photo or another Twin. Your piece stays open. We’ll refresh your preview and fit guidance.</Dialog.Description>
    {identity&&<div className="perspective-current"><IdentityPortrait identity={identity}/><span>Currently viewing<strong>{identity?.kind==='twin'?`${identity.name} · Twin`:'Your photo'}</strong></span><Camera size={22} aria-hidden="true"/></div>}
    <ConnectedAccount perspectiveOnly initialSource="photo" savedLooks={null} onDone={()=>setOpen(false)} onSaved={()=>setOpen(false)}/>
   </Dialog.Content>
  </Dialog.Portal>
 </Dialog.Root>;
}

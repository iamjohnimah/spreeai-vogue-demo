const media='/spreeai-always-on-demo/online/media/';
export default function CampaignHero({onSignIn,onShop}:{onSignIn:()=>void;onShop:()=>void}){
 return <section className="campaign" aria-label="Always On with Freja">
  <video autoPlay muted loop playsInline disablePictureInPicture controls={false} poster={media+'freja-poster.jpg'} aria-label="Freja discovers fashion on her laptop, then wears an evening dress and tailored suit" src={media+'freja-always-on.mp4'}/>
  <div className="campaign-shade"/>
  <div className="campaign-copy"><p className="eyebrow">INTRODUCING ALWAYS ON</p><h1>A world of style.<br/><em>Already on you.</em></h1><p>Your likeness, your motion, your fit.<br/>Naturally part of every piece you discover.</p><div className="campaign-actions"><button onClick={onShop}>Explore collection</button><button onClick={onSignIn}>My profile</button></div></div>
  <span className="campaign-credit">FREJA / THE ALWAYS ON FILM</span>
 </section>
}

import Link from "next/link";
import { PageHero } from "@/components/SiteShell";

type ProductLandingProps={eyebrow:string;title:string;description:string;introTitle:string;intro:string;benefits:string[];considerations:string[];faq:{q:string;a:string}[];};

export default function ProductLanding({eyebrow,title,description,introTitle,intro,benefits,considerations,faq}:ProductLandingProps){
 return <>
  <PageHero eyebrow={eyebrow} title={title} description={description}/>
  <section className="section product-intro"><div className="wrap product-intro-grid"><div><p className="eyebrow">UNDERSTAND YOUR OPTIONS</p><h2>{introTitle}</h2></div><div><p>{intro}</p><Link className="button" href="/quote">Explore your options <span aria-hidden="true">↗</span></Link></div></div></section>
  <section className="section product-detail-section"><div className="wrap product-detail-grid">
   <article><p className="eyebrow">WHAT TO CONSIDER</p><h2>Questions worth asking.</h2><ul className="product-check-list">{benefits.map((item)=><li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></article>
   <aside className="product-note"><p className="eyebrow">IMPORTANT DETAILS</p><h3>Understand the policy before you decide.</h3><ul>{considerations.map(item=><li key={item}>{item}</li>)}</ul></aside>
  </div></section>
  <section className="section product-faq-section"><div className="wrap"><div className="section-heading"><p className="eyebrow">COMMON QUESTIONS</p><h2>What people often ask.</h2></div><div className="product-faq-list">{faq.map((item)=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></div></section>
  <section className="product-cta"><div className="wrap"><div><p className="eyebrow">TAKE THE NEXT STEP</p><h2>Start with a conversation, not a commitment.</h2><p>Tell us what you are looking for. We will help direct your request to an appropriately licensed professional.</p></div><Link className="button button-light" href="/quote">Request information <span aria-hidden="true">↗</span></Link></div></section>
 </>;
}

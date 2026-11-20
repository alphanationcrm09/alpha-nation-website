"use client";

import { useEffect, useState } from "react";
import TurnstileChallenge from "@/components/TurnstileChallenge";

type StateOption = { state_code: string; state_name: string };
const products = ["Life Insurance","Final Expense","Term Life Insurance","Whole Life Insurance","Mortgage Protection","Medicare","ACA Health Insurance"];
const ageBands = ["Under 30","30–39","40–49","50–59","60–69","70–79","80 or older"];
const coverageGoals = ["Under $25,000","$25,000–$49,999","$50,000–$99,999","$100,000–$249,999","$250,000–$499,999","$500,000 or more","Not sure yet"];

export default function QuoteJourney() {
  const [step,setStep]=useState(1);
  const [product,setProduct]=useState("Life Insurance");
  const [state,setState]=useState("");
  const [ageBand,setAgeBand]=useState("");
  const [coverage,setCoverage]=useState("Not sure yet");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [states,setStates]=useState<StateOption[]>([]);
  const [statesLoading,setStatesLoading]=useState(true);

  useEffect(()=>{
    fetch("/api/states",{cache:"no-store"})
      .then(async response=>{
        if(!response.ok) throw new Error("State list unavailable.");
        const result=await response.json();
        setStates(Array.isArray(result.rows)?result.rows:[]);
      })
      .catch(()=>setStates([]))
      .finally(()=>setStatesLoading(false));
  },[]);

  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    if(String(data.get("website")||"").trim()) return;
    if(!data.get("consent")) return setMessage("Please confirm that Alpha Nation may contact you about this request.");
    const token=String(data.get("cf-turnstile-response")||"");
    if(!token) return setMessage("Complete the security check before sending your request.");
    const name=String(data.get("name")||"").trim();
    const phone=String(data.get("phone")||"").trim();
    const email=String(data.get("email")||"").trim();
    const zip=String(data.get("zip")||"").trim();
    if(name.length<2||phone.length<7||!state||!ageBand||!product) return setMessage("Complete the required details before continuing.");
    setBusy(true);setMessage("Sending your request…");
    try {
      const response=await fetch("/api/inquiries",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
        fullName:name,phone,email,stateCode:state,zipCode:zip,inquiryType:product==="Final Expense"?"Final Expense":product==="Medicare"?"Medicare":product==="ACA Health Insurance"?"ACA Health Insurance":"Life Insurance",
        message:"Website quote request. Age range: "+ageBand+". Coverage goal: "+coverage+". Requested product: "+product+". Please contact me to discuss available options.",
        contactConsent:true,website:String(data.get("website")||""),turnstileToken:token
      })});
      const result=await response.json().catch(()=>({error:"We could not send your request."}));
      if(!response.ok){window.turnstile?.reset();setMessage(result.error||"We could not send your request. Please try again.");return;}
      form.reset();setStep(1);setProduct("Life Insurance");setState("");setAgeBand("");setCoverage("Not sure yet");window.turnstile?.reset();
      setMessage("Your request has been received. Alpha Nation will contact you to discuss options. This is not an insurance quote or an application.");
    } catch {window.turnstile?.reset();setMessage("The request could not be sent. Check your connection and try again.");}
    finally {setBusy(false);}
  }

  return <div className="quote-journey">
    <div className="quote-progress"><span>YOUR COVERAGE CONVERSATION</span><b>Step {step} of 2</b><div><i style={{width:step===1?"50%":"100%"}}/></div></div>
    <form onSubmit={submit}>
      {step===1?<section className="quote-step">
        <p className="eyebrow">LET'S START WITH THE BASICS</p><h2>What kind of protection are you exploring?</h2><p className="quote-step-copy">Choose the option closest to what you have in mind. A licensed professional will confirm which products are available in your state.</p>
        <label className="quote-field-label">Coverage type</label><div className="quote-product-grid">{products.map((item)=> <button type="button" key={item} className={product===item?"quote-choice selected":"quote-choice"} aria-pressed={product===item} onClick={()=>setProduct(item)}><span>{item}</span><b>{product===item?"Selected":"Choose"}</b></button>)}</div>
        <div className="quote-form-grid">
          <label>Where do you live?<select required value={state} disabled={statesLoading||states.length===0} onChange={e=>setState(e.target.value)}><option value="">{statesLoading?"Loading states…":states.length?"Select your state":"State list unavailable"}</option>{states.map(item=><option key={item.state_code} value={item.state_code}>{item.state_name}</option>)}</select></label>
          <label>What is your age range?<select required value={ageBand} onChange={e=>setAgeBand(e.target.value)}><option value="">Select age range</option>{ageBands.map(a=><option key={a}>{a}</option>)}</select></label>
          <label className="quote-wide">Do you have a coverage amount in mind?<select value={coverage} onChange={e=>setCoverage(e.target.value)}>{coverageGoals.map(c=><option key={c}>{c}</option>)}</select></label>
        </div>
        <button type="button" className="button quote-next" onClick={()=>{if(!state||!ageBand){setMessage("Select your state and age range to continue.");return;}setMessage("");setStep(2);}}>Continue <span aria-hidden="true">→</span></button>
      </section>:<section className="quote-step">
        <p className="eyebrow">ONE LAST STEP</p><h2>Where should we reach you?</h2><p className="quote-step-copy">Share your contact details so our team can follow up about your request. Do not enter medical details or Social Security numbers here.</p>
        <div className="quote-form-grid">
          <label>Full name<input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Your name"/></label>
          <label>Phone number<input name="phone" required minLength={7} maxLength={32} type="tel" pattern="[0-9+() .-]{7,32}" autoComplete="tel" placeholder="Your phone number"/></label>
          <label>Email address <span>(optional)</span><input name="email" type="email" maxLength={254} autoComplete="email" placeholder="you@example.com"/></label>
          <label>ZIP code <span>(optional)</span><input name="zip" inputMode="numeric" maxLength={10} pattern="[0-9]{5}(-[0-9]{4})?" placeholder="ZIP code"/></label>
        </div>
        <div className="quote-consent"><label><input type="checkbox" name="consent" required/> I agree Alpha Nation may contact me about this specific request. This is not consent to unrelated marketing or automated marketing calls or texts.</label></div>
        <div className="form-honeypot" aria-hidden="true"><label>Leave empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
        <TurnstileChallenge action="inquiry" theme="light" />
        <div className="quote-actions"><button type="button" className="an-text-button" onClick={()=>{setStep(1);setMessage("");}}>← Back</button><button className="button" disabled={busy}>{busy?"Sending…":"Send my request"}</button></div>
      </section>}
      {message&&<p className="quote-status" role="status">{message}</p>}
    </form>
    <p className="quote-legal">Submitting this form requests a follow-up only. It does not generate a price, guarantee eligibility, submit an insurance application, bind coverage, or create an appointment. Availability depends on state, carrier, product, licensing and underwriting.</p>
  </div>;
}

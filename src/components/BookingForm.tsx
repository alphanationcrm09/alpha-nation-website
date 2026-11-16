"use client";
import {useEffect,useRef,useState} from "react";
import Script from "next/script";
type StateOption={state_code:string;state_name:string};
const products=["Final Expense","Term Life Insurance","Whole Life Insurance","Mortgage Protection","Auto Insurance","Health Insurance","Medicare","ACA Health Insurance","Home Insurance","Credit Repair","Debt Relief"];
const localDateValue=()=>{const now=new Date();now.setMinutes(now.getMinutes()-now.getTimezoneOffset());return now.toISOString().slice(0,10);};
export function BookingForm(){
 const [states,setStates]=useState<StateOption[]>([]);const [state,setState]=useState("");const [turnstileSiteKey,setTurnstileSiteKey]=useState("");const [turnstileLoaded,setTurnstileLoaded]=useState(false);const turnstileContainer=useRef<HTMLDivElement|null>(null);const turnstileWidgetId=useRef<string|null>(null);const [date,setDate]=useState("");const [slot,setSlot]=useState("");const [source,setSource]=useState("Other");const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);
 useEffect(()=>{fetch("/api/states",{cache:"no-store"}).then(r=>r.json()).then(j=>setStates(j.rows||[])).catch(()=>setStates([]));fetch("/api/public-config",{cache:"no-store"}).then(r=>r.json()).then(j=>setTurnstileSiteKey(typeof j.turnstileSiteKey==="string"?j.turnstileSiteKey:"")).catch(()=>setTurnstileSiteKey(""));},[]);\n useEffect(()=>{if(!turnstileLoaded||!turnstileSiteKey||!turnstileContainer.current||!window.turnstile)return;turnstileContainer.current.replaceChildren();turnstileWidgetId.current=window.turnstile.render(turnstileContainer.current,{sitekey:turnstileSiteKey,action:"appointment",theme:"dark"});return()=>{if(turnstileWidgetId.current&&window.turnstile){window.turnstile.remove(turnstileWidgetId.current);turnstileWidgetId.current=null;}};},[turnstileLoaded,turnstileSiteKey]);
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget;const fields=new FormData(form);
  if(!fields.get("consent"))return setMessage("Please provide appointment contact consent.");
  if(String(fields.get("website")||"").trim())return setMessage("We could not submit your request. Please try again.");
  const turnstileToken=String(fields.get("cf-turnstile-response")||"");if(!turnstileToken)return setMessage("Please complete the security check.");
  setBusy(true);setMessage("Sending your appointment request…");
  try{
   const response=await fetch("/api/appointments",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
    legalFirstName:String(fields.get("firstName")||"").trim(),legalLastName:String(fields.get("lastName")||"").trim(),
    residentialAddress:String(fields.get("address")||"").trim(),phone:String(fields.get("phone")||"").trim(),email:String(fields.get("email")||"").trim(),
    stateCode:state,zipCode:String(fields.get("zip")||"").trim(),city:String(fields.get("city")||"").trim(),
    insuranceType:String(fields.get("interest")||"Final Expense"),coverageAmount:Number(fields.get("coverage")),
    beneficiaryName:String(fields.get("beneficiary")||"").trim(),beneficiaryRelationship:String(fields.get("relationship")||"").trim(),
    preferredDate:date,preferredTime:slot,source,contactConsent:true,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
    website:String(fields.get("website")||""),turnstileToken
   })});
   const result=await response.json().catch(()=>({error:"We could not submit your request. Please try again."}));
   if(!response.ok){window.turnstile?.reset(turnstileWidgetId.current||undefined);setMessage(result.error||"We could not submit your request. Please try again.");return;}
   form.reset();setState("");setDate("");setSlot("");setSource("Other");window.turnstile?.reset();
   setMessage("Request received. Alpha Nation will contact you to confirm the appointment. Your preferred time is not confirmed until our team contacts you.");
  }catch{window.turnstile?.reset();setMessage("The request could not be sent. Check your connection and try again.");}
  finally{setBusy(false);}
 }
 return <form className="form-card" onSubmit={submit}>
  <h2>Legal name and contact details</h2>
  <div className="form-grid">
   <label>Legal first name<input name="firstName" autoComplete="given-name" required maxLength={60}/></label>
   <label>Legal last name<input name="lastName" autoComplete="family-name" required maxLength={60}/></label>
   <label>Phone number<input name="phone" type="tel" autoComplete="tel" required maxLength={32} minLength={7} pattern="[0-9+() .-]{7,32}"/></label>
   <label>Email address <span>(optional)</span><input name="email" type="email" autoComplete="email" maxLength={254}/></label>
  </div>
  <h2>Residential address</h2>
  <div className="form-grid">
   <label className="form-grid-wide">Street address<input name="address" autoComplete="street-address" required maxLength={240} placeholder="House number and street"/></label>
   <label>City<input name="city" autoComplete="address-level2" required maxLength={100}/></label>
   <label>State<select required value={state} onChange={e=>setState(e.target.value)}><option value="">Select state</option>{states.map(s=><option key={s.state_code} value={s.state_code}>{s.state_name}</option>)}</select></label>
   <label>ZIP code<input name="zip" inputMode="numeric" autoComplete="postal-code" required maxLength={10} pattern="[0-9]{5}(-[0-9]{4})?"/></label>
  </div>
  <h2>Coverage and beneficiary</h2>
  <div className="form-grid">
   <label>Insurance type<select name="interest" defaultValue="Final Expense">{products.map(p=><option key={p}>{p}</option>)}</select></label>
   <label>Coverage amount (USD)<input name="coverage" type="number" min="2000" max="50000" step="500" required placeholder="e.g. 15000"/></label>
   <label>Beneficiary full name<input name="beneficiary" required maxLength={120}/></label>
   <label>Relationship to you<input name="relationship" required maxLength={60} placeholder="e.g. Spouse, child"/></label>
   <label>Preferred appointment date<input type="date" required value={date} onChange={e=>setDate(e.target.value)} min={localDateValue()}/></label>
   <label>Preferred appointment time<select required value={slot} onChange={e=>setSlot(e.target.value)}><option value="">Choose a time</option>{Array.from({length:25},(_,i)=>{const hour=8+Math.floor(i/2),minute=i%2?30:0,label=`${hour%12||12}:${minute?"30":"00"} ${hour<12?"AM":"PM"}`;return <option key={label}>{label}</option>;})}</select></label>
   <label>How did you hear about us?<select name="source" value={source} onChange={e=>setSource(e.target.value)}>{["Google Search","Facebook","Instagram","Referral","Advertisement","Phone Call","Other"].map(s=><option key={s}>{s}</option>)}</select></label>
  </div>
  <div className="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  <div className="consent-panel"><p><b>Appointment contact consent</b></p><label className="consent-check"><input name="consent" type="checkbox" required/> I agree that Alpha Nation may contact me by phone or email about this appointment. This is not consent to receive marketing messages or submit an insurance application.</label></div>
  {turnstileSiteKey?<><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={()=>setTurnstileLoaded(true)}/><div className="turnstile-wrap"><div ref={turnstileContainer}/><noscript>JavaScript is required for the security check.</noscript></div></>:<p className="form-notice">Security verification is loading or is not configured. Please refresh this page shortly. If the issue continues, contact aalphanation@gmail.com.</p>}
  <p className="form-notice">Your preferred date and time are a request, not a confirmed booking. Our team will contact you to confirm. Do not enter medical or health details here.</p>
  <button className="button" type="submit" disabled={busy}>{busy?"Submitting…":"Request appointment"}</button>
  {message&&<p role="status" className="form-notice">{message}</p>}
 </form>;
}
declare global{interface Window{turnstile?:{render:(container:HTMLElement,options:{sitekey:string;action:string;theme:string})=>string;reset:(widgetId?:string)=>void;remove:(widgetId:string)=>void}}}

"use client";
import {useEffect,useState} from "react";
import TurnstileChallenge from "@/components/TurnstileChallenge";
type StateOption={state_code:string;state_name:string};
const products=["Final Expense","Term Life Insurance","Whole Life Insurance","Mortgage Protection","Auto Insurance","Health Insurance","Medicare","ACA Health Insurance","Home Insurance","Credit Repair","Debt Relief"];
const productsRequiringCoverage=["Final Expense","Term Life Insurance","Whole Life Insurance","Mortgage Protection"];
const localDateValue=()=>{const now=new Date();now.setMinutes(now.getMinutes()-now.getTimezoneOffset());return now.toISOString().slice(0,10);};
export function BookingForm(){
 const [states,setStates]=useState<StateOption[]>([]);const [state,setState]=useState("");const [date,setDate]=useState("");const [slot,setSlot]=useState("");const [source,setSource]=useState("Other");const [insuranceType,setInsuranceType]=useState("Final Expense");const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);const [turnstileToken,setTurnstileToken]=useState("");
 const requiresCoverage=productsRequiringCoverage.includes(insuranceType);
 useEffect(()=>{fetch("/api/states",{cache:"no-store"}).then(async r=>{if(!r.ok)throw new Error("State list unavailable.");return r.json();}).then(j=>setStates(Array.isArray(j.rows)?j.rows:[])).catch(()=>{setStates([]);setMessage("State availability is temporarily unavailable. Please try again later.");});},[]);
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget;const fields=new FormData(form);
  if(!fields.get("consent"))return setMessage("Please provide appointment contact consent.");
  if(String(fields.get("faxNumber")||"").trim())return setMessage("We could not submit your request. Please try again. (Diagnostic code: CLIENT_HONEYPOT)");
  if(!turnstileToken)return setMessage("Please complete the security check.");
  setBusy(true);setMessage("Sending your appointment request…");
  try{
   const response=await fetch("/api/appointments",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
    legalFirstName:String(fields.get("firstName")||"").trim(),legalLastName:String(fields.get("lastName")||"").trim(),
    residentialAddress:String(fields.get("address")||"").trim(),phone:String(fields.get("phone")||"").trim(),email:String(fields.get("email")||"").trim(),
    stateCode:state,zipCode:String(fields.get("zip")||"").trim(),city:String(fields.get("city")||"").trim(),
    insuranceType,coverageAmount:requiresCoverage?Number(fields.get("coverage")):null,
    preferredDate:date,preferredTime:slot,source,contactConsent:true,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
    website:String(fields.get("faxNumber")||""),turnstileToken
   })});
   const result=await response.json().catch(()=>({error:"We could not submit your request. Please try again."}));
   if(!response.ok){window.turnstile?.reset();setTurnstileToken("");const detail=result.diagnosticCode?` (Diagnostic code: ${result.diagnosticCode})`:"";setMessage((result.error||"We could not submit your request. Please try again.")+detail);return;}
   form.reset();setState("");setDate("");setSlot("");setSource("Other");setInsuranceType("Final Expense");window.turnstile?.reset();setTurnstileToken("");
   setMessage("Request received. Alpha Nation will contact you to confirm the appointment. Your preferred time is not confirmed until our team contacts you.");
  }catch{window.turnstile?.reset();setTurnstileToken("");setMessage("The request could not be sent. Check your connection and try again.");}
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
   <label>State<select required value={state} disabled={states.length===0} onChange={e=>setState(e.target.value)}><option value="">{states.length?"Select state":"States unavailable"}</option>{states.map(s=><option key={s.state_code} value={s.state_code}>{s.state_name}</option>)}</select></label>
   <label>ZIP code<input name="zip" inputMode="numeric" autoComplete="postal-code" required maxLength={10} pattern="[0-9]{5}(-[0-9]{4})?"/></label>
  </div>
  <h2>Coverage preferences</h2>
  <div className="form-grid">
   <label>Insurance type<select name="interest" value={insuranceType} onChange={e=>setInsuranceType(e.target.value)}>{products.map(p=><option key={p}>{p}</option>)}</select></label>
   {requiresCoverage&&<label>Coverage amount (USD)<input name="coverage" type="number" min="2000" max="50000" step="500" required placeholder="e.g. 15000"/></label>}
   <label>Preferred appointment date<input type="date" required value={date} onChange={e=>setDate(e.target.value)} min={localDateValue()}/></label>
   <label>Preferred appointment time<select required value={slot} onChange={e=>setSlot(e.target.value)}><option value="">Choose a time</option>{Array.from({length:25},(_,i)=>{const hour=8+Math.floor(i/2),minute=i%2?30:0,label=`${hour%12||12}:${minute?"30":"00"} ${hour<12?"AM":"PM"}`;return <option key={label}>{label}</option>;})}</select></label>
   <label>How did you hear about us?<select name="source" value={source} onChange={e=>setSource(e.target.value)}>{["Google Search","Facebook","Instagram","Referral","Advertisement","Phone Call","Other"].map(s=><option key={s}>{s}</option>)}</select></label>
  </div>
  <div className="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="faxNumber" type="text" tabIndex={-1} autoComplete="new-password" /></label></div>
  <div className="consent-panel"><p><b>Appointment contact consent</b></p><label className="consent-check"><input name="consent" type="checkbox" required/> I ask Alpha Nation to contact me by phone or email about this appointment request using the details I provided. This is not consent to unrelated marketing or automated marketing calls or text messages.</label></div>
  <TurnstileChallenge action="appointment" theme="dark" onToken={setTurnstileToken} />
  <p className="form-notice">Appointment requests are accepted only in states currently marked active. Requests are subject to licensing, service eligibility, and agent availability. Your preferred date and time are not confirmed until our team contacts you. We’ll discuss beneficiary details if you decide to explore an application. Do not enter medical or health details here.</p>
  <button className="button" type="submit" disabled={busy}>{busy?"Submitting…":"Request appointment"}</button>
  {message&&<p role="status" className="form-notice">{message}</p>}
 </form>;
}

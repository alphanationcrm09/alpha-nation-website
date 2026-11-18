"use client";
import {useState} from "react";
import Link from "next/link";
import {AlphaLogo} from "@/components/AlphaLogo";
export default function CustomerLoginPage(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);
 async function login(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setMessage("");try{const r=await fetch("/api/customer/auth",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Sign-in failed.");window.location.assign("/customer");}catch(e){setMessage(e instanceof Error?e.message:"Sign-in failed.");}finally{setBusy(false);}}
 return <section className="admin-login-wrap"><div className="admin-login-card"><Link href="/"><AlphaLogo/></Link><p className="eyebrow">CUSTOMER PORTAL</p><h1>Customer login</h1><p>Sign in to view policy information linked to your Alpha Nation account.</p><form onSubmit={login}><label>Email address<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="button" disabled={busy}>{busy?"Signing in…":"Sign in"}</button>{message&&<p role="status">{message}</p>}</form><small>Customer accounts are created by Alpha Nation staff. If you need access, contact our team.</small><p><Link className="an-inline-link" href="/contact">Contact customer support</Link></p></div></section>;
}

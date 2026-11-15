import Link from "next/link";
import { AlphaLogo } from "@/components/AlphaLogo";

export default function CustomerLoginPage() {
  return <section className="admin-login-wrap"><div className="admin-login-card">
    <Link href="/"><AlphaLogo /></Link>
    <p className="eyebrow">CUSTOMER SUPPORT</p>
    <h1>Customer access</h1>
    <p>The secure customer portal is not currently enabled on this website. For help with an existing policy, beneficiary questions or account access, contact the Alpha Nation team.</p>
    <a className="button" href="mailto:aalphanation@gmail.com?subject=Customer%20Account%20Assistance">Contact customer support</a>
    <p><Link className="an-inline-link" href="/">Return to Alpha Nation</Link></p>
  </div></section>;
}

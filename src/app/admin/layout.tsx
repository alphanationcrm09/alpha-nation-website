import type { Metadata } from "next";
export const metadata:Metadata={title:"Admin panel"};
export default function AdminLayout({children}:{children:React.ReactNode}){return <div className="admin-area">{children}</div>}

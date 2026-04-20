import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router-dom";

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate()
  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){
      navigate('/login')
    }
  },[])
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>

  );
}

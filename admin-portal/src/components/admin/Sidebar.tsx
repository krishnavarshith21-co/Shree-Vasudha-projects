"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  TreePalm,
  Image,
  MessageSquareQuote,
  Users,
  FileEdit,
  Home,
  Info,
  Phone,
  Mail,
  Search,
  Settings,
  BarChart3,
  UserCircle,
  LogOut,
  ChevronLeft,
  Megaphone,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { type: "divider", label: "Content" },
  { label: "Projects", icon: Building2, href: "/admin/projects" },
  { label: "Services", icon: Briefcase, href: "/admin/services" },
  { label: "Amenities", icon: TreePalm, href: "/admin/amenities" },
  { label: "Gallery", icon: Image, href: "/admin/media" },
  { label: "Blog", icon: FileEdit, href: "/admin/blog" },
  { type: "divider", label: "Pages" },
  { label: "Homepage", icon: Home, href: "/admin/homepage" },
  { label: "About", icon: Info, href: "/admin/about" },
  { label: "Contact", icon: Phone, href: "/admin/contact" },
  { type: "divider", label: "Management" },
  { label: "Enquiries", icon: Mail, href: "/admin/enquiries" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "SEO", icon: Search, href: "/admin/seo" },
  { type: "divider", label: "System" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
] as const;

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const supabase = createClient();
      const { count } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'New');
      if (count !== null) setUnreadCount(count);
    };
    fetchUnread();
  }, []);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#0e0e0e] border-r border-white/[0.06] flex flex-col z-50 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className="h-[72px] flex items-center justify-between px-5 border-b border-white/[0.06] shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#b59b54] to-[#8a7440] flex items-center justify-center shadow-[0_0_20px_rgba(181,155,84,0.25)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">Shree Vasudha</p>
              <p className="text-[#555] text-[10px] tracking-[0.15em] uppercase">Admin Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/70 transition-all ${
            collapsed ? "mx-auto rotate-180" : ""
          }`}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {menuItems.map((item, i) => {
          if ("type" in item && item.type === "divider") {
            return (
              <div key={i} className="pt-4 pb-2">
                {!collapsed && (
                  <p className="px-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-white/25">
                    {item.label}
                  </p>
                )}
                {collapsed && <div className="border-t border-white/[0.04] mx-2" />}
              </div>
            );
          }

          if (!("href" in item)) return null;

          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative ${
                isActive
                  ? "bg-[#b59b54]/10 text-[#b59b54]"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#b59b54] rounded-r-full" />
              )}
              <Icon size={18} strokeWidth={1.5} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
              {(item.label === 'Enquiries' && unreadCount > 0) && !collapsed && (
                <span className="ml-auto text-[10px] bg-[#b59b54] text-black font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3 shrink-0">
        <form action="/admin/login/actions" method="post">
          <button
            type="button"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all w-full ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut size={18} strokeWidth={1.5} />
            {!collapsed && <span>Logout</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}

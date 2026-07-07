"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface HeaderProps {
  user?: { email?: string } | null;
}

export default function Header({ user }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        const mapped = data.map(lead => {
          const created = new Date(lead.created_at);
          const diffMs = new Date().getTime() - created.getTime();
          const diffMins = Math.round(diffMs / 60000);
          const diffHours = Math.round(diffMs / 3600000);
          const diffDays = Math.round(diffMs / 86400000);
          
          let timeString = 'Just now';
          if (diffDays > 0) timeString = `${diffDays} days ago`;
          else if (diffHours > 0) timeString = `${diffHours} hr ago`;
          else if (diffMins > 0) timeString = `${diffMins} min ago`;

          return {
            id: lead.id,
            text: `New enquiry from ${lead.name}`,
            time: timeString,
            unread: lead.status === 'New'
          };
        });
        setNotifications(mapped);
        setUnreadCount(data.filter(l => l.status === 'New').length);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <header className="h-[72px] bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-[400px]">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          type="text"
          placeholder="Search projects, enquiries, settings..."
          className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/[0.12] transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20 bg-white/[0.06] px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white/80 transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-[#b59b54] rounded-full" />}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 w-[360px] bg-[#141414] border border-white/[0.08] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="p-4 border-b border-white/[0.06] flex justify-between items-center">
                <h3 className="text-white text-sm font-semibold">Notifications</h3>
                <span className="text-[10px] bg-[#b59b54]/20 text-[#b59b54] px-2 py-0.5 rounded-full">
                  {unreadCount > 0 ? `${unreadCount} new` : '0 new'}
                </span>
              </div>
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-white/40">No notifications to display</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer ${
                      n.unread ? "bg-[#b59b54]/[0.03]" : ""
                    }`}
                  >
                    <p className="text-sm text-white/80">{n.text}</p>
                    <p className="text-xs text-white/30 mt-1">{n.time}</p>
                  </div>
                ))
              )}
              <div className="p-3 text-center">
                <button className="text-xs text-[#b59b54] hover:text-[#c9ae6a] transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-white/[0.06]" />

        {/* Profile */}
        <button className="flex items-center gap-3 hover:bg-white/[0.04] rounded-xl px-3 py-2 transition-all">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#b59b54] to-[#8a7440] flex items-center justify-center text-black text-sm font-bold">
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="text-left">
            <p className="text-sm text-white/80 font-medium">Admin</p>
            <p className="text-[10px] text-white/30">{user?.email || "admin"}</p>
          </div>
          <ChevronDown size={14} className="text-white/30 ml-1" />
        </button>
      </div>
    </header>
  );
}

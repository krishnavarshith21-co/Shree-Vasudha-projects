"use client";
import { motion } from "framer-motion";
import { BarChart3, Eye, MousePointer, Clock, Monitor, Smartphone, Tablet, TrendingUp, ArrowUpRight } from "lucide-react";

const pageViews = [
  { page: "/", views: 4250, label: "Homepage" },
  { page: "/projects", views: 2180, label: "Projects" },
  { page: "/contact", views: 1650, label: "Contact" },
  { page: "/about", views: 980, label: "About" },
  { page: "/amenities", views: 720, label: "Amenities" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Website performance overview</p>
      </div>
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: "Total Visitors", value: "12,438", change: "+23%", icon: Eye },
          { label: "Enquiries", value: "248", change: "+18%", icon: MousePointer },
          { label: "Bounce Rate", value: "34.2%", change: "-5%", icon: TrendingUp },
          { label: "Avg. Session", value: "3m 42s", change: "+12%", icon: Clock },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#b59b54]/10 flex items-center justify-center"><Icon size={18} className="text-[#b59b54]" /></div>
                <span className="flex items-center gap-1 text-xs text-green-500"><ArrowUpRight size={12} />{stat.change}</span>
              </div>
              <p className="text-2xl text-white font-semibold">{stat.value}</p>
              <p className="text-xs text-white/35 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-white text-sm font-semibold mb-5">Top Pages</h3>
          <div className="space-y-3">
            {pageViews.map((p, i) => (
              <div key={p.page} className="flex items-center gap-4">
                <span className="text-xs text-white/25 w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1.5"><span className="text-sm text-white/70">{p.label}</span><span className="text-xs text-white/40">{p.views.toLocaleString()}</span></div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#b59b54] to-[#8a7440] rounded-full" style={{ width: `${(p.views / 4250) * 100}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        {/* Device Analytics */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-white text-sm font-semibold mb-5">Device Analytics</h3>
          <div className="space-y-5">
            {[
              { label: "Desktop", value: "58%", icon: Monitor },
              { label: "Mobile", value: "35%", icon: Smartphone },
              { label: "Tablet", value: "7%", icon: Tablet },
            ].map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center"><Icon size={18} className="text-white/40" /></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5"><span className="text-sm text-white/70">{d.label}</span><span className="text-xs text-white/40">{d.value}</span></div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden"><div className="h-full bg-[#b59b54] rounded-full" style={{ width: d.value }} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

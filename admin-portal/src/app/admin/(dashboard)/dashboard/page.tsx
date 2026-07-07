"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Building2,
  Hammer,
  Clock,
  CheckCircle2,
  Mail,
  MessageSquare,
  Eye,
  TrendingUp,
  Plus,
  FileEdit,
  Upload,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Total Projects",
    value: "12",
    change: "+2 this month",
    trend: "up",
    icon: Building2,
    color: "#b59b54",
  },
  {
    label: "Ongoing Projects",
    value: "4",
    change: "In progress",
    trend: "up",
    icon: Hammer,
    color: "#4CAF50",
  },
  {
    label: "Upcoming Projects",
    value: "3",
    change: "Launching soon",
    trend: "up",
    icon: Clock,
    color: "#2196F3",
  },
  {
    label: "Completed Projects",
    value: "5",
    change: "+1 this quarter",
    trend: "up",
    icon: CheckCircle2,
    color: "#9C27B0",
  },
  {
    label: "Total Enquiries",
    value: "248",
    change: "+18 this week",
    trend: "up",
    icon: Mail,
    color: "#FF9800",
  },
  {
    label: "Unread Messages",
    value: "3",
    change: "Needs attention",
    trend: "down",
    icon: MessageSquare,
    color: "#F44336",
  },
  {
    label: "Published Articles",
    value: "0",
    change: "Live on website",
    trend: "up",
    icon: FileText,
    color: "#00BCD4",
  },
  {
    label: "Draft Articles",
    value: "0",
    change: "Work in progress",
    trend: "up",
    icon: FileEdit,
    color: "#8BC34A",
  },
];

const quickActions = [
  { label: "Add Project", icon: Plus, href: "/admin/projects/new", color: "#b59b54" },
  { label: "Edit Homepage", icon: FileEdit, href: "/admin/homepage", color: "#4CAF50" },
  { label: "Upload Media", icon: Upload, href: "/admin/media", color: "#2196F3" },
  { label: "Manage Users", icon: Users, href: "/admin/users", color: "#9C27B0" },
];

export default function DashboardPage() {
  const [realStats, setRealStats] = useState(stats);
  const [realActivity, setRealActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();
      
      // Fetch Projects
      const { data: projects } = await supabase.from('projects').select('status');
      
      let totalProjects = 0;
      let ongoing = 0;
      let upcoming = 0;
      let completed = 0;
      
      if (projects) {
        totalProjects = projects.length;
        projects.forEach(p => {
          if (p.status === 'Ongoing') ongoing++;
          else if (p.status === 'Upcoming') upcoming++;
          else if (p.status === 'Completed') completed++;
        });
      }

      // Fetch Leads (Enquiries) and Recent Activity
      const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      let totalLeads = 0;
      let unread = 0;
      let recentLeadsActivity: any[] = [];

      if (leads) {
        totalLeads = leads.length;
        unread = leads.filter(l => l.status === 'New').length;
        
        // Format the 5 most recent leads for the activity feed
        recentLeadsActivity = leads.slice(0, 5).map(lead => {
          // Calculate time ago
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
            action: "New enquiry received",
            detail: `${lead.name} — ${lead.project_interest || 'General'}`,
            time: timeString,
            type: "enquiry"
          };
        });
      }
      setRealActivity(recentLeadsActivity);

      // Fetch Blogs
      const { data: blogs } = await supabase.from('blogs').select('status');
      let publishedBlogs = 0;
      let draftBlogs = 0;
      if (blogs) {
        publishedBlogs = blogs.filter(b => b.status === 'Published').length;
        draftBlogs = blogs.filter(b => b.status === 'Draft').length;
      }

      setRealStats([
        { ...stats[0], value: totalProjects.toString(), change: `Total in database` },
        { ...stats[1], value: ongoing.toString(), change: `Currently building` },
        { ...stats[2], value: upcoming.toString(), change: `In pipeline` },
        { ...stats[3], value: completed.toString(), change: `Delivered` },
        { ...stats[4], value: totalLeads.toString(), change: `Total received` },
        { ...stats[5], value: unread.toString(), change: unread > 0 ? `Needs attention` : `All caught up`, trend: unread > 0 ? "down" : "up" },
        { ...stats[6], value: publishedBlogs.toString(), change: `Live on website` }, 
        { ...stats[7], value: draftBlogs.toString(), change: `Work in progress` }, 
      ]);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-light text-white tracking-wide"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
          >
            Dashboard
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Welcome back. Here&apos;s your website overview.
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xs">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {realStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group bg-[#141414] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon size={20} style={{ color: stat.color }} strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trend === "up" ? (
                    <ArrowUpRight size={12} className="text-green-500" />
                  ) : (
                    <ArrowDownRight size={12} className="text-red-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500/70" : "text-red-500/70"}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <p className="text-2xl text-white font-semibold mb-1">{stat.value}</p>
              <p className="text-xs text-white/35">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6"
        >
          <h3 className="text-white text-sm font-semibold mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div 
                  key={action.label}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={action.href}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.06] hover:shadow-lg transition-all group h-full"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${action.color}15` }}
                    >
                      <Icon size={18} style={{ color: action.color }} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors font-medium">
                      {action.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="lg:col-span-2 bg-[#141414] border border-white/[0.06] rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-white text-sm font-semibold">Recent Activity</h3>
            <Link href="/admin/enquiries" className="text-xs text-[#b59b54] hover:text-[#c9ae6a] transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-0">
            {realActivity.length === 0 ? (
              <div className="py-8 text-center text-white/30 text-sm">
                No recent activity to display.
              </div>
            ) : (
              realActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-[#b59b54] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80">{item.action}</p>
                    <p className="text-xs text-white/30 truncate">{item.detail}</p>
                  </div>
                  <span className="text-[10px] text-white/20 shrink-0">{item.time}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

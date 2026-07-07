import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export const metadata = {
  title: "Admin Portal — Shree Vasudha Projects",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      <div className="ml-[260px] transition-all duration-300">
        <Header user={user} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

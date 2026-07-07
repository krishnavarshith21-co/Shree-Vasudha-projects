"use client";

import { motion } from "framer-motion";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { createUser, deleteUser } from "@/app/admin/actions/users";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
};

const roleColors: Record<string, string> = { 
  Admin: "#b59b54", 
  Manager: "#4CAF50", 
  Editor: "#2196F3", 
  Viewer: "#9C27B0" 
};

export default function UserManager({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Editor", password: "" });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createUser(formData);
      if (res.success) {
        // Optimistic add (will be refreshed by revalidatePath)
        setIsAdding(false);
        setFormData({ name: "", email: "", role: "Editor", password: "" });
        window.location.reload();
      } else {
        alert("Error adding user: " + res.error);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this user? They will lose access immediately.")) return;
    startTransition(async () => {
      const res = await deleteUser(id);
      if (res.success) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert("Error deleting user: " + res.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide" style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}>Users</h1>
          <p className="text-white/40 text-sm mt-1">Manage admin users and permissions</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#b59b54] to-[#9a8347] text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-[#c9ae6a] hover:to-[#b59b54] transition-all shadow-[0_0_20px_rgba(181,155,84,0.25)]"
        >
          <Plus size={16} /> {isAdding ? "Cancel" : "Add User"}
        </button>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 mb-6">
          <h3 className="text-white text-lg font-semibold mb-4">Add New Admin User</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" placeholder="Email Address" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors appearance-none">
                  <option value="Admin" className="bg-[#141414]">Admin</option>
                  <option value="Manager" className="bg-[#141414]">Manager</option>
                  <option value="Editor" className="bg-[#141414]">Editor</option>
                  <option value="Viewer" className="bg-[#141414]">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Password</label>
                <input value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b59b54]/50 transition-colors" placeholder="Default: Vasudha@123" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button type="submit" disabled={isPending} className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors">
                {isPending ? "Adding..." : "Create User"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-3">
        {users.map((u, i) => (
          <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[#141414] border border-white/[0.06] rounded-xl p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b59b54] to-[#8a7440] flex items-center justify-center text-black text-sm font-bold uppercase">{u.name[0]}</div>
            <div className="flex-1">
              <p className="text-sm text-white/90 font-medium">{u.name}</p>
              <p className="text-xs text-white/35">{u.email}</p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: `${roleColors[u.role]}15`, color: roleColors[u.role] }}>{u.role}</span>
            <span className="text-xs text-white/25 w-24 text-right">{u.lastLogin}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
              <button onClick={() => handleDelete(u.id)} disabled={isPending} className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
        {users.length === 0 && (
          <div className="text-center py-10 text-white/40 text-sm bg-[#141414] rounded-xl border border-white/[0.06]">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}

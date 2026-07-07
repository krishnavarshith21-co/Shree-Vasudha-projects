"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return redirect("/admin/login?error=Please+enter+email+and+password");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

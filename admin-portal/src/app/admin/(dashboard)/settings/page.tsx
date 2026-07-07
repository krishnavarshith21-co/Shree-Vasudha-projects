import { createClient } from "@/utils/supabase/server";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "global")
    .single();

  const settings = data?.value || {};

  return <SettingsForm initialSettings={settings} />;
}

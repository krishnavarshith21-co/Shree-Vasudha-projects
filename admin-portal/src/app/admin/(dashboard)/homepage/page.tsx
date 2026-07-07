import HomepageManager from "@/components/admin/HomepageManager";
import { getHomepageContent } from "@/app/admin/actions/homepage";

export const dynamic = "force-dynamic";

export default async function HomepageCMSPage() {
  const data = await getHomepageContent();
  return <HomepageManager initialData={data} />;
}

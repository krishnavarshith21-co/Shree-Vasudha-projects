import AboutManager from "@/components/admin/AboutManager";
import { getAboutContent } from "@/app/admin/actions/about";

export default async function AboutCMSPage() {
  const data = await getAboutContent();
  return <AboutManager initialData={data} />;
}

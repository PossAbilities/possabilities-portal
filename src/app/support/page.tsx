import { getLibrary } from "@/lib/easyreads";
import { SupportScreen } from "@/components/screens/SupportScreen";

export default async function SupportPage() {
  const library = await getLibrary();
  return <SupportScreen library={library} />;
}

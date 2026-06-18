import { getPolicies } from "@/lib/data";
import { getEasyReads } from "@/lib/easyreads";
import type { LibraryItem } from "@/lib/types";
import { SupportScreen } from "@/components/screens/SupportScreen";

export default async function SupportPage() {
  // Prefer easy reads from the external platform; fall back to Supabase
  // policies so the library is never empty if the API is down/unconfigured.
  const easyReads = await getEasyReads();
  let library: LibraryItem[] = easyReads;
  if (!library.length) {
    const policies = await getPolicies();
    library = policies.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      body: p.body,
    }));
  }
  return <SupportScreen library={library} />;
}

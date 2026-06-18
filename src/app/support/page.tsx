import { getPolicies } from "@/lib/data";
import { SupportScreen } from "@/components/screens/SupportScreen";

export default async function SupportPage() {
  const policies = await getPolicies();
  return <SupportScreen policies={policies} />;
}

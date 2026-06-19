import { getEvents } from "@/lib/data";
import { isAppleWalletConfigured, isGoogleWalletConfigured } from "@/lib/env";
import { EventsScreen } from "@/components/screens/EventsScreen";

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <EventsScreen
      events={events}
      appleWallet={isAppleWalletConfigured()}
      googleWallet={isGoogleWalletConfigured()}
    />
  );
}

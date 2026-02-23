import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { getCurrentRole } from "@/lib/actions";

export default async function Home() {
  const role = await getCurrentRole();
  return (
    <main>
      <CalendarGrid role={role} />
    </main>
  );
}

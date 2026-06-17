import { createFileRoute } from "@tanstack/react-router";
import { CallMonitoringAndTracking } from "@/components/calls";

export const Route = createFileRoute("/calls/tracking")({
  component: RouteComponent,
  meta: () => [
    {
      title: "Call Monitoring & Tracking - Echo Link",
    },
  ],
});

function RouteComponent() {
  return (
    <div className="w-full">
      <CallMonitoringAndTracking userRole="Manager" userId={1} />
    </div>
  );
}

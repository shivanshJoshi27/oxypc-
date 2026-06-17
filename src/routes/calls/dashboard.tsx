import { createFileRoute } from "@tanstack/react-router";
import { CallDashboard } from "@/components/calls";

export const Route = createFileRoute("/calls/dashboard")({
  component: RouteComponent,
  meta: () => [
    {
      title: "Call Dashboard - Echo Link",
    },
  ],
});

function RouteComponent() {
  return (
    <div className="w-full">
      <CallDashboard userRole="Manager" userId={1} />
    </div>
  );
}

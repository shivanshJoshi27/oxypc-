import { createFileRoute } from "@tanstack/react-router";
import { CallDumpModule } from "@/components/calls";

export const Route = createFileRoute("/calls/dump")({
  component: RouteComponent,
  meta: () => [
    {
      title: "Call Dump Module - Echo Link",
    },
  ],
});

function RouteComponent() {
  return (
    <div className="w-full">
      <CallDumpModule userRole="Manager" currentUserId={1} />
    </div>
  );
}

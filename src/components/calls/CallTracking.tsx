import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineDescription,
  TimelineTime,
} from "@/components/ui/timeline";
import {
  Phone,
  CheckCircle2,
  Clock,
  User,
  FileText,
  ChevronRight,
} from "lucide-react";
import { formatRelativeTime } from "@/utils/callsUtils";
import type { CallHistoryEvent } from "@/types/calls";

interface CallHistoryTimelineProps {
  events: CallHistoryEvent[];
  isLoading?: boolean;
}

const eventIcons: Record<string, React.ReactNode> = {
  Created: <Phone className="w-4 h-4" />,
  Assigned: <User className="w-4 h-4" />,
  Followup: <Clock className="w-4 h-4" />,
  "Lead Created": <CheckCircle2 className="w-4 h-4" />,
  "Status Changed": <FileText className="w-4 h-4" />,
};

const eventColors: Record<string, string> = {
  Created: "bg-blue-100",
  Assigned: "bg-purple-100",
  Followup: "bg-orange-100",
  "Lead Created": "bg-green-100",
  "Status Changed": "bg-gray-100",
};

export function CallHistoryTimeline({
  events,
  isLoading,
}: CallHistoryTimelineProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No History</h3>
          <p className="text-muted-foreground">
            No events have been recorded for this call yet
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`p-2 rounded-full ${
                  eventColors[event.event_type] || "bg-gray-100"
                }`}
              >
                {eventIcons[event.event_type] || <FileText className="w-4 h-4" />}
              </div>
              {index < events.length - 1 && (
                <div className="w-0.5 h-12 bg-border my-2" />
              )}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{event.event_type}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.event_description}
                  </p>
                  {event.previous_value && event.new_value && (
                    <div className="mt-2 text-sm bg-muted p-2 rounded">
                      <span className="line-through text-muted-foreground">
                        {event.previous_value}
                      </span>
                      {" → "}
                      <span className="font-semibold text-foreground">
                        {event.new_value}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatRelativeTime(event.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface CallRecordViewerProps {
  callId: string;
  contact: {
    name: string;
    phone: string;
    email: string;
    company?: string;
  };
  callDetails: {
    type: "Incoming" | "Outgoing";
    duration: number;
    date: Date;
    recorded: boolean;
    recordingUrl?: string;
    notes?: string;
  };
  onClose?: () => void;
}

export function CallRecordViewer({
  callId,
  contact,
  callDetails,
  onClose,
}: CallRecordViewerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View Record
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Call Record</DialogTitle>
          <DialogDescription>
            Call ID: {callId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{contact.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{contact.company || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{contact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{contact.email}</p>
              </div>
            </div>
          </div>

          {/* Call Details */}
          <div>
            <h3 className="font-semibold mb-3">Call Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Call Type</p>
                <Badge variant="outline">{callDetails.type}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {Math.floor(callDetails.duration / 60)}m{" "}
                  {callDetails.duration % 60}s
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">
                  {callDetails.date.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recording</p>
                {callDetails.recorded ? (
                  <Badge className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not Recorded</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Recording Player */}
          {callDetails.recordingUrl && (
            <div>
              <h3 className="font-semibold mb-3">Call Recording</h3>
              <audio
                controls
                className="w-full"
                src={callDetails.recordingUrl}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Notes */}
          {callDetails.notes && (
            <div>
              <h3 className="font-semibold mb-3">Notes</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">{callDetails.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

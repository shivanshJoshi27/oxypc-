import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CallHistoryTimeline, CallRecordViewer } from "./CallTracking";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Phone,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatRelativeTime, formatCallDuration } from "@/utils/callsUtils";
import type { Call, FollowUp, CallHistoryEvent } from "@/types/calls";

interface CallMonitoringProps {
  userRole?: "Manager" | "User" | "Admin";
  userId?: number;
}

export function CallMonitoringAndTracking({
  userRole = "Manager",
  userId = 1,
}: CallMonitoringProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockCalls: Call[] = [
    {
      id: 1,
      call_id: "CALL-001",
      contact_name: "Acme Corporation",
      contact_phone: "+1-555-0101",
      contact_email: "contact@acme.com",
      call_type: "Outgoing",
      duration_seconds: 1245,
      call_date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      assigned_to_user_id: 6,
      recorded: true,
      recording_url: "/recordings/call-001.wav",
      notes: "Discussed pricing and features. Interested in demo.",
      status: "Completed",
      source: "Call Dump",
      created_by_id: 5,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      call_id: "CALL-002",
      contact_name: "TechStart Inc",
      contact_phone: "+1-555-0102",
      contact_email: "sales@techstart.com",
      call_type: "Incoming",
      duration_seconds: 823,
      call_date: new Date(Date.now() - 1 * 60 * 60 * 1000),
      assigned_to_user_id: 7,
      recorded: true,
      recording_url: "/recordings/call-002.wav",
      notes: "Follow-up meeting scheduled for next Monday",
      status: "Completed",
      source: "Manual",
      created_by_id: 7,
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: 3,
      call_id: "CALL-003",
      contact_name: "Global Solutions",
      contact_phone: "+1-555-0103",
      contact_email: "hello@globalsolutions.com",
      call_type: "Outgoing",
      duration_seconds: 2100,
      call_date: new Date(Date.now() - 30 * 60 * 1000),
      assigned_to_user_id: 6,
      recorded: false,
      notes: "Left voicemail, will try again tomorrow",
      status: "Completed",
      source: "Call Dump",
      created_by_id: 5,
      created_at: new Date(Date.now() - 30 * 60 * 1000),
      updated_at: new Date(Date.now() - 30 * 60 * 1000),
    },
  ];

  const mockFollowups: FollowUp[] = [
    {
      id: 1,
      followup_id: "FUP-001",
      call_id: 1,
      user_id: 6,
      followup_type: "Call",
      scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed_date: null,
      notes: "Confirm interest and send proposal",
      status: "Pending",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      followup_id: "FUP-002",
      call_id: 2,
      user_id: 7,
      followup_type: "Meeting",
      scheduled_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      completed_date: null,
      notes: "Product demonstration session",
      status: "Pending",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  const mockCallHistory: CallHistoryEvent[] = [
    {
      id: 1,
      call_id: 1,
      event_type: "Created",
      event_description: "Call record created from Call Dump upload",
      changed_by_id: 5,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      call_id: 1,
      event_type: "Assigned",
      event_description: "Call assigned to team member",
      changed_by_id: 5,
      previous_value: "Unassigned",
      new_value: "Sarah Wilson",
      created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    },
    {
      id: 3,
      call_id: 1,
      event_type: "Followup",
      event_description: "Follow-up scheduled",
      changed_by_id: 6,
      new_value: "Call scheduled for tomorrow",
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: 4,
      call_id: 1,
      event_type: "Lead Created",
      event_description: "Lead created from this call",
      changed_by_id: 6,
      new_value: "LEAD-001",
      created_at: new Date(Date.now() - 30 * 60 * 1000),
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // TODO: Implement export
    console.log("Exporting call records...");
  };

  const filteredCalls = mockCalls.filter((call) => {
    const matchSearch =
      call.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.contact_phone.includes(searchTerm) ||
      call.contact_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === "all" || call.status === filterStatus;
    const matchType = filterType === "all" || call.call_type === filterType;

    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    totalCalls: mockCalls.length,
    completedCalls: mockCalls.filter((c) => c.status === "Completed").length,
    pendingFollowups: mockFollowups.filter((f) => f.status === "Pending").length,
    recordedCalls: mockCalls.filter((c) => c.recorded).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Call Monitoring & Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Monitor all calls and track follow-up activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Calls</p>
              <p className="text-3xl font-bold mt-2">{stats.totalCalls}</p>
            </div>
            <Phone className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold mt-2">{stats.completedCalls}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(
                  (stats.completedCalls / stats.totalCalls) * 100
                )}% completion
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Follow-ups</p>
              <p className="text-3xl font-bold mt-2">
                {stats.pendingFollowups}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Recorded</p>
              <p className="text-3xl font-bold mt-2">{stats.recordedCalls}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(
                  (stats.recordedCalls / stats.totalCalls) * 100
                )}% recorded
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-purple-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="calls" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calls">Call Records</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
          {selectedCall && <TabsTrigger value="history">History</TabsTrigger>}
        </TabsList>

        {/* Call Records Tab */}
        <TabsContent value="calls" className="space-y-4">
          {/* Search and Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by contact name, phone, or email..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Missed">Missed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Incoming">Incoming</SelectItem>
                  <SelectItem value="Outgoing">Outgoing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Call Records Table */}
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recording</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCalls.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No calls found matching your criteria
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCalls.map((call) => (
                      <TableRow
                        key={call.id}
                        onClick={() => setSelectedCall(call)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p>{call.contact_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {call.contact_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{call.contact_phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {call.call_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatCallDuration(call.duration_seconds)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              call.status === "Completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {call.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {call.recorded ? (
                            <Badge
                              className="bg-green-100 text-green-800"
                            >
                              ✓ Available
                            </Badge>
                          ) : (
                            <Badge variant="secondary">—</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatRelativeTime(call.call_date)}
                        </TableCell>
                        <TableCell>
                          <CallRecordViewer
                            callId={call.call_id}
                            contact={{
                              name: call.contact_name,
                              phone: call.contact_phone || "",
                              email: call.contact_email || "",
                            }}
                            callDetails={{
                              type: call.call_type,
                              duration: call.duration_seconds,
                              date: call.call_date,
                              recorded: call.recorded,
                              recordingUrl: call.recording_url,
                              notes: call.notes,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Follow-ups Tab */}
        <TabsContent value="followups" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have {mockFollowups.filter((f) => f.status === "Pending").length}{" "}
              pending follow-ups
            </AlertDescription>
          </Alert>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Follow-up Type</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFollowups.map((followup) => {
                    const call = mockCalls.find((c) => c.id === followup.call_id);
                    return (
                      <TableRow key={followup.id}>
                        <TableCell className="font-medium">
                          {call?.contact_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {followup.followup_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {followup.scheduled_date
                            ? formatRelativeTime(followup.scheduled_date)
                            : "Not scheduled"}
                        </TableCell>
                        <TableCell>Sarah Wilson</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              followup.status === "Pending"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {followup.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {followup.notes}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        {selectedCall && (
          <TabsContent value="history" className="space-y-4">
            <Alert>
              <AlertDescription>
                Call history for {selectedCall.contact_name}
              </AlertDescription>
            </Alert>
            <CallHistoryTimeline events={mockCallHistory} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

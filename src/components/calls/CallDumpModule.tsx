import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Upload, Phone, TrendingUp } from "lucide-react";
import { CallDumpUpload } from "@/components/calls/CallDumpUpload";
import { CallDumpList } from "@/components/calls/CallDumpList";
import { AssignContacts } from "@/components/calls/AssignContacts";
import { FollowupAndLeadCreation } from "@/components/calls/FollowupAndLeadCreation";
import { formatRelativeTime, getCallStatusColor } from "@/utils/callsUtils";
import type { CallDump, Call, User } from "@/types/calls";

interface CallDumpModuleProps {
  userRole?: "Manager" | "User" | "Admin";
  currentUserId?: number;
}

export function CallDumpModule({
  userRole = "Manager",
  currentUserId = 1,
}: CallDumpModuleProps) {
  const [dumps, setDumps] = useState<CallDump[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDump, setSelectedDump] = useState<CallDump | null>(null);

  // Mock data
  useEffect(() => {
    const mockDumps: CallDump[] = [
      {
        id: 1,
        dump_id: "DUMP-1719410400",
        dump_name: "February Campaign Leads",
        total_contacts: 250,
        processed_contacts: 250,
        status: "Completed",
        file_url: "/uploads/dump-1.csv",
        uploaded_by_id: 5,
        processing_started_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
        processing_completed_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        id: 2,
        dump_id: "DUMP-1719324000",
        dump_name: "March Outreach List",
        total_contacts: 180,
        processed_contacts: 145,
        status: "Processing",
        uploaded_by_id: 5,
        processing_started_at: new Date(Date.now() - 30 * 60 * 1000),
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 15 * 60 * 1000),
      },
    ];

    const mockCalls: Call[] = [
      {
        id: 1,
        call_id: "CALL-001",
        contact_name: "John Smith",
        contact_phone: "+1-555-0101",
        contact_email: "john.smith@company.com",
        call_type: "Outgoing",
        duration_seconds: 1245,
        call_date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        assigned_to_user_id: 6,
        recorded: true,
        notes: "Interested in product demo",
        status: "Completed",
        source: "Call Dump",
        created_by_id: 5,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 2,
        call_id: "CALL-002",
        contact_name: "Sarah Johnson",
        contact_phone: "+1-555-0102",
        contact_email: "sarah.j@email.com",
        call_type: "Incoming",
        duration_seconds: 823,
        call_date: new Date(Date.now() - 30 * 60 * 1000),
        recorded: false,
        notes: "Follow-up needed",
        status: "Completed",
        source: "Call Dump",
        created_by_id: 5,
        created_at: new Date(Date.now() - 30 * 60 * 1000),
        updated_at: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: 3,
        call_id: "CALL-003",
        contact_name: "Michael Chen",
        contact_phone: "+1-555-0103",
        contact_email: "michael.chen@corp.com",
        call_type: "Outgoing",
        duration_seconds: 2100,
        call_date: new Date(Date.now() - 15 * 60 * 1000),
        notes: "Scheduled for meeting next week",
        status: "Completed",
        source: "Call Dump",
        created_by_id: 5,
        created_at: new Date(Date.now() - 15 * 60 * 1000),
        updated_at: new Date(Date.now() - 15 * 60 * 1000),
      },
    ];

    const mockUsers: User[] = [
      {
        id: 5,
        username: "manager_sales",
        email: "manager@oxypc.com",
        role: "Manager",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        username: "user_sales1",
        email: "user1@oxypc.com",
        role: "User",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        username: "user_sales2",
        email: "user2@oxypc.com",
        role: "User",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    setTimeout(() => {
      setDumps(mockDumps);
      setCalls(mockCalls);
      setUsers(mockUsers);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleDumpViewDetails = (dump: CallDump) => {
    setSelectedDump(dump);
  };

  const assignedCalls = calls.filter((c) => c.assigned_to_user_id);
  const unassignedCalls = calls.filter((c) => !c.assigned_to_user_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Call Dump Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage bulk call uploads, assignments, and conversions
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Calls</p>
              <p className="text-2xl font-bold mt-2">{calls.length}</p>
            </div>
            <Phone className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Assigned</p>
              <p className="text-2xl font-bold mt-2">{assignedCalls.length}</p>
            </div>
            <Badge variant="secondary" className="mt-1">
              {Math.round(
                (assignedCalls.length / calls.length) * 100
              ) || 0}%
            </Badge>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Assignment</p>
              <p className="text-2xl font-bold mt-2">{unassignedCalls.length}</p>
            </div>
            <Upload className="h-8 w-8 text-yellow-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Dumps</p>
              <p className="text-2xl font-bold mt-2">
                {dumps.filter((d) => d.status !== "Completed").length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="uploads" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="uploads">Call Dumps</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          {userRole === "Manager" && (
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          )}
        </TabsList>

        {/* Uploads Tab */}
        <TabsContent value="uploads" className="space-y-4">
          {userRole === "Manager" || userRole === "Admin" ? (
            <>
              <CallDumpUpload />
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
                <CallDumpList
                  dumps={dumps}
                  isLoading={isLoading}
                  onViewDetails={handleDumpViewDetails}
                />
              </div>
            </>
          ) : (
            <Alert>
              <AlertDescription>
                Only managers can upload call dumps
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Calls Tab */}
        <TabsContent value="calls" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Calls</h3>
            {userRole === "Manager" && (
              <AssignContacts
                calls={unassignedCalls}
                users={users}
                isManager={userRole === "Manager"}
              />
            )}
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">
                        {call.contact_name}
                      </TableCell>
                      <TableCell>{call.contact_phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{call.call_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {Math.round(call.duration_seconds / 60)}m{" "}
                        {call.duration_seconds % 60}s
                      </TableCell>
                      <TableCell>
                        <Badge variant={getCallStatusColor(call.status)}>
                          {call.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {call.assigned_to_user_id
                          ? users.find((u) => u.id === call.assigned_to_user_id)
                              ?.username || "N/A"
                          : "Unassigned"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatRelativeTime(call.call_date)}
                      </TableCell>
                      <TableCell>
                        <FollowupAndLeadCreation call={call} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        {userRole === "Manager" && (
          <TabsContent value="assignments" className="space-y-4">
            <Alert>
              <AlertDescription>
                You can assign up to {unassignedCalls.length} unassigned calls to
                your team members
              </AlertDescription>
            </Alert>
            <AssignContacts
              calls={unassignedCalls}
              users={users}
              isManager={true}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

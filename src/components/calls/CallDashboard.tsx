import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  KPICard,
  CallActivityChart,
  CallDurationTrend,
  LeadConversionFunnel,
  TeamPerformance,
  CallTypeDistribution,
} from "./DashboardCharts";
import {
  Phone,
  TrendingUp,
  Users,
  Target,
  RefreshCw,
  Download,
  AlertCircle,
} from "lucide-react";
import { formatRelativeTime } from "@/utils/callsUtils";

interface CallDashboardProps {
  userRole?: "Manager" | "User" | "Admin";
  userId?: number;
}

export function CallDashboard({
  userRole = "Manager",
  userId = 1,
}: CallDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("week");
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>("all");

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting dashboard data...");
  };

  // Mock data for charts
  const callActivityData = [
    { time: "Mon", calls: 45, completed: 42 },
    { time: "Tue", calls: 52, completed: 50 },
    { time: "Wed", calls: 38, completed: 35 },
    { time: "Thu", calls: 61, completed: 58 },
    { time: "Fri", calls: 55, completed: 53 },
    { time: "Sat", calls: 28, completed: 26 },
    { time: "Sun", calls: 32, completed: 30 },
  ];

  const callDurationData = [
    { day: "Mon", average: 12, duration: 540 },
    { day: "Tue", average: 13, duration: 585 },
    { day: "Wed", average: 11, duration: 495 },
    { day: "Thu", average: 14, duration: 630 },
    { day: "Fri", average: 12, duration: 540 },
    { day: "Sat", average: 10, duration: 450 },
    { day: "Sun", average: 11, duration: 495 },
  ];

  const leadConversionData = [
    { stage: "New Leads", count: 284 },
    { stage: "Contacted", count: 198 },
    { stage: "Qualified", count: 145 },
    { stage: "Proposed", count: 89 },
    { stage: "Converted", count: 42 },
  ];

  const teamPerformanceData = [
    { name: "Sarah Wilson", calls: 156, conversion: 18, followups: 98 },
    { name: "John Martinez", calls: 142, conversion: 22, followups: 87 },
    { name: "Emily Chen", calls: 168, conversion: 20, followups: 105 },
    { name: "Michael Brown", calls: 134, conversion: 16, followups: 72 },
  ];

  const recentFollowups = [
    {
      id: 1,
      contact: "Acme Corp",
      person: "John Doe",
      type: "Follow-up Call",
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      assignedTo: "Sarah Wilson",
      status: "Pending",
    },
    {
      id: 2,
      contact: "TechStart Inc",
      person: "Jane Smith",
      type: "Email",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      assignedTo: "John Martinez",
      status: "Pending",
    },
    {
      id: 3,
      contact: "Global Solutions",
      person: "Bob Johnson",
      type: "Meeting",
      dueDate: new Date(Date.now() - 60 * 60 * 1000),
      assignedTo: "Emily Chen",
      status: "Overdue",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Call Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor call performance and team metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Calls"
          value="313"
          change={12}
          icon={<Phone className="w-8 h-8 text-blue-500" />}
          color="bg-blue-50"
        />
        <KPICard
          title="Avg Duration"
          value="12.4m"
          change={-5}
          icon={<TrendingUp className="w-8 h-8 text-green-500" />}
          color="bg-green-50"
        />
        <KPICard
          title="Team Members"
          value="4"
          icon={<Users className="w-8 h-8 text-purple-500" />}
          color="bg-purple-50"
        />
        <KPICard
          title="Lead Conversion"
          value="14.8%"
          change={3}
          icon={<Target className="w-8 h-8 text-orange-500" />}
          color="bg-orange-50"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {userRole === "Manager" && (
            <TabsTrigger value="team">Team Performance</TabsTrigger>
          )}
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CallActivityChart data={callActivityData} />
            <CallTypeDistribution incoming={128} outgoing={185} />
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="space-y-4">
            <CallDurationTrend data={callDurationData} />
            <LeadConversionFunnel data={leadConversionData} />
          </div>
        </TabsContent>

        {/* Team Performance Tab */}
        {userRole === "Manager" && (
          <TabsContent value="team" className="space-y-4">
            <div className="space-y-4">
              <TeamPerformance data={teamPerformanceData} />

              {/* Detailed Team Stats */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Team Activity Details</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team Member</TableHead>
                        <TableHead>Calls Today</TableHead>
                        <TableHead>Avg Duration</TableHead>
                        <TableHead>Leads</TableHead>
                        <TableHead>Follow-ups</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamPerformanceData.map((member) => (
                        <TableRow key={member.name}>
                          <TableCell className="font-medium">
                            {member.name}
                          </TableCell>
                          <TableCell>{member.calls}</TableCell>
                          <TableCell>12.5 min</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {member.conversion}%
                            </Badge>
                          </TableCell>
                          <TableCell>{member.followups}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700"
                            >
                              Active
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Follow-ups Tab */}
        <TabsContent value="followups" className="space-y-4">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You have {recentFollowups.filter((f) => f.status === "Overdue").length}{" "}
              overdue follow-ups that need attention
            </AlertDescription>
          </Alert>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Person</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentFollowups.map((followup) => (
                    <TableRow key={followup.id}>
                      <TableCell className="font-medium">
                        {followup.contact}
                      </TableCell>
                      <TableCell>{followup.person}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{followup.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatRelativeTime(followup.dueDate)}
                      </TableCell>
                      <TableCell>{followup.assignedTo}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            followup.status === "Overdue"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {followup.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

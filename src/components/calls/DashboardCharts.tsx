import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Activity, PhoneOff } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

export function KPICard({ title, value, change, icon, color }: KPICardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2 text-sm">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={
                  change >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(change)}%
              </span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </Card>
  );
}

interface CallActivityChartProps {
  data: Array<{
    time: string;
    calls: number;
    completed: number;
  }>;
}

export function CallActivityChart({ data }: CallActivityChartProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Call Activity (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="calls" fill="#3b82f6" name="Total Calls" />
          <Bar dataKey="completed" fill="#10b981" name="Completed" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface CallDurationTrendProps {
  data: Array<{
    day: string;
    duration: number;
    average: number;
  }>;
}

export function CallDurationTrend({ data }: CallDurationTrendProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Average Call Duration Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip formatter={(value) => `${value}m`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="average"
            stroke="#8b5cf6"
            name="Avg Duration (min)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface LeadConversionFunnelProps {
  data: Array<{
    stage: string;
    count: number;
  }>;
}

export function LeadConversionFunnel({ data }: LeadConversionFunnelProps) {
  const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Lead Conversion Funnel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="stage" type="category" width={140} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface TeamPerformanceProps {
  data: Array<{
    name: string;
    calls: number;
    conversion: number;
    followups: number;
  }>;
}

export function TeamPerformance({ data }: TeamPerformanceProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Team Performance</h3>
      <div className="space-y-4">
        {data.map((member) => (
          <div key={member.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{member.name}</span>
              <span className="text-sm text-muted-foreground">
                {member.calls} calls
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Conversion</p>
                <p className="font-semibold">{member.conversion}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Follow-ups</p>
                <p className="font-semibold">{member.followups}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Efficiency</p>
                <p className="font-semibold">
                  {Math.round((member.conversion * member.followups) / 100)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface CallTypeDistributionProps {
  incoming: number;
  outgoing: number;
}

export function CallTypeDistribution({
  incoming,
  outgoing,
}: CallTypeDistributionProps) {
  const data = [
    { name: "Incoming", value: incoming },
    { name: "Outgoing", value: outgoing },
  ];

  const colors = ["#10b981", "#3b82f6"];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Call Type Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

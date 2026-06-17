import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { formatRelativeTime, getDumpStatusColor } from "@/utils/callsUtils";
import type { CallDump } from "@/types/calls";

interface CallDumpListProps {
  dumps: CallDump[];
  isLoading?: boolean;
  onViewDetails?: (dump: CallDump) => void;
  onDelete?: (dumpId: string) => void;
  onDownload?: (dump: CallDump) => void;
}

const statusIcons = {
  Pending: <Clock className="w-4 h-4" />,
  Processing: <Clock className="w-4 h-4 animate-spin" />,
  Completed: <CheckCircle2 className="w-4 h-4" />,
  Failed: <AlertCircle className="w-4 h-4" />,
};

export function CallDumpList({
  dumps,
  isLoading,
  onViewDetails,
  onDelete,
  onDownload,
}: CallDumpListProps) {
  const [selectedDump, setSelectedDump] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Card>
    );
  }

  if (dumps.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No Call Dumps</h3>
          <p className="text-muted-foreground">
            Start by uploading a call dump to get started
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dump Name</TableHead>
              <TableHead>Total Contacts</TableHead>
              <TableHead>Processed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dumps.map((dump) => (
              <TableRow
                key={dump.id}
                className={
                  selectedDump === dump.dump_id ? "bg-muted" : "hover:bg-muted/50"
                }
              >
                <TableCell className="font-medium">{dump.dump_name}</TableCell>
                <TableCell>{dump.total_contacts}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            dump.total_contacts > 0
                              ? (dump.processed_contacts / dump.total_contacts) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {dump.processed_contacts}/{dump.total_contacts}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getDumpStatusColor(dump.status)}>
                    <span className="mr-1 inline-flex">
                      {statusIcons[dump.status as keyof typeof statusIcons]}
                    </span>
                    {dump.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatRelativeTime(dump.created_at)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedDump(dump.dump_id);
                          onViewDetails?.(dump);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {dump.status === "Completed" && (
                        <DropdownMenuItem onClick={() => onDownload?.(dump)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Results
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete?.(dump.dump_id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

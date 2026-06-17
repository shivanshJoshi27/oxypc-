import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";
import type { Call, User } from "@/types/calls";

const assignSchema = z.object({
  assigned_to_id: z.string().min(1, "Please select a user"),
  priority: z.enum(["Low", "Normal", "High", "Urgent"]),
  notes: z.string().optional(),
});

type AssignFormValues = z.infer<typeof assignSchema>;

interface AssignContactsProps {
  calls: Call[];
  users: User[];
  isManager?: boolean;
  onAssignSuccess?: () => void;
}

export function AssignContacts({
  calls,
  users,
  isManager = true,
  onAssignSuccess,
}: AssignContactsProps) {
  const [open, setOpen] = useState(false);
  const [selectedCalls, setSelectedCalls] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      priority: "Normal",
      notes: "",
    },
  });

  const onSubmit = async (values: AssignFormValues) => {
    if (selectedCalls.length === 0) {
      toast.error("Please select at least one call to assign");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/calls/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call_ids: selectedCalls,
          assigned_to_id: parseInt(values.assigned_to_id),
          priority: values.priority,
          notes: values.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign calls");
      }

      toast.success(
        `Successfully assigned ${selectedCalls.length} call(s) to user`
      );
      setSelectedCalls([]);
      form.reset();
      setOpen(false);
      onAssignSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to assign calls"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isManager) {
    return null;
  }

  const unassignedCalls = calls.filter(
    (call) => !call.assigned_to_user_id
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Contacts to Users</DialogTitle>
          <DialogDescription>
            Select contacts and assign them to your team members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Select Calls Section */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Select Contacts to Assign</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {unassignedCalls.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No unassigned calls available
                </p>
              ) : (
                unassignedCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-start space-x-3 p-2 hover:bg-muted rounded-lg"
                  >
                    <Checkbox
                      id={`call-${call.id}`}
                      checked={selectedCalls.includes(call.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCalls([...selectedCalls, call.id]);
                        } else {
                          setSelectedCalls(
                            selectedCalls.filter((id) => id !== call.id)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`call-${call.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium text-sm">
                        {call.contact_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {call.contact_phone} • {call.contact_email}
                      </div>
                    </label>
                    <Badge variant="secondary">{call.call_type}</Badge>
                  </div>
                ))
              )}
            </div>
            {selectedCalls.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {selectedCalls.length} contact(s) selected
                </p>
              </div>
            )}
          </Card>

          {/* Assignment Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="assigned_to_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a team member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users
                          .filter((user) => user.role === "User")
                          .map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.username} ({user.email})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the priority level for this assignment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any special instructions or notes..."
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedCalls.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    "Assign Contacts"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

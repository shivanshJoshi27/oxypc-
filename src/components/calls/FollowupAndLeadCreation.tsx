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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import type { Call, FollowupType } from "@/types/calls";

const followupSchema = z.object({
  followup_type: z.enum(["Call", "Email", "SMS", "Meeting", "Other"]),
  scheduled_date: z.string().min(1, "Scheduled date is required"),
  notes: z.string().min(1, "Notes are required"),
});

const leadSchema = z.object({
  lead_name: z.string().min(1, "Lead name is required"),
  lead_email: z.string().email().optional().or(z.literal("")),
  lead_phone: z.string().optional(),
  company_name: z.string().optional(),
  value: z.string().optional(),
});

type FollowupFormValues = z.infer<typeof followupSchema>;
type LeadFormValues = z.infer<typeof leadSchema>;

interface FollowupAndLeadCreationProps {
  call: Call;
  onSuccess?: () => void;
}

const followupIcons: Record<FollowupType, React.ReactNode> = {
  Call: <Phone className="w-4 h-4" />,
  Email: <Mail className="w-4 h-4" />,
  SMS: <MessageSquare className="w-4 h-4" />,
  Meeting: <Calendar className="w-4 h-4" />,
  Other: <CheckCircle2 className="w-4 h-4" />,
};

export function FollowupAndLeadCreation({
  call,
  onSuccess,
}: FollowupAndLeadCreationProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadCreated, setLeadCreated] = useState(false);

  const followupForm = useForm<FollowupFormValues>({
    resolver: zodResolver(followupSchema),
    defaultValues: {
      followup_type: "Call",
      scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: "",
    },
  });

  const leadForm = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      lead_name: call.contact_name,
      lead_email: call.contact_email || "",
      lead_phone: call.contact_phone || "",
      company_name: "",
      value: "",
    },
  });

  const onFollowupSubmit = async (values: FollowupFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/calls/followups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call_id: call.id,
          followup_type: values.followup_type,
          scheduled_date: values.scheduled_date,
          notes: values.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create follow-up");
      }

      toast.success("Follow-up scheduled successfully!");
      followupForm.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create follow-up"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLeadSubmit = async (values: LeadFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/calls/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call_id: call.id,
          lead_name: values.lead_name,
          lead_email: values.lead_email || undefined,
          lead_phone: values.lead_phone || undefined,
          company_name: values.company_name || undefined,
          value: values.value ? parseFloat(values.value) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create lead");
      }

      toast.success("Lead created successfully!");
      setLeadCreated(true);
      leadForm.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create lead"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Phone className="mr-2 h-4 w-4" />
          Follow-up & Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Follow-up & Lead Management</DialogTitle>
          <DialogDescription>
            For contact: {call.contact_name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="followup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followup">Schedule Follow-up</TabsTrigger>
            <TabsTrigger value="lead">Create Lead</TabsTrigger>
          </TabsList>

          {/* Follow-up Tab */}
          <TabsContent value="followup" className="space-y-4">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                Schedule a follow-up action to stay engaged with this contact
              </AlertDescription>
            </Alert>

            <Form {...followupForm}>
              <form
                onSubmit={followupForm.handleSubmit(onFollowupSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={followupForm.control}
                  name="followup_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow-up Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(
                            ["Call", "Email", "SMS", "Meeting", "Other"] as FollowupType[]
                          ).map((type) => (
                            <SelectItem key={type} value={type}>
                              <span className="flex items-center gap-2">
                                {followupIcons[type]}
                                {type}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={followupForm.control}
                  name="scheduled_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={followupForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What should be covered in this follow-up?"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Add details about what you want to discuss or cover
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Follow-up"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Lead Tab */}
          <TabsContent value="lead" className="space-y-4">
            {leadCreated && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Lead created successfully! You can now track its progress.
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Convert this contact into a sales lead for tracking and nurturing
              </AlertDescription>
            </Alert>

            <Form {...leadForm}>
              <form
                onSubmit={leadForm.handleSubmit(onLeadSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={leadForm.control}
                  name="lead_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contact name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={leadForm.control}
                    name="lead_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={leadForm.control}
                    name="lead_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1-555-0000"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={leadForm.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Company name"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={leadForm.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Value ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Lead...
                    </>
                  ) : (
                    "Create Lead"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

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
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const uploadSchema = z.object({
  dump_name: z.string().min(1, "Dump name is required"),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => file.type === "text/csv" || file.name.endsWith(".csv"),
      "File must be a CSV file"
    ),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

interface CallDumpUploadProps {
  onUploadSuccess?: (dumpId: string) => void;
}

export function CallDumpUpload({ onUploadSuccess }: CallDumpUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      dump_name: "",
    },
  });

  const onSubmit = async (values: UploadFormValues) => {
    setIsUploading(true);
    try {
      // Simulate file upload
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const formData = new FormData();
      formData.append("dump_name", values.dump_name);
      formData.append("file", values.file);

      // TODO: Replace with actual API call
      const response = await fetch("/api/calls/dumps/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload dump");
      }

      const data = await response.json();
      toast.success("Call dump uploaded successfully!");
      form.reset();
      setUploadProgress(0);
      onUploadSuccess?.(data.dump_id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload dump"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Upload Call Dump</h2>
        <p className="text-sm text-muted-foreground">
          Upload a CSV file containing contact information for bulk call management
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="dump_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dump Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., February Campaign Leads"
                    disabled={isUploading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Give your call dump a descriptive name for easy identification
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>CSV File</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(file);
                      }}
                      disabled={isUploading}
                      {...field}
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="font-semibold">
                          {value?.name || "Click to upload or drag and drop"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          CSV file up to 5MB
                        </p>
                      </div>
                    </label>
                  </div>
                </FormControl>
                <FormDescription>
                  Required columns: contact_name, contact_phone, contact_email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {isUploading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <div className="ml-2">
                  <p className="font-semibold">Uploading...</p>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Call Dump
              </>
            )}
          </Button>
        </form>
      </Form>

      <Alert className="mt-6 border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          CSV should contain columns: contact_name, contact_phone, contact_email,
          company_name (optional)
        </AlertDescription>
      </Alert>
    </Card>
  );
}

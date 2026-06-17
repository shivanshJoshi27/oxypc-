/**
 * Call utility functions
 */

import { formatDistanceToNow } from "date-fns";
import type { CallStatus, FollowupStatus, LeadStatus, DumpStatus } from "@/types/calls";

/**
 * Format call duration from seconds to human-readable format
 */
export const formatCallDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Get status badge color based on call status
 */
export const getCallStatusColor = (
  status: CallStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Completed":
      return "default";
    case "Missed":
      return "destructive";
    case "Pending":
      return "secondary";
    default:
      return "outline";
  }
};

/**
 * Get status badge color for followup
 */
export const getFollowupStatusColor = (
  status: FollowupStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Completed":
      return "default";
    case "Pending":
      return "secondary";
    case "Cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

/**
 * Get status badge color for lead
 */
export const getLeadStatusColor = (
  status: LeadStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Converted":
      return "default";
    case "Lost":
      return "destructive";
    case "Qualified":
      return "secondary";
    case "Contacted":
      return "secondary";
    case "New":
      return "outline";
    default:
      return "outline";
  }
};

/**
 * Get status badge color for dump
 */
export const getDumpStatusColor = (
  status: DumpStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Completed":
      return "default";
    case "Processing":
      return "secondary";
    case "Failed":
      return "destructive";
    case "Pending":
      return "outline";
    default:
      return "outline";
  }
};

/**
 * Generate unique ID with prefix
 */
export const generateId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Calculate lead conversion rate
 */
export const calculateConversionRate = (
  totalLeads: number,
  convertedLeads: number
): number => {
  if (totalLeads === 0) return 0;
  return Math.round((convertedLeads / totalLeads) * 100);
};

/**
 * Calculate average call duration in seconds
 */
export const calculateAverageCallDuration = (durations: number[]): number => {
  if (durations.length === 0) return 0;
  const total = durations.reduce((sum, duration) => sum + duration, 0);
  return Math.round(total / durations.length);
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data: any[], filename: string): void => {
  const headers = Object.keys(data[0]);
  const rows = data.map((item) => headers.map((header) => item[header]));

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
};

/**
 * Parse CSV file
 */
export const parseCSV = (
  file: File
): Promise<Record<string, string>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());
        const data = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => {
            const values = line.split(",");
            const obj: Record<string, string> = {};
            headers.forEach((header, index) => {
              obj[header] = values[index]?.trim() || "";
            });
            return obj;
          });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};

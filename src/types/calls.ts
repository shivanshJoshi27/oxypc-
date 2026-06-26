/**
 * Call-related type definitions
 */

export type CallType = "Incoming" | "Outgoing";
export type CallStatus = "Completed" | "Missed" | "Pending";
export type DumpStatus = "Pending" | "Processing" | "Completed" | "Failed";
export type AssignmentStatus = "Active" | "Completed" | "Reassigned";
export type FollowupType = "Call" | "Email" | "SMS" | "Meeting" | "Other";
export type FollowupStatus = "Pending" | "Completed" | "Cancelled";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Lost";
export type LeadConversionOption = "Sourcing Deal" | "Opportunity";
export type LeadSourceOption = 
  | "Google"
  | "Facebook"
  | "Instagram"
  | "LinkedIn"
  | "Call Dump"
  | "Manual"
  | "Other";
export type UserRole = "Admin" | "Manager" | "User" | "HeadEngineer" | "StoreManager";

/**
 * Call Record
 */
export interface Call {
  id: number;
  call_id: string;
  contact_name: string;
  contact_phone?: string;
  contact_email?: string;
  call_type: CallType;
  duration_seconds: number;
  call_date: Date;
  assigned_to_user_id?: number;
  recorded: boolean;
  recording_url?: string;
  notes?: string;
  status: CallStatus;
  source: string;
  created_by_id?: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Call Dump - Bulk upload of calls
 */
export interface CallDump {
  id: number;
  dump_id: string;
  dump_name: string;
  total_contacts: number;
  processed_contacts: number;
  status: DumpStatus;
  file_url?: string;
  uploaded_by_id?: number;
  processing_started_at?: Date;
  processing_completed_at?: Date;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Call Assignment - Manager assigns calls to users
 */
export interface CallAssignment {
  id: number;
  assignment_id: string;
  call_id: number;
  assigned_by_id: number;
  assigned_to_id: number;
  assignment_date: Date;
  priority: "Low" | "Normal" | "High" | "Urgent";
  notes?: string;
  status: AssignmentStatus;
  created_at: Date;
  updated_at: Date;
}

/**
 * Follow-up Action
 */
export interface FollowUp {
  id: number;
  followup_id: string;
  call_id: number;
  user_id: number;
  followup_type: FollowupType;
  scheduled_date?: Date;
  completed_date?: Date;
  notes?: string;
  status: FollowupStatus;
  created_at: Date;
  updated_at: Date;
}

/**
 * Lead created from a call
 */
export interface CallLead {
  id: number;
  lead_id: string;
  call_id: number;
  created_by_id: number;
  lead_name: string;
  lead_email?: string;
  lead_phone?: string;
  company_name?: string;
  status: LeadStatus;
  lead_source: LeadSourceOption;
  campaign?: string;
  conversion_option?: LeadConversionOption;
  tags?: string[];
  value?: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Call Metrics and KPIs
 */
export interface CallMetrics {
  id: number;
  metric_date: Date;
  user_id?: number;
  total_calls: number;
  total_call_duration_minutes: number;
  followup_completed: number;
  leads_created: number;
  lead_conversion_rate: number;
  average_call_duration_seconds: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Call History Event
 */
export interface CallHistoryEvent {
  id: number;
  call_id: number;
  event_type:
    | "Created"
    | "Assigned"
    | "Followup"
    | "Lead Created"
    | "Status Changed";
  event_description: string;
  changed_by_id?: number;
  previous_value?: string;
  new_value?: string;
  created_at: Date;
}

/**
 * User Information
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Form Data Types
 */
export interface CreateCallDumpForm {
  dump_name: string;
  file: File;
}

export interface AssignCallForm {
  call_ids: number[];
  assigned_to_id: number;
  priority: "Low" | "Normal" | "High" | "Urgent";
  notes?: string;
}

export interface CreateFollowupForm {
  call_id: number;
  followup_type: FollowupType;
  scheduled_date: Date;
  notes?: string;
}

export interface CreateLeadForm {
  call_id: number;
  lead_name: string;
  lead_email?: string;
  lead_phone?: string;
  company_name?: string;
  lead_source?: LeadSourceOption;
  campaign?: string;
  conversion_option?: LeadConversionOption;
  tags?: string[];
  value?: number;
}

/**
 * Dashboard Widget Data
 */
export interface DashboardMetrics {
  total_calls_today: number;
  total_call_duration_today: number;
  pending_followups: number;
  leads_created_today: number;
  assigned_contacts: number;
  completed_followups_today: number;
  lead_conversion_rate: number;
  average_call_duration: number;
}

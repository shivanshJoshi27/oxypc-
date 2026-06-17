# Call Features Implementation Guide

## 📋 Overview

This document outlines the complete implementation of three major features for the Echo Link CRM system:

1. **Call Dump Module** - Bulk import and manage call data
2. **Call Dashboard** - Monitor call metrics and team performance
3. **Call Monitoring & Tracking** - Complete call history and follow-up tracking

## 🗄️ Database Schema

### New Tables Created

#### 1. `calls` Table
Stores individual call records with metadata.

```sql
- id (PRIMARY KEY)
- call_id (UNIQUE) - Formatted: CALL-001
- contact_name, contact_phone, contact_email
- call_type (Incoming/Outgoing)
- duration_seconds, call_date
- assigned_to_user_id (FK: users)
- recorded, recording_url
- notes, status
- source, created_by_id
- timestamps (created_at, updated_at)
```

#### 2. `call_dumps` Table
Tracks bulk call uploads and their processing status.

```sql
- id (PRIMARY KEY)
- dump_id (UNIQUE) - Formatted: DUMP-timestamp
- dump_name, total_contacts, processed_contacts
- status (Pending/Processing/Completed/Failed)
- file_url, uploaded_by_id
- processing_started_at, processing_completed_at
- error_message
- timestamps
```

#### 3. `call_assignments` Table
Manager assignments of calls to team members.

```sql
- id (PRIMARY KEY)
- assignment_id (UNIQUE)
- call_id (FK: calls)
- assigned_by_id (FK: users) - Manager
- assigned_to_id (FK: users) - Team member
- assignment_date
- priority (Low/Normal/High/Urgent)
- notes, status
- timestamps
```

#### 4. `follow_ups` Table
Follow-up actions on calls.

```sql
- id (PRIMARY KEY)
- followup_id (UNIQUE)
- call_id (FK: calls)
- user_id (FK: users)
- followup_type (Call/Email/SMS/Meeting/Other)
- scheduled_date, completed_date
- notes, status (Pending/Completed/Cancelled)
- timestamps
```

#### 5. `call_leads` Table
Leads created from calls.

```sql
- id (PRIMARY KEY)
- lead_id (UNIQUE)
- call_id (FK: calls)
- created_by_id (FK: users)
- lead_name, lead_email, lead_phone, company_name
- status (New/Contacted/Qualified/Converted/Lost)
- lead_source, value
- timestamps
```

#### 6. `call_metrics` Table
KPI aggregations and analytics.

```sql
- id (PRIMARY KEY)
- metric_date
- user_id (FK: users)
- total_calls, total_call_duration_minutes
- followup_completed, leads_created
- lead_conversion_rate, average_call_duration_seconds
- timestamps
- UNIQUE(metric_date, user_id)
```

#### 7. `call_history` Table
Audit trail of all call events.

```sql
- id (PRIMARY KEY)
- call_id (FK: calls)
- event_type (Created/Assigned/Followup/Lead Created/Status Changed)
- event_description
- changed_by_id (FK: users)
- previous_value, new_value
- created_at
```

## 🎨 Components Overview

### Call Dump Module Components

#### `CallDumpUpload.tsx`
Handles CSV file uploads for bulk call imports.

**Props:**
```typescript
interface CallDumpUploadProps {
  onUploadSuccess?: (dumpId: string) => void;
}
```

**Features:**
- Drag-and-drop file upload
- CSV validation (size, format)
- Progress tracking
- Error handling

#### `CallDumpList.tsx`
Displays list of uploaded call dumps with status.

**Props:**
```typescript
interface CallDumpListProps {
  dumps: CallDump[];
  isLoading?: boolean;
  onViewDetails?: (dump: CallDump) => void;
  onDelete?: (dumpId: string) => void;
  onDownload?: (dump: CallDump) => void;
}
```

#### `AssignContacts.tsx`
Allows managers to assign calls to team members.

**Props:**
```typescript
interface AssignContactsProps {
  calls: Call[];
  users: User[];
  isManager?: boolean;
  onAssignSuccess?: () => void;
}
```

**Features:**
- Multi-select call assignment
- Priority level setting
- Notes and comments
- User filtering by role

#### `FollowupAndLeadCreation.tsx`
Enables users to create follow-ups and leads from calls.

**Props:**
```typescript
interface FollowupAndLeadCreationProps {
  call: Call;
  onSuccess?: () => void;
}
```

**Features:**
- Schedule follow-up actions
- Create sales leads
- Capture lead details
- Set lead value

### Call Dashboard Components

#### `DashboardCharts.tsx`
Reusable chart components for visualizations.

**Exports:**
- `KPICard` - Display key metrics
- `CallActivityChart` - Bar chart of call activity
- `CallDurationTrend` - Line chart of duration trends
- `LeadConversionFunnel` - Funnel visualization
- `TeamPerformance` - Performance metrics
- `CallTypeDistribution` - Pie chart of call types

#### `CallDashboard.tsx`
Main dashboard page with tabs and filters.

**Features:**
- Real-time KPI metrics
- 7-day activity view
- Team performance metrics
- Follow-up status tracking
- Time range filtering
- Export functionality

### Call Monitoring Components

#### `CallTracking.tsx`
Timeline and record viewer components.

**Exports:**
- `CallHistoryTimeline` - Event timeline display
- `CallRecordViewer` - Call details modal

#### `CallMonitoringAndTracking.tsx`
Main monitoring dashboard.

**Features:**
- Complete call records table
- Advanced search and filtering
- Call history timeline
- Follow-up tracking
- Recording playback
- Recording availability indicators

## 🛣️ Routes

All routes are prefixed with `/calls`:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/calls/dump` | CallDumpModule | Bulk call management |
| `/calls/dashboard` | CallDashboard | Analytics and KPIs |
| `/calls/tracking` | CallMonitoringAndTracking | Call history and monitoring |

## 📁 Folder Structure

```
src/
├── routes/calls/
│   ├── dump.tsx          # Route for call dump module
│   ├── dashboard.tsx     # Route for dashboard
│   └── tracking.tsx      # Route for monitoring
├── components/calls/
│   ├── CallDumpUpload.tsx
│   ├── CallDumpList.tsx
│   ├── AssignContacts.tsx
│   ├── FollowupAndLeadCreation.tsx
│   ├── CallDumpModule.tsx
│   ├── DashboardCharts.tsx
│   ├── CallDashboard.tsx
│   ├── CallTracking.tsx
│   ├── CallMonitoringAndTracking.tsx
│   └── index.ts           # Barrel export
├── types/
│   └── calls.ts           # TypeScript interfaces
├── utils/
│   └── callsUtils.ts      # Utility functions
└── hooks/
    └── (ready for custom hooks)
```

## 🔧 Type Definitions

Complete TypeScript interfaces for type safety:

```typescript
// Enums
type CallType = "Incoming" | "Outgoing"
type CallStatus = "Completed" | "Missed" | "Pending"
type DumpStatus = "Pending" | "Processing" | "Completed" | "Failed"
type FollowupType = "Call" | "Email" | "SMS" | "Meeting" | "Other"
type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Lost"

// Main interfaces
interface Call { ... }
interface CallDump { ... }
interface CallAssignment { ... }
interface FollowUp { ... }
interface CallLead { ... }
interface CallMetrics { ... }
interface CallHistoryEvent { ... }
interface DashboardMetrics { ... }

// Form data types
interface CreateCallDumpForm { ... }
interface AssignCallForm { ... }
interface CreateFollowupForm { ... }
interface CreateLeadForm { ... }

// API response types
interface ApiResponse<T> { ... }
interface PaginatedResponse<T> { ... }
```

## 🛠️ Utility Functions

### Date/Time Utilities
- `formatCallDuration(seconds)` - Convert seconds to readable format
- `formatRelativeTime(date)` - Convert to relative time (e.g., "2 hours ago")

### Color/Status Utilities
- `getCallStatusColor(status)` - Get badge color for call status
- `getFollowupStatusColor(status)` - Get badge color for follow-up
- `getLeadStatusColor(status)` - Get badge color for lead
- `getDumpStatusColor(status)` - Get badge color for dump

### Data Utilities
- `generateId(prefix)` - Generate unique ID with prefix
- `formatPhoneNumber(phone)` - Format phone numbers
- `calculateConversionRate(total, converted)` - Calculate conversion %
- `calculateAverageCallDuration(durations)` - Get average duration

### Export/Import Utilities
- `exportToCSV(data, filename)` - Export table data to CSV
- `parseCSV(file)` - Parse CSV file to objects

## 📡 API Integration

All components reference the following API endpoints:

### Call Dumps
```typescript
POST /api/calls/dumps/upload
// Payload: FormData with dump_name, file

GET /api/calls/dumps
// Returns: PaginatedResponse<CallDump[]>

GET /api/calls/dumps/:id
// Returns: CallDump

DELETE /api/calls/dumps/:id
// Returns: { success: boolean }
```

### Call Assignments
```typescript
POST /api/calls/assign
// Payload: { call_ids, assigned_to_id, priority, notes }

GET /api/calls/assignments
// Returns: PaginatedResponse<CallAssignment[]>

PUT /api/calls/assignments/:id
// Payload: Partial<CallAssignment>
```

### Follow-ups
```typescript
POST /api/calls/followups
// Payload: { call_id, followup_type, scheduled_date, notes }

GET /api/calls/followups
// Returns: PaginatedResponse<FollowUp[]>

PUT /api/calls/followups/:id
// Payload: Partial<FollowUp>
```

### Leads
```typescript
POST /api/calls/leads
// Payload: { call_id, lead_name, lead_email, lead_phone, company_name, value }

GET /api/calls/leads
// Returns: PaginatedResponse<CallLead[]>

PUT /api/calls/leads/:id
// Payload: Partial<CallLead>
```

### Call Records
```typescript
GET /api/calls
// Returns: PaginatedResponse<Call[]>
// Query params: status, type, search, limit, page

GET /api/calls/:id
// Returns: Call with history

POST /api/calls
// Payload: Omit<Call, 'id' | 'timestamps'>
```

### Metrics
```typescript
GET /api/calls/metrics/dashboard
// Returns: DashboardMetrics

GET /api/calls/metrics/history
// Query params: user_id, start_date, end_date
// Returns: CallMetrics[]
```

## 🚀 Implementation Steps

### 1. Backend Setup
- [ ] Create database tables (schema.sql provided)
- [ ] Implement API endpoints
- [ ] Set up authentication/authorization
- [ ] Configure Supabase storage for files

### 2. Frontend Integration
- [ ] Replace mock data with API calls
- [ ] Add React Query for data fetching
- [ ] Implement error boundaries
- [ ] Add loading states

### 3. Real-time Features
- [ ] Set up Supabase subscriptions
- [ ] Implement WebSocket for live updates
- [ ] Add notification system

### 4. Testing
- [ ] Unit tests for utilities
- [ ] Component tests
- [ ] E2E tests for workflows

### 5. Performance
- [ ] Implement pagination
- [ ] Add caching strategies
- [ ] Optimize rerenders

## 📊 Sample Data

Mock data is included in components for development. Replace with API calls in production.

### Sample Call Record
```typescript
{
  id: 1,
  call_id: "CALL-001",
  contact_name: "John Smith",
  contact_phone: "+1-555-0101",
  contact_email: "john@example.com",
  call_type: "Outgoing",
  duration_seconds: 1245,
  call_date: new Date(),
  assigned_to_user_id: 6,
  recorded: true,
  notes: "Interested in product demo",
  status: "Completed",
  source: "Call Dump"
}
```

## 🔐 Security Considerations

1. **Role-based Access:**
   - Managers: Full access to all features
   - Users: Can only view assigned calls and create follow-ups
   - Admins: Complete system access

2. **Data Privacy:**
   - Implement field-level encryption for sensitive data
   - Audit all changes in call_history table
   - Comply with data retention policies

3. **File Uploads:**
   - Validate file types and sizes
   - Scan for malware
   - Store in secure S3 bucket

## 📈 Performance Optimization

1. **Pagination:** All list endpoints paginated (default: 20 items/page)
2. **Caching:** React Query with stale-while-revalidate strategy
3. **Lazy Loading:** Components load charts only when visible
4. **Virtualization:** Consider for large call lists
5. **Memoization:** Prevent unnecessary rerenders

## 🐛 Error Handling

Each component includes:
- Try-catch blocks for API calls
- User-friendly error messages via toast
- Fallback UI states
- Error boundaries for component crashes

## 📝 Usage Examples

### Using Call Dump Module
```typescript
import { CallDumpModule } from '@/components/calls';

<CallDumpModule 
  userRole="Manager" 
  currentUserId={1} 
/>
```

### Using Dashboard
```typescript
import { CallDashboard } from '@/components/calls';

<CallDashboard 
  userRole="Manager" 
  userId={1} 
/>
```

### Using Monitoring
```typescript
import { CallMonitoringAndTracking } from '@/components/calls';

<CallMonitoringAndTracking 
  userRole="Manager" 
  userId={1} 
/>
```

## 📚 Dependencies

All required dependencies are already in package.json:
- React 19
- React Hook Form + Zod
- Radix UI components
- Recharts for visualizations
- Sonner for notifications
- date-fns for date utilities

## 🎯 Next Steps

1. Review and test the mock components
2. Set up backend API endpoints
3. Integrate React Query for data fetching
4. Add authentication/authorization logic
5. Deploy to production
6. Monitor usage and optimize

---

**Documentation Version:** 1.0  
**Last Updated:** 2026-06-17  
**Status:** ✅ Implementation Complete

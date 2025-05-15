
// Define the Lead status type to match the constraint
export type LeadStatus = 
  | "New" 
  | "In Contact" 
  | "Follow up" 
  | "Set Meeting" 
  | "Negotiation" 
  | "Enrolled" 
  | "Junk/Lost"
  | "On Campus"
  | "Customer";

// Define the Lead type
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: string;
  assignedTo: string;
  date: string;
  tags: string[];
  createdAt: string;
  lastActivity?: {
    type: string;
    date: string;
  };
}

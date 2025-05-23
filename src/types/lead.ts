
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
    id: string,
    name:string,
    createdAt:string,
    firstName:string,
    lastName:string,
    mobile:string,
    email:string,
    source:string,
    course:string,
    leadType: string,
    updatedAt: string,
    recentNote: string,
    message:string,
}

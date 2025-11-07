
export enum VerificationStatus {
  Verified = 'Verified',
  NotVerified = 'Not Verified',
  Pending = 'Pending'
}

export interface Document {
  name: string;
  status: VerificationStatus;
  reason?: string; // Reason for not being verified
}

export interface Employee {
  id: string;
  name: string;
  imageUrl: string;
  identityId: string;
  identityDocs: Document[];
  educationDocs: Document[];
}

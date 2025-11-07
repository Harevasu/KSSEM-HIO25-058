
import { Employee, VerificationStatus } from './types';

export const mockEmployees: Employee[] = [
  {
    id: 'emp1',
    name: 'Gokul Sharan R',
    imageUrl: 'https://picsum.photos/seed/emp3/200',
    identityId: 'VD-00123',
    identityDocs: [
      { name: 'Aadhaar Card', status: VerificationStatus.Verified },
      { name: 'PAN Card', status: VerificationStatus.Verified },
      { name: 'Passport', status: VerificationStatus.NotVerified, reason: 'Passport has expired.' },
    ],
    educationDocs: [
      { name: '10th Marksheet', status: VerificationStatus.Verified },
      { name: '12th Marksheet', status: VerificationStatus.Verified },
      { name: 'Undergraduate Degree', status: VerificationStatus.Verified },
      { name: 'Postgraduate Degree', status: VerificationStatus.Pending },
    ],
  },
  {
    id: 'emp2',
    name: 'Caleb Rivers',
    imageUrl: 'https://picsum.photos/seed/emp2/200',
    identityId: 'VD-00124',
    identityDocs: [
      { name: 'Aadhaar Card', status: VerificationStatus.Verified },
      { name: 'PAN Card', status: VerificationStatus.Verified },
      { name: 'Passport', status: VerificationStatus.Verified },
    ],
    educationDocs: [
      { name: '10th Marksheet', status: VerificationStatus.Verified },
      { name: '12th Marksheet', status: VerificationStatus.NotVerified, reason: 'Scanned copy is not legible.' },
      { name: 'Undergraduate Degree', status: VerificationStatus.Verified },
    ],
  },
  {
    id: 'emp3',
    name: 'Spencer Hastings',
    imageUrl: 'https://picsum.photos/seed/emp3/200',
    identityId: 'VD-00125',
    identityDocs: [
      { name: 'Aadhaar Card', status: VerificationStatus.Verified },
      { name: 'PAN Card', status: VerificationStatus.Verified },
      { name: 'Passport', status: VerificationStatus.Verified },
    ],
    educationDocs: [
      { name: '10th Marksheet', status: VerificationStatus.Verified },
      { name: '12th Marksheet', status: VerificationStatus.Verified },
      { name: 'Undergraduate Degree', status: VerificationStatus.Verified },
      { name: 'Postgraduate Degree', status: VerificationStatus.Verified },
    ],
  },
    {
    id: 'emp4',
    name: 'Hanna Marin',
    imageUrl: 'https://picsum.photos/seed/emp4/200',
    identityId: 'VD-00126',
    identityDocs: [
      { name: 'Aadhaar Card', status: VerificationStatus.NotVerified, reason: 'Name mismatch with PAN card.' },
      { name: 'PAN Card', status: VerificationStatus.NotVerified, reason: 'Name mismatch with Aadhaar card.' },
      { name: 'Passport', status: VerificationStatus.Pending },
    ],
    educationDocs: [
      { name: '10th Marksheet', status: VerificationStatus.Verified },
      { name: '12th Marksheet', status: VerificationStatus.Verified },
      { name: 'Undergraduate Degree', status: VerificationStatus.Pending },
    ],
  },
];

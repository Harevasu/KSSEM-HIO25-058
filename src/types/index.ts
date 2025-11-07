export interface ComparisonData {
  Candidate: string;
  Documents: {
    Document_Name: string;
    Differences: 'Yes' | 'No' | 'Missing in DigiLocker' | 'Error';
    Details: {
      Field: string;
      Reason: string;
      Json1?: any;
      Json2?: any;
    }[];
  }[];
}

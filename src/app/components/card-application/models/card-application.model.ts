export type ApplicationStatus = 'DRAFT' | 'COMPLETED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface EconomicProfile {
  employmentStatus: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  economicActivity: string;
}

export interface SourceOfFunds {
  source: string;
  description?: string;
  declarationAccepted: boolean;
}

export type DocumentStatus = 'VALID' | 'INVALID' | 'DUPLICATE';

export interface AddressProof {
  fileName: string;
  fileType: string;
  fileSize?: number;
  validationStatus?: DocumentStatus;
}

export interface CardSelection {
  cardType: string;
  transactionLimit: number;
}

export interface Terms {
  accepted: boolean;
  signature?: string;
}

export interface CustomerOrigin {
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
}

export interface CardApplication {
  id: string;
  currentStep: number;
  status: ApplicationStatus;

  economicProfile?: EconomicProfile;
  sourceOfFunds?: SourceOfFunds;
  addressProof?: AddressProof;
  cardSelection?: CardSelection;
  terms?: Terms;
  location?: CustomerOrigin;
  risk?: RiskResult;
}

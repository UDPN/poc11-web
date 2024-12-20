export interface TokenInfo {
  stablecoinId: number;
  tokenName: string;
  tokenType: number;
  tokenSymbol: string;
  decimalPrecision: number;
  currencySymbol: string;
  usPrice: string;
  blockchainCode: string;
  blockchainName: string;
  blockchainId: number;
  blockchainNameAbbreviation: string;
}

export interface TokenResponse {
  code: number;
  message: string;
  data: TokenInfo[];
}

export interface SubjectInfo {
  financialSubjectId: number;
  stablecoinId: number;
  subjectCategory: string;
  subjectCode: string;
  subjectTitle: string;
}

export interface SubjectResponse {
  code: number;
  message: string;
  data: SubjectInfo[];
}

export interface SaveSubjectRequest {
  stablecoinId: number;
  subjectCategory: string;
  subjectCode: string;
  subjectTitle: string;
}

export interface SaveSubjectResponse {
  code: number;
  message: string;
  data: any;
} 
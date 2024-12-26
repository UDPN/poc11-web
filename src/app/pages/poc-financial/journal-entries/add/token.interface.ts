/*
 * @Author: chenyuting
 * @Date: 2024-12-20 14:03:55
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-26 17:55:27
 * @Description:
 */
export interface TokenInfo {
  stablecoinId: number;
  tokenName: string;
  tokenType: number;
  tokenSymbol: string;
  tokenPrice: number | string;
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

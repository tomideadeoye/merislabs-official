import { mattersAgainstBank } from './matters-against-bank';
import { casesByEcobank } from './cases-instituted-by-ecobank';
import { appeals } from './appeals';
import { highClaimCases } from './high-claim-cases';
import {
  MattersAgainstBankItem,
  CasesByEcobankItem,
  AppealsItem,
  AnyCase,
  CaseWithMetadata,
  CaseData
} from '@merislabs/types';

// Re-export for convenience
export type { CaseWithMetadata, CaseData };



export const getAllCases = (): CaseWithMetadata[] => {
  console.log('[Data] getAllCases called');

  console.log('[Data] Data counts:', {
    mattersAgainstBank: mattersAgainstBank.length,
    casesInstitutedByTheBank: casesByEcobank.length,
    appeals: appeals.length,
    highClaimCases: highClaimCases.length
  });

  const combined: CaseWithMetadata[] = [
    ...highClaimCases.map((item, index) => {
      console.log('[Data] Processing high claim case', index, item.CaseID);
      return {
        ...item,
        section: 'priority-matters' as const,
        uniqueId: `priority-matters-${item.CaseID}`
      };
    }),
    ...(mattersAgainstBank as MattersAgainstBankItem[]).map((item, index) => {
      console.log('[Data] Processing matters against bank case', index, item.CaseID);
      return {
        ...item,
        section: 'matters-against' as const,
        uniqueId: `matters-against-${item.CaseID}`
      };
    }),
    ...(casesByEcobank as CasesByEcobankItem[]).map((item, index) => {
      console.log('[Data] Processing cases by bank case', index, item.CaseID);
      return {
        ...item,
        section: 'cases-by-bank' as const,
        uniqueId: `cases-by-bank-${item.CaseID}`
      };
    }),
    ...(appeals as AppealsItem[]).map((item, index) => {
      console.log('[Data] Processing appeal case', index, item.CaseID);
      return {
        ...item,
        section: 'appeals' as const,
        uniqueId: `appeals-${item.CaseID}`
      };
    })
  ];
  console.log('[Data] Combined total cases:', combined.length);
  return combined;
};
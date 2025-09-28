import React from 'react';

interface ESGPage2Props {
  pageNumber?: number;
  footnoteStart?: number;
  footnotes?: string[];
  onPageCountChange?: (count: number) => void;
}

const defaultFootnotes = [
  'Nigeria Industrial Revolution Plan (NIRP) 2014-2020. Available at <https://nipc.gov.ng/nigeria-industrial-revolution-plan-nirp/> (Accessed 3 August 2025)',
  'World Bank (2020). *Nigeria Economic Update: Strengthening Manufacturing for Inclusive Growth*. Washington, DC: World Bank Group.',
  'African Development Bank (2019). *African Economic Outlook 2019: Growth and Sustainability in Africa’s Cities*. Abidjan: AfDB.',
  'United Nations Industrial Development Organization (UNIDO) (2018). *Industry 4.0 and Sustainable Industrial Development in Africa*. Vienna: UNIDO.',
  'Nigeria Bureau of Statistics (2023). *Manufacturing Sector Performance Report*. Abuja: NBS.'
];

export const ESGPage2: React.FC<ESGPage2Props> = ({ pageNumber, footnoteStart = 1, footnotes = defaultFootnotes }) => {
  // This page is now merged into the main content flow
  // Return null as it's handled by the main content component
  return null;
};

(ESGPage2 as any).defaultProps = {
  footnotes: defaultFootnotes
};
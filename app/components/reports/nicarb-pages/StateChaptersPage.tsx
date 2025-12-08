import React from 'react';
import { Page } from './Page';
import { Nicarb2025ConferenceFooter } from './ui/footer';

export function StateBranchesPage() {
  const stateBranches: Array<{ state: string; chairperson: string; imageSrc: string | null }> = [{ state: "Abuja", chairperson: "Erimma Gloria Orie, FCArb", imageSrc: "/nicarb/committee-images/DR. ERIMMA GLORIA ORIE, FCArb..png" },
  { state: "Adamawa State", chairperson: "Isuwa Kskbiya – Misali, MCArb", imageSrc: "/nicarb/committee-images/ADAMAWA STATE Chairman Isuwa Kskbiya – Misali, MCArb.jpg" },
  { state: "Anambra State", chairperson: "Francis Chigozie Moneke, MCArb", imageSrc: "/nicarb/committee-images/Screenshot 2025-11-25 at 06.04.36.png" },
  { state: "Bayelsa State", chairperson: "Alabo Dr. Nengi James, MCArb", imageSrc: "/nicarb/committee-images/Screenshot 2025-11-25 at 06.01.59.png" },
  { state: "Borno State", chairperson: "Ali Idris Ismail, FCArb", imageSrc: "/nicarb/committee-images/Borno State Chairperson  Ali Idris Ismail, FCArb.jpg" },
  { state: "Cross River/Akwa-Ibom State", chairperson: "Engr. Edo Bassey Etuk, MCArb", imageSrc: "/nicarb/committee-images/Engr. Edo Bassey Etuk .jpeg" },
  { state: "Delta State", chairperson: "Echeho Godfrey, FCArb", imageSrc: "/nicarb/committee-images/DELTA STATE CHAIRMAN Echeho Godfrey, FCArb.jpg" },
  { state: "Edo State", chairperson: "Isi Ukhun Iyioha, MCArb", imageSrc: "/nicarb/committee-images/Edo State Chairperson Isi Ukhun Iyioha Mcarb.jpg" },
  { state: "Enugu State", chairperson: "Nobis-Elendu Chukwudinka Norbert, MCArb", imageSrc: "/nicarb/committee-images/ENUGU STATE Chairman Nobis-Elendu Chukwudinka Norbert MCArb,..jpg" },

  { state: "Imo State", chairperson: "Barr. (Nze) Jude Ikechukwu Ogamba, ACArb", imageSrc: "/nicarb/committee-images/Imo State Chairman Barr. (Nze) Jude Ikechukwu Ogamba ACArb.jpg" },
  { state: "Kaduna State", chairperson: "Sherrif Y. Ndasule, Esq., MCArb", imageSrc: "/nicarb/committee-images/KADUNA STATE Chairman  Sherrif Y. Ndasule, Esq., MCArb..jpg" },
  { state: "Kano State", chairperson: "Ismail Abdulaziz, ACArb", imageSrc: "/nicarb/committee-images/Kano State CHAIRMAN ISMAIL Abdulaziz, ACArb.jpg" },
  { state: "Lagos State", chairperson: "Aanuoluwapo Omoloju, FCArb", imageSrc: "/nicarb/committee-images/Lagos State Chairperson Aanuoluwapo Omoloju, Fcarb,.jpg" },
  { state: "Niger State", chairperson: "Lafene Idrees Abdulkareem", imageSrc: "/nicarb/committee-images/Niger State Chairman  LAFENE IDREES ABDULKAREEM.jpg" },
  { state: "Ondo State", chairperson: "Hon. Justice Folashade Aguda-Taiwo (Rtd)", imageSrc: "/nicarb/committee-images/ONDO STATE Chairperson  Hon. Justice Folashade Aguda-Taiwo Rtd..jpg" },
  { state: "Osun State", chairperson: "Hon. Justice Kunle Adeigbe (Rtd), FCArb", imageSrc: "/nicarb/committee-images/Osun STATE Chairman Hon. Justice Kunle Adeigbe Rtd FCArb.jpg" },
  { state: "Rivers State", chairperson: "Mr. Okechukwu E. Wali, SAN FCArb", imageSrc: "/nicarb/committee-images/Screenshot 2025-11-25 at 05.57.56.png" },
  ];

  return (
    <Page className="bg-white p-6 flex flex-col">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-center mb-2 text-[#064802] font-serif border-b-4 border-[#2dc27a] pb-2 inline-block w-full">
          STATE BRANCHES
        </h2>
        <p className="text-center text-[#3d8f02] font-medium uppercase tracking-widest text-xs mb-4">
          Chairpersons
        </p>

        {/* Single Image Content */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/nicarb/attendee-images/state-council-nicarb.png"
            alt="NICArb State Branches Chairpersons"
            className="w-full h-auto object-contain rounded-3xl border border-gray-200"
          />
        </div>
      </div>
      <Nicarb2025ConferenceFooter pageNumber="24" />
    </Page>
  );
}

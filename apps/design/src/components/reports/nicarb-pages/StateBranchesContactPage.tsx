import React from 'react';
import { Page } from './Page';
import { Nicarb2025ConferenceFooter } from './ui/footer';

interface Branch {
  title: string;
  address: string;
  email: string | null;
  website?: string;
  phones: string[];
}

export function StateBranchesContactPage() {
  const branches: Branch[][] = [
    // Column 1
    [
      {
        title: "Lagos State Head Office",
        address: "10, Adedeji Adekola Close, Off Freedom Way Lekki Phase 1, Lekki Peninsula, Lagos.",
        email: "info@nicarb.org",
        website: "www.nicarb.org",
        phones: ["08132993651", "09087187410"]
      },
      {
        title: "Abuja Office",
        address: "Soulmate House, Plot 188, Cadastral Zone Bo32 American Diya Road, Durumi FCT, Abuja, Nigeria.",
        email: "Info@nicarb.org",
        phones: ["09087187410"]
      },
      {
        title: "Borno State Branch",
        address: "The Chairman, 177 Hawul Close, Pompomari Estate, Maiduguri, Borno State.",
        email: "Bornobranch@nicarb.org",
        phones: ["07035087451"]
      },
      {
        title: "Adamawa State Branch",
        address: "The Chairman, Solicitor General/Permanent Secretary, Ministry Of Justice, Adamawa State Secretariat, Yola, Adamawa.",
        email: "Adamawabranch@nicarb.org",
        phones: ["08037143317", "8027476888"]
      },
      {
        title: "Ondo State Branch",
        address: "The Acting Chairman, Ondo State Branch: Road 2, House 1, Court of Appeal Estate, Alagbaka GRA, Akure, Ondo State.",
        email: "Ondobranch@nicarb.org",
        phones: ["08034716413", "8033526392"]
      },
      {
        title: "Osun State Branch",
        address: "The Chairman, C/O Osun State Boundary Commission, Ministry Of Justice Complex, Osun State Secretariat, Gbongan Road, Osogbo, Osun State.",
        email: "Osunbranch@nicarb.org",
        phones: ["08033260441", "8033328284"]
      }
    ],
    // Column 2
    [
      {
        title: "Cross River/Akwa Ibom Branch",
        address: "The Chairman, Cross River Akwa Ibom States Branch: No 10, Nsikak Okokon Street, Off Gloria Anana Lane, Osonganma Estate, Uyo, Akwa Ibom State.",
        email: "nicarbakwaibom-crossriver@nicarb.org",
        phones: ["08023128375", "08135307722", "9075087740"]
      },
      {
        title: "Anambra State Branch",
        address: "The Chairman, Anambra State Branch: 62, New Market Road, Onitsha, Anambra State.",
        email: "Anambrabranch@nicarb.org",
        phones: ["08063929029", "08036064470", "8062679068"]
      },
      {
        title: "Imo State Branch",
        address: "The Chairman, Imo State Branch: 76, Njemanze Street, Owerri, Imo State.",
        email: "Imobranch@nicarb.org",
        phones: ["08033320402", "08034095004", "08037503341", "08062679068", "8030674849"]
      },
      {
        title: "Bayelsa State Branch",
        address: "The Chairman, Bayelsa State Branch: 1/3 Collins Daniel Close, Off Samphino Hotel Road, Kpansia, Yenagoa, Bayelsa State.",
        email: "Bayelsabranch@nicarb.org",
        phones: ["08033103533", "08033405931", "08034791317", "0803 342 8267", "0813 067 9844"]
      },
      {
        title: "Enugu State Branch",
        address: "The Chairman, Enugu State Branch: Plot 47 Liberty Estate, Independence Layout, Enugu, Enugu State.",
        email: null,
        phones: ["08034930282", "07065401924"]
      },
      {
        title: "Kano State Branch",
        address: "The Chairman, Kano State Branch: H.H Karkasana & Co., 38 Ibrahim Taiwo Road, Kano State.",
        email: "Kanobranch@nicarb.org",
        phones: ["08036192155", "08033973180", "8031806766"]
      }
    ],
    // Column 3
    [
      {
        title: "Rivers State Branch",
        address: "The Chairman, River State Branch: 3 Okomoko Street, D-Line Port-Harcourt, Rivers State.",
        email: "Riverbranch@nicarb.org",
        phones: ["08034015134", "08058500283", "08033107492"]
      },
      {
        title: "Niger State Branch",
        address: "The Chairman, No. 1 Shehu Usman Plaza Opp. Fati Lami Institute For Legal & Administration Studies, Kpakungu, Minna, Niger State.",
        email: "Nigerbranch@nicarb.org",
        phones: ["07039654074", "803 451 0114"]
      },
      {
        title: "Kaduna State Branch",
        address: "The Chairman, Kaduna State Branch: Tafawa Balewa Way, Old ABUTH Drs Quarters, Kaduna, Kaduna State.",
        email: "Kadunabranch@nicarb.org",
        phones: ["08065734042", "08027411110", "8067992108"]
      },
      {
        title: "Delta State Branch",
        address: "The Chairman, Delta State Branch: Plot 38, Chief Edwin Uzor Street, Off Okpanam Road, Asaba, Delta State.",
        email: "Deltabranch@nicarb.org",
        phones: ["07067937668", "08034461082", "8039441406"]
      },
      {
        title: "Abia State Branch",
        address: "The Chairman, Office Of the Governor, Umuahia, Abia State.",
        email: "Abiabranch@nicarb.org",
        phones: ["08068234140", "8060263613"]
      },
      {
        title: "Edo State Branch",
        address: "The Chairman, Edo State Branch: 66, Boundary Road, Benin City, Edo State.",
        email: "Edobranch@nicarb.org",
        phones: ["08033935135", "07030858006", "08037333433", "8075340997"]
      }
    ]
  ];

  return (
    <Page className="relative flex flex-col h-full bg-white overflow-hidden p-0 font-sans print:bg-white">
      {/* Main Content Area - Clean White Background */}
      <div className="flex-1 relative z-10 px-10 py-8 flex flex-col justify-center">
        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          {branches.map((column, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-5">
              {column.map((branch, branchIdx) => (
                <div key={branchIdx} className="flex gap-2.5 items-start group">
                  {/* Location Pin Icon */}
                  <div className="mt-0.5 flex-shrink-0 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {/* Text Content - Professional Typography */}
                  <div className="text-[10px] text-gray-800 leading-tight font-medium">
                    <h3 className="font-bold text-[11px] mb-1 uppercase tracking-wide text-gray-900">{branch.title}</h3>
                    <p className="mb-1 leading-snug">{branch.address}</p>
                    {branch.email && (
                      <p className="mb-0.5">
                        <span className="font-semibold text-gray-700">Email:</span> {branch.email}
                      </p>
                    )}
                    {branch.website && (
                      <p className="mb-0.5">
                        <span className="font-semibold text-gray-700">Website:</span> {branch.website}
                      </p>
                    )}
                    {branch.phones.length > 0 && (
                      <p className="font-semibold text-gray-900 mt-1">
                        {branch.phones.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section - NICArb Theme */}
      <div className="h-[20%] bg-[#064802] relative z-30 flex flex-col justify-center items-center text-white px-8 py-6">
        <div className="flex w-full justify-between max-w-5xl mx-auto gap-8">
          {/* Left Block */}
          <div className="flex-1 text-center border-r border-white/30 pr-8">
            <h3 className="text-[#2dc27a] font-bold text-xs mb-2 uppercase tracking-widest">CORPORATE HEAD OFFICE</h3>
            <p className="text-[10px] leading-relaxed mb-1 text-white/90">10 Adedeji Adekola Street, off Freedom Way,<br />Lekki Phase 1, Lagos</p>
            <p className="text-[10px] font-bold mb-1 text-white">09087187401-14</p>
            <p className="text-[10px] text-white/90">info@nicarb.org</p>
          </div>

          {/* Right Block */}
          <div className="flex-1 text-center pl-8">
            <h3 className="text-[#2dc27a] font-bold text-xs mb-2 uppercase tracking-widest">ABUJA OFFICE</h3>
            <p className="text-[10px] leading-relaxed mb-1 text-white/90">Soulmate House: Plot 188, Durumi District<br />Off Oladipo Diya Road, FCT Abuja, Nigeria</p>
            <p className="text-[10px] font-bold mb-1 text-white">0908787403, 09087187412</p>
            <p className="text-[10px] text-white/90">info@nicarb.org</p>
          </div>
        </div>

        {/* Bottom Website Link */}
        <div className="mt-4 text-center">
          <p className="text-white/70 italic text-xs tracking-[0.2em] font-serif">www.nicarb.org</p>
        </div>
      </div>
    </Page>
  );
}

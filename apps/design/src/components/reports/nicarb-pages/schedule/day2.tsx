import React from 'react';

// Reuse the Row and TableHeader components from Day 1 (or create a shared file 'schedule-components.tsx')
// For this response, I'll repeat the component definition to ensure it works standalone, 
// but in a real project, you'd import them.

const Row = ({ 
  time, 
  title, 
  description, 
  speaker, 
  panelists, 
  moderator, 
  isBreak = false,
  isPlenary = false
}: { 
  time: string, 
  title: React.ReactNode, 
  description?: string, 
  speaker?: string,
  panelists?: string,
  moderator?: string,
  isBreak?: boolean,
  isPlenary?: boolean
}) => (
  <tr className={`border-b border-[#c5e1a5] align-top ${isBreak ? 'bg-[#f0f7ee]' : 'bg-white'}`}>
    <td className="w-24 py-3 px-2 text-[10px] font-bold text-[#075302] border-r border-[#d9edd3] whitespace-nowrap">
      {time}
    </td>
    <td className="py-3 px-3 text-[10px] text-gray-800">
      <div className={`leading-snug mb-1 ${isPlenary ? 'font-bold text-[#064802] text-xs uppercase' : 'font-bold text-gray-900 uppercase'}`}>
        {title}
      </div>
      {description && (
        <div className="mb-2 text-justify leading-snug text-gray-600">
          {description}
        </div>
      )}
      <div className="space-y-1">
        {speaker && <div className="italic"><span className="font-bold text-[#559203] not-italic mr-1">Speaker:</span> {speaker}</div>}
        {panelists && <div className="italic"><span className="font-bold text-[#559203] not-italic mr-1">Panelists:</span> {panelists}</div>}
        {moderator && <div className="italic"><span className="font-bold text-[#559203] not-italic mr-1">Moderator:</span> {moderator}</div>}
      </div>
    </td>
  </tr>
);

const TableHeader = ({ day, date }: { day: string, date: string }) => (
  <div className="bg-[#064802] text-white p-3 flex justify-between items-baseline mb-0 border-b-4 border-[#2dc27a]">
    <h2 className="text-xl font-bold font-serif">{day}</h2>
    <span className="text-sm font-medium text-[#c5e1a5]">{date}</span>
  </div>
);

export const Day2Schedule = () => {
  return (
    <div className="w-full border border-[#c5e1a5] shadow-sm">
      <TableHeader day="Day 2" date="28/11/2025" />
      <table className="w-full text-left border-collapse">
        <tbody>
           <Row 
            time="07.30 – 08.45" 
            title="Early Riser Session: YOUNG NICArb - The Role of Young Arbitrators in Promoting ADR Awareness"
            isPlenary={true}
            description="In Nigeria and across Africa, the public understanding and institutional acceptance of ADR mechanisms remain uneven. Within this evolving landscape, young arbitrators have emerged as dynamic actors driving awareness, education, and participation in ADR processes. This panel session will explore the role of young arbitrators in promoting ADR awareness, examining how their activities, advocacy, and collaborations help shape the future of dispute resolution on the continent."
            panelists="Toheeb Amuda; Latifat Hamdallat Hassan; Abasiemediong Etuk, MCArb; Festus Ogun"
            moderator="Gideon Edem (Chairman, NBA Young Lawyers’ Forum)"
          />
          <Row time="08.45 – 09.00" title="Summary of Day 1 discussions" />
          <Row 
            time="09.00 – 09.15" 
            title="Keynote Address (African Series)" 
            speaker="Hon. Dorcas Orduor – Attorney-General, Kenya"
          />
           <Row 
            time="09.15 – 10.45" 
            title="Plenary Session 5: THE CASE FOR INSTITUTIONAL MEDIATION AND COLLABORATION BETWEEN INSTITUTES IN DISPUTE RESOLUTION"
            isPlenary={true}
            description="While arbitration has long dominated Africa’s dispute resolution landscape, mediation is increasingly recognised for its cost-effectiveness, confidentiality, flexibility, and ability to preserve relationships. This session will explore how institutional mediation can be mainstreamed, the role of cross-institutional partnerships, lessons from global mediation practices, and the success of African models such as the Lagos Multi-Door Courthouse."
            panelists="Tat Tit Lim (Chair, IMI); Cai Weiping (Dennis); Oladimeji Ojo (World Bank); Achere Cole, FCIArb (LMDC)"
            moderator="Professor Steve Abayomi Bank-Ola"
          />
           <Row 
            time="10.45 – 12.15" 
            title="Plenary Session 6: ARBITRATION AND THE COURTS: ENHANCING DOMESTIC AND INTERNATIONAL ARBITRATION/ADR IN AFRICA"
            isPlenary={true}
            description="This essential session delves into the crucial and often complex interplay between arbitration and national courts as two key pillars for strengthening the continent’s appeal as a centre for trade and investment. The discussion will examine the court’s role throughout the arbitral process—from supporting interim relief and evidence gathering to the critical stage of enforcement and set-aside of awards."
            panelists="Hon. Justice Jumoke Pedro; Hon. Justice François Xavier Mbono (OHADA); Momoh Kadiri; CUI Jun"
            moderator="Nze Atulomah"
          />
           <Row 
            time="12.15 – 13.45" 
            title="Plenary Session 7: ETHICS, AND EVERYTHING IN-BETWEEN IN DOMESTIC, INTERNATIONAL ARBITRATION AND ADR"
            isPlenary={true}
            description="The legitimacy of arbitration rests on the integrity, independence, and ethical conduct of arbitrators and institutions. This session will explore the evolving duties of arbitrators, the distinction between judicial oversight and intervention, ethical challenges in both domestic and international arbitration, and the application of global standards, including the IBA Guidelines on Conflicts of Interest and UNCITRAL ethics frameworks."
            panelists="Hon. Justice Hadiza Shagari, JCA; Remi Gerbay; Jonathan Barnes; Caroline Etuk"
            moderator="Dr. Jude Theedeus Nnodum, Jnr."
          />
          <Row time="13.45 – 14.00" title="Closing Remarks" />
          <Row time="14.00 – 14.45" title="Lunch" isBreak={true} />
          <Row time="15.00 – 16.00" title="Annual General Meeting" />
        </tbody>
      </table>
    </div>
  );
};

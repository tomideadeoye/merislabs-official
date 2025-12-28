import React from 'react';

// --- Shared Components for the Table Layout ---

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
    {/* Time Column */}
    <td className="w-24 py-3 px-2 text-[10px] font-bold text-[#075302] border-r border-[#d9edd3] whitespace-nowrap">
      {time}
    </td>
    
    {/* Content Column */}
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
        {speaker && (
          <div className="italic">
            <span className="font-bold text-[#559203] not-italic mr-1">Speaker:</span> 
            {speaker}
          </div>
        )}
        {panelists && (
          <div className="italic">
             <span className="font-bold text-[#559203] not-italic mr-1">Panelists:</span> 
             {panelists}
          </div>
        )}
        {moderator && (
          <div className="italic">
             <span className="font-bold text-[#559203] not-italic mr-1">Moderator:</span> 
             {moderator}
          </div>
        )}
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

// --- Day 1 Part 1 (Morning) ---

export const Day1SchedulePart1 = () => {
  return (
    <div className="w-full border border-[#c5e1a5] shadow-sm">
      <TableHeader day="Day 1 (Morning)" date="27/11/2025" />
      <table className="w-full text-left border-collapse">
        <tbody>
          <Row time="07.30 – 09.00" title="Registration/Breakfast/Networking" isBreak={true} />
          <Row 
            time="09.00 – 09.05" 
            title="Welcome Address" 
            speaker="Chief Bolaji Ayorinde, OFR, SAN, FCArb – Chairman, Annual Conference Planning Committee" 
          />
          <Row 
            time="09.05 – 09.10" 
            title="Opening Remarks" 
            speaker="Professor Fabian Ajogwu, OFR, SAN, FCArb – President and Chairman, Nigerian Institute of Chartered Arbitrators (NICArb)" 
          />
          <Row 
            time="09.10 – 09.20" 
            title="Goodwill Message" 
            speaker="Wang Chengjie – Vice Chairman/Secretary General, China International Economic, Trade and Arbitration Commission (CIETAC)" 
          />
          <Row 
            time="09.20 – 09.30" 
            title="Goodwill Message" 
            speaker="Mazi Afam Osigwe, SAN, FCArb – President, Nigerian Bar Association" 
          />
          <Row 
            time="09.30 – 09.45" 
            title="Chief Host Welcome Address" 
            speaker="His Excellency, Mr. Babajide Olusola Sanwo-Olu – Executive Governor of Lagos State" 
          />
          <Row time="09.45 – 09.50" title="Photo Ups" />
          <Row 
            time="09.50 – 10.00" 
            title="Keynote Address" 
            speaker="Anna Joubin-Bret – Secretary General, United Nations Commission on International Trade Law" 
          />
          <Row 
            time="10.00 – 10.15" 
            title="Keynote Address" 
            speaker="Chief Lateef Olasunkanmi Fagbemi SAN – Honourable Minister of Justice and Attorney General of the Federation of Nigeria" 
          />
          <Row time="10.15 – 10.30" title="BREAK" isBreak={true} />
          
          <Row 
            time="10.30 – 12.00" 
            title="Plenary Session 1: STRENGTHENING INSTITUTIONAL ARBITRATION AND ADR IN AFRICA: CHARTING A NEW PATH"
            isPlenary={true}
            description="African countries are increasingly reforming their arbitration frameworks; however, institutional arbitration still faces challenges related to credibility, consistency, and user confidence. This session will explore how arbitral institutions across the continent can transition from ad hoc practices to structured, reliable systems that meet international benchmarks. Panellists will examine the role of courts in supporting arbitral processes, the importance of judicial consistency, and the need for governments to adopt policies that enable effective dispute resolution. The discussion will also consider lessons from OHADA, UNCITRAL, and the New York Convention, highlighting how African arbitration centres can become competitive destinations for both domestic and cross-border disputes."
            panelists="Hon. Justice Aisha Mohammed Usman (Chief Judge, Nasarawa State); Professor Bankole Sodipo, SAN, FCArb; James Clanchy (Commercial Arbitrator, London); Ishaka Mudi Dikko, SAN"
            moderator="Professor Ike Ehiribe (International Arbitrator and Dispute Resolver)"
          />
        </tbody>
      </table>
    </div>
  );
};

// --- Day 1 Part 2 (Afternoon) ---

export const Day1SchedulePart2 = () => {
  return (
    <div className="w-full border border-[#c5e1a5] shadow-sm">
      <TableHeader day="Day 1 (Afternoon)" date="27/11/2025" />
      <table className="w-full text-left border-collapse">
        <tbody>
          <Row 
            time="12.00 – 13.30" 
            title="Plenary Session 2: EFFECTIVE MANAGEMENT AND RESOLUTION OF DISPUTES IN THE ENERGY, OIL & GAS SECTORS"
            isPlenary={true}
            description="The energy and oil & gas industries are central to Africa’s economic development, but they also generate some of the most complex and high-value disputes. Contractual breaches, regulatory changes, environmental claims, community tensions, and cross-border investments often create conflicts requiring swift and specialised resolution. This session explores how arbitration and ADR can be utilised to manage these disputes effectively, reduce project disruption, enhance investor confidence, and support long-term sectoral stability. Panellists will also examine environmental compliance, the role of national institutions, and strategies for strengthening public trust in arbitration outcomes within the energy sector."
            panelists="Prof. Yinka Omorogbe, SAN (Lead Speaker); Engr. Dr. Felicia Agubata, FNSE; Dr. Joseph Tolorunse (NMDPRA); Ngozi Ekeoma, Esq"
            moderator="Dr. Erimma Gloria Orie, FCArb"
          />
          <Row 
            time="13.30 – 13.35" 
            title="The PR of Private Justice: How Media Narratives Shape Public Acceptance of Arbitration as a Dispute Resolution Tool"
            speaker="Rosemary Egabor-Afolahan, Director of Commercial & Communications, News Central"
          />
          <Row time="13.35 – 14.30" title="LUNCH" isBreak={true} />
          
          <Row 
            time="14.30 – 16.00" 
            title="Plenary Session 3: CONSTRUCTION AND INFRASTRUCTURE INVESTMENT DISPUTES: ANALYSING INFRASTRUCTURE ARBITRATION IN AFRICA"
            isPlenary={true}
            description="Infrastructure remains central to Africa’s economic growth and regional connectivity, yet it is also one of the most dispute-prone sectors. Issues such as delayed payments, contractual breaches, project financing challenges, regulatory inconsistencies, political risk, and investor-state disagreements frequently give rise to high-stakes disputes. Arbitration and ADR have increasingly been adopted across the continent to address these disputes, but significant gaps still exist in institutional capacity, enforcement mechanisms, cost-effectiveness, and access to technical expertise. This session will evaluate the progress made so far and identify practical reforms required to strengthen infrastructure arbitration in Africa, drawing lessons from global and regional experiences."
            panelists="Ahmed Abdel Hakam; Kola Awodein, SAN, FICIArb, FCTI; Virginie Colaiuta; Mark Hammick; Ngo-Martins Okonmah"
            moderator="Winnifred Olanipekun, MCArb"
          />
           <Row 
            time="16.00 – 17.30" 
            title="Plenary Session 4: CROSS-BORDER LENDING AND DEBT RECOVERY: INSTITUTIONAL ARBITRATION IN BANKING, FINANCE, AND FINTECH DISPUTES"
            isPlenary={true}
            description="The expansion of cross-border lending, digital finance, and fintech innovations across Africa has increased economic opportunities but has also resulted in complex disputes involving debt recovery, syndicated loans, sovereign guarantees, insolvency, and regulatory breaches. Traditional court processes are often slow and jurisdictionally restrictive, making arbitration a preferred mechanism due to its neutrality, flexibility, and enforceability under instruments such as the New York Convention. This session will explore how Africa can strengthen its institutional arbitration capacity in the financial and fintech sectors, retain disputes within the continent, build investor confidence, and reduce reliance on foreign jurisdictions for financial dispute resolution."
            panelists="Nosakhare Aguebor (AFC); Adekunle Olaofe (Flutterwave); Jackwell Feris; Michael Otu (Zenith Bank)"
            moderator="Taiwo Ogbara, MCArb"
          />
          <Row time="17.30 – 19.30" title="Welcome Reception" isBreak={true} />
        </tbody>
      </table>
    </div>
  );
};

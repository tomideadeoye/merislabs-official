import React from 'react';
import { Page } from './Page';
import { Nicarb2025ConferenceFooter } from './ui/footer';

const OpeningRemarksPage: React.FC = () => {
  return (
    <Page className="p-8">
      <div className="flex-1 text-justify text-gray-700 text-[12.5px] leading-snug">
        <div className="float-right w-32 h-40 ml-6 mb-2 bg-gray-200 rounded-xl overflow-hidden">
          <img
            src="/nicarb/attendee-images/fabian ajogwu.jpeg"
            alt="Professor Fabian Ajogwu"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mb-4 text-right">
          <h2 className="text-2xl font-bold text-[#064802] mb-1">Opening Remarks</h2>
          <h3 className="text-lg font-semibold text-[#559203] leading-tight">Professor Fabian Ajogwu, OFR, SAN</h3>
          <p className="text-gray-500 text-xs uppercase tracking-wide">President/Chairman, NICArb</p>
        </div>

        <p className="font-medium text-[#075302] mb-2">
          Distinguished colleagues, learned friends, partners in justice, members of the arbitral community, ladies and gentlemen.
        </p>
        <p className="mb-2">
          It is an honour to welcome you to this year's Annual Conference of the Nigerian Institute of Chartered Arbitrators.
        </p>
        <p className="mb-2">
          We gather today under the banner of an idea that is not only relevant, but must also now be sustained: the idea that Africa can, and must, take ownership of its destiny in dispute resolution.
        </p>
        <p className="mb-2">
          The theme of this year's conference, <span className="italic font-semibold">"Strengthening Institutional Arbitration and ADR in Africa: Charting a New Path,"</span> is not only aspirational. It is both a challenge and a charge. For decades, arbitration and other ADR methods have been the quiet architecture of global commerce, due to their efficiency, privacy, enforceability, and grounding in party autonomy. Yet, for us in Africa, the next frontier is no longer the mere adoption of arbitration and ADR, but the strengthening of our institutions.
        </p>
        <p className="mb-2">
          Strong arbitration does not emerge by chance; it is built. It is built on the foundation of trust, forged through consistency, and sustained by principle. It requires institutions that are independent of personal influence, legislation that is clear and coherent, and judiciaries that understand their vital role not as adversaries but as allies and partners in the arbitral process.
        </p>
        <p className="mb-2">
          Across Africa, progress, though gradual, is visible, from Kigali to Cairo, from Lagos to Nairobi, and from Abidjan to Johannesburg, yet fragmentation persists. The challenge lies in the fact that we have too often built mechanisms without ecosystems, rules without culture, and institutions without the predictable governance that commands global confidence.
        </p>
        <p className="mb-2">
          If institutional arbitration and ADR in Africa must flourish, we must address five imperatives:
        </p>
        <div className="bg-[#f0f7ee] p-3 rounded-lg border-l-4 border-[#2dc27a] my-3 text-xs">
          <ul className="space-y-1">
            <li><strong>1. Institutional Credibility:</strong> Arbitral centres must be insulated from political or personal influence, and governance must inspire confidence at home and abroad.</li>
            <li><strong>2. Judicial Partnership:</strong> Our courts must reinforce, not re-litigate, the arbitral process. The finality of awards and settlement agreements is the foundation of their legitimacy.</li>
            <li><strong>3. Ethical Standards:</strong> The integrity of arbitrators, mediators and administrators is the invisible currency of our system, and without it, even the best statutes will fail.</li>
            <li><strong>4. Capacity and Inclusion:</strong> The next generation of African arbitrators and ADR practitioners, our young professionals, women practitioners, and regional experts, must be empowered to lead.</li>
            <li><strong>5. Continental Cooperation:</strong> We must connect African arbitral and ADR institutions through collaboration, shared standards, and digital innovation that transcends borders.</li>
          </ul>
        </div>
        <p className="mb-2">
          Africa does not lack expertise; what it seeks is coherence. We must therefore move from fragmented excellence to institutional cohesion. Arbitration and ADR should not be viewed as an elite instrument of private justice, but rather as a pillar of economic governance, one that is central to investor confidence, trade stability, and the rule of law.
        </p>
        <p className="mb-2">
          As we chart a new path, let three truths guide us: That the strength of any arbitral system lies in the trust it commands; That the independence of arbitral institutions is a national asset; and That the measure of true reform is not by the number of conferences we hold, but by the predictability and confidence we deliver.
        </p>
        <p className="mb-2">
          Colleagues, Africa's future in dispute resolution cannot be outsourced. It must be built by us, through us, and for us. When parties across continents choose to arbitrate in Kigali, Cairo, Abidjan, Cameroun, Johannesburg, Lagos, Accra or any part of Africa, not out of proximity, but out of confidence and credibility, then we will know that we have succeeded.
        </p>
        <p className="mb-2">
          Let this Conference be a reminder that arbitration is not just a process; it is a promise, a promise of fairness, of efficiency, and of justice that endures beyond jurisdiction.
        </p>
        <p className="mb-2">
          May our deliberations over the next two days deepen that promise and strengthen the institutions that will uphold it.
        </p>
        <p className="font-bold mt-2">Thank you.</p>
      </div>
      <Nicarb2025ConferenceFooter pageNumber="13" />
    </Page>
  );
};

export default OpeningRemarksPage;

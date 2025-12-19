import React from 'react';
import { Page } from './Page';
import { Nicarb2025ConferenceFooter } from './ui/footer';

const WelcomeAddressPage: React.FC = () => {
  return (
    <Page className="p-8">
      <div className="flex-1 text-justify text-gray-700 text-[14.5px] leading-snug">
        <div className="float-left w-32 h-40 mr-6 mb-2 bg-gray-200 rounded-xl overflow-hidden">
          <img
            src="/nicarb/attendee-images/Bolaji-Ayorinde-SAN-1200x725.jpg"
            alt="Chief Bolaji Ayorinde"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-[#064802] mb-1">Welcome Address</h2>
          <h3 className="text-lg font-semibold text-[#559203] leading-tight">Chief Bolaji Ayorinde, OFR, SAN, FCArb</h3>
          <p className="text-gray-500 text-xs uppercase tracking-wide">Chairman, 2025 Annual Conference Planning Committee</p>
        </div>

        <p className="font-medium text-[#075302] mb-2">
          Distinguished Guests, Esteemed Colleagues, and Honourable Delegates,
        </p>
        <p className="mb-2">
          It is a profound honour to welcome you to this year's conference, held under the compelling theme:
          <span className="font-semibold text-[#559203]"> "Strengthening Institutional Arbitration and ADR in Africa: Charting a New Path."</span>
          Today, we gather not only as professionals, but as custodians of justice, architects of peace, and visionaries committed to shaping a more prosperous Africa.
        </p>
        <p className="mb-2">
          Across our continent, the importance of effective dispute resolution cannot be overstated. It is the quiet engine that fuels economic growth, sustains stability, and builds trust in our institutions. As Africa accelerates toward deeper integration with the global economy, the demand for credible, efficient, and forward-looking mechanisms for resolving disputes becomes ever more urgent.
        </p>
        <p className="mb-2">
          The Nigerian Institute of Chartered Arbitrators (NICArb), founded in 1979, stands at the heart of this transformation. For over four decades, NICArb has remained a beacon of excellence—championing the domestication, advancement, and practical application of arbitration and alternative dispute resolution in Nigeria.
        </p>
        <p className="mb-2">
          With a thriving membership of more than 7,000 professionals drawn from diverse disciplines, NICArb's reach extends far beyond our borders. Our members proudly represent us across Africa and around the world—from Cameroon to Canada, from the United Kingdom to Tanzania, Liberia, Sierra Leone, Côte d'Ivoire, Ghana, Japan, and the United States. This global footprint reflects not only our growth, but the rising confidence in Africa's capacity to lead in the fields of arbitration and ADR.
        </p>
        <p className="mb-2">
          Through world-class training, forward-thinking policies, and dependable dispute resolution services, NICArb continues to strengthen our justice ecosystem. Our work alleviates the burden on the courts, supports economic productivity, and promotes harmony within society.
        </p>
        <p className="mb-2">
          This year's conference invites us to envision the future of dispute resolution in Africa. It calls us to deepen our collaboration, embrace innovation, and build institutions that can stand with confidence on the global stage. Over the next few days, we will explore critical themes—from institutional strengthening and the power of technology to the importance of developing the next generation of ADR practitioners.
        </p>
        <p className="mb-2">
          I warmly invite you to join NICArb, to become part of a community dedicated to advancing justice through dialogue, expertise, and integrity. Together, we can forge a more effective, inclusive, and resilient dispute resolution landscape—one that nurtures prosperity and enables Africa to realise its boundless potential.
        </p>
        <p className="mb-2">
          To our valued partners and delegates, we extend our heartfelt gratitude. Your unwavering support, commitment, and belief in our vision have played an immeasurable role in our journey and in the success of this conference. Thank you for your dedication to NICArb, and for your continued partnership in the mission to build a stronger, more peaceful, and more prosperous Africa.
        </p>
      </div>
      <Nicarb2025ConferenceFooter pageNumber="12" />
    </Page>
  );
};

export default WelcomeAddressPage;

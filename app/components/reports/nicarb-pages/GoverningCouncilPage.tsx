import React from 'react';
import { Page } from './Page';
import { Nicarb2025ConferenceFooter } from '@/reports/nicarb-pages/ui/footer';

const CouncilMember = ({ name, title, imageSrc, imageScale, imagePosition }: {
  name: string;
  title: string;
  imageSrc?: string;
  imageScale?: number;
  imagePosition?: string;
}) => (
  <div className="flex flex-col items-center max-w-[100px] mx-auto">
    {/* Image area with green border and corner accent */}
    <div className="w-full aspect-[4/5] relative overflow-visible border-3 border-[#3d8f02] bg-white">
      {/* Decorative L-shaped corner accent */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-3 border-l-3 border-[#559203]"></div>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover object-center"
          style={imageScale ? {
            transform: `scale(${imageScale})`,
            transformOrigin: imagePosition || 'center center'
          } : {}}
        />
      ) : (
        <div className="w-full h-full bg-[#f0f7ee]/30 flex items-center justify-center">
          <span className="text-xs text-[#7cb342] font-bold uppercase">No Image</span>
        </div>
      )}
    </div>
    {/* Text area - outside the bordered box */}
    <div className="mt-0.5 flex flex-col items-center text-center w-full min-h-[28px]">
      <h3 className="font-bold text-[6.5px] leading-tight mb-0.5 text-[#559203]">{name}</h3>
      {title && <p className="text-[5.5px] leading-tight text-gray-600 uppercase tracking-wide font-medium">{title}</p>}
    </div>
  </div>
);

const GoverningCouncilPage: React.FC = () => {

  return (
    <Page className="p-4 flex flex-col">
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-bold text-center mb-1 text-[#064802] font-serif border-b-4 border-[#2dc27a] pb-2 inline-block w-full">
          Governing Council Members
        </h2>
        <p className="text-center text-[#3d8f02] font-medium uppercase tracking-widest text-xs mb-3">
          The Nigerian Institute of Chartered Arbitrators
        </p>

        {/* Single Image Content */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/nicarb/governing1.png"
            alt="Governing Council Members"
            className="w-full h-auto object-contain rounded-3xl border border-gray-200"
          />
        </div>
      </div>
      <Nicarb2025ConferenceFooter pageNumber="08" />
    </Page>
  );
};

export default GoverningCouncilPage;

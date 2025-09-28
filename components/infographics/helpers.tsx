import React from 'react';

export const InfographicContainer: React.FC<{
	title: string;
	children: React.ReactNode;
	className?: string;
}> = ({ title, children, className = '', ...props }) => (
	<div className={`flex-col bg-white rounded-2xl shadow-lg p-1 mb-2 text-wrap items-center ${className}`} {...props}>
		<ChartHeader title={title}></ChartHeader>
		{children}
	</div>
);

export const ChartHeader: React.FC<{
  title: string;
}> = ({ title }) => (
  <div className="flex-col items-center my-4 text-center">
    <h3 className="text-lg font-bold text-[#3b82f6]">{title}</h3>
  </div>
);

export const KeyInsight: React.FC<{
  text: string;
}> = ({ text }) => (
  <div className="mt-10 p-4 bg-[#f0f8ff] border-l-4 border-[#3b82f6] rounded-r-lg w-full">
    <p className="text-xs text-[#002060] w-full">
      <strong className="font-bold">Key Insight:</strong> {text}
    </p>
  </div>
);

export const FlowStep: React.FC<{
  icon: React.ReactNode;
  title: string;
  text: string;
}> = ({ icon, title, text }) => (
  <div className="relative bg-white p-4 rounded-lg shadow-md w-64 text-center z-10">
    <div className="flex items-center justify-center gap-3">
      {icon}
      <h3 className="text-lg font-bold text-[#002060] m-0">{title}</h3>
    </div>
    <p className="text-sm text-slate-500 mt-2">{text}</p>
  </div>
);

export const Pillar: React.FC<{
  icon: React.ReactNode;
  title: string;
  items: string[];
}> = ({ icon, title, items }) => (
  <div>
    <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex justify-center items-center">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-[#002060] mt-4 mb-2">{title}</h3>
    <ul className="text-sm text-slate-500 space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

export const ChallengeBlock: React.FC<{
  icon: React.ReactNode;
  title: string;
  text: string;
  style?: React.CSSProperties;
}> = ({ icon, title, text, style }) => (
  <div
    className="relative w-4/5 p-4 bg-white border border-slate-200 rounded-lg shadow-md z-10"
    style={style}
  >
    <div className="flex items-center gap-4">
      <div className="text-[#002060]">{icon}</div>
      <div>
        <h3 className="font-bold text-lg text-[#002060]">{title}</h3>
        <p className="text-sm text-slate-500">{text}</p>
      </div>
    </div>
  </div>
);

export const Meter: React.FC<{
  title: string;
  level: number;
  levelText: string;
  color: string;
}> = ({ title, level, levelText, color }) => (
  <div className="text-center">
    <h3 className="text-xl font-bold text-[#002060] mb-4">{title}</h3>
    <div className="w-full h-64 bg-[#c4c1c1] rounded-full relative">
      <div
        className="absolute bottom-0 left-0 w-full rounded-full"
        style={{ height: `${level}%`, backgroundColor: color }}
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg text-center">
        {levelText}
      </div>
    </div>
  </div>
);
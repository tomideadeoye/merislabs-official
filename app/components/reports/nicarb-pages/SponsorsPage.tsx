import React from 'react';
import { Page } from './Page';
import { Nicarb2025ConferenceFooter } from './ui/footer';

export function SponsorsPage() {
	const partners = [
		{ name: "Zenith Bank", logo: "/nicarb/client-logo/Zenith-Bank-logo.png" },
		{ name: "Fidelity Bank", logo: "/nicarb/client-logo/Fidelity-Bank-Old-Logo-Brandessence.png" },
		{ name: "Bola Ajibola & Co.", logo: "/nicarb/client-logo/bola ajibola and co law firm.png" },
		{ name: "KENNA", logo: "/nicarb/client-logo/kenna partners logo.png" },
		{ name: "Alliance Law Firm", logo: "/nicarb/client-logo/alliance law firm.jpg" },
		{ name: "D. D. Dodo & Co.", logo: "/nicarb/client-logo/D. D. Dodo & Co..png" },
		{ name: "Nigeria Export Processing Zones Authority (NEPZA)", logo: "/nicarb/client-logo/nigeria export processing zones authority.webp" },
		{ name: "Dele Adesina LP", logo: "/nicarb/client-logo/Dele Adesina LP law firm.png" },
		{ name: "Nigerian Ports Authority (NPA)", logo: "/nicarb/client-logo/Nigerian Ports Authority.png" },
		{ name: "R.A. Lawal-Rabana & Co.", logo: "/nicarb/client-logo/R.A. Lawal-Rabana & Co.jpeg" },
		{ name: "O. A. Omonuwa (SAN) & Co.", logo: "/nicarb/client-logo/O. A. Omonuwa (SAN) & Co..png" },
		{ name: "Awomolo & Associates", logo: "/nicarb/client-logo/Awomolo & Associates.png" },
		{ name: "Chief Chris Uche (SAN) & Co", logo: "/nicarb/client-logo/Chief Chris Uche (SAN) & Co.png" },
		{ name: "SimmonsCooper Partners", logo: "/nicarb/client-logo/SimmonsCoopers Partners.png" },
		{ name: "Vantage Attorneys LP", logo: "/nicarb/client-logo/Vantage Attorneys LP.png" },
		{ name: "Esher & Makarios", logo: "/nicarb/client-logo/Esher & Makarios.png" },
		{ name: "Omoloju & Co.", logo: null },
		{ name: "Olanipekun & Co.", logo: "/nicarb/client-logo/Wole Olanipekun.png" },
		{ name: "Family Homes Funds", logo: "/nicarb/client-logo/Family Homes Funds (FHFL) .png" },
		{ name: "Jurislaw", logo: "/nicarb/client-logo/jurislaw.jpeg" },
		{ name: "KBC (Kegana Bakura Insurance Brokers Ltd)", logo: "/nicarb/client-logo/KBC (Kegana Bakura Insurance Brokers Ltd).png" },
		{ name: "F.O Oleghe Law Firm", logo: null },
		{ name: "DAC Legal Practitioners", logo: "/nicarb/client-logo/dac legal practitioners.png" },
		{ name: "Partner 1", logo: "/partner-logos/Screenshot 2025-11-25 at 05.34.49.png" },
		{ name: "Partner 2", logo: "/partner-logos/Screenshot 2025-11-25 at 05.38.51.png" },
		{ name: "Partner 3", logo: "/partner-logos/Screenshot 2025-11-25 at 05.40.44.png" },
		{ name: "Partner 4", logo: "/partner-logos/Screenshot 2025-11-25 at 05.40.51.png" },
		{ name: "Partner 5", logo: "/partner-logos/Screenshot 2025-11-25 at 05.43.12.png" },
		{ name: "Partner 6", logo: "/partner-logos/Screenshot 2025-11-25 at 05.08.34.png" },
	];

	const mediaPartners = [
		{ name: "News Central", logo: "/nicarb/media partners logos/news-central.png" },
		{ name: "AIT News", logo: "/nicarb/media partners logos/AIT_News_Logo.jpg" },
		{ name: "BusinessDay", logo: "/nicarb/media partners logos/BusinessDay-Media-Limited.png" },
		{ name: "Channels TV", logo: "/nicarb/media partners logos/Channels_TV.jpg" },
		{ name: "Daily Trust", logo: "/nicarb/media partners logos/Daily-Trust-Logo-scaled-1.jpeg" },
		{ name: "TVC News", logo: "/nicarb/media partners logos/New-TVC.jpg" },
		{ name: "Punch", logo: "/nicarb/media partners logos/Punch_logo.svg.png" },

		{ name: "Media Partner 2", logo: "/nicarb/media partners logos/Screenshot 2025-11-25 at 05.10.21.png" },
		{ name: "Media Partner 3", logo: "/nicarb/media partners logos/Screenshot 2025-11-25 at 05.11.37.png" },
		{ name: "Media Partner 4", logo: "/nicarb/media partners logos/Screenshot 2025-11-25 at 05.12.44.png" },
		{ name: "Media Partner 5", logo: "/nicarb/media partners logos/Screenshot 2025-11-25 at 05.14.50.png" },
		{ name: "Media Partner 6", logo: "/nicarb/media partners logos/Screenshot 2025-11-25 at 05.16.42.png" },
		{ name: "Media Partner 7", logo: "/nicarb/media partners logos/Screenshot 2025-11-25 at 05.17.32.png" },
		{ name: "Media Partner 8", logo: "/nicarb/media partners logos/images (1).jpeg" },
		{ name: "Media Partner 9", logo: "/nicarb/media partners logos/images.jpeg" },
	];

	const supportingOrganisations = [
		{ name: "IMI", logo: "/nicarb/supporting organisations/IMI-Full-logo-with-name1.jpeg" },
		{ name: "UNCITRAL", logo: "/nicarb/supporting organisations/LOGO UNCITRAL 09-82218_logo_E_blue.png" },
		{ name: "CIETAC", logo: "/nicarb/supporting organisations/cietac.png" },
		{ name: "Supporting Organisation 4", logo: "/nicarb/supporting organisations/Screenshot 2025-11-25 at 05.24.11.png" },
		{ name: "Supporting Organisation 5", logo: "/nicarb/supporting organisations/Screenshot 2025-11-25 at 05.30.02.png" },
	];

	return (
		<>
			{/* Page 25: BA Law L.L.P. */}
			<Page className="bg-white p-12 flex flex-col">
				<div className="flex-1 flex flex-col justify-center">
					<h2 className="text-3xl font-bold text-center mb-12 text-[#064802] font-serif border-b-4 border-[#2dc27a] pb-4 inline-block mx-auto">
						SPONSORS & PARTNERS
					</h2>

					{/* BA Law L.L.P. */}
					<div className="bg-[#f0f7ee] p-10 rounded-xl border border-[#d9edd3] flex-1 flex flex-col justify-center">
						<div className="flex flex-col items-center mb-8">
							<div className="w-64 h-auto bg-white border border-gray-200 flex items-center justify-center mb-6 p-4 rounded-lg">
								<img
									src="/nicarb/BA Law L.L.P.jpeg"
									alt="BA Law L.L.P. Logo"
									className="w-full h-auto object-contain"
								/>
							</div>
							<a
								href="http://www.ba-law.org"
								className="text-[#3d8f02] font-bold text-xl hover:underline"
							>
								www.ba-law.org
							</a>
						</div>

						<div className="text-justify text-base leading-loose text-gray-800 max-w-3xl mx-auto">
							<p className="mb-6 font-bold text-[#064802] text-lg text-center">
								The BA Law L.L.P. family felicitates with the Nigerian Institute
								of Chartered Arbitrators on the occasion of its 2025 Annual
								Conference.
							</p>
							<p className="mb-6">
								This year’s theme, “Strengthening Institutional Arbitration in
								Africa: Charting a New Path,” aptly underscores the essential
								role of strong arbitration institutions in fostering economic
								growth and improving the justice delivery system. The emphasis
								on redefining and advancing institutional arbitration in West
								Africa is both timely and critical to the continued development
								of the arbitration and ADR landscape.
							</p>
							<p className="font-bold text-[#075302] text-center text-lg">
								We extend our best wishes for insightful and impactful
								deliberations throughout the conference.
							</p>
						</div>
					</div>
				</div>
				<Nicarb2025ConferenceFooter pageNumber="25" />
			</Page>

			{/* Page 26: OLUJINMI & AKEREDOLU */}
			<Page className="bg-white p-12 flex flex-col">
				<div className="flex-1 flex flex-col justify-center">
					{/* OLUJINMI & AKEREDOLU */}
					<div className="bg-white p-10 rounded-xl border-4 border-[#064802] flex-1 flex flex-col justify-center">
						<div className="flex flex-col items-center mb-10">
							<div className="w-80 h-auto bg-white flex items-center justify-center mb-6">
								<img
									src="/nicarb/OLUJINMI & AKEREDOLU law.png"
									alt="OLUJINMI & AKEREDOLU Logo"
									className="w-full h-auto object-contain"
								/>
							</div>
							<h3 className="font-bold text-[#064802] text-2xl leading-tight mb-2">
								OLUJINMI & AKEREDOLU
							</h3>
							<p className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">
								Legal Practitioners & Notaries Public
							</p>
						</div>

						<div className="text-center max-w-3xl mx-auto mb-10">
							<p className="font-serif italic text-2xl text-[#075302] leading-relaxed">
								&quot;Wishing all the delegates an inspirational and uplifting
								conference.&quot;
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm max-w-4xl mx-auto w-full mb-10">
							<div className="text-center md:text-right border-r-0 md:border-r border-gray-200 pr-0 md:pr-10">
								<h4 className="font-bold text-[#064802] mb-2 text-lg">
									ABUJA ADDRESS:
								</h4>
								<p className="text-gray-700 leading-relaxed">
									41, Femi Gbajabiamila Crescent,
									<br />
									Jahi District, Abuja
								</p>
							</div>
							<div className="text-center md:text-left pl-0 md:pl-10">
								<h4 className="font-bold text-[#064802] mb-2 text-lg">
									IBADAN ADDRESS:
								</h4>
								<p className="text-gray-700 leading-relaxed">
									9, Ring Road, G. P. O Box 1816,
									<br />
									Ibadan
								</p>
							</div>
						</div>

						<div className="pt-8 border-t border-gray-200 flex flex-row justify-between text-sm text-gray-600 font-medium max-w-4xl mx-auto w-full">
							<p>
								<strong>Tel:</strong> 0700-0000-625, 08032715724
							</p>
							<p>
								<strong>Email:</strong> oolujinmi@oandalegal.com
							</p>
							<p>
								<strong>Website:</strong>{" "}
								<a
									href="http://www.oandalegal.com"
									className="text-[#3d8f02] hover:underline"
								>
									www.oandalegal.com
								</a>
							</p>
						</div>
					</div>
				</div>
				<Nicarb2025ConferenceFooter pageNumber="26" />
			</Page>

			{/* Page 27: KENNA Congratulatory Message */}
			<Page className="!bg-[#001f3f] p-12 flex flex-col relative overflow-hidden">
				{/* Watermark/Graphic - Bottom Left */}
				<div className="absolute bottom-[-100px] left-[-100px] opacity-5 pointer-events-none">
					<svg width="400" height="400" viewBox="0 0 100 100" fill="white">
						<path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
					</svg>
				</div>

				{/* Faint Watermark behind text */}
				<div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
					<img
						src="/nicarb/client-logo/kenna partners logo.png"
						className="w-[80%] h-auto grayscale"
					/>
				</div>

				<div className="flex-1 flex flex-col items-center justify-center text-center z-10 relative">
					{/* Logo */}
					<div className="mb-16 w-48">
						<img
							src="/nicarb/client-logo/kenna partners logo.png"
							alt="KENNA Logo"
							className="w-full h-auto brightness-0 invert"
						/>
					</div>

					{/* Content */}
					<div className="max-w-3xl space-y-8 font-serif">
						<p className="text-white text-2xl leading-relaxed">
							KENNA congratulates the President, Fellows, and Members of the
							Nigerian Institute of Chartered Arbitrators (NICArb)
						</p>

						<p className="text-white text-xl italic">on its</p>

						<p className="text-cyan-300 text-3xl font-bold">
							46th Annual Conference, 2025.
						</p>

						<p className="text-white text-xl">With the theme,</p>

						<p className="text-cyan-300 text-3xl font-bold leading-normal">
							“Strengthening Institutional Arbitration and ADR in Africa:
							Charting a New Path.”
						</p>

						<p className="text-white text-xl leading-relaxed pt-4">
							We wish you a successful event filled with insightful
							deliberations that elevate arbitration practice.
						</p>

						<div className="pt-12">
							<p className="text-white text-xl">
								<span className="italic">Signed:</span>{" "}
								<span className="font-bold">Management, KENNA</span>
							</p>
						</div>
					</div>
				</div>
				<Nicarb2025ConferenceFooter pageNumber="27" />
			</Page>

			{/* Page 28: Other Sponsors & Partners */}
			<Page className="bg-white p-8 flex flex-col">
				<div className="flex-1">
					<div className="flex justify-center mb-12">
						<h2 className="text-3xl font-bold text-center text-[#064802] font-serif border-b-4 border-[#2dc27a] pb-4">
							OUR ESTEEMED PARTNERS
						</h2>
					</div>

					<div className="w-full flex justify-center mb-8">
						<img
							src="/nicarb/partner-logos/sponsors-nicarb.png"
							alt="Our Esteemed Partners"
							className="w-full h-auto object-contain"
						/>
					</div>
				</div>
				<Nicarb2025ConferenceFooter pageNumber="28" />
			</Page>

			{/* Page 29: Media Partners & Supporting Organisations */}
			<Page className="bg-white p-6 flex flex-col">
				<div className="flex-1">
					<h2 className="text-2xl font-bold text-center mb-4 text-[#064802] font-serif border-b-4 border-[#2dc27a] pb-2 inline-block w-full">
						Supporting Organisations
					</h2>
					<div className="flex flex-wrap justify-center items-center gap-3 mb-8">
						{supportingOrganisations.map((partner, i) => (
							<div
								key={i}
								className="w-48 aspect-[3/2] bg-white rounded-xl flex items-center justify-center p-2"
							>
								<img
									src={partner.logo}
									alt={partner.name}
									className="max-w-full max-h-full object-contain"
								/>
							</div>
						))}
					</div>

					<h2 className="text-2xl font-bold text-center mb-4 text-[#064802] font-serif border-b-4 border-[#2dc27a] pb-2 inline-block w-full">
						Media Partners
					</h2>
					<div className="flex flex-wrap justify-center items-center gap-3">
						{mediaPartners.map((partner, i) => {
							const isNewsCentral = partner.name === "News Central";
							return (
								<React.Fragment key={i}>
									<div
										className={`${isNewsCentral ? "w-[38%]" : "w-[18%]"
											} aspect-[3/2] bg-white rounded-xl flex items-center justify-center p-2`}
									>
										<img
											src={partner.logo}
											alt={partner.name}
											className="max-w-full max-h-full object-contain"
										/>
									</div>
									{i === 12 && <div className="w-full h-0" />}
								</React.Fragment>
							);
						})}
					</div>
				</div>
				<Nicarb2025ConferenceFooter pageNumber="29" />
			</Page>
		</>
	);
}

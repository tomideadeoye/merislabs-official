'use client';

import React from 'react';
import { Day1SchedulePart1, Day1SchedulePart2 } from './schedule/day1';
import { Day2Schedule } from './schedule/day2';
import { attendeeProfiles } from '@/data/nicarb/attendees';
import { Page } from './Page';
import { CoverPage } from './CoverPage';
import { Nicarb2025ConferenceFooter } from '@/reports/nicarb-pages/ui/footer';
import WelcomeAddressPage from './WelcomeAddressPage';
import GoverningCouncilPage from './GoverningCouncilPage';
import OpeningRemarksPage from './OpeningRemarksPage';
import { PlanningCommitteePage } from './PlanningCommitteePage';
import { SponsorsPage } from './SponsorsPage';
import { StateBranchesPage } from './StateChaptersPage';
import { StateBranchesContactPage } from './StateBranchesContactPage';

export function ConferenceBrochure() {



	const PortraitPage = ({
		imageSrc,
		name,
		title,
		pageNumber,
		honorific = "His Excellency",
		suffix = ""
	}: {
		imageSrc: string;
		name: string;
		title: React.ReactNode;
		pageNumber: string;
		honorific?: string;
		suffix?: string;
	}) => (
		<Page className="bg-white overflow-hidden border-t-8 border-b-8 border-[#064802]">
			<div className="flex-1 flex flex-col items-center justify-center p-12 relative">
				{/* Background Flags Effect (Subtle) */}
				<div className="absolute inset-0 z-0 opacity-5">
					<div className="absolute inset-0 bg-gradient-to-r from-green-800 via-white to-green-800"></div>
				</div>

				{/* Portrait Section - Option B: Architectural Offset */}
				<div className="relative z-10 mb-12">
					<div className="relative w-[350px] h-[450px] border-16 border-t-[#7cb342] border-l-[#7cb342] border-b-[#2e7d32] border-r-[#2e7d32]">
						{/* Image */}
						<img
							src={imageSrc}
							alt={name}
							className="w-full h-full object-cover object-top border-2 border-white"
						/>
					</div>
				</div>

				{/* Text Information */}
				<div className="relative z-10 w-full max-w-3xl">
					<div className="bg-[#558b2f] text-white py-8 px-10 rounded-lg border-b-4 border-[#7cb342] text-center">
						{honorific && <p className="text-sm uppercase tracking-[0.3em] text-white/90 mb-3 font-medium">{honorific}</p>}
						<h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 tracking-wide text-white">
							{name} {suffix && <span className="text-xl align-top text-[#aed581] ml-2">{suffix}</span>}
						</h2>
						<div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto my-4"></div>
						<div className="text-base md:text-lg font-medium uppercase tracking-widest leading-relaxed text-white">
							{title}
						</div>
					</div>
				</div>
			</div>
			<Nicarb2025ConferenceFooter pageNumber={pageNumber} />
		</Page>
	);

	const SinglePageProfile = ({
		imageSrc,
		name,
		title,
		bio,
		pageNumber,
		honorific = "Keynote Speaker",
		suffix = ""
	}: {
		imageSrc: string;
		name: string;
		title: React.ReactNode;
		bio: React.ReactNode;
		pageNumber: string;
		honorific?: string;
		suffix?: string;
	}) => {
		return (
			<Page className="bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden border-t-8 border-b-8 border-[#064802] flex flex-col h-full relative">
				{/* Subtle Background Texture */}
				<div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
					<div className="absolute inset-0" style={{
						backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)`
					}}></div>
				</div>

				{/* Main Content Container */}
				<div className="flex-1 flex relative p-6">

					{/* LEFT SIDE: Curved Geometric Element + Circular Portrait */}
					<div className="absolute left-0 top-0 h-full w-[38%] overflow-visible">
						{/* Curved Background Arc - PURE GREEN GRADIENT ONLY */}
						<div
							className="absolute inset-0 bg-gradient-to-br from-[#559203] via-[#2dc27a] to-[#559203] opacity-92"
							style={{
								clipPath: 'ellipse(95% 100% at 0% 50%)',
								transform: 'translateX(-20px)',
							}}
						/>

						{/* Decorative Pattern Overlay */}
						<div className="absolute inset-0 opacity-10" style={{
							backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`
						}}></div>

						{/* Circular Portrait Container - Positioned to avoid text overlap */}
						<div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 z-10">
							<div className="relative w-72 h-72">
								{/* White circular border */}
								<div className="absolute inset-0 rounded-full bg-white p-2.5 ring-2 ring-[#d9edd3]/50">
									<div className="w-full h-full rounded-full overflow-hidden border-[5px] border-[#d9edd3] relative">
										<img
											src={imageSrc}
											alt={name}
											className="w-full h-full object-cover object-top"
										/>
										{/* Subtle inner glow */}
										<div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20"></div>
									</div>
								</div>
							</div>

							{/* Label Overlay - Positioned below the image */}
							<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#064802] to-[#075302] px-4 py-2 rounded-lg border border-[#7cb342]/30 z-30 whitespace-nowrap">
								<span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">
									{honorific}
								</span>
							</div>
						</div>
					</div>

					{/* RIGHT SIDE: Text Content - NO OVERLAP */}
					<div className="ml-[40%] flex flex-col justify-center flex-1 pr-4 relative z-20">
						{/* Name with Text Shadow */}
						<h2 className="text-[2.5rem] font-bold text-[#064802] mb-2 font-serif leading-tight" style={{
							textShadow: '0 2px 4px rgba(0,0,0,0.05)'
						}}>
							{name}
							{suffix && <span className="text-xl text-[#559203] ml-2">{suffix}</span>}
						</h2>

						{/* Decorative Line - PURE GREEN GRADIENT */}
						<div className="w-20 h-1 bg-gradient-to-r from-[#3d8f02] via-[#2dc27a] to-[#2dc27a] mb-3 rounded-full"></div>

						{/* Title with Compact Spacing */}
						<div className="text-sm text-[#559203] font-semibold mb-4 uppercase tracking-wide leading-snug">
							{title}
						</div>

						{/* Biography - LARGER TEXT, NO SCROLLING */}
						<div className="text-gray-700 text-[12px] leading-[1.7] text-justify bio-content">
							<style jsx>{`
                        .bio-content :global(p:first-child)::first-letter {
                            font-size: 3.5rem;
                            font-weight: bold;
                            float: left;
                            line-height: 0.75;
                            margin: 0.05em 0.1em 0 0;
                            color: #064802;
                            font-family: serif;
                            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .bio-content :global(p) {
                            margin-bottom: 0.5rem;
                        }
                        /* Print optimization */
                        @media print {
                            .bio-content {
                                page-break-inside: avoid;
                            }
                        }
                    `}</style>
							{bio}
						</div>
					</div>
				</div>

				<Nicarb2025ConferenceFooter pageNumber={pageNumber} />
			</Page>
		);
	};


	const SessionPage = ({
		number,
		title,
		panelists,
		moderator,
		pageNumber
	}: {
		number: string;
		title: string;
		panelists: { name: string; bio: string; imageSrc: string; isModerator?: boolean; isSpeaker?: boolean; wrapText?: boolean }[];
		moderator?: { name: string; bio: string; imageSrc: string };
		pageNumber: string;
	}) => (
		<Page className="p-8">
			<div className="border-b-4 border-[#2dc27a] mb-8 pb-2">
				<h1 className="text-xl font-bold text-[#064802] font-serif leading-tight">
					<span className="text-lg font-bold text-[#a9ce46] uppercase tracking-widest">Plenary Session {number}:</span> {title}
				</h1>
			</div>

			<div className="grid grid-cols-2 gap-x-6 gap-y-8">
				{panelists.map((p, i) => (
					<div key={i} className={`${p.isModerator ? 'bg-[#f0f7ee] p-4 rounded-lg border border-[#d9edd3]' : ''} ${p.wrapText ? '' : 'flex gap-4 items-start'}`}>
						{p.wrapText ? (
							<>
								<img
									src={p.imageSrc}
									alt={p.name}
									className="w-24 h-32 float-left mr-3 mb-2 bg-gray-200 border border-[#c5e1a5] object-cover"
								/>
								<div className="flex items-center gap-2 mb-1">
									<h3 className="text-sm font-bold text-[#064802] leading-tight">{p.name}</h3>
									{p.isModerator && (
										<span className="px-2 py-0.5 bg-[#2dc27a] text-white text-[9px] font-bold uppercase tracking-wider rounded-sm">Moderator</span>
									)}
									{p.isSpeaker && (
										<span className="px-2 py-0.5 bg-[#2dc27a] text-white text-[9px] font-bold uppercase tracking-wider rounded-sm">Speaker</span>
									)}
								</div>
								<p className="text-xs text-gray-600 text-justify leading-snug">{p.bio}</p>
							</>
						) : (
							<>
								<div className="w-24 h-32 bg-gray-200 flex-shrink-0 border border-[#c5e1a5] overflow-hidden">
									<img src={p.imageSrc} alt={p.name} className="w-full h-full object-cover" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<h3 className="text-sm font-bold text-[#064802] leading-tight">{p.name}</h3>
										{p.isModerator && (
											<span className="px-2 py-0.5 bg-[#2dc27a] text-white text-[9px] font-bold uppercase tracking-wider rounded-sm">Moderator</span>
										)}
										{p.isSpeaker && (
											<span className="px-2 py-0.5 bg-[#2dc27a] text-white text-[9px] font-bold uppercase tracking-wider rounded-sm">Speaker</span>
										)}
									</div>
									<p className="text-xs text-gray-600 text-justify leading-snug">{p.bio}</p>
								</div>
							</>
						)}
					</div>
				))}
			</div>

			{moderator && !panelists.some(p => p.isModerator) && (
				<div className="mt-6 bg-[#f0f7ee] p-4 rounded-lg border border-[#d9edd3]">
					<div className="flex gap-4 items-start">
						<div className="w-24 h-32 bg-gray-200 flex-shrink-0 border border-[#c5e1a5] overflow-hidden">
							<img src={moderator.imageSrc} alt={moderator.name} className="w-full h-full object-cover" />
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<h3 className="text-sm font-bold text-[#064802]">{moderator.name}</h3>
								<span className="px-2 py-0.5 bg-[#2dc27a] text-white text-[9px] font-bold uppercase tracking-wider rounded-sm">Moderator</span>
							</div>
							<p className="text-xs text-gray-600 text-justify leading-snug">{moderator.bio}</p>
						</div>
					</div>
				</div>
			)}
			<Nicarb2025ConferenceFooter pageNumber={pageNumber} />
		</Page>
	);

	return (
		<div className="bg-gray-100 min-h-screen font-sans text-gray-900 py-8 print:py-0 print:bg-white relative">
			{/* Download/Print Button */}
			<button
				onClick={() => window.print()}
				className="fixed bottom-8 right-8 z-50 bg-[#064802] text-white px-6 py-3 rounded-full shadow-2xl hover:bg-[#559203] transition-all flex items-center gap-2 font-bold no-print border-2 border-[#a9ce46]"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="7 10 12 15 17 10" />
					<line x1="12" x2="12" y1="15" y2="3" />
				</svg>
				Download PDF
			</button>

			{/* Page 1: Cover Page */}
			<CoverPage />

			{/* Page 01: Presidential Portrait */}
			<PortraitPage
				imageSrc="/nicarb/attendee-images/Bola_Tinubu_portrait.jpg"
				name="BOLA AHMED TINUBU"
				suffix="GCFR"
				title={
					<>
						President, Commander-in-Chief of the Armed Forces
						<br />
						Federal Republic of Nigeria
					</>
				}
				pageNumber="01"
			/>

			{/* Page 02: Governor of Lagos State */}
			<PortraitPage
				imageSrc="/nicarb/Babajide-Sanwo-olu.jpg"
				name="MR BABAJIDE OLUSOLA SANWO-OLU"
				title="Governor of Lagos State"
				pageNumber="02"
			/>

			{/* Page 03: UNCITRAL Secretary General */}
			<SinglePageProfile
				imageSrc="/nicarb/attendee-images/ANNA_JOUBIN-BRET-removebg-preview.png"
				name="ANNA JOUBIN-BRET"
				honorific="Keynote Speaker"
				title="Secretary, United Nations Commission on International Trade Law (UNCITRAL)"
				bio="Ms. Anna Joubin-Bret is the Secretary of the United Nations Commission on International Trade Law (UNCITRAL) and Director of the International Trade Law Division in the UN Office of Legal Affairs. Appointed in 2017, she brings over three decades of experience in international investment law, arbitration, and dispute resolution. Before joining UNCITRAL, Ms. Joubin-Bret practised law in Paris, where she specialised in investment treaty law and investor–state dispute settlement (ISDS), acting as counsel, arbitrator, mediator, and conciliator in numerous proceedings under ICSID, UNCITRAL, and ICC rules. From 1996 to 2011, she served as Senior Legal Adviser at the United Nations Conference on Trade and Development (UNCTAD), where she advised governments on international investment agreements and sustainable development policy. She has authored and edited several leading publications, including Reform of Investor-State Dispute Settlement: In Search of a Roadmap (2015), and has been a key voice in the global dialogue on ISDS reform, transparency, and balancing investor protection with State sovereignty. Under her leadership, UNCITRAL has advanced initiatives to modernise international trade law frameworks and strengthen multilateral cooperation. Ms. Joubin-Bret is widely regarded as one of the foremost authorities on investment arbitration and trade law reform worldwide."
				pageNumber="03"
			/>

			{/* Page 04: Attorney General */}
			<SinglePageProfile
				imageSrc="/nicarb/attendee-images/PRINCE LATEEF FAGBEMI SAN.jpeg"
				name="PRINCE LATEEF FAGBEMI"
				suffix="SAN, FCArb"
				honorific="Keynote Speaker"
				title="Attorney-General of the Federation and Minister of Justice"
				bio={
					<>
						<p className="mb-3">
							Lateef Olasunkanmi Fagbemi, Senior Advocate of Nigeria (SAN), is a
							distinguished legal practitioner with an illustrious career
							spanning over three decades. He began his academic journey at the
							University of Jos, where he earned his LL.B degree between 1981
							and 1984. Following his mandatory one-year legal training at the
							Nigerian Law School in Lagos (1984-1985), he was called to the
							Nigerian Bar in August 1985. Pursuing further education, Mr.
							Fagbemi obtained a Master’s Degree in Law from Obafemi Awolowo
							University in 1987.
						</p>
						<p className="mb-3">
							His professional career was launched at the esteemed Emmanuel
							Chambers (Afe Babalola & Co.) in Ibadan, where he served as a
							Youth Corp member and subsequently as a pupil counsel under the
							mentorship of Aare Afe Babalola SAN. In 1996, at just 10 years at
							the Bar, Mr. Fagbemi attained the prestigious rank of Senior
							Advocate of Nigeria, a remarkable achievement that set him apart
							as a trailblazer in the legal field. In 2000, he founded his law
							firm, Temitope Chambers (Lateef Fagbemi & Co.), which has since
							grown to be recognized as one of Nigeria’s leading law firms.
						</p>
						<p className="mb-3">
							As both an advocate and arbitrator, Mr. Fagbemi has made
							significant contributions to the legal profession. He is a Fellow
							of several esteemed institutions, including the Chartered
							Institute of Arbitrators (UK), the Chartered Institute of
							Arbitrators (Nigeria), and the Nigerian Institute of Advanced
							Legal Studies (FNIALS). Additionally, he is a respected member of
							the London Court of International Arbitration. Mr. Fagbemi’s
							literary contributions include his role as a contributor to “Law
							of Evidence in Nigeria” by Aare Afe Babalola and as an editor of
							“A Diamond at the Bar: A Chronicle of Lessons and Values from the
							Life of Aare Babalola.”
						</p>
						<p className="mb-3">
							As a staunch advocate for Justice Sector Reforms, Mr. Fagbemi has
							significantly advanced Nigerian jurisprudence, with numerous
							landmark decisions to his credit. He also served as a prosecutor
							for the Independent Corrupt Practices and Other Related Offenses
							Commission (ICPC) and was the Chairman of the Governing Council of
							Yaba College of Technology (Yabatech) from 2017 to 2023. On August
							21, 2023, Mr. Fagbemi was appointed as the 24th Attorney-General
							of the Federation and Minister of Justice by President Bola Ahmed
							Tinubu.
						</p>
						<p>
							Beyond his professional achievements, Mr. Fagbemi is a devoted
							family man who cherishes spending quality time with his loved
							ones.
						</p>
					</>
				}
				pageNumber="04"
			/>

			{/* Page 05: Keynote Speaker (African Series) */}
			<SinglePageProfile
				imageSrc="/nicarb/attendee-images/image87.png"
				name="HON. DORCAS ODUOR"
				honorific="Keynote Speaker (African Series)"
				title="Attorney-General of the Republic of Kenya"
				bio="Dorcas Oduor, the Attorney General of the Republic of Kenya, is a distinguished legal professional with over three decades of experience in public service and criminal justice reform. Prior to her appointment as Attorney General, she served as Secretary, Public Prosecutions, and Principal Deputy to the Director of Public Prosecutions (DPP), where she played a pivotal role in shaping Kenya’s prosecutorial and justice systems. A graduate of the University of Nairobi with a Master’s degree in International Conflict Management and an LL.B in Law, Dorcas Oduor has been instrumental in designing and implementing key prosecutorial and institutional reforms. She led the development of the Decision to Charge Guidelines, a landmark framework that enhanced transparency, accountability, and prosecutorial discretion in Kenya. Throughout her career, she has chaired and participated in numerous national task forces and law reform committees, contributing to the development of critical legislation, including the Proceeds of Crime and Anti-Money Laundering Act (POCAMLA). Her commitment to justice, integrity, and institutional strengthening has earned her several national honours, including the Elder of the Order of the Burning Spear (EBS) and the prestigious title of Senior Counsel (SC). Dorcas continues to inspire as a transformative leader in Kenya’s legal and governance landscape."
				pageNumber="05"
			/>

			{/* Page 06: Wang Chengjie */}
			<SinglePageProfile
				imageSrc={"/nicarb/attendee-images/MR. WANG_CHENGJIE.png"}
				name="MR. WANG CHENGJIE"
				honorific="Keynote Speaker"
				title={
					<>
						Vice Chairman and Secretary-General, China International Economic
						and Trade Arbitration Commission (CIETAC)
						<br />
						<br />
					</>
				}
				bio={
					<>
						<img
							src="/nicarb/attendee-images/Screenshot 2025-11-25 at 14.48.45.png"
							alt="Wang Chengjie Bio"
							className="w-full h-auto mb-3"
						/>
						<p>
							Mr. Wang Chengjie, who is the Vice Chairman and Secretary-General
							of China International Economic and Trade Arbitration Commission
							(CIETAC), Vice Chairman and Secretary-General of Arbitration
							Center Across the Straits (ACAS), President of Asian Domain Name
							Dispute Resolution Centre (ADNDRC), Committee member of Asia
							Pacific Regional Arbitration Group (APRAG) and Vice Chairman of
							China Maritime Arbitration Commission (CMAC). He is also
							arbitrator of many domestic and international arbitration
							institutes, mediator of mediation institutes including China
							Chamber of International Commerce, he has a rich experience in the
							field of dispute resolution for about 30 years.
						</p>
					</>
				}
				pageNumber="06"
			/>

			{/* Page 07: NBA President */}
			<SinglePageProfile
				imageSrc="/nicarb/attendee-images/NBA-President-Mazi-Afam-Osigwe.png"
				name="MAZI AFAM OSIGWE"
				suffix="SAN"
				honorific="Special Guest"
				title="President, Nigerian Bar Association (NBA)"
				bio={
					<>
						<p className="mb-3">
							Mazi Afam Josiah Osigwe, SAN, is a distinguished legal
							practitioner, arbitrator, and the 32nd President of the Nigerian
							Bar Association (NBA), having assumed office in August 2024. A
							quintessential "Bar Man," he is renowned for his vast experience
							in legal practice and his longstanding commitment to the
							advancement of the legal profession in Nigeria.
						</p>
						<p className="mb-3">
							<strong>Education & Qualifications</strong>
						</p>
						<p className="mb-3">
							He graduated from the University of Nigeria, Enugu Campus, with a
							Bachelor of Laws (LL.B) in 1997 and was called to the Nigerian Bar
							in 1999. Demonstrating a commitment to continuous learning, he
							holds two Master of Laws (LL.M) degrees: one from the University
							of Jos (2010) and another in Transnational Commercial Practice
							from the Centre for International Legal Studies, Austria (in
							collaboration with Lazarski University, Poland).
						</p>
						<p className="mb-3">
							<strong>Professional Career</strong>
						</p>
						<p className="mb-3">
							Mazi Osigwe began his legal career at the chambers of Chike
							Chigbue & Co. in Abuja. In 2002, he founded Law Forte, a
							full-service law firm where he serves as Senior Partner. His
							practice expertise spans Corporate and Commercial Law, Banking,
							Intellectual Property, Litigation, and Financial Crimes defense.
						</p>
						<p className="mb-3">
							He was appointed a Notary Public in 2006. He became a Fellow of
							the Chartered Institute of Arbitrators (UK) in 2011. He was
							elevated to the prestigious rank of Senior Advocate of Nigeria
							(SAN) in December 2020.
						</p>
						<p className="mb-3">
							<strong>Service to the Bar</strong>
						</p>
						<p>
							Prior to his election as President, Mazi Osigwe served the Bar in
							numerous critical capacities: General Secretary of the NBA
							(2014–2016), Chairman, NBA Abuja Branch (Unity Bar), and Life
							Bencher, serving on the Body of Benchers. He is widely recognized
							for his advocacy regarding the welfare of lawyers, pro bono
							representation for the indigent, and sports development within the
							legal community.
						</p>
					</>
				}
				pageNumber="07"
			/>

			{/* Page 08: Governing Council */}
			<GoverningCouncilPage />

			{/* Page 09: Schedule Day 1 - Part 1 */}
			<Page className="p-12">
				<div className="text-sm">
					<Day1SchedulePart1 />
				</div>
				<Nicarb2025ConferenceFooter pageNumber="09" />
			</Page>

			{/* Page 10: Schedule Day 1 - Part 2 */}
			<Page className="p-12">
				<div className="text-sm">
					<Day1SchedulePart2 />
				</div>
				<Nicarb2025ConferenceFooter pageNumber="10" />
			</Page>

			{/* Page 11: Schedule Day 2 */}
			<Page className="p-12">
				<div className="text-sm">
					<Day2Schedule />
				</div>
				<Nicarb2025ConferenceFooter pageNumber="11" />
			</Page>

			{/* Page 12: Welcome Address */}
			<WelcomeAddressPage />

			{/* Page 13: Opening Remarks */}
			<OpeningRemarksPage />

			{/* Page 14: Session 1 */}
			<SessionPage
				number="One"
				title="STRENGTHENING INSTITUTIONAL ARBITRATION AND ADR IN AFRICA: CHARTING A NEW PATH"
				pageNumber="14"
				panelists={[
					{
						name: "HON. JUSTICE AISHA MOHAMMED USMAN",
						imageSrc: "/nicarb/attendee-images/image99.png",
						bio: "Hon. Justice Aisha Mohammed Usman, born on 21 December 1962 in Jos, is the first female Chief Judge of Nasarawa State, appointed in 2020. A graduate of Ahmadu Bello University, Zaria, and the Nigerian Law School, Lagos, she has held several pioneering positions, including Director of Public Prosecutions, the first female Solicitor-General and Permanent Secretary of the Ministry of Justice, and Clerk of the State House of Assembly. Renowned for her transformative leadership, she has driven the digitalisation and modernisation of the Nasarawa State Judiciary to global standards. Justice Usman is an active member of numerous legal associations and is married.",
						wrapText: true,
					},
					{
						name: "PROF. BANKOLE ADEKUNLE AKINTOYE SODIPO, SAN, FCArb",
						imageSrc: "/nicarb/attendee-images/image104.png",
						bio: "Prof. Bankole Adekunle Akintoye Sodipo, SAN, FCArb, is a professor of law and former dean of the School of Law and Security Studies at Babcock University, Nigeria. A Fellow of the Nigerian Institute of Chartered Arbitrators and member of the ICC Arbitration and ADR Commission, he serves as counsel, mediator, and arbitrator in complex commercial disputes. He convenes the African Arbitration Day Conference in collaboration with Queen Mary University of London and the British Institute of International and Comparative Law. His research and teaching focus on arbitration, mediation, intellectual property, and energy law, with visiting fellowships at Queen Mary University and BIICL.",
						wrapText: true,
					},
					{
						name: "JAMES CLANCHY",
						imageSrc: "/nicarb/attendee-images/image102.png",
						bio: "James Clanchy, FCIArb, is a full-time arbitrator and an associate member of Six Pump Court chambers in London. He is a Full Member of the London Maritime Arbitrators Association (LMAA) and was its Honorary Secretary 2021 - 2022. A solicitor in England & Wales (admitted 1990, non-practising since 2019), James was also an avocat at the Paris bar 1994 - 2008. He spent 20 years as a commercial disputes lawyer with Withers, Holman Fenwick Willan, and Stephenson Harwood. He was the Registrar and Deputy Director-General of the London Court of International Arbitration (LCIA) from 2008 to 2012.",
						wrapText: true,
					},
					{
						name: "ISHAKA MUDI DIKKO, SAN",
						imageSrc: "/nicarb/attendee-images/image109.png",
						bio: "Ishaka Mudi Dikko, SAN, is the Principal Partner at M.I. Dikko & Associates. He has appeared in numerous cases before Nigeria's Superior Courts of Record, with several reported judgments to his credit. He holds an LL.B from Ahmadu Bello University, an LL.M, and a B.L from the Nigerian Law School. Elevated to the rank of Senior Advocate of Nigeria in 2018, he achieved this distinction within 12 years of call. His practice areas include corporate law, constitutional law, election petitions, and criminal litigation. He is a member of the NBA, AFBA, IBA, and CILRM, and has held leadership roles in the NBA Lafia Branch.",
						wrapText: true,
					},
				]}
				moderator={{
					name: "PROF. IKE EHIRIBE",
					imageSrc: "/nicarb/attendee-images/image26.png",
					bio: "High Chief (Professor) Ike Ehiribe is a Barrister, Chartered Arbitrator, Adjudicator, Expert Determiner, and Accredited Mediator, and the Founder of Ike Ehiribe & Co. (International Lawyers & Dispute Resolvers) in Nigeria. Called to the Nigerian Bar in 1982 and the Bar of England & Wales (Lincoln’s Inn) in 1996, he holds an Executive Certificate in Negotiation from the University of Oxford. A full-time international arbitrator, he serves on panels of ICC, WIPO, CAS, SIAC, HKIAC, and CAfA. A Visiting Professor and Fellow at the Centre for International Legal Studies, he has also chaired CIArb’s ADR Committee in London.",
				}}
			/>

			{/* Page 15: Session 2 */}
			<SessionPage
				number="Two"
				title="EFFECTIVE MANAGEMENT AND RESOLUTION OF DISPUTES IN THE ENERGY, OIL & GAS SECTORS"
				pageNumber="15"
				panelists={[
					{
						name: "PROF. YINKA OMOROGBE, SAN",
						imageSrc: "/nicarb/attendee-images/image106.png",
						bio: "Prof. Yinka Omorogbe, SAN, is a distinguished scholar and practitioner of energy law and policy. She served as Attorney General of Edo State (2017–2020) and Legal Adviser to the NNPC (2009–2011). Prof. Omorogbe founded EtinPower Limited, a clean energy company. A Harvard Advanced Leadership Fellow (2021), she has contributed to major petroleum reforms and is President of the Nigerian Society of International Law. She is a Fellow of several notable professional institutes and has taught at the Universities of Benin, Lagos, and Ibadan.",
						wrapText: true,
					},
					{
						name: "ENGR. DR. FELICIA AGUBATA, FNSE",
						imageSrc: "/nicarb/attendee-images/image114.png",
						bio: "Engr. Dr. Felicia Nnenna Agubata, Ph.D, FNSE, is a distinguished Electrical and Electronics Engineer and Deputy General Manager at Nigerian Airspace Management Agency (NAMA). A Fellow and Vice President of the Nigerian Society of Engineers, she is the 15th President of APWEN and a UN-UNITAR Global Diplomacy Fellow (Class of 2024). She leads the SheEngineer initiative, empowering girls across Nigeria through scholarships and science labs. A multi-award-winning professional, she has received recognitions from NSE, NIWE, and the Royal Academy of Engineering. Celebrated globally as one of 2025’s Ascent 100 Top Career Women in Africa.",
						wrapText: true,
					},
					{
						name: "DR. JOSEPH ADEBOLA TOLORUNSE",
						imageSrc: "/nicarb/attendee-images/image111.png",
						bio: "Dr. Joseph Adebola Tolorunse, PhD, is a distinguished legal expert with over three decades of experience in Nigeria's oil and gas industry. He serves as Authority Secretary and Legal Adviser to the Board of the Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA). He has led major regulatory reforms and contributed to landmark legislation, including the Deep Offshore Act Amendment (2019). A Dundee-trained scholar, Dr. Tolorunse is globally recognised for his expertise in petroleum law, governance, and dispute resolution.",
						wrapText: true,
					},
					{
						name: "NGOZI EKEOMA",
						imageSrc: "/nicarb/attendee-images/image113.jpg",
						bio: "Mrs. Ngozi Ekeoma is a seasoned lawyer, accomplished entrepreneur, and Group Managing Director of the Nepal Group of Companies, with interests in oil and gas, logistics, manufacturing, power, and agriculture. A Harvard Business School alumna, she has served on numerous corporate boards and leads several subsidiaries including Nepal Energies and Quest Shipping. She holds multiple law degrees from the University of Lagos. A celebrated philanthropist, she founded the Pa. Anyaso Skill Acquisition Centre and the Ngozi Ekeoma Foundation, empowering thousands through training and scholarships.",
						wrapText: true,
					},
					{
						name: "ROSEMARY EGABOR-AFOLAHAN",
						imageSrc: "/nicarb/DR. ERIMMA GLORIA ORIE.png",
						bio: "Rosemary Egabor-Afolahan is the Director of Commercial and Communications at News Central, where she drives strategic marketing, brand visibility, and audience-focused communication initiatives. With experience across Banking, Marketing Communications, Digital Media, and the Oil & Gas sector, she has significantly strengthened News Central TV's commercial positioning. She previously served as Head of Business Development, Market Strategy, and Sales before assuming her current leadership role. Rosemary holds a Bachelor's degree in Marketing from Covenant University and a Master's in Media and Communications from Pan-Atlantic University. She is also an Associate Member of the Chartered Institute of Marketing (CIM) and the Chartered Institute of Public Relations (CIPR), UK.",
						isSpeaker: true,
						wrapText: true,
					},
					{
						name: "DR. ERIMMA GLORIA ORIE",
						imageSrc: "/nicarb/attendee-images/image27.png",
						bio: "Dr. Orie, former Head of the Department of Private and Property Law, National Open University of Nigeria, teaches Environmental Law, Oil and Gas Law, ADR, and Intellectual Property Law. She holds two Ph.D. degrees in Law and has published over fifty-five peer-reviewed articles and book chapters. Recognised as the Best Researcher in her Faculty (2021–2024). A Fellow of NICArb and the Association of Environmental Lawyers of Nigeria, Dr. Orie is the Chairperson of NICArb Abuja Branch and the 2025 Conference Content and Programme Committee.",
						isModerator: true,
						wrapText: true,
					},
				]}
			/>

			{/* Page 16: Session 3 */}
			<SessionPage
				number="Three"
				title="CONSTRUCTION AND INFRASTRUCTURE INVESTMENT DISPUTES"
				pageNumber="16"
				panelists={[
					{
						name: "AHMED ABDEL-HAKAM",
						imageSrc: "/nicarb/attendee-images/image116.png",
						bio: "Ahmed Abdel-Hakam is a Partner at Volterra Fietta in London, a Solicitor-Advocate before the Higher Courts of England & Wales, and a French Avocat. He serves on the Dispute Resolution Committee of the Law Society of England & Wales and co-chairs the Dispute Resolution Section of the African Society of International Law. He is also a member of the International Law Committee of the New York City Bar Association. Ahmed represents States and investors in investment treaty arbitrations before ICSID and the PCA and has appeared before the ICJ, CJEU, and ECHR, as well as in ICC and LCIA proceedings across Europe.",
						wrapText: true,
					},
					{
						name: "KOLA AWODEIN, SAN",
						imageSrc: "/nicarb/attendee-images/image119.png",
						bio: "Kola Awodein, SAN, is the Founding Partner of Kola Awodein & Co., with offices in Lagos, Abuja, and Port Harcourt. Called to the Nigerian Bar in 1978 and elevated to the rank of Senior Advocate of Nigeria in 1999, he specialises in Commercial, Constitutional, and Real Estate Law. Mr. Awodein has advised major institutions, including the Central Bank of Nigeria and the World Bank, and played key roles in the Nigerian Banking Sector Reform Programme and the establishment of AMCON. A Fellow of several professional institutes, he is also a Notary Public, distinguished lecturer, and internationally recognised advocate and arbitrator.",
						wrapText: true,
					},
					{
						name: "VIRGINIE COLAIUTA",
						imageSrc: "/nicarb/attendee-images/image120.png",
						bio: "Virginie Colaiuta is a Partner at LMS Legal LLP in London with over 25 years of experience as counsel, advocate, and arbitrator in international arbitration, particularly in construction, energy, aerospace, and defence projects. She is admitted to practise in England and Wales, New York, and France, and holds a law degree from Italy. Virginie is a Visiting Fellow at King’s College London’s Centre of Construction Law and Dispute Resolution, where she teaches investment treaty protection and conflict of laws. She currently serves as Co-Chair of the International Construction Projects Committee of the International Bar Association.",
						wrapText: true,
					},
					{
						name: "MARK HAMMICK",
						imageSrc: "/nicarb/attendee-images/image121.png",
						bio: "Mark began his career in 1982 as a Site Quantity Surveyor and became a Director at Kingsbourne in 1994. He has evaluated variations and claims on major projects, including dams, mining, roads, power plants, and harbours across Australia, Africa, Europe, the Middle East, and Asia. He prepares claims for adjudication, mediation, and arbitration and frequently serves as an expert witness on claim quantification in various forums across Australia and Africa. Mark has also acted as a single-member and chairperson/member of three-person Dispute Adjudication and Avoidance Boards (DABs/DAABs) on numerous infrastructure projects throughout sub-Saharan Africa.",
						wrapText: true,
					},
					{
						name: "NGO-MARTINS OKONMAH",
						imageSrc: "/nicarb/attendee-images/image122.png",
						bio: "Ngo-Martins is a Partner in the Dispute Resolution practice at Aluko & Oyebode and heads the firm’s Construction and Engineering Practice. A skilled litigator and arbitration lawyer, he has expertise in construction, energy, oil & gas, shipping, and aviation law. He has acted as counsel and arbitrator in LCIA, UNCITRAL, and ICC arbitrations seated in Nigeria, London, Zurich, and Miami. He advises on FIDIC, NEC, JCT, and bespoke EPC/EPCM contracts across various sectors. Founder and Executive Director of the Africa Construction Law initiative, he is recognised by The Legal 500 (EMEA) for his expertise and leadership in arbitration and construction law.",
						wrapText: true,
					},
					{
						name: "WINNIFRED OLANIPEKUN",
						imageSrc: "/nicarb/attendee-images/image28.png",
						bio: "Winnifred is the Managing Partner at Esher & Makarios and a member of the firm’s Policy Advisory and Dispute Resolution Groups. Her expertise spans Arbitration, Human Rights, Environmental Law, and Commercial Litigation. She holds an LL.B from Igbinedion University, a Postgraduate Diploma in Law from the University of London, and is called to the Nigerian Bar. Winnifred edits The Pivot, a newsletter on family rights and professional development for young lawyers. She is a Fellow of the Chartered Institute of Management Consultants and a Certified Management Consultant, and a member of the NBA, NICArb, IBA, and BIICL.",
						isModerator: true,
						wrapText: true,
					},
				]}
			/>

			{/* Page 17: Session 4 */}
			<SessionPage
				number="Four"
				title="CROSS-BORDER LENDING AND DEBT RECOVERY: INSTITUTIONAL ARBITRATION IN BANKING, FINANCE, AND FINTECH DISPUTES"
				pageNumber="17"
				panelists={[
					{
						name: "NOSAKHARE AGUEBOR",
						imageSrc: "/nicarb/attendee-images/image123.png",
						bio: "Nosakhare Aguebor is an Associate Vice President and Senior Legal Counsel at the Africa Finance Corporation (AFC), a leading pan-African multilateral development finance institution. Before joining AFC in 2019, he was a Senior Associate and Team Lead of the Banking, Finance, and Projects Practice at G. Elias. He previously worked with the African Export-Import Bank in 2006 and 2011. With over 15 years of experience in corporate and project finance, capital markets, and mergers and acquisitions (M&A) across 20 African countries, Nosakhare holds an LLM in International Trade Law (Distinction) and an MPhil in Development Finance. He was named a “Rising Star” and “Next Generation Partner” by IFLR1000 and Legal 500.",
						wrapText: true,
					},
					{
						name: "ADEKUNLE OLAOFE",
						imageSrc: "/nicarb/attendee-images/image124.png",
						bio: "Adekunle Olaofe is a seasoned legal professional with over 15 years of post-call experience spanning fintech, corporate governance, commercial law, litigation, and alternative dispute resolution. He has held key legal and leadership roles at Qrios Networks Limited and VFD Group, bringing deep expertise in multinational and financial sector operations. Currently, he serves as Senior Manager at Flutterwave, where he leads legal support for the company’s global expansion and operations. His work focuses on regulatory compliance, risk management, and strategic dispute resolution, ensuring Flutterwave’s continued growth and adherence to international legal and regulatory standards.",
						wrapText: true,
					},
					{
						name: "JACKWELL FERIS",
						imageSrc: "/nicarb/attendee-images/image125.jpg",
						bio: "Jackwell Feris is a Director in Cliffe Dekker Hofmeyr’s Dispute Resolution Practice and Sector Head for Industrials, Manufacturing & Trade. With over 18 years’ experience, he has represented governments, state-owned entities, multilaterals, and private clients in complex disputes across oil and gas, mining, energy, infrastructure, and government sectors. A leading arbitration practitioner, he handles major international commercial and investment arbitrations and contributes actively to arbitration capacity building in Africa. He lectures on international arbitration, serves on key committees including ICC South Africa and AFSA International, and is consistently recognised by Best Lawyers, Legal 500, and Chambers Global for dispute resolution excellence.",
						wrapText: true,
					},
					{
						name: "MICHAEL OTU",
						imageSrc: "/nicarb/attendee-images/image86.png",
						bio: "Michael Osilama Otu is the Company Secretary and General Counsel of Zenith Bank Plc, a position he has held since 1997. Called to the Nigerian Bar in 1993, he holds an LL.M from the University of Lagos and brings over 30 years of expertise in banking law, corporate governance, and compliance. A Fellow of the Nigerian Institute of Chartered Arbitrators, he is a member of several professional bodies, including the NBA, IBA, and Institute of Directors. He has participated in executive programmes at Harvard, INSEAD, Euromoney Singapore, and Lagos Business School, and has advised on multi-billion-dollar syndicated facilities.",
						wrapText: true,
					},
				]}
				moderator={{
					name: "TAIWO OGBARA",
					imageSrc: "/nicarb/attendee-images/image29.png",
					bio: "Taiwo Ogbara is a dispute resolution specialist with over a decade of experience in commercial litigation, arbitration, insolvency, and enforcement proceedings. He leads the Commercial Litigation & Dispute Resolution Practice at Jackson, Etti & Edu and serves as Deputy Sector Head for Energy & Infrastructure. Taiwo has acted as both counsel and arbitrator in high-value disputes, including serving on a three-member tribunal with two Senior Advocates of Nigeria. A member of NICArb, ICMC, BRIPAN, and INSOL International, he is known for his commercial acumen, mentorship, and contributions to advancing arbitration and ADR in Nigeria.",
				}}
			/>

			{/* Page 18: Young NICArb */}
			<SessionPage
				number="Young NICArb"
				title="EARLY RISER SESSION: THE ROLE OF YOUNG ARBITRATORS IN PROMOTING ADR AWARENESS"
				pageNumber="18"
				panelists={[
					{
						name: "TOHEEB AMUDA",
						imageSrc: "/nicarb/attendee-images/image88.png",
						bio: "Toheeb is an Associate at Aluko & Oyebode and an experienced dispute resolution lawyer with a focus on litigation, international, domestic, and investor-state arbitration. He holds an LL.M in International Business Law (Distinction) from The University of Law, London. He has participated in numerous commercial and investment arbitrations under leading institutional rules, including ICSID, LCIA, ICC, DIAC, AAA/ICDR, and RCICAL, serving as counsel and tribunal secretary. He was named Young Arbitration Practitioner of the Year at the 2024 Africa Arbitration Awards.",
						wrapText: true,
					},
					{
						name: "LATIFAT HAMDALAT HASSAN",
						imageSrc: "/nicarb/attendee-images/image90.png",
						bio: "Latifat Hamdalat Hassan is a legal practitioner and Chartered Arbitrator with diverse experience in litigation, compliance, and dispute resolution. A graduate of Ahmadu Bello University, Zaria, she was called to the Nigerian Bar in 2017. She has worked with Falana & Falana's Chambers, Abuja, and St. Christopher's Chambers (Oyiboka & Co.), Port Harcourt, handling complex legal matters with precision. She is the former Young NICArb Representative of the Abuja Branch.",
						wrapText: true,
					},
					{
						name: "ABASIEMEDIONG ETUK, MCArb",
						imageSrc: "/nicarb/attendee-images/image91.png",
						bio: "Abasiemediong Etuk, MCArb, is a Senior Associate at KENNA, specialising in Dispute Resolution and ADR, Capital Markets, and Corporate Governance & Regulatory Compliance. Her dispute resolution experience spans oil spill litigation, contract breaches, labour disputes, shareholder actions, cross-border arbitration, and enforcement of fundamental rights. She has served as a tribunal secretary in both international and domestic arbitrations.",
						wrapText: true,
					},
					{
						name: "FESTUS OGUN",
						imageSrc: "/nicarb/attendee-images/Festus Ogun.jpeg",
						bio: "Festus Ogun is a Partner at FOLEGAL, a premier Nigerian disputes resolution Law Firm based in Lagos and he heads the litigation, arbitration and alternative dispute resolution team of the firm. He routinely appears before high courts, industrial courts, appellate courts, and arbitral tribunals. He handles courtroom disputes and arbitration work related to labour and employment, banking and finance, energy and oil and gas, shipping and maritime, electoral and constitutional matters, and general contracts.",
						wrapText: true,
					},
				]}
				moderator={{
					name: "GIDEON EDEM",
					imageSrc: "/nicarb/attendee-images/image30.png",
					bio: "Gideon is an Associate in the Governance, Risk, and Compliance team at Aluko & Oyebode and Chairman of the Young Lawyers Forum, NBA Lagos Branch. His practice covers corporate governance, regulatory compliance, ESG, and data protection. He advises multinational clients on compliance frameworks, investigations, and dispute resolution strategies, including regulatory and arbitral proceedings. With experience in white-collar crimes, employee misconduct, and corporate investigations, Gideon provides strategic insight into how compliance breaches evolve into disputes.",
				}}
			/>

			{/* Page 19: Session 5 */}
			<SessionPage
				number="Five"
				title="THE CASE FOR INSTITUTIONAL MEDIATION AND COLLABORATION BETWEEN INSTITUTES IN DISPUTE RESOLUTION"
				pageNumber="19"
				panelists={[
					{
						name: "TAT LIM",
						imageSrc: "/nicarb/attendee-images/image92.png",
						bio: "Tat Lim is an IMI Certified Mediator and Mediation Advocate, currently serving as Chair of the IMI Board of Directors. An international dispute resolution practitioner based in Singapore, he is a founding member of Maxwell Mediators and an accredited mediator and arbitrator with several leading institutions. With nearly 20 years of experience mediating commercial and public interest disputes, Tat is also deeply committed to developing future mediators, training and assessing practitioners globally. A 2017 Weinstein JAMS International Fellow, he chairs the Society of Mediation Professionals (Singapore) and serves on the board of the Singapore Mediation Centre. His work has been recognized by The Legal 500 and Who’s Who Legal: Mediation.",
						wrapText: true,
					},
					{
						name: "CAI WEIPING (DENNIS)",
						imageSrc: "/nicarb/attendee-images/image93.jpg",
						bio: "CAI Weiping (Dennis) is the Deputy Director of the AALCO Hong Kong Regional Arbitration Centre (AALCO-HKRAC), a position he has held since 2022. With over two decades of experience in international arbitration, he has served in senior roles at leading institutions, including Deputy Chief Operating Officer at eBRAM International ODR Centre, Secretary-General of the Asian Domain Name Dispute Resolution Centre, and Assistant Secretary-General of the Hong Kong International Arbitration Centre. An experienced arbitrator, Dennis has decided more than 30 cases involving intellectual property, domain name, and e-commerce disputes, reflecting his deep expertise in technology-related arbitration.",
						wrapText: true,
					},
					{
						name: "OLADIMEJI AYOBOBOLA OJO",
						imageSrc: "/nicarb/attendee-images/image94.png",
						bio: "Oladimeji is a Legal Counsel at the International Center for Settlement of Investment Disputes (ICSID). He is a seasoned advocate, with over a decade of experience in first instance and appellate litigation, commercial and investment arbitration and other forms of dispute resolution across a wide range of industries. At ICSID, Oladimeji manages, and acts as tribunal secretary, in investor-state disputes administered on the basis of the ICSID Convention and its arbitration, conciliation, mediation and additional facility rules.",
						wrapText: true,
					},
					{
						name: "ACHERE IBIFURO COLE, FCIArb (UK)",
						imageSrc: "/nicarb/attendee-images/image95.png",
						bio: "Achere Ibifuro Cole, FCIArb (UK), is the Chief Executive Officer and Director of the Lagos Multi-Door Courthouse (LMDC), Africa's first court-connected ADR Centre. A Barrister and Solicitor of the Supreme Court of Nigeria with over 22 years' experience, she is a leading ADR specialist in mediation, arbitration, restorative justice, and justice reform. She has led judicial transformation projects with IDLO, IDEA, EU, and the British Council across Africa, co-authored Nigeria's first Restorative Justice Manual, and expanded Multi-Door Courthouses nationwide. A Fellow of CIArb (UK) and CEDR Mediator, she sits on several ADR boards and speaks globally on dispute resolution.",
						wrapText: true,
					},
				]}
				moderator={{
					name: "PROF. STEVE ABAYOMI BANK-OLA",
					imageSrc: "/nicarb/attendee-images/image1.png",
					bio: "Professor Bank-Ola Steve, DSc.TS, PhDTh, PhD(MIS), PhD.Div, PhD(CMA), PhD.B.L, PhD(C.ED), PhD(Sp & Psy), PhD(B.Ethics & HD), EDD.BL, MAOCI, MTP, MACTN, FFCTS, F.Ced-ICCS, is a distinguished Professor of Theology and Human Development. He is a Fellow and Subject Development Expert at the Christian University for Leadership Education and Development, Delaware, USA, and a Faculty Lecturer and member of the Nigerian Institute of Chartered Arbitrators. Professor Steve has served as a visiting Professor and Consultant to numerous Christian universities and theological seminaries in Nigeria and abroad, contributing significantly to faith-based education, leadership, and human development.",
				}}
			/>

			{/* Page 20: Session 6 */}
			<SessionPage
				number="Six"
				title="ARBITRATION AND THE COURTS: ENHANCING DOMESTIC AND INTERNATIONAL ARBITRATION/ADR IN AFRICA"
				pageNumber="20"
				panelists={[
					{
						name: "HON. JUSTICE JUMOKE PEDRO",
						imageSrc: "/nicarb/attendee-images/image96.png",
						bio: "Honourable Justice Jumoke Olusola Pedro obtained her LL.B (Hons) from the University of Lagos in 1980 and was called to the Nigerian Bar in 1981. She joined the Lagos State Judiciary in 1984, rising through the ranks from Magistrate to Chief Registrar before her appointment as a Judge of the High Court of Lagos State in 2001. She currently heads the Commercial and Fast Track Division and serves as Chairman of the Governing Council, Lagos Multi-Door Courthouse. A Fellow of the Chartered Institute of Arbitrators and the Institute of Chartered Mediators and Conciliators, she is also a Certified Mediator.",
						wrapText: true,
					},
					{
						name: "HON. JUSTICE XAVIER MBONO",
						imageSrc: "/nicarb/attendee-images/image20.png",
						bio: "Justice Mbono is a Senior Magistrate and expert in Intellectual Property Law, he has held several key positions within the Ministry of Justice of Cameroon, including Deputy Public Prosecutor, President of various courts, and currently President of the Court of Appeal of the West Region. An accredited OHADA trainer and lecturer at ERSUMA in Porto-Novo, he also serves as a consultant in Intellectual Property Law. He holds Master’s degrees in Intellectual Property Law from the University of Nantes (France) and Cybercrime Law from Gaston Berger University (Senegal). Fluent in French and English, he is a recipient of the Officer of the National Order of Valour.",
						wrapText: true,
					},
					{
						name: "MOMOH KADIRI",
						imageSrc: "/nicarb/attendee-images/image22.png",
						bio: "Momoh Kadiri is a dual-qualified lawyer in England & Wales and Nigeria, and the Managing Partner of Mitchell Simmonds, a commercial dispute resolution firm based in Canary Wharf, London. A Fellow of the Chartered Institute of Arbitrators (UK), his international practice spans arbitration, litigation, and commercial law across sectors such as oil and gas, energy, mining, construction, infrastructure, and maritime. Momoh accepts appointments as an arbitrator and is conversant with major institutional rules, including ICC, LCIA, LMAA, UNCITRAL, ICSID, and LCA. He is also an accredited mediator and serves on the Court of Arbitration of the Lusaka International Arbitration Centre (LIAC).",
						wrapText: true,
					},
					{
						name: "CUI JUN",
						imageSrc: "/nicarb/client-logo/CUI Jun.png",
						bio: "CUI Jun, LLB, LLM, is Managing Director of Frontier and Partners, specializing in international construction law. He is an Arbitrator with the China International Economic and Trade Arbitration Commission and has extensive experience in international construction contracts, arbitration, and dispute resolution. He has worked abroad for over 20 years across Asia, Africa, the Middle East, Latin America, and Europe, advising major Chinese contractors. Author of 14 books on FIDIC contracts and over 100 articles on international construction contracts.",
						wrapText: true,
					},
				]}
				moderator={{
					name: "NZEAKOR ATULOMAH",
					imageSrc: "/nicarb/attendee-images/image2.png",
					bio: "Nzeakor (“Nze”) Atulomah is the Managing Partner of Synergy Law Partners and a leading expert in corporate and commercial law, dispute resolution, intellectual property, and corporate governance. A Fellow of the Nigerian Institute of Chartered Arbitrators, he holds an LL.B. from Abia State University, an LL.M. from the University of Lagos, and is a doctoral researcher at Imo State University. He has acted for major clients across technology, FinTech, and construction sectors. A former Honorary Secretary of the Society for Corporate Governance Nigeria, he contributed to Nigeria’s first corporate governance code and serves on several corporate and institutional boards.",
				}}
			/>

			{/* Page 21: Session 7 (Ethics) */}
			<SessionPage
				number="Seven"
				title="ETHICS, AND EVERYTHING IN-BETWEEN IN DOMESTIC, INTERNATIONAL ARBITRATION AND ADR"
				pageNumber="21"
				panelists={[
					{
						name: "HON. JUSTICE HADIZA SHAGARI",
						imageSrc: "/nicarb/attendee-images/Justice Hadiza Rabiu Shagari.jpeg",
						bio: "Hon. Justice Hadiza Rabi'u Shagari (JCA) was appointed to the Court of Appeal in 2023, after serving as a Judge of the Federal High Court since 2015. She began her judicial career as a Senior Magistrate in 2006. Prior to joining the judiciary, she worked at the Nigerian Ports Authority from 1994 to 2006. She served on federal government committees. A 1991 graduate of Usman Danfodiyo University with a combined LLB in Common Law & Sharia, she was called to the Bar in 1992. In 2021, she became a Fellow of the Nigerian Institute of Chartered Arbitrators. She has interests in marine and commercial law and advocates for transparency, integrity, and timely justice delivery.",
						wrapText: true,
					},
					{
						name: "REMY GERBAY",
						imageSrc: "/nicarb/attendee-images/image23.png",
						bio: "Remy Gerbay (LL.M., Ph.D.) is a Partner at Hughes Hubbard & Reed LLP, Washington, D.C., where he leads the firm’s investor–state arbitration practice. He has represented clients in complex disputes under major institutional rules, including ICC, LCIA, ICSID, and UNCITRAL, across sectors such as energy, infrastructure, and finance. A former Deputy Registrar of the LCIA and Registrar of DIFC-LCIA, Remy has been appointed arbitrator in over 25 cases. He co-directs the LL.M. in Arbitration at Queen Mary University of London and serves as Vice President of the International Court of AFSA.",
						wrapText: true,
					},
					{
						name: "JONATHAN BARNES",
						imageSrc: "/nicarb/attendee-images/image24.png",
						bio: "Jonathan is a Partner in the Dispute Resolution Department at Bowmans, specialising in Commercial Litigation and International Arbitration. His expertise spans transactional disputes, contractual claims, mining matters, and urgent High Court proceedings. He has represented clients in cross-border disputes involving Botswana, France, Nigeria, Tanzania, and the United Kingdom and successfully defended South Africa’s largest brewery in litigation and arbitration. A qualified mediator accredited by the Africa Centre for Dispute Settlement and the Centre for Effective Dispute Resolution (UK), Jonathan holds BA and LLB degrees from the University of the Witwatersrand and an LLM from the University of Edinburgh focused on international arbitration.",
						wrapText: true,
					},
					{
						name: "CAROLINE ETUK",
						imageSrc: "/nicarb/attendee-images/image25.png",
						bio: "Caroline Nene Etuk is the Director of the Enugu State Multi-Door Courthouse and former Director of the Lagos Multi-Door Courthouse, Africa’s first court-connected ADR Centre. With an LL.B. from the University of Ife and an LL.M. from King’s College, London, she has been instrumental in justice sector reform and ADR development in Nigeria. A CEDR-accredited mediator and Weinstein JAMS Fellow, she has consulted for the British Council, World Bank, and EU. Mrs. Etuk also serves as President of the Forum of Directors of Multi-Door Courthouses of Nigeria and remains a leading voice in mainstreaming ADR nationwide.",
						wrapText: true,
					},
				]}
				moderator={{
					name: "DR. JUDE NNODUM, JNR",
					imageSrc:
						"/nicarb/attendee-images/Jude Nnodum profile picture.jpg",
					bio: "Dr Jude Nnodum, Jnr., is a Partner at KENNA, a full-service law firm with offices in Lagos, Abuja, and Enugu, Nigeria. He is a core member of the firm’s dispute resolution practice, with considerable experience representing a wide range of clients, including private and public companies, government institutions, multinational corporations, and high-net-worth individuals (HNIs), in complex and high-stakes cases. His dispute resolution practice, which includes arbitration and mediation, covers banking and financial services, energy (oil and gas), environmental law, labour and employment, investment securities, and capital market. Dr. Nnodum obtained both his master&#39;s and doctoral degrees from the University of Sussex, UK, with research interests in the areas of international investment law (including international investment arbitration and international investment treaties) and international commercial arbitration. He has written extensively in these areas.",
				}}
			/>

			{/* Page 22-23: Planning Committee */}
			<PlanningCommitteePage />

			{/* Page 24: State Branches */}
			<StateBranchesPage />

			{/* Pages 25-29: Sponsors */}
			<SponsorsPage />

			{/* Page 30: State Branches Contact (Back Cover) */}
			<StateBranchesContactPage />
		</div>
	);
}

export default ConferenceBrochure;

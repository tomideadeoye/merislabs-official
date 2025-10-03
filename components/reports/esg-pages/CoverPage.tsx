import React from "react";
import { HybridPage } from "../HybridPage";
import { Badge, Card, CardContent } from "../../ui/index";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/index";
import { reportData } from "../../../data";
import { Contact } from "../../../types";

interface CoverPageProps {
	pageNumber?: number;
}

export const CoverPage: React.FC<CoverPageProps> = ({ pageNumber }) => {
	const contacts = reportData.contacts || [];

	return (
		<HybridPage pageNumber={pageNumber} useColumns={false} components={{}}>
			<div className="relative w-full h-full flex flex-col justify-center items-center px-2">
				{/* Background gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-80"></div>

				{/* Main content card */}
				<Card className="relative w-full h-full bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
					{/* Decorative top border */}
					<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800"></div>

					<CardContent className="p-3 h-full flex flex-col justify-between relative z-10">
						{/* Header Section */}
						<div className="text-center pt-4">
							{/* Main title with enhanced typography */}
							<div className="pt-8 mb-6">
								<h1 className="text-3xl md:text-4xl font-bold text-gray-700 leading-tight tracking-tight select-text cursor-text">
									Bridging the ESG Finance Gap:
								</h1>
							</div>

							{/* Decorative line */}
							<div className="flex items-center justify-center mb-8">
								<div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
								<div className="mx-4 w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
								<div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
							</div>
						</div>

						{/* Subtitle Section */}
						<div className="text-center mb-8">
							<h2 className="text-base md:text-lg font-medium text-gray-700 leading-relaxed max-w-4xl mx-auto select-text">
								<span className="text-blue-400 font-semibold select-text">
									Demand and Supply-Side Constraints
								</span>
								<br />
								<span className="text-blue-400 select-text">
									Facing Nigerian Small and Medium-Sized Enterprises (SMEs)
								</span>
							</h2>
						</div>

						{/* Central Image Section */}
						<div className="flex-1 flex items-center justify-center mb-6">
							<div className="relative max-w-lg w-full">
								{/* Image with enhanced styling */}
								<div className="relative">
									<img
										src="/bridgin_financing_gap/sme.png"
										alt="SME Financing Gap"
										className="w-full h-auto object-contain rounded-2xl shadow-2xl border-4 border-white"
									/>
									{/* Subtle glow effect */}
									<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-xl -z-10"></div>
								</div>
							</div>
						</div>

						{/* Authors and Footer Section */}
						<div className="space-y-4">
							{/* Authors */}
							<div className="text-center">
								<div className="flex flex-wrap justify-center gap-4">
									{contacts.map((contact: Contact) => (
										<div
											key={contact.email}
											className="flex items-center bg-white/70 rounded-full px-4 py-2 shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300 hover:bg-blue-50"
										>
											<Avatar className="w-8 h-8 mr-3 ring-2 ring-blue-200">
												<AvatarImage src={contact.image} alt={contact.name} />
												<AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold">
													{contact.name
														.split(" ")
														.map((n: string) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div className="text-left">
												<p className="font-semibold text-gray-800 text-sm">
													{contact.linkedinUrl ? (
														<a
															href={contact.linkedinUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="flex items-center hover:text-blue-600 transition-colors"
														>
															{contact.name}
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-3 w-3 ml-1 text-blue-500"
																viewBox="0 0 24 24"
																fill="currentColor"
															>
																<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
															</svg>
														</a>
													) : (
														<span>{contact.name}</span>
													)}
												</p>
											</div>
										</div>
									))}
								</div>	{/* Date and Organization */}
							<p className="text-xs inline-block bg-gray-400 text-white p-2 m-8 rounded-full shadow-lg text-center mb-4 self-center font-bold">
								September 2025
							</p>
						</div>
							</div>


					</CardContent>
				</Card>
			</div>
		</HybridPage>
	);
};

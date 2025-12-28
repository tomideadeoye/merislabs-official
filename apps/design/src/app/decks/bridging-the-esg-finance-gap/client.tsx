"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { pdf } from "@react-pdf/renderer";
import { EndnotesPage } from "../../components/reports/esg-pages/EndnotesPage";
import { Endpage } from "../../components/reports/pages/EndPage";
import { CoverPage } from "../../components/reports/esg-pages/CoverPage";
import {
	IntroductionPage,
	TableOfContents,
	IntroductionPage2,
	IntroductionPage3,
	InternalBarriersPage1,
	InternalBarriersPage2,
	InternalBarriersPage3,
	ExternalBarriersPage,
	ESGPage8,
	ESGPage9,
	ESGPage10,
	ESGPage11,
	ESGPage12,
	ESGPage13,
} from "../../components/reports/esg-pages";
import {
	PDFGenerator,
	ComponentRef,
} from "../../lib/pdfUtils";

export default function HybridESGDemoClient() {
	const { setTheme } = useTheme();
	const [showFootnotes, setShowFootnotes] = useState(false);
	const [isGeneratingPDF, setIsGeneratingPDF] = useState<string | null>(null);
	const fullReportRef = useRef<HTMLDivElement>(null);

	// Force light theme for ESG report pages
	useEffect(() => {
		setTheme('light');
	}, [setTheme]);

	// Create component reference array for full report generation
	const getAllComponents = (): ComponentRef[] => [
		{ name: "cover", ref: coverRef as React.RefObject<HTMLDivElement> },
		{ name: "toc", ref: tocRef as React.RefObject<HTMLDivElement> },
		{ name: "intro1", ref: intro1Ref as React.RefObject<HTMLDivElement> },
		{ name: "intro2", ref: intro2Ref as React.RefObject<HTMLDivElement> },
		{ name: "intro3", ref: intro3Ref as React.RefObject<HTMLDivElement> },
		{ name: "internal1", ref: internal1Ref as React.RefObject<HTMLDivElement> },
		{ name: "internal2", ref: internal2Ref as React.RefObject<HTMLDivElement> },
		{ name: "internal3", ref: internal3Ref as React.RefObject<HTMLDivElement> },
		{ name: "external", ref: externalRef as React.RefObject<HTMLDivElement> },
		{ name: "esg8", ref: esg8Ref as React.RefObject<HTMLDivElement> },
		{
			name: "industrialization",
			ref: industrializationRef as React.RefObject<HTMLDivElement>,
		},
		{
			name: "governance1",
			ref: governance1Ref as React.RefObject<HTMLDivElement>,
		},
		{
			name: "governance2",
			ref: governance2Ref as React.RefObject<HTMLDivElement>,
		},
		{ name: "esg9", ref: esg9Ref as React.RefObject<HTMLDivElement> },
		{ name: "esg10", ref: esg10Ref as React.RefObject<HTMLDivElement> },
		{ name: "esg11", ref: esg11Ref as React.RefObject<HTMLDivElement> },
		{ name: "esg12", ref: esg12Ref as React.RefObject<HTMLDivElement> },
		{ name: "esg13", ref: esg13Ref as React.RefObject<HTMLDivElement> },
		{ name: "endnotes1", ref: endnotes1Ref as React.RefObject<HTMLDivElement> },
		{ name: "endnotes2", ref: endnotes2Ref as React.RefObject<HTMLDivElement> },
		{ name: "appendix", ref: appendixRef as React.RefObject<HTMLDivElement> },
		{ name: "endpage", ref: endpageRef as React.RefObject<HTMLDivElement> },
	];


	// Full report download functions using the utility
	const downloadFullReportWithMethod = async (
		method: "react-to-pdf" | "html2canvas" | "react-pdf",
		quality: "low" | "medium" | "high" = "high"
	) => {
		const components = getAllComponents();
		const timestamp = new Date()
			.toISOString()
			.slice(0, 19)
			.replace(/[:.]/g, "-");
		const filename = `esg-full-report-${method}-${timestamp}.pdf`;

		setIsGeneratingPDF(`full-${method}`);

		try {
			await PDFGenerator.generateFullReport(components, filename, {
				method,
				quality,
				format: "a4",
				orientation: "portrait",
			});
		} catch (error) {
			console.error(`Full report generation failed for ${method}:`, error);
			alert(
				`Full report generation failed for ${method}. ${error instanceof Error ? error.message : String(error)
				}`
			);
		} finally {
			setIsGeneratingPDF(null);
		}
	};

	// Create refs for each individual component
	const coverRef = useRef<HTMLDivElement>(null);
	const tocRef = useRef<HTMLDivElement>(null);
	const intro1Ref = useRef<HTMLDivElement>(null);
	const intro2Ref = useRef<HTMLDivElement>(null);
	const intro3Ref = useRef<HTMLDivElement>(null);
	const internal1Ref = useRef<HTMLDivElement>(null);
	const internal2Ref = useRef<HTMLDivElement>(null);
	const internal3Ref = useRef<HTMLDivElement>(null);
	const externalRef = useRef<HTMLDivElement>(null);
	const esg8Ref = useRef<HTMLDivElement>(null);
	const industrializationRef = useRef<HTMLDivElement>(null);
	const governance1Ref = useRef<HTMLDivElement>(null);
	const governance2Ref = useRef<HTMLDivElement>(null);
	const esg9Ref = useRef<HTMLDivElement>(null);
	const esg10Ref = useRef<HTMLDivElement>(null);
	const esg11Ref = useRef<HTMLDivElement>(null);
	const esg12Ref = useRef<HTMLDivElement>(null);
	const esg13Ref = useRef<HTMLDivElement>(null);
	const endnotes1Ref = useRef<HTMLDivElement>(null);
	const endnotes2Ref = useRef<HTMLDivElement>(null);
	const appendixRef = useRef<HTMLDivElement>(null);
	const endpageRef = useRef<HTMLDivElement>(null);

	// Individual component download functions using html2canvas-pro
	const downloadComponent = async (
		ref: React.RefObject<HTMLDivElement>,
		filename: string,
		componentName: string
	) => {
		if (!ref.current) return;

		setIsGeneratingPDF(componentName);
		try {
			const canvas = await html2canvas(ref.current, {
				scale: 2,
				useCORS: true,
				allowTaint: false,
				backgroundColor: '#ffffff',
				logging: false,
				width: ref.current.scrollWidth,
				height: ref.current.scrollHeight,
				imageTimeout: 15000,
				removeContainer: false,
				foreignObjectRendering: true
			});

			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF({
				orientation: 'portrait',
				unit: 'mm',
				format: 'a4'
			});

			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();
			const imgWidth = pdfWidth;
			const imgHeight = (canvas.height * pdfWidth) / canvas.width;

			if (imgHeight <= pdfHeight) {
				const xOffset = (pdfWidth - imgWidth) / 2;
				pdf.addImage(imgData, 'PNG', xOffset, 0, imgWidth, imgHeight);
			} else {
				const scaleFactor = pdfHeight / imgHeight;
				const scaledWidth = imgWidth * scaleFactor;
				const xOffset = (pdfWidth - scaledWidth) / 2;
				pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, pdfHeight);
			}

			pdf.save(filename);
		} catch (error) {
			console.error("Error generating PDF:", error);
			alert(
				`Failed to generate PDF for ${filename}. ${error instanceof Error ? error.message : String(error)}`
			);
		} finally {
			setIsGeneratingPDF(null);
		}
	};

	const downloadWithHtml2Canvas = async (
		ref: React.RefObject<HTMLDivElement>,
		filename: string,
		componentName: string
	) => {
		if (!ref.current) return;

		setIsGeneratingPDF(`${componentName}-h2c`);
		try {
			const canvas = await html2canvas(ref.current, {
				scale: 2,
				useCORS: true,
				allowTaint: true,
				backgroundColor: "#ffffff",
				logging: false,
			});

			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: "a4",
			});

			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();
			const imgWidth = pdfWidth;
			const imgHeight = (canvas.height * pdfWidth) / canvas.width;

			if (imgHeight <= pdfHeight) {
				const xOffset = (pdfWidth - imgWidth) / 2;
				pdf.addImage(imgData, "PNG", xOffset, 0, imgWidth, imgHeight);
			} else {
				const scaleFactor = pdfHeight / imgHeight;
				const scaledWidth = imgWidth * scaleFactor;
				const xOffset = (pdfWidth - scaledWidth) / 2;
				pdf.addImage(imgData, "PNG", xOffset, 0, scaledWidth, pdfHeight);
			}

			pdf.save(filename);
		} catch (error) {
			console.error("HTML2Canvas PDF generation failed:", error);
			alert(
				`HTML2Canvas PDF generation failed for ${filename}. ${error instanceof Error ? error.message : String(error)
				}`
			);
		} finally {
			setIsGeneratingPDF(null);
		}
	};

	const downloadWithReactPDF = async (
		ref: React.RefObject<HTMLDivElement>,
		filename: string,
		componentName: string
	) => {
		if (!ref.current) return;

		setIsGeneratingPDF(`${componentName}-rpdf`);
		try {
			// Clone element to avoid modifying original
			const clonedElement = ref.current.cloneNode(true) as HTMLElement;

			// Remove problematic elements
			const scriptsAndStyles = clonedElement.querySelectorAll("script, style");
			scriptsAndStyles.forEach((el) => el.remove());

			const MyDocument = PDFGenerator.createReactPDFDocument(
				clonedElement,
				componentName
			);
			const blob = await pdf(<MyDocument />).toBlob();

			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("React-PDF generation failed:", error);
			alert(
				`React-PDF generation failed for ${filename}. ${error instanceof Error ? error.message : String(error)
				}`
			);
		} finally {
			setIsGeneratingPDF(null);
		}
	};

	return (
		<div className="container mx-auto py-8">
			<div
				ref={fullReportRef}
				className="pdf-container"
				style={{
					width: "794px",
					margin: "0 auto",
				}}
			>
				{/* Ensure images are loaded before PDF generation */}
				<style
					dangerouslySetInnerHTML={{
						__html: `
					.pdf-container img {
						max-width: 100%;
						height: auto;
						opacity: 0;
						animation: fadeIn 0.5s ease-in-out forwards;
					}

					@keyframes fadeIn {
						to {
							opacity: 1;
						}
					}

					/* Ensure all images are loaded */
					.pdf-container img[src] {
						animation-delay: 0.2s;
					}
					`,
					}}
				/>
				<div className="report-content">
					<div ref={coverRef}>
						<CoverPage pageNumber={1} />
					</div>
					<div ref={tocRef}>
						<TableOfContents pageNumber={2} />
					</div>
					<div ref={intro1Ref}>
						<IntroductionPage
							pageNumber={3}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={intro2Ref}>
						<IntroductionPage2
							pageNumber={4}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={intro3Ref}>
						<IntroductionPage3
							pageNumber={5}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={internal1Ref}>
						<InternalBarriersPage1
							pageNumber={6}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={internal2Ref}>
						<InternalBarriersPage2
							pageNumber={7}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>{" "}
					</div>
					<div ref={internal3Ref}>
						<InternalBarriersPage3
							pageNumber={8}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={externalRef}>
						<ExternalBarriersPage
							pageNumber={9}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={esg8Ref}>
						<ESGPage8
							pageNumber={10}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={esg9Ref}>
						<ESGPage9
							pageNumber={11}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={esg10Ref}>
						<ESGPage10
							pageNumber={12}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={esg11Ref}>
						<ESGPage11
							pageNumber={13}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={esg12Ref}>
						<ESGPage12
							pageNumber={14}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={esg13Ref}>
						<ESGPage13
							pageNumber={15}
							width={794}
							height={1123}
							showFootnotes={showFootnotes}
						/>
					</div>
					<div ref={endnotes1Ref}>
						<EndnotesPage
							pageNumber={16}
							footnoteStart={1}
							footnoteEnd={45}
							startFromNote={1}
							showHeading={true}
						/>
					</div>
					<div ref={endnotes2Ref}>
						<EndnotesPage
							pageNumber={17}
							footnoteStart={46}
							footnoteEnd={63}
							startFromNote={28}
							showHeading={false}
						/>
					</div>
					<div ref={endpageRef}>
						<Endpage pageNumber={21} />
					</div>
				</div>
			</div>
		</div>
	);
}

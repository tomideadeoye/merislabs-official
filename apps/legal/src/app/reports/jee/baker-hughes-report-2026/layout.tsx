export const metadata = {
    title: 'Baker Hughes: 2026 Strategic Legal Outlook',
    description: 'Annual Status Report by Jackson Etti & Edu. Featuring Litigation Portfolio Analysis, 2025 Case Resolutions, and the 2026 Execution Strategy. Powered by Meris Labs Sovereign Infrastructure.',
    openGraph: {
        title: 'Baker Hughes: 2026 Strategic Legal Outlook',
        description: 'Litigation Portfolio Analysis, 2025 Case Resolutions, and the 2026 Execution Strategy. A Jackson Etti & Edu Status Report.',
        url: 'https://legal.merislabs.com/reports/jee/baker-hughes-report-2026',
        siteName: 'Jackson Etti & Edu | Meris Labs',
        images: [
            {
                url: 'https://legal.merislabs.com/branding/baker_hughes_og.png',
                width: 1200,
                height: 630,
                alt: 'Baker Hughes 2026 Status Report - Secured by Meris Labs',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Baker Hughes: 2026 Strategic Legal Outlook',
        description: 'Annual Status Report by Jackson Etti & Edu. Powered by Meris Labs.',
        images: ['https://legal.merislabs.com/branding/baker_hughes_og.png'],
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

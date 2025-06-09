"use client";
import React, { useState, useMemo } from "react";

interface Deck {
  title: string;
  iframe: string;
  link: string;
  client: string;
  tags: string[];
}

// All deck data is now in this file
const decks: Deck[] = [
  {
    "title": "African Startup Review presentation for Timi",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/uSHyLAV4WE3y4D?hostedIn=slideshare&page=upload",
    "link": "https://www.slideshare.net/slideshow/embed_code/key/uSHyLAV4WE3y4D?hostedIn=slideshare&page=upload",
    "client": "Timileyin Idowu",
    "tags": ["Africa", "Startup", "Review", "Presentation", "Timi"]
  },
  {
    "title": "DeFi Protocols: Business Models, Revenue Streams, and Sustainability",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/2ElMQ82Etd1bLI?startSlide=1",
    "link": "https://www.slideshare.net/slideshow/defi-protocols-business-models-revenue-streams-and-sustainability-72a2/276257056",
    "client": "MerisLabs",
    "tags": ["DeFi", "Finance", "Protocols", "Business Models", "Sustainability"]
  },
  {
    "title": "Digital Transformation in Education: Trends, Frameworks, and Case Studies",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/3XmCVcUAFXfCK2?startSlide=1",
    "link": "https://www.slideshare.net/slideshow/digital-transformation-in-education-trends-frameworks-and-case-studies/276191841",
    "client": "MerisLabs",
    "tags": ["Education", "Digital Transformation", "Frameworks", "Case Studies"]
  },
  {
    "title": "Legal Pages Magazine: Law, COVID-19, and Technology",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/znd08lqf8TBWsD?startSlide=1",
    "link": "https://www.slideshare.net/slideshow/legal-pages-magazine-law-covid-19-and-technology/276181658",
    "client": "MerisLabs",
    "tags": ["Law", "COVID-19", "Technology", "Magazine"]
  },
  {
    "title": "Understanding Nigerian Taxes A Comprehensive Handbook for Tax Enthusiasts.pdf",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/6wUr7amntGCswB?startSlide=1",
    "link": "https://www.slideshare.net/slideshow/understanding-nigerian-taxes-a-comprehensive-handbook-for-tax-enthusiasts-pdf/276163470",
    "client": "MerisLabs",
    "tags": ["Tax", "Nigeria", "Handbook", "Finance"]
  },
  {
    "title": "The Nigerian Insurance Industry An Overview of the Regulatory & Commercial Landscape - Obafemi Agaba .pdf",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/NINRrQFB4UdTre?startSlide=1",
    "link": "https://www.slideshare.net/slideshow/the-nigerian-insurance-industry-an-overview-of-the-regulatory-commercial-landscape-obafemi-agaba-pdf/276154806",
    "client": "MerisLabs",
    "tags": ["Insurance", "Nigeria", "Regulation", "Commerce"]
  },
  {
    "title": "VerifyPro: A real estate management pitch deck",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/C0cFij9FGAU0Hg?startSlide=1",
    "link": "https://www.slideshare.net/slideshow/verifypro-a-real-estate-management-pitch-deck/276153996",
    "client": "MerisLabs",
    "tags": ["Real Estate", "Management", "Pitch Deck"]
  },
  {
    "title": "AI IN FRAUD DETECTION; TOMIDE ADEOYE.pdf",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/whmgP1moV0ydMl?startSlide=1",
    "link": "https://www.slideshare.net/slideshow/ai-in-fraud-detection-tomide-adeoye-pdf/276133039",
    "client": "MerisLabs",
    "tags": ["AI", "Fraud Detection", "Finance"]
  },
  {
    "title": "A Tech-Driven Approach to Land Ownership Transparency",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/tIpfebzR67BwPW?startSlide=1",
    "link": "https://www.slideshare.net/slideshow/a-tech-driven-approach-to-land-ownership-transparency/276130608",
    "client": "MerisLabs",
    "tags": ["Land Ownership", "Transparency", "Tech"]
  },
  {
    "title": "JEE Data Protection Newsletter - January 2025 - MerisLabs.pdf",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/KmM7Ofqe4N4hTi?startSlide=1",
    "link": "https://www.slideshare.net/slideshow/jee-data-protection-newsletter-january-2025-merislabs-pdf/275746018",
    "client": "MerisLabs",
    "tags": ["Data Protection", "Newsletter", "2025"]
  },
  {
    "title": "Nigerian Tax Research Network Presentation; Tomide Adeoye.ppsx",
    "iframe": "https://www.slideshare.net/slideshow/embed_code/key/tsTd0FoVFnfeS?startSlide=1",
    "link": "https://www.slideshare.net/slideshow/nigerian-tax-research-network-presentation-tomide-adeoye-ppsx/274809170",
    "client": "MerisLabs",
    "tags": ["Tax", "Nigeria", "Research", "Presentation"]
  },
  {
    "title": "Copy of Blue Home Decor Interior Design Presentation",
    "iframe": "https://www.canva.com/design/DAGhK2aVnRo/TyrIsHbSZJYBokRxZZ8VeA/view?embed",
    "link": "https://www.canva.com/design/DAGhK2aVnRo/TyrIsHbSZJYBokRxZZ8VeA/view?utm_content=DAGhK2aVnRo&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
    "client": "Tomide Adeoye",
    "tags": ["Interior Design", "Home Decor", "Presentation"]
  },
  {
    "title": "TLcom Assessment  ",
    "iframe": "https://www.canva.com/design/DAFetMaQ5jQ/M67_tLZX0yVEYVOgyGw0Gg/view?embed",
    "link": "https://www.canva.com/design/DAFetMaQ5jQ/M67_tLZX0yVEYVOgyGw0Gg/view?utm_content=DAFetMaQ5jQ&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
    "client": "Adeoye Tomide",
    "tags": ["Assessment", "TLcom"]
  },
  {
    "title": "Kuramo Investment paper - Timileyin Idowu",
    "iframe": "https://www.canva.com/design/DAGJjBzb9RQ/pLJHolL-ZO-8gQUMZ42dMw/view?embed",
    "link": "https://www.canva.com/design/DAGJjBzb9RQ/pLJHolL-ZO-8gQUMZ42dMw/view?utm_content=DAGJjBzb9RQ&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
    "client": "Timileyin Idowu",
    "tags": ["Investment", "Kuramo"]
  },
  {
    "title": "Copy of QOREPAY DECK (SALES)",
    "iframe": "https://www.canva.com/design/DAGhKw2BNsw/reaCdwf5J9FTklFUaeFZIg/view?embed",
    "link": "https://www.canva.com/design/DAGhKw2BNsw/reaCdwf5J9FTklFUaeFZIg/view?utm_content=DAGhKw2BNsw&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
    "client": "Tomide Adeoye",
    "tags": ["QOREPAY", "Sales", "Deck"]
  },
  {
    "title": "Copy of Businesses in Africa struggle with: - Poor customer service - High operational costs - Limited access to skilled outsourcing solutions Global BPO providers do not fully cater to Africa's unique needs.",
    "iframe": "https://www.canva.com/design/DAGnUK85WoQ/6_wLW_7NDbcCUnJLcnW1uQ/view?embed",
    "link": "https://www.canva.com/design/DAGnUK85WoQ/6_wLW_7NDbcCUnJLcnW1uQ/view?utm_content=DAGnUK85WoQ&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
    "client": "Tomide Adeoye",
    "tags": ["Africa", "Customer Service", "BPO", "Operations"]
  }
];

function DeckTags({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function DecksPage() {
  const [search, setSearch] = useState("");

  // Filter decks by title, author, or tags (case-insensitive, partial match)
  const filteredDecks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return decks;
    return decks.filter((deck: any) => {
      const title = (deck.title || "").toLowerCase();
      const author = (deck.author || "").toLowerCase();
      const tags = (deck.tags || []).map((t: string) => t.toLowerCase()).join(" ");
      return (
        title.includes(q) ||
        author.includes(q) ||
        tags.includes(q)
      );
    });
  }, [search]);

  return (
    <div className="container mx-auto py-8 mt-16">
      <h1 className="text-3xl font-bold mb-6">MerisLabs Decks & Presentations</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, author, or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredDecks.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No decks found.</div>
        ) : (
          filteredDecks.map((deck: any, idx: number) => (
            <div key={idx} className="bg-white rounded-lg shadow p-4">
              {deck.iframe && (
                <div className="mb-2">
                  <iframe
                    src={deck.iframe}
                    width="100%"
                    height="400"
                    frameBorder="0"
                    allowFullScreen
                    style={{ border: "1px solid #CCC", borderRadius: "8px" }}
                    title={deck.title}
                  />
                </div>
              )}
              <div>
                <a
                  href={deck.link}
                  target="_blank"
                  rel="noopener"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {deck.title}
                </a>
                <div className="text-sm text-gray-500">Client: {deck.client || "Unknown"}</div>
                <DeckTags tags={deck.tags} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

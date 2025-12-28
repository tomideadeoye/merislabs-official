import React from 'react';
import { SmartPage } from '../SmartPage';

interface ESGPageTestProps {
  pageNumber?: number;
  footnoteStart?: number;
  footnotes?: string[];
}

const defaultFootnotes = [
  'World Bank SME Finance. Available at <https://www.worldbank.org/en/topic/smefinance> (Accessed 3 August 2025)',
  'World Finance (n.d.) *Can hybrid finance unburden Africa\'s shaky SME sector?* Available at: <https://www.worldfinance.com/markets/can-hybrid-finance-unburden-africas-shaky-sme-sector> (Accessed 3 August 2025)',
  'Moniepoint (n.d.) *Nigeria small business statistics: Everything you should know in 2024*. Available at <https://moniepoint.com/blog/nigeria-small-business-statistics> (Accessed 3 August 2025)',
  'Section 2 of the National Minimum Wage (Amendment) Act, 2024, provides that every employer in Nigeria shall pay a national minimum wage of not less than ₦70,000.00 per month to every worker under his/her establishment. The Act also shortened the wage rate review period from 5 years to 3 years.',
  'Additional footnote for testing pagination with many footnotes. This is a longer footnote to test how the system handles varying footnote heights.',
  'Another test footnote to ensure our pagination system can handle multiple footnotes without overlapping with the main content area.',
  'Yet another footnote to make sure we have enough footnotes to properly test the dynamic height calculation and positioning system.'
];

export const ESGPageTest: React.FC<ESGPageTestProps> = ({ pageNumber, footnoteStart, footnotes = defaultFootnotes }) => {
  return (
    <SmartPage
      pageNumber={pageNumber}
      footnoteStart={footnoteStart}
      footnotes={footnotes}
    >
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Test Page for Dynamic Pagination System</h1>

      <h2 className="text-xl font-semibold mb-3 mt-6 text-blue-500">Introduction to Pagination Testing</h2>

      <p className="mb-4">
        This page is specifically designed to test the dynamic pagination system. Small and Medium-sized Enterprises (SMEs) form the backbone of economies globally, driving inclusive growth, job creation, poverty reduction, and innovation. Worldwide, SMEs make up around 90% of businesses and contribute over 50% of global GDP<sup>1</sup>. The impact is even more pronounced in Africa, where they represent over 90% of all businesses and provide nearly 80% of total employment<sup>2</sup>. In Nigeria, SMEs account for 96% of all businesses, contribute 48% to national GDP, and employ about half of the country's workforce<sup>3</sup>.
      </p>

      <h2 className="text-xl font-semibold mb-3 mt-6 text-blue-500">Detailed Analysis of ESG Constraints</h2>

      <p className="mb-4">
        As a dominant force, SMEs are well-positioned to shape environmental, social, and governance (ESG) outcomes through their operations, workforce practices, and governance structures. Although individual SMEs have relatively modest operations, their collective environmental impact is substantial, particularly in terms of cumulative carbon emissions. On the social front, SME businesses often fall short in addressing labour standards, inequality concerns, or broader community development. For instance, Nigeria's recent minimum wage increased from ₦30,000 to ₦70,000<sup>4</sup> has not been widely adopted in the SME sector due to affordability concerns or weak enforcement. In addition, structured corporate social responsibility initiatives are largely absent, even at a small scale<sup>5</sup>.
      </p>

      <p className="mb-4">
        From a governance perspective, many SMEs operate informally or semi-formally, with limited or no internal structure to support for decision-making, financial transparency, accountability, or regulatory compliance. This weak governance framework often leads to mismanagement, business fragility, and ultimately financial collapse. Considering that SMEs account for the majority of employment in Nigeria, such failures contribute significantly to rising unemployment and economic instability<sup>6</sup>.
      </p>

      <h2 className="text-xl font-semibold mb-3 mt-6 text-blue-500">Extended Content for Pagination Testing</h2>

      <p className="mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>

      <p className="mb-4">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
      </p>

      <p className="mb-4">
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
      </p>

      <h2 className="text-xl font-semibold mb-3 mt-6 text-blue-500">More Content for Testing</h2>

      <p className="mb-4">
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
      </p>

      <p className="mb-4">
        Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
      </p>

      <p className="mb-4">
        Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>

      <h2 className="text-xl font-semibold mb-3 mt-6 text-blue-500">Final Section for Pagination Testing</h2>

      <p className="mb-4">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo<sup>7</sup>.
      </p>

      <p className="mb-4">
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
      </p>
    </SmartPage>
  );
};

(ESGPageTest as any).defaultProps = {
  footnotes: defaultFootnotes
};
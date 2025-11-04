import React from 'react';
import { MorganHacksPage1 } from './morganhacks/MorganHacksPage1';
import { MorganHacksPage2 } from './morganhacks/MorganHacksPage2';
import { MorganHacksPage3 } from './morganhacks/MorganHacksPage3';
import { MorganHacksPage4 } from './morganhacks/MorganHacksPage4';
import { MorganHacksPage5 } from './morganhacks/MorganHacksPage5';
import { MorganHacksPage6 } from './morganhacks/MorganHacksPage6';

interface MorganHacksPageProps {
    width?: number;
    height?: number;
    currentPage?: number;
    columns?: number;
}

export const MorganHacksPage: React.FC<MorganHacksPageProps> = ({
    width = 794,
    height = 1123,
    currentPage = 1,
    columns = 1
}) => {
    const renderPage = () => {
        switch (currentPage) {
            case 1:
                return <MorganHacksPage1 width={width} height={height} columns={columns} />;
            case 2:
                return <MorganHacksPage6 width={width} height={height} columns={columns} />;
            case 3:
                return <MorganHacksPage2 width={width} height={height} columns={columns} />;
            case 4:
                return <MorganHacksPage3 width={width} height={height} columns={columns} />;
            case 5:
                return <MorganHacksPage4 width={width} height={height} columns={columns} />;
            case 6:
                return <MorganHacksPage5 width={width} height={height} columns={columns} />;
            default:
                return <MorganHacksPage1 width={width} height={height} columns={columns} />;
        }
    };

    return (
        <div key={`morganhacks-page-${currentPage}`}>
            {renderPage()}
        </div>
    );
};

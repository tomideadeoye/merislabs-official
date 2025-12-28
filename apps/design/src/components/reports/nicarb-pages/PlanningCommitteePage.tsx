import React from 'react';
import { Page } from './Page';
import { Nicarb2025ConferenceFooter } from './ui/footer';

export function PlanningCommitteePage() {
    const leadership = [
        {
            name: "CHIEF BOLAJI AYORINDE, OFR, SAN, FCArb.",
            role: "Chair, Annual Conference Planning Committee",
            imageSrc: "/nicarb/committee-images/Chief bolaji ayorinde.jpg"
        },
        {
            name: "LADY DEBBIE OBODOUKWU, FCArb",
            role: "Co-Chair, Annual Conference Planning Committee & Chair, Fundraising Committee",
            imageSrc: "/nicarb/committee-images/LADY DEBBIE OBODOUKWU, FCArb.png"
        },
    ];

    const subCommitteeChairs = [
        {
            name: "DR. ERIMMA GLORIA ORIE, FCArb.",
            role: "Chair, Content and Programme Committee",
            imageSrc: "/nicarb/committee-images/DR. ERIMMA GLORIA ORIE, FCArb..png"
        },
        {
            name: "TAIWO OGBARA, MCArb",
            role: "Co-Chair, Content and Programme Committee",
            imageSrc: "/nicarb/attendee-images/image29.png"
        },
        {
            name: "PROF. FOLUKE DADA-LAWANSON, MCArb.",
            role: "Chair, Information and Technology",
            imageSrc: "/nicarb/committee-images/PROF. FOLUKE DADA-LAWANSON, MCArb..png"
        },
        {
            name: "PROF ABIODUN AMUDA-KANNIKE SAN, FCArb.",
            role: "Chair, Media and Publicity",
            imageSrc: "/nicarb/committee-images/PROF ABIODUN AMUDA-KANNIKE SAN, FCArb..png"
        },
        {
            name: "CHARLES IFEANYI MOZIE, MCArb",
            role: "Chair, Planning And Logistics Committee",
            imageSrc: "/nicarb/committee-images/CHARLES IFEANYI MOZIE, MCArb.png"
        },
        {
            name: "MKPONG UWEM ARCHIBONG, MCArb",
            role: "Co-Chair, Planning and Logistics Committee",
            imageSrc: "/nicarb/committee-images/MKPONG UWEM ARCHIBONG, MCArb Co-Chair  Planing and  Logistics Committee.png"
        },
    ];

    const members = [
        { name: "R. A. LAWAL-RABANA SAN, FCArb", imageSrc: "/nicarb/committee-images/R. A. LAWAL-RABANA SAN, FCArb.png" },
        { name: "DHESEVIANO EMIASO, Ph.D, B.L, ACArb, MI-UK", imageSrc: "/nicarb/committee-images/DHESEVIANO EMIASO, Ph.D, B.L, ACArb, MI-UK.png" },
        { name: "OMOTAYO SAKA, MCArb", imageSrc: "/nicarb/committee-images/OMOTAYO SAKA, MCArb.png" },
        { name: "PROF. BANK-OLA STEVE ABAYOMI, Ph.D, MCArb", imageSrc: "/nicarb/committee-images/PROF. BANK-OLA STEVE ABAYOMI, Ph.D, MCArb.png" },
        { name: "OMOTAYO AWOMOLO-ENUJIUGHA, MCArb", imageSrc: "/nicarb/committee-images/OMOTAYO AWOMOLO-ENUJIUGHA, MCArb.png" },
        { name: "BARR. MRS. OLAOLUWA ELIZABETH AKINREMI, MCArb", imageSrc: "/nicarb/committee-images/BARR. MRS. OLAOLUWA ELIZABETH AKINREMI, MCArb.png" },
        { name: "DIKE RUBY OROMA, MCArb", imageSrc: "/nicarb/committee-images/DIKE RUBY OROMA, MCArb.png" },
        { name: "CHIDERA EZENWANNE, ACArb", imageSrc: "/nicarb/committee-images/CHIDERA EZENWANNE, ACArb.png" },
        { name: "YUSUF YUSUF, MCArb", imageSrc: "/nicarb/committee-images/YUSUF YUSUF, MCArb.png" },
        { name: "DR. JULIET ORIE REX-CHIKEZIE, MCArb", imageSrc: "/nicarb/committee-images/DR. JULIET ORIE REX-CHIKEZIE, MCArb.png" },
        { name: "AMARACHI GOODNESS ARINZE-UCHENDU, ACArb", imageSrc: "/nicarb/committee-images/AMARACHI GOODNESS ARINZE-UCHENDU, ACArb.png" },
        { name: "DR. BIEKOROMA CHARITY AMAPAKABO, MCArb", imageSrc: "/nicarb/committee-images/DR. BIEKOROMA CHARITY  AMAPAKABO, MCArb.png" },
        { name: "OLUWAFUNMILADE ADEWALE, ACArb", imageSrc: "/nicarb/committee-images/OLUWAFUNMILADE ADEWALE, ACArb.png" },
        { name: "SAMUEL OROBOSA OSARENREN, MCArb", imageSrc: "/nicarb/committee-images/SAMUEL OROBOSA OSARENREN, MCArb.png" },
        { name: "ABASIEMEDIONG ETUK, MCArb", imageSrc: "/nicarb/committee-images/ABASIEMEDIONG ETUK, MCArb.png" },
        { name: "EMMANUEL EJIOFOR UGWUANYI, ACArb", imageSrc: "/nicarb/committee-images/EMMANUEL EJIOFOR UGWUANYI,  ACArb .png" },
        { name: "OSATOHANMWEN UWAGBOE, ACArb", imageSrc: "/nicarb/committee-images/OSATOHANMWEN UWAGBOE, ACArb.png" },
        { name: "TAWAKALTU TORIOLA, MCArb", imageSrc: "/nicarb/committee-images/TAWAKALTU TORIOLA,  MCArb.png" },
        { name: "MICHAEL MFON ESSO, MCArb", imageSrc: "/nicarb/committee-images/MICHAEL MFON ESSO, MCArb.png" },
        { name: "OLUFISAYO ABIDOYE, ACArb", imageSrc: "/nicarb/committee-images/OLUFISAYO ABIDOYE, ACArb.png" },
        { name: "MOYEGE LAW-ADEPOJU, GRADICSAN, MCArb", imageSrc: "/nicarb/committee-images/MOYEGE LAW-ADEPOJU, GRADICSAN, MCArb.png" },
        { name: "CHINYERE IYK-OHAEGBULAM, ACArb", imageSrc: "/nicarb/committee-images/CHINYERE IYK-OHAEGBULAM, ACArb.png" },
        { name: "REX UDUAMOLI ERAMEH, MCArb", imageSrc: "/nicarb/committee-images/REX UDUAMOLI ERAMEH,  MCArb.png" },
        { name: "DAZE CHIDOZIE NGA, MCArb", imageSrc: "/nicarb/committee-images/DAZE CHIDOZIE NGA, MCArb.png" },
        { name: "BARR.NGOZI DOROTHY OSUNWA, MCArb", imageSrc: "/nicarb/committee-images/BARR.NGOZI DOROTHY OSUNWA, MCArb.png" },
        { name: "EBIEKIBO JUDITH EDWARD PAGSON, ACArb", imageSrc: "/nicarb/committee-images/EBIEKIBO JUDITH EDWARD PAGSON, ACArb.png" },
        { name: "ASIYA ABUBAKAR, ACArb", imageSrc: "/nicarb/committee-images/ASIYA ABUBAKAR, ACArb.png" },
        { name: "MACSUNNY EZIKPE NWOKE, ACArb", imageSrc: "/nicarb/committee-images/MACSUNNY EZIKPE NWOKE, ACArb.png" }
    ];

    return (
        <>
            {/* Page 20: Leadership & Chairs */}
            <Page className="bg-white text-[#064802] p-8 flex flex-col">
                <div className="flex-1 flex flex-col">
                    <h2 className="text-2xl font-bold text-center mb-3 border-b-4 border-[#2dc27a] pb-2 inline-block w-full text-[#064802] font-serif">
                        2025 ANNUAL CONFERENCE PLANNING COMMITTEE
                    </h2>
                    <p className="text-center text-[#3d8f02] font-medium uppercase tracking-widest text-xs mb-5">
                        Leadership
                    </p>

                    {/* Leadership - Flex Row */}
                    <div className="flex justify-center items-start gap-6 mb-6 w-full">
                        {leadership.map((leader, idx) => (
                            <div key={idx} className="flex flex-col items-center w-[180px]">
                                {/* Image with green border and corner accent */}
                                <div className="w-full h-[225px] relative overflow-visible border-[3px] border-[#3d8f02] bg-white">
                                    <div className="absolute -top-2 -left-2 w-7 h-7 border-t-4 border-l-4 border-[#559203]"></div>
                                    <img
                                        src={leader.imageSrc}
                                        alt={leader.name}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                                {/* Text outside the bordered box */}
                                <div className="mt-2 flex flex-col items-center text-center w-full">
                                    <h3 className="font-bold text-[10px] leading-tight mb-1 text-[#064802]">{leader.name}</h3>
                                    <p className="text-[8px] leading-tight text-gray-600 uppercase tracking-wide font-medium">{leader.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-[#3d8f02] font-medium uppercase tracking-widest text-xs mb-4">
                        Sub-Committee Chairs
                    </p>

                    {/* Sub-Committee Chairs - 3 column grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {subCommitteeChairs.map((chair, idx) => (
                            <div key={idx} className="flex flex-col items-center max-w-[160px] mx-auto min-h-[240px]">
                                {/* Image with green border and corner accent */}
                                <div className="w-full h-[200px] relative overflow-visible border-[3px] border-[#3d8f02] bg-white">
                                    <div className="absolute -top-2 -left-2 w-7 h-7 border-t-4 border-l-4 border-[#559203]"></div>
                                    <img
                                        src={chair.imageSrc}
                                        alt={chair.name}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                                {/* Text outside the bordered box */}
                                <div className="mt-1.5 flex flex-col items-center text-center w-full flex-1">
                                    <h3 className="font-bold text-[9px] leading-tight mb-0.5 text-[#064802]">{chair.name}</h3>
                                    <p className="text-[7.5px] leading-tight text-gray-600 uppercase tracking-wide font-medium">{chair.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Nicarb2025ConferenceFooter pageNumber="22" />
            </Page>

            {/* Page 23: Members */}
            <Page className="bg-white text-[#064802] p-6 flex flex-col">
                <div className="flex-1 flex flex-col">
                    <h2 className="text-2xl font-bold text-center mb-2 text-[#064802] font-serif border-b-4 border-[#2dc27a] pb-2 inline-block w-full">
                        COMMITTEE MEMBERS
                    </h2>
                    <p className="text-center text-[#3d8f02] font-medium uppercase tracking-widest text-xs mb-4">
                        2025 Annual Conference Planning Committee
                    </p>

                    {/* Dense Grid for Members - 5 Columns */}
                    <div className="grid grid-cols-5 gap-2">
                        {members.map((member, idx) => (
                            <div key={idx} className={`flex flex-col items-center max-w-[105px] mx-auto min-h-[160px] ${idx === 25 ? 'col-start-2' : ''}`}>
                                {/* Image area with green border - portrait orientation */}
                                <div className="w-full aspect-[4/5] relative overflow-visible border-3 border-[#3d8f02] bg-white">
                                    {/* Decorative L-shaped corner accent */}
                                    <div className="absolute -top-2 -left-2 w-7 h-7 border-t-4 border-l-4 border-[#559203]"></div>
                                    <img src={member.imageSrc} alt={member.name} className="w-full h-full object-cover object-center" />
                                </div>
                                {/* Text area - outside the bordered box */}
                                <div className="mt-1 flex flex-col items-center text-center w-full flex-1">
                                    <p className="text-[6.5px] font-bold text-[#559203] leading-tight">{member.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Nicarb2025ConferenceFooter pageNumber="23" />
            </Page>
        </>
    );
}

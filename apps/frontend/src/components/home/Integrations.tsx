import IntegrationsColumn from '@/components/home/IntegrationsColumn';
import Tag from '@/components/home/Tag';

const integrations = [
    {
        name: 'Google Meet',
        icon: '/assets/company-logos/meet.svg',
        description:
            'From campus placements to technical interviews — Google Meet hosts them all. BlindInterview provides real-time AI assistance to help you prepare and perform at your best.',
    },
    {
        name: 'Zoom Calls',
        icon: '/assets/company-logos/zoom.svg',
        description:
            'BlindInterview seamlessly integrates with Zoom to provide smart, contextual guidance during interviews, helping you showcase your best performance.',
    },
    {
        name: 'Microsoft Teams',
        icon: '/assets/company-logos/teams.svg',
        description:
            'Used by enterprises for structured interviews. BlindInterview supports your preparation with real-time guidance on technical problems and behavioral responses.',
    },
    {
        name: 'HackerRank',
        icon: '/assets/company-logos/hackerrank.svg',
        description:
            'Master coding challenges on HackerRank. BlindInterview analyzes problems and provides guidance to help you develop better solutions and improve your coding skills.',
    },
    {
        name: 'CoderByte',
        icon: '/assets/company-logos/coderbyte.svg',
        description:
            'Strengthen your coding skills with AI-powered logic breakdowns and clean code examples. BlindInterview helps you understand and solve problems better.',
    },
    {
        name: 'CoderPad',
        icon: '/assets/company-logos/coderpad.svg',
        description:
            'Prepare for behavioral questions and technical discussions. BlindInterview helps you craft thoughtful, professional responses to common interview questions.',
    },
    {
        name: 'Mettl Browser',
        icon: '/assets/company-logos/mettl.svg',
        description:
            'Prepare confidently for assessments. BlindInterview provides comprehensive study resources to help you build the knowledge and skills needed to excel.',
    },
];

export type IntegrationsType = typeof integrations;

export default function Integrations() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="container">
                <div className="grid lg:grid-cols-2 items-center lg:gap-16">
                    <div className="">
                        <Tag>Integrations</Tag>
                        <h2 className="text-6xl font-medium mt-6 text-primary">
                            Comprehensive. Integrated. Effective.
                        </h2>
                        <p className="text-muted-foreground mt-4 text-lg">
                            BlindInterview provides comprehensive support across multiple platforms
                            and interview formats. Access real-time guidance and resources to help
                            you prepare effectively and perform confidently.
                        </p>
                    </div>
                    <div className="">
                        <div className="h-[400px] lg:h-[800px] mt-8 lg:mt-0 grid md:grid-cols-2 gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                            <IntegrationsColumn integrations={integrations} />
                            <IntegrationsColumn
                                reverse
                                integrations={integrations.slice().reverse()}
                                className="hidden md:flex"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

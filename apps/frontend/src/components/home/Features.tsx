import Avatar from '@/components/home/Avatar';
import FeatureCard from '@/components/home/FeatureCard';
import Image from 'next/image';
import Key from '@/components/home/Key';
import Tag from '@/components/home/Tag';
// Avatars are now served from public/assets/avatars/

const features = [
    'Real Time Response',
    'Code Transparency',
    'Instant Response',
    'Smart Answers',
    'System Voice Record',
    'Smart Hide',
];

export default function Features() {
    return (
        <section className="py-24" id="Features">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>Features</Tag>
                </div>
                <h2 className="text-6xl font-medium text-center mt-6 px-[2px] max-w-2xl mx-auto">
                    Where power meets <span className="text-primary">simplicity</span>
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        className="md:col-span-2 lg:col-span-1 group"
                        title="Real time Response"
                        description="Very fast response from the top LLMs support."
                    >
                        <div className="aspect-video flex items-center justify-center">
                            <Avatar className="z-40 border-green-500">
                                <Image
                                    src="/assets/avatars/chatgpt.png"
                                    alt="avatar 1"
                                    className="rounded-full"
                                    height={100}
                                    width={100}
                                />
                            </Avatar>
                            <Avatar className="-ml-6 border-amber-500 z-30">
                                <Image
                                    src="/assets/avatars/Claude.png"
                                    alt="avatar 2"
                                    className="rounded-full"
                                    height={100}
                                    width={100}
                                />
                            </Avatar>
                            <Avatar className="-ml-6 border-indigo-500 z-20">
                                <Image
                                    src="/assets/avatars/Gemini.png"
                                    alt="avatar 3"
                                    className="rounded-full"
                                    height={100}
                                    width={100}
                                />
                            </Avatar>
                            <Avatar className="-ml-6 border-transparent group-hover:border-primary transition">
                                <div className="size-full bg-secondary rounded-full inline-flex items-center justify-center gap-1 relative">
                                    <Image
                                        src="/assets/avatars/Llama.png"
                                        alt="avatar 4"
                                        className="absolute size-full rounded-full opacity-0 group-hover:opacity-100 transition"
                                        height={100}
                                        width={100}
                                    />
                                    {Array.from({ length: 3 }).map((_, index) => {
                                        return (
                                            <span
                                                // Removed avatar imports
                                                className="size-1.5 rounded-full bg-foreground inline-flex"
                                                key={index}
                                            ></span>
                                        );
                                    })}
                                </div>
                            </Avatar>
                        </div>
                    </FeatureCard>
                    <FeatureCard
                        className="md:col-span-2 lg:col-span-1 group"
                        title="Interactive prototyping"
                        description="Easy to use, intuitive interface designed for seamless learning."
                    >
                        <div className="aspect-video flex items-center justify-center">
                            <p className="text-[1.9rem] font-extrabold text-muted-foreground group-hover:text-muted-foreground/50 transition duration-500 text-center ">
                                We&apos;ve achieved{' '}
                                <span className="bg-gradient-to-r from-primary block to-secondary bg-clip-text text-transparent relative">
                                    <span className="">PRECISION</span>
                                    <video
                                        src="/assets/WWE.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="absolute bottom-full left-1/2 -translate-1/2 rounded-2xl shadow-xl opacity-0 pointer-none group-hover:opacity-100 transition duration-500"
                                    />
                                </span>{' '}
                                in the Software.
                            </p>
                        </div>
                    </FeatureCard>
                    <FeatureCard
                        className="md:col-span-2 md:col-start-2 lg:col-span-1 group "
                        title="Keyboard quick actions"
                        description="Quick shortcuts for efficient interview preparation and reference."
                    >
                        <div className="aspect-video flex items-center justify-center gap-4">
                            <Key className="w-28 outline-2 outline-offset-4 group-hover:outline-primary outline-transparent transition duration-500 group-hover:translate-y-1">
                                Ctrl
                            </Key>
                            <Key className="outline-2 outline-offset-4 group-hover:outline-primary outline-transparent transition duration-500 group-hover:translate-y-1 delay-150">
                                C
                            </Key>
                            <Key className="outline-2 outline-offset-4 group-hover:outline-primary outline-transparent transition duration-500 group-hover:translate-y-1 delay-300">
                                V
                            </Key>
                        </div>
                    </FeatureCard>
                </div>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    {features.map((feature) => (
                        <div
                            key={feature}
                            className="bg-card border border-border inline-flex px-3 md:px-5 py-1.5 md:py-2 rounded-2xl gap-3 items-center text-[1rem] hover:scale-105 transition duration-500 group"
                        >
                            <span
                                className="bg-primary text-primary-foreground size-5 rounded-full inline-flex items-center justify-center
              group-hover:rotate-45 transition duration-500"
                            >
                                &#10038;
                            </span>
                            <span className="font-[550] md:text-lg">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

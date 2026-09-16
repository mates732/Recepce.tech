import SectionHeading from './SectionHeading';

interface Props {
  title: string;
  heading?: string;
  children: React.ReactNode;
  className?: string;
}

export default function RoomLayout({ title, heading, children, className = '' }: Props) {
  return (
    <main className={`min-h-screen pt-20 pb-24 md:pt-24 md:pb-32 ${className}`}>
      <div className="mx-auto max-w-2xl px-8 md:px-0">
        {heading && (
          <SectionHeading className="mb-6">{heading}</SectionHeading>
        )}
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-black mb-12 md:mb-16">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}
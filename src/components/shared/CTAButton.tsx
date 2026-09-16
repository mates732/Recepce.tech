import Link from 'next/link';

interface Props {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function CTAButton({ href, children, variant = 'primary', className = '' }: Props) {
  const styles = {
    primary:
      'inline-block px-6 py-3 text-sm font-light text-ink bg-black hover:bg-gray-800 rounded-lg transition-all duration-300',
    secondary:
      'inline-block px-6 py-3 text-sm font-light text-black border border-black/[0.15] hover:border-black/[0.4] hover:text-black rounded-lg transition-all duration-300',
  };

  return (
    <Link href={href} className={`${styles[variant]} ${className}`}>
      {children}
    </Link>
  );
}
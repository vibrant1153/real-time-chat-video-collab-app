// frontend/components/ui/Avatar.tsx
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar = ({ src, alt, size = 'md', className }: AvatarProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn('rounded-full overflow-hidden', sizes[size], className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};
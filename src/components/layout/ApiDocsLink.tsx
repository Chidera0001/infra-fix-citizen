import { Book, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

interface ApiDocsLinkProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

const ApiDocsLink: React.FC<ApiDocsLinkProps> = ({
  variant = 'outline',
  size = 'default',
  showIcon = true,
  showText = true,
  className,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
      asChild
    >
      <a
        href={ROUTES.apiDocs}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
      >
        {showIcon && <Book className="h-4 w-4" />}
        {showText && 'API Docs'}
        <ExternalLink className="h-3 w-3" />
      </a>
    </Button>
  );
};

export default ApiDocsLink;

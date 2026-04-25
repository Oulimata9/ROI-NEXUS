import logoImage from 'figma:asset/40e256ff190b1b08a687d789a29cc284c27c24d0.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export default function Logo({
  size = 'md',
  variant = 'dark',
  showTagline = false,
  onClick,
  ariaLabel = "Retourner a la page d'accueil"
}: LogoProps) {
  const sizes = {
    sm: { image: 'h-10', container: 'gap-2', text: 'text-lg', tagline: 'text-xs' },
    md: { image: 'h-12', container: 'gap-3', text: 'text-xl', tagline: 'text-xs' },
    lg: { image: 'h-14', container: 'gap-3', text: 'text-2xl', tagline: 'text-sm' },
    xl: { image: 'h-20', container: 'gap-4', text: 'text-3xl', tagline: 'text-base' }
  };

  const textStyles = variant === 'light' 
    ? 'text-white' 
    : 'bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent';
  
  const taglineStyles = variant === 'light' ? 'text-blue-200' : 'text-gray-600';

  const content = (
    <div className="flex items-center gap-4">
      <div className={`flex items-center ${sizes[size].container}`}>
        <div className="relative">
          <img 
            src={logoImage} 
            alt="Nexus Sign Logo" 
            className={`${sizes[size].image} w-auto object-contain drop-shadow-xl transition-transform hover:scale-105`}
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className={`${sizes[size].text} font-black leading-tight tracking-tight ${textStyles}`}>
            Nexus Sign
          </div>
          {showTagline && (
            <p className={`${sizes[size].tagline} font-semibold mt-0.5 ${taglineStyles} leading-tight`}>
              Signature électronique pour l'Afrique
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className="inline-flex rounded-2xl transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
      >
        {content}
      </button>
    );
  }

  return content;
}

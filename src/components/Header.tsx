
import React from 'react';
import { ExternalLink } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a 
          href="https://www.goelektrik.de/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center hover:opacity-90 transition-opacity"
          aria-label="GoElektrik Website"
        >
          <img 
            src="/lovable-uploads/8efc3121-0df0-425d-ae40-5d977ec9e692.png" 
            alt="GoElektrik Logo" 
            className="h-10 md:h-12" 
          />
          <span className="sr-only">Besuchen Sie GoElektrik</span>
        </a>
        <a 
          href="https://www.goelektrik.de/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-goelektrik flex items-center gap-1 hover:underline"
        >
          Zur Website <ExternalLink size={14} />
        </a>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { BrandAvatar } from './BrandAvatar';

interface MarqueeCompany {
  name: string;
  domain: string;
}

const FEATURED_COMPANIES: readonly MarqueeCompany[] = [
  { name: 'Scale AI', domain: 'scale.com' },
  { name: 'Anthropic', domain: 'anthropic.com' },
  { name: 'Mercor', domain: 'mercor.com' },
  { name: 'Babel Audio', domain: 'babel.audio' },
  { name: 'micro1', domain: 'micro1.ai' },
  { name: 'Visora', domain: 'visora.com' },
  { name: 'Spout', domain: 'withspout.com' },
  { name: 'Outlier AI', domain: 'outlier.ai' },
  { name: 'DataAnnotation', domain: 'dataannotation.tech' },
  { name: 'Vercel', domain: 'vercel.com' },
  { name: 'Supabase', domain: 'supabase.com' },
  { name: 'Hugging Face', domain: 'huggingface.co' },
  { name: 'Turing', domain: 'turing.com' },
  { name: 'ElevenLabs', domain: 'elevenlabs.io' },
  { name: 'Cohere', domain: 'cohere.com' },
  { name: 'Linear', domain: 'linear.app' },
  { name: 'Mistral AI', domain: 'mistral.ai' },
  { name: 'Perplexity AI', domain: 'perplexity.ai' },
];

export const CompanyMarquee: React.FC = () => {
  return (
    <div
      aria-label="Hiring partners and remote AI employers"
      className="no-print w-full bg-[#060913]/80 backdrop-blur-md border-b border-cyan-500/15 py-2.5 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
          {[0, 1].map((dupIndex) => (
            <div
              key={dupIndex}
              aria-hidden={dupIndex === 1 ? 'true' : undefined}
              className="flex shrink-0 items-center"
            >
              {FEATURED_COMPANIES.map((company) => (
                <React.Fragment key={`${dupIndex}-${company.name}`}>
                  <span className="inline-flex shrink-0 items-center gap-2 px-2.5 py-0.5 text-xs font-medium tracking-wide text-slate-400 transition-colors hover:text-cyan-300 whitespace-nowrap">
                    <BrandAvatar
                      name={company.name}
                      domain={company.domain}
                      size="xs"
                    />
                    <span>{company.name}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mx-3 select-none text-xs text-slate-700"
                  >
                    •
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

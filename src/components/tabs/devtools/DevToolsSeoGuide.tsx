import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Cloud,
  HelpCircle,
  KeyRound,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How do zero-egress providers like Cloudflare R2 and Backblaze eliminate data transfer fees?',
    answer:
      'Traditional hyperscalers (AWS, GCP, Azure) impose asymmetric outbound egress pricing (~$0.08 to $0.12 per gigabyte), which acts as a commercial lock-in mechanism. Modern edge storage providers like Cloudflare R2 operate on private optical fiber backbones and partner networks (such as the Bandwidth Alliance). Because Cloudflare already peers globally at hundreds of Internet exchange points (IXPs) to deliver CDN caching, the marginal cost of routing static object bytes to consumers is near zero, allowing them to offer flat zero-dollar egress globally.',
  },
  {
    question: 'Is decoding a JSON Web Token (JWT) in a web browser safe?',
    answer:
      'Yes, provided that the client-side tool is strictly offline. A JWT payload is simply Base64URL-encoded JSON text—it is signed, not encrypted. Anyone holding a token can decode the claims without knowing the secret key. PlanetAI Hub’s token inspector runs 100% locally in browser memory without making any external API or telemetry requests. However, you should never place confidential passwords, private database keys, or unhashed sensitive credentials inside JWT payload claims.',
  },
  {
    question: 'How should distributed systems handle cron jobs without duplicate task executions?',
    answer:
      'In multi-container or serverless Kubernetes environments, triggering a cron schedule on multiple replicas simultaneously causes the "thundering herd" problem and duplicate side-effects. The industry standard pattern is to use a distributed lock (such as Redis Redlock or PostgreSQL pg_try_advisory_lock) with an idempotency key. The first worker to acquire the lock executes the scheduled batch, while subsequent workers immediately exit safely.',
  },
  {
    question: 'What is the performance difference between Class A and Class B object storage calls?',
    answer:
      'In S3-compatible object storage, Class A operations encompass state mutations and directory listings (PUT, POST, COPY, LIST). Because mutations require distributed metadata consensus across multiple availability zones, providers charge a higher tier (typically $0.0045 to $0.005 per 1,000 requests). Class B operations are read-only fetches (GET, HEAD), which are served directly from read-replicas or edge caches at roughly one-tenth the cost ($0.00036 to $0.0004 per 1,000 requests).',
  },
];

export const DevToolsSeoGuide: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <article
      aria-labelledby="devtools-guide-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-8"
    >
      {/* Article Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <span>B2B Engineering Handbook &amp; Reference Architecture</span>
        </div>
        <h3
          id="devtools-guide-heading"
          className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance"
        >
          Cloud Egress Optimization, JWT Token Hygiene &amp; Resilient Cron Scheduling
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          A field guide for SaaS technical founders, cloud architects, and full-stack engineers building modern distributed web applications.
        </p>
      </div>

      {/* Section 1: Cloud Egress Optimization */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
          <h4 className="font-display text-lg font-bold text-slate-900">
            1. Eliminating the 9¢/GB Egress Tax in Modern SaaS Architectures
          </h4>
        </div>
        <div className="text-xs leading-relaxed text-slate-700 space-y-3 font-normal">
          <p>
            For data-intensive SaaS platforms—particularly those streaming AI audio, processing video assets, or hosting multi-gigabyte client datasets—outbound internet data transfer (egress) frequently accounts for 40% to 70% of the total monthly cloud bill. Legacy hyperscalers charge between $0.08 and $0.12 per gigabyte for traffic leaving their proprietary virtual private clouds (VPCs). Over the course of a year, moving 50 terabytes per month across standard AWS S3 or GCP buckets yields over $50,000 in egress penalties alone.
          </p>
          <p>
            Architectural decoupling provides the antidote. By placing an S3-compatible object store with zero egress fees (such as Cloudflare R2 or Backblaze B2 routed through the Bandwidth Alliance) in front of your storage tier, developers retain familiar S3 SDK primitives while reducing outbound bandwidth fees to zero. Pairing this architecture with strict <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[#1D4ED8]">Cache-Control: public, max-age=31536000, immutable</code> headers ensures that 80% or more of read requests are absorbed at the edge without querying the origin bucket.
          </p>
        </div>
      </section>

      {/* Section 2: JWT Security Hygiene */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
          <h4 className="font-display text-lg font-bold text-slate-900">
            2. JWT Security Hygiene: Lifecycles, Cryptographic Signatures &amp; Claim Boundaries
          </h4>
        </div>
        <div className="text-xs leading-relaxed text-slate-700 space-y-3 font-normal">
          <p>
            JSON Web Tokens (RFC 7519) provide a compact, self-contained mechanism for securely transmitting assertions between distributed services. However, architectural misuse is pervasive. The most critical principle of JWT hygiene is understanding that Base64URL-encoded tokens are completely transparent. Never store unhashed passwords, credit card fragments, internal API keys, or personally identifiable information (PII) in payload claims.
          </p>
          <p>
            Production microservices should enforce strict asymmetric signing (RS256 or Ed25519) over symmetric HMAC keys (HS256) when distributing tokens to third-party clients. Asymmetric cryptography allows public verification across edge workers using a JSON Web Key Set (JWKS) without risking leakage of the private signing key. Furthermore, access tokens must maintain aggressive, short expiration windows (typically 10 to 15 minutes), backed by cryptographically randomized, revocable refresh tokens stored exclusively in secure, HTTP-only, SameSite cookies.
          </p>
        </div>
      </section>

      {/* Section 3: Cron Automation */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
          <h4 className="font-display text-lg font-bold text-slate-900">
            3. Resilient Cron Automation: Idempotency, Timezone Standards &amp; Advisory Locks
          </h4>
        </div>
        <div className="text-xs leading-relaxed text-slate-700 space-y-3 font-normal">
          <p>
            Automated cron schedules power the background nervous system of SaaS—from invoice generation and database vacuuming to daily vector index compaction. In high-availability clusters where background worker containers are dynamically scaled, naive crontab daemons inevitably trigger duplicate runs. Production architectures must enforce three rules:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
            <li>
              <strong>Mandatory UTC Baseline:</strong> Never schedule cron jobs in local server timezones (e.g. EST or CET), which break or double-execute during daylight saving time (DST) shifts. Always standardize schedulers in UTC.
            </li>
            <li>
              <strong>Distributed Advisory Locks:</strong> Wrap execution logic in database advisory locks (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[#1D4ED8]">pg_try_advisory_lock</code>) or atomic Redis key leases with short TTLs to guarantee that exactly one worker processes the job.
            </li>
            <li>
              <strong>Idempotent Operations:</strong> Design each batch job to be re-runnable without unintended state mutation. Utilize deterministic upserts (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[#1D4ED8]">ON CONFLICT DO UPDATE</code>) and idempotent payment gateway keys.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 4: Interactive FAQ Accordion */}
      <section className="border-t border-slate-100 pt-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
          <h4 className="font-display text-base font-bold text-slate-900">
            Frequently Asked Engineering Questions
          </h4>
        </div>

        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={faq.question} className="p-4 transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between text-left text-xs font-bold text-slate-900 gap-4"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
};

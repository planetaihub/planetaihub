import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  Check,
  Cloud,
  Copy,
  DollarSign,
  HardDrive,
  Info,
  Layers,
  Percent,
  Sparkles,
  TrendingDown,
  Zap,
} from 'lucide-react';

interface CloudPreset {
  id: string;
  label: string;
  description: string;
  storageGb: number;
  egressGb: number;
  readRequests: number;
  writeRequests: number;
  cacheHitRatio: number;
}

const PRESETS: CloudPreset[] = [
  {
    id: 'mvp',
    label: 'Early SaaS / MVP',
    description: '100 GB storage, 500 GB egress, 2M requests',
    storageGb: 100,
    egressGb: 500,
    readRequests: 2_000_000,
    writeRequests: 200_000,
    cacheHitRatio: 50,
  },
  {
    id: 'growth',
    label: 'Scaling SaaS',
    description: '2 TB storage, 8 TB egress, 20M requests',
    storageGb: 2000,
    egressGb: 8000,
    readRequests: 20_000_000,
    writeRequests: 2_000_000,
    cacheHitRatio: 75,
  },
  {
    id: 'ai-media',
    label: 'AI Audio / Media Heavy',
    description: '15 TB storage, 40 TB egress, 50M requests',
    storageGb: 15_000,
    egressGb: 40_000,
    readRequests: 50_000_000,
    writeRequests: 5_000_000,
    cacheHitRatio: 80,
  },
  {
    id: 'enterprise',
    label: 'Enterprise Scale',
    description: '50 TB storage, 150 TB egress, 150M requests',
    storageGb: 50_000,
    egressGb: 150_000,
    readRequests: 150_000_000,
    writeRequests: 15_000_000,
    cacheHitRatio: 85,
  },
];

interface ProviderCost {
  id: string;
  name: string;
  subtitle: string;
  storageCost: number;
  egressCost: number;
  requestCost: number;
  totalMonthly: number;
  totalAnnual: number;
  savingsVsAws: number;
  highlight?: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const CloudCostEstimatorTool: React.FC = () => {
  const [storageGb, setStorageGb] = useState<number>(2000);
  const [egressGb, setEgressGb] = useState<number>(8000);
  const [readRequests, setReadRequests] = useState<number>(20_000_000);
  const [writeRequests, setWriteRequests] = useState<number>(2_000_000);
  const [cacheHitRatio, setCacheHitRatio] = useState<number>(70);
  const [hasCopied, setHasCopied] = useState(false);

  // Effective origin egress after CDN cache hit reduction
  const effectiveOriginEgressGb = useMemo(() => {
    return egressGb * (1 - cacheHitRatio / 100);
  }, [egressGb, cacheHitRatio]);

  // Provider calculation engine
  const providerCalculations: ProviderCost[] = useMemo(() => {
    // 1. AWS (S3 Standard + CloudFront / Direct Egress)
    // S3 Storage: $0.023/GB
    // Egress: First 100GB free, then ~$0.085/GB blended
    // Requests: PUT $0.005/1k ($5/1M), GET $0.0004/1k ($0.40/1M)
    const awsStorage = storageGb * 0.023;
    const awsEgressBillable = Math.max(0, effectiveOriginEgressGb - 100);
    const awsEgress = awsEgressBillable * 0.085;
    const awsRequests = (writeRequests / 1000) * 0.005 + (readRequests / 1000) * 0.0004;
    const awsTotal = awsStorage + awsEgress + awsRequests;

    // 2. Google Cloud Platform (Cloud Storage Standard + CDN)
    // GCP Storage: $0.020/GB
    // Egress: $0.085/GB blended
    // Operations: Class A $0.005/1k, Class B $0.0004/1k
    const gcpStorage = storageGb * 0.02;
    const gcpEgress = effectiveOriginEgressGb * 0.085;
    const gcpRequests = (writeRequests / 1000) * 0.005 + (readRequests / 1000) * 0.0004;
    const gcpTotal = gcpStorage + gcpEgress + gcpRequests;

    // 3. Microsoft Azure (Blob Hot Storage)
    // Storage: $0.018/GB
    // Egress: First 100GB free, then $0.087/GB
    // Operations: Write $0.005/1k, Read $0.0004/1k
    const azureStorage = storageGb * 0.018;
    const azureEgressBillable = Math.max(0, effectiveOriginEgressGb - 100);
    const azureEgress = azureEgressBillable * 0.087;
    const azureRequests = (writeRequests / 1000) * 0.005 + (readRequests / 1000) * 0.0004;
    const azureTotal = azureStorage + azureEgress + azureRequests;

    // 4. Cloudflare R2 + Workers (Zero Egress!)
    // Storage: $0.015/GB (First 10GB free)
    // Egress: $0.00 ALWAYS
    // Class A (write/list): 1M free, then $4.50/million ($0.0045/1k)
    // Class B (read): 10M free, then $0.36/million ($0.00036/1k)
    const r2Storage = Math.max(0, storageGb - 10) * 0.015;
    const r2Egress = 0;
    const r2ClassA = (Math.max(0, writeRequests - 1_000_000) / 1_000_000) * 4.5;
    const r2ClassB = (Math.max(0, readRequests - 10_000_000) / 1_000_000) * 0.36;
    const r2Requests = r2ClassA + r2ClassB;
    const r2Total = r2Storage + r2Egress + r2Requests;

    // 5. Backblaze B2 (Bandwidth Alliance)
    // Storage: $0.006/GB (First 10GB free)
    // Egress: Free via Cloudflare Bandwidth Alliance, or $0.01/GB direct. We assume Cloudflare caching proxy (0.00)
    // Requests: Free Class B, negligible Class A
    const b2Storage = Math.max(0, storageGb - 10) * 0.006;
    const b2Egress = 0; // via Bandwidth Alliance
    const b2Requests = (writeRequests / 1000) * 0.004;
    const b2Total = b2Storage + b2Egress + b2Requests;

    // 6. DigitalOcean Spaces
    // Flat $5/mo includes 250GB storage + 1,024GB egress
    // Extra storage: $0.02/GB
    // Extra egress: $0.01/GB
    // Requests: Unlimited free
    const doExtraStorage = Math.max(0, storageGb - 250) * 0.02;
    const doExtraEgress = Math.max(0, effectiveOriginEgressGb - 1024) * 0.01;
    const doTotal = 5 + doExtraStorage + doExtraEgress;

    const rawList: Omit<ProviderCost, 'savingsVsAws'>[] = [
      {
        id: 'cloudflare-r2',
        name: 'Cloudflare R2',
        subtitle: 'S3-compatible · 0 Egress Fees Worldwide',
        storageCost: r2Storage,
        egressCost: r2Egress,
        requestCost: r2Requests,
        totalMonthly: r2Total,
        totalAnnual: r2Total * 12,
        highlight: 'Zero Egress Champion',
        color: 'border-orange-500 bg-orange-50/40 text-orange-950',
        badgeBg: 'bg-orange-100 text-orange-800',
        badgeText: '0 Egress Fees',
      },
      {
        id: 'backblaze-b2',
        name: 'Backblaze B2 + Cloudflare',
        subtitle: 'Bandwidth Alliance Partner · $0.006/GB storage',
        storageCost: b2Storage,
        egressCost: b2Egress,
        requestCost: b2Requests,
        totalMonthly: b2Total,
        totalAnnual: b2Total * 12,
        highlight: 'Lowest Storage Cost',
        color: 'border-red-400 bg-red-50/30 text-red-950',
        badgeBg: 'bg-red-100 text-red-800',
        badgeText: 'Cheapest Storage',
      },
      {
        id: 'digitalocean-spaces',
        name: 'DigitalOcean Spaces',
        subtitle: 'Flat $5/mo bundle · $0.01/GB overage egress',
        storageCost: Math.min(5, doTotal) + doExtraStorage,
        egressCost: doExtraEgress,
        requestCost: 0,
        totalMonthly: doTotal,
        totalAnnual: doTotal * 12,
        color: 'border-blue-300 bg-blue-50/30 text-blue-950',
        badgeBg: 'bg-blue-100 text-blue-800',
        badgeText: 'Flat Bundle',
      },
      {
        id: 'azure-blob',
        name: 'Microsoft Azure Blob',
        subtitle: 'Hot Tier Storage + Microsoft Global Network',
        storageCost: azureStorage,
        egressCost: azureEgress,
        requestCost: azureRequests,
        totalMonthly: azureTotal,
        totalAnnual: azureTotal * 12,
        color: 'border-slate-200 bg-white text-slate-900',
        badgeBg: 'bg-slate-100 text-slate-700',
        badgeText: 'Enterprise Tier',
      },
      {
        id: 'gcp-storage',
        name: 'Google Cloud Storage',
        subtitle: 'Standard Multi-Regional + Cloud CDN',
        storageCost: gcpStorage,
        egressCost: gcpEgress,
        requestCost: gcpRequests,
        totalMonthly: gcpTotal,
        totalAnnual: gcpTotal * 12,
        color: 'border-slate-200 bg-white text-slate-900',
        badgeBg: 'bg-slate-100 text-slate-700',
        badgeText: 'Hyperscaler',
      },
      {
        id: 'aws-s3',
        name: 'Amazon Web Services (AWS)',
        subtitle: 'S3 Standard + CloudFront CDN',
        storageCost: awsStorage,
        egressCost: awsEgress,
        requestCost: awsRequests,
        totalMonthly: awsTotal,
        totalAnnual: awsTotal * 12,
        color: 'border-slate-200 bg-white text-slate-900',
        badgeBg: 'bg-slate-100 text-slate-700',
        badgeText: 'Baseline Standard',
      },
    ];

    // Compute savings relative to AWS
    return rawList
      .map((item) => ({
        ...item,
        savingsVsAws: Math.max(0, awsTotal - item.totalMonthly),
      }))
      .sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [storageGb, effectiveOriginEgressGb, readRequests, writeRequests]);

  const cheapest = providerCalculations[0];
  const awsCost = providerCalculations.find((p) => p.id === 'aws-s3')?.totalMonthly ?? 1;
  const maxSavings = Math.max(0, awsCost - cheapest.totalMonthly);
  const savingsPercent = awsCost > 0 ? Math.round((maxSavings / awsCost) * 100) : 0;

  const handleApplyPreset = (preset: CloudPreset) => {
    setStorageGb(preset.storageGb);
    setEgressGb(preset.egressGb);
    setReadRequests(preset.readRequests);
    setWriteRequests(preset.writeRequests);
    setCacheHitRatio(preset.cacheHitRatio);
  };

  const handleCopySummary = async () => {
    const text = `Cloud Bandwidth, Storage & Egress Cost Comparison (PlanetAI Hub Estimator)
Parameters:
- Storage: ${storageGb >= 1000 ? `${(storageGb / 1000).toFixed(1)} TB` : `${storageGb} GB`}
- Outbound Egress: ${egressGb >= 1000 ? `${(egressGb / 1000).toFixed(1)} TB` : `${egressGb} GB`}
- CDN Cache Hit Ratio: ${cacheHitRatio}% (Effective Origin Egress: ${(effectiveOriginEgressGb / 1000).toFixed(2)} TB)
- Read Requests: ${(readRequests / 1_000_000).toFixed(1)}M/mo | Write Requests: ${(writeRequests / 1_000_000).toFixed(2)}M/mo

Estimated Monthly Costs:
${providerCalculations
  .map(
    (p, i) =>
      `${i + 1}. ${p.name}: $${p.totalMonthly.toFixed(2)}/mo ($${p.totalAnnual.toFixed(0)}/yr) — Storage: $${p.storageCost.toFixed(2)}, Egress: $${p.egressCost.toFixed(2)}`
  )
  .join('\n')}

Potential Annual Savings vs AWS: $${(maxSavings * 12).toFixed(0)} (${savingsPercent}%) using ${cheapest.name}`;

    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            SaaS Infrastructure &amp; Edge Economics
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl text-balance">
            Cloud Bandwidth, Storage &amp; Egress Cost Estimator
          </h3>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600">
            Compare monthly data transfer, object storage, and request costs across AWS, Google Cloud, Azure, Cloudflare R2, Backblaze B2, and DigitalOcean. Calculate real-world savings from zero-egress edge networks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 shrink-0 self-start"
        >
          {hasCopied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <span className="text-emerald-700">Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span>Copy Cost Summary</span>
            </>
          )}
        </button>
      </div>

      {/* Architecture Presets */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <span className="text-xs font-semibold text-slate-700">
          Load Architecture Scale Preset:
        </span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-3 text-left transition-all hover:border-[#1D4ED8]/60 hover:shadow-xs"
            >
              <span className="text-xs font-bold text-slate-900">{preset.label}</span>
              <span className="mt-0.5 text-[11px] text-slate-500">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Sliders & Parameter Controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Storage & Egress */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HardDrive className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
            <h4 className="text-sm font-bold text-slate-900">Capacity &amp; Data Transfer</h4>
          </div>

          {/* Storage Volume */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="storage-slider" className="font-semibold text-slate-700">
                Active Object Storage
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                {storageGb >= 1000 ? `${(storageGb / 1000).toFixed(1)} TB` : `${storageGb} GB`} ({storageGb.toLocaleString()} GB)
              </span>
            </div>
            <input
              id="storage-slider"
              type="range"
              min={50}
              max={50000}
              step={50}
              value={storageGb}
              onChange={(e) => setStorageGb(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50 GB</span>
              <span>10 TB</span>
              <span>25 TB</span>
              <span>50 TB</span>
            </div>
          </div>

          {/* Monthly Egress */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="egress-slider" className="font-semibold text-slate-700">
                Monthly Outbound Data Transfer (Total Traffic)
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                {egressGb >= 1000 ? `${(egressGb / 1000).toFixed(1)} TB` : `${egressGb} GB`} ({egressGb.toLocaleString()} GB)
              </span>
            </div>
            <input
              id="egress-slider"
              type="range"
              min={100}
              max={100000}
              step={100}
              value={egressGb}
              onChange={(e) => setEgressGb(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>100 GB</span>
              <span>20 TB</span>
              <span>50 TB</span>
              <span>100 TB</span>
            </div>
          </div>

          {/* CDN Cache Hit Ratio */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="cache-slider" className="flex items-center gap-1 font-semibold text-slate-700">
                <span>CDN Edge Cache Hit Ratio</span>
                <span className="text-[11px] text-slate-500 font-normal">(Edge absorbs traffic)</span>
              </label>
              <span className="font-mono font-bold text-emerald-700 tabular-nums">
                {cacheHitRatio}% Cached
              </span>
            </div>
            <input
              id="cache-slider"
              type="range"
              min={0}
              max={95}
              step={5}
              value={cacheHitRatio}
              onChange={(e) => setCacheHitRatio(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-600"
            />
            <div className="mt-1.5 flex items-center justify-between rounded-lg bg-emerald-50/70 px-3 py-1.5 text-xs text-emerald-900">
              <span className="text-[11px]">Origin Egress Billed to Storage:</span>
              <span className="font-mono font-bold tabular-nums">
                {effectiveOriginEgressGb >= 1000
                  ? `${(effectiveOriginEgressGb / 1000).toFixed(2)} TB`
                  : `${Math.round(effectiveOriginEgressGb)} GB`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Operations & Request Volume */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Zap className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
            <h4 className="text-sm font-bold text-slate-900">API Operations &amp; Requests</h4>
          </div>

          {/* Read Requests (Class B) */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="read-slider" className="font-semibold text-slate-700">
                Monthly Read / GET Operations (Class B)
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                {(readRequests / 1_000_000).toFixed(1)} Million
              </span>
            </div>
            <input
              id="read-slider"
              type="range"
              min={500_000}
              max={150_000_000}
              step={500_000}
              value={readRequests}
              onChange={(e) => setReadRequests(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>500K</span>
              <span>25M</span>
              <span>75M</span>
              <span>150M</span>
            </div>
          </div>

          {/* Write Requests (Class A) */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="write-slider" className="font-semibold text-slate-700">
                Monthly Write / PUT / List Operations (Class A)
              </label>
              <span className="font-mono font-bold text-[#1D4ED8] tabular-nums">
                {(writeRequests / 1_000_000).toFixed(2)} Million
              </span>
            </div>
            <input
              id="write-slider"
              type="range"
              min={50_000}
              max={20_000_000}
              step={50_000}
              value={writeRequests}
              onChange={(e) => setWriteRequests(Number(e.target.value))}
              className="mt-2 w-full accent-[#1D4ED8]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50K</span>
              <span>5M</span>
              <span>10M</span>
              <span>20M</span>
            </div>
          </div>

          {/* Savings Spotlight Banner */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  Zero-Egress Economics: Save ${Math.round(maxSavings).toLocaleString()}/month
                </p>
                <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                  By routing storage through zero-egress architectures like <strong className="font-semibold">{cheapest.name}</strong>, you reduce monthly data transfer spend by up to <strong className="font-bold">{savingsPercent}%</strong> (${Math.round(maxSavings * 12).toLocaleString()} annualized).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Architecture Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Provider Cost Breakdown &amp; Ranking (Sorted Lowest to Highest)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Egress basis: ${(effectiveOriginEgressGb / 1000).toFixed(2)} TB at origin
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 font-semibold">
                <th scope="col" className="px-5 py-3">Architecture / Provider</th>
                <th scope="col" className="px-4 py-3 text-right">Storage</th>
                <th scope="col" className="px-4 py-3 text-right">Egress (Data Transfer)</th>
                <th scope="col" className="px-4 py-3 text-right">API Ops</th>
                <th scope="col" className="px-4 py-3 text-right">Monthly Total</th>
                <th scope="col" className="px-4 py-3 text-right">Annual Total</th>
                <th scope="col" className="px-5 py-3 text-right">Savings vs AWS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providerCalculations.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`transition-colors hover:bg-slate-50/80 ${
                    idx === 0 ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{p.name}</span>
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${p.badgeBg}`}>
                            {p.badgeText}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{p.subtitle}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                    ${p.storageCost.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                    {p.egressCost === 0 ? (
                      <span className="font-bold text-emerald-700">$0.00 (Free)</span>
                    ) : (
                      <span className="text-slate-700">${p.egressCost.toFixed(2)}</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                    ${p.requestCost.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ${p.totalMonthly.toFixed(2)}
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                    ${p.totalAnnual.toFixed(0)}
                  </td>

                  <td className="px-5 py-3.5 text-right font-mono tabular-nums">
                    {p.id === 'aws-s3' ? (
                      <span className="text-slate-400">Baseline</span>
                    ) : p.savingsVsAws > 0 ? (
                      <span className="font-bold text-emerald-700">
                        -${p.savingsVsAws.toFixed(2)}/mo
                      </span>
                    ) : (
                      <span className="text-slate-400">+$0.00</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

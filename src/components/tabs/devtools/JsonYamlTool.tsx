import React, { useMemo, useState } from 'react';
import { dump as yamlDump, load as yamlLoad } from 'js-yaml';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileCode,
  FileJson,
  Minimize2,
  Sparkles,
  Trash2,
} from 'lucide-react';

const SAMPLE_JSON_CONFIG = `{
  "service": "planetai-gateway",
  "version": "2.4.0",
  "environment": "production",
  "replicas": 4,
  "egressOptimization": {
    "enabled": true,
    "provider": "cloudflare-r2",
    "cacheHitRatioTarget": 0.85
  },
  "endpoints": [
    { "path": "/api/v1/jobs", "rateLimit": 100 },
    { "path": "/api/v1/evals", "rateLimit": 50 }
  ]
}`;

const SAMPLE_K8S_YAML = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: planetai-worker
  labels:
    app: planetai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: planetai
  template:
    metadata:
      labels:
        app: planetai
    spec:
      containers:
      - name: worker
        image: planetai/inference-runner:v2
        resources:
          limits:
            memory: "4Gi"
            cpu: "2"`;

export const JsonYamlTool: React.FC = () => {
  const [inputContent, setInputContent] = useState<string>(SAMPLE_JSON_CONFIG);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  // Auto-detect mode or current target action
  const [actionType, setActionType] = useState<
    'format-json' | 'minify-json' | 'json-to-yaml' | 'yaml-to-json'
  >('format-json');

  // Processing & Validation
  const result = useMemo(() => {
    const raw = inputContent.trim();
    if (!raw) {
      return {
        isValid: true,
        output: '',
        error: null,
        originalBytes: 0,
        outputBytes: 0,
        savingsPercent: 0,
        detectedFormat: 'empty',
      };
    }

    const originalBytes = new TextEncoder().encode(inputContent).length;

    try {
      if (actionType === 'format-json') {
        const parsed = JSON.parse(raw);
        const formatted = JSON.stringify(parsed, null, indentSize);
        const outputBytes = new TextEncoder().encode(formatted).length;
        const diff = originalBytes - outputBytes;
        const savingsPercent = originalBytes > 0 ? (diff / originalBytes) * 100 : 0;
        return {
          isValid: true,
          output: formatted,
          error: null,
          originalBytes,
          outputBytes,
          savingsPercent,
          detectedFormat: 'JSON',
        };
      }

      if (actionType === 'minify-json') {
        const parsed = JSON.parse(raw);
        const minified = JSON.stringify(parsed);
        const outputBytes = new TextEncoder().encode(minified).length;
        const diff = originalBytes - outputBytes;
        const savingsPercent = originalBytes > 0 ? (diff / originalBytes) * 100 : 0;
        return {
          isValid: true,
          output: minified,
          error: null,
          originalBytes,
          outputBytes,
          savingsPercent,
          detectedFormat: 'JSON',
        };
      }

      if (actionType === 'json-to-yaml') {
        const parsed = JSON.parse(raw);
        const yamlOutput = yamlDump(parsed, { indent: indentSize, lineWidth: 120 });
        const outputBytes = new TextEncoder().encode(yamlOutput).length;
        const diff = originalBytes - outputBytes;
        const savingsPercent = originalBytes > 0 ? (diff / originalBytes) * 100 : 0;
        return {
          isValid: true,
          output: yamlOutput,
          error: null,
          originalBytes,
          outputBytes,
          savingsPercent,
          detectedFormat: 'JSON',
        };
      }

      if (actionType === 'yaml-to-json') {
        const parsed = yamlLoad(raw);
        const jsonOutput = JSON.stringify(parsed, null, indentSize);
        const outputBytes = new TextEncoder().encode(jsonOutput).length;
        const diff = originalBytes - outputBytes;
        const savingsPercent = originalBytes > 0 ? (diff / originalBytes) * 100 : 0;
        return {
          isValid: true,
          output: jsonOutput,
          error: null,
          originalBytes,
          outputBytes,
          savingsPercent,
          detectedFormat: 'YAML',
        };
      }

      return {
        isValid: true,
        output: '',
        error: null,
        originalBytes,
        outputBytes: 0,
        savingsPercent: 0,
        detectedFormat: 'unknown',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Syntax error in document.';
      return {
        isValid: false,
        output: '',
        error: msg,
        originalBytes,
        outputBytes: 0,
        savingsPercent: 0,
        detectedFormat: 'invalid',
      };
    }
  }, [inputContent, actionType, indentSize]);

  const handleCopy = async () => {
    if (!result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleDownload = () => {
    if (!result.output) return;
    const isYaml = actionType === 'json-to-yaml';
    const extension = isYaml ? '.yaml' : '.json';
    const blob = new Blob([result.output], {
      type: isYaml ? 'text/yaml' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planetai-formatted${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Syntax &amp; Payload Optimization
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl text-balance">
            JSON / YAML Formatter, Minifier &amp; Validator
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Real-time syntax validation, pretty-printing, byte-size reduction metrics, and two-way JSON/YAML conversion.
          </p>
        </div>

        {/* Action Selector Buttons */}
        <div
          role="tablist"
          aria-label="JSON and YAML actions"
          className="grid w-full grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1.5 sm:inline-flex sm:w-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={actionType === 'format-json'}
            onClick={() => setActionType('format-json')}
            className={`min-h-[38px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold transition-all ${
              actionType === 'format-json'
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            Format JSON
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={actionType === 'minify-json'}
            onClick={() => setActionType('minify-json')}
            className={`min-h-[38px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold transition-all ${
              actionType === 'minify-json'
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            Minify JSON
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={actionType === 'json-to-yaml'}
            onClick={() => setActionType('json-to-yaml')}
            className={`min-h-[38px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold transition-all ${
              actionType === 'json-to-yaml'
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            JSON ➔ YAML
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={actionType === 'yaml-to-json'}
            onClick={() => {
              setActionType('yaml-to-json');
              if (inputContent === SAMPLE_JSON_CONFIG) {
                setInputContent(SAMPLE_K8S_YAML);
              }
            }}
            className={`min-h-[38px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold transition-all ${
              actionType === 'yaml-to-json'
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            YAML ➔ JSON
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Validation State
          </span>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-bold">
            {result.isValid ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Valid Syntax</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span className="text-rose-700">Syntax Error</span>
              </>
            )}
          </div>
        </div>

        {/* Input Bytes */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Original Size
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-slate-900 tabular-nums">
            {result.originalBytes.toLocaleString()} bytes
          </p>
        </div>

        {/* Output Bytes */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Processed Size
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-slate-900 tabular-nums">
            {result.outputBytes.toLocaleString()} bytes
          </p>
        </div>

        {/* Savings / Delta */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Byte Reduction
          </span>
          <p
            className={`mt-1 font-mono text-xs font-bold tabular-nums ${
              result.savingsPercent > 0
                ? 'text-emerald-700'
                : result.savingsPercent < 0
                ? 'text-slate-600'
                : 'text-slate-500'
            }`}
          >
            {result.savingsPercent > 0
              ? `Saved ${result.savingsPercent.toFixed(1)}%`
              : result.savingsPercent < 0
              ? `+${Math.abs(result.savingsPercent).toFixed(1)}% expanded`
              : '0% change'}
          </p>
        </div>
      </div>

      {/* Editor & Output Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Pane */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Source Input:</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Load Sample:</span>
              <button
                type="button"
                onClick={() => {
                  setInputContent(SAMPLE_JSON_CONFIG);
                  if (actionType === 'yaml-to-json') setActionType('format-json');
                }}
                className="text-[11px] font-medium text-[#1D4ED8] hover:underline"
              >
                JSON Config
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputContent(SAMPLE_K8S_YAML);
                  setActionType('yaml-to-json');
                }}
                className="text-[11px] font-medium text-[#1D4ED8] hover:underline"
              >
                K8s YAML
              </button>
              <button
                type="button"
                onClick={() => setInputContent('')}
                className="text-[11px] text-slate-400 hover:text-rose-600"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            rows={14}
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Paste your JSON or YAML here..."
            className="input-obsidian w-full p-3 font-mono text-xs leading-relaxed"
          />
        </div>

        {/* Output Pane */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Output Result:</span>
              {(actionType === 'format-json' || actionType === 'json-to-yaml') && (
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Indent:</span>
                  <select
                    value={indentSize}
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    aria-label="Indent size"
                    className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] text-slate-700 font-mono"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!result.output}
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] hover:text-[#1E40AF] disabled:opacity-40"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                disabled={!result.output}
                onClick={handleDownload}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {result.isValid ? (
            <textarea
              readOnly
              rows={14}
              value={result.output}
              placeholder="Output will appear here..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 font-mono text-xs text-slate-800 leading-relaxed"
            />
          ) : (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-900">
              <div className="flex items-center gap-2 font-bold text-rose-950">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Syntax Parser Error</span>
              </div>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-rose-800 whitespace-pre-wrap">
                {result.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

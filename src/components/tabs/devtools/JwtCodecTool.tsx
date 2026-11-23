import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  KeyRound,
  Lock,
  RefreshCw,
  Shield,
  Trash2,
} from 'lucide-react';

const SAMPLE_JWT_OIDC =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBsYW5ldGFpLTIwMjYifQ.eyJpc3MiOiJodHRwczovL2F1dGgucGxhbmV0YWlodWIuY29tLyIsInN1YiI6InVzZXJfMjN4SzlsTVBRT1ZXIiwiYXVkIjpbImh0dHBzOi8vYXBpLnBsYW5ldGFpLmRldiIsImF1dGgtY2xpZW50Il0sImlhdCI6MTc5NTI4NjQwMCwiZXhwIjoxNzk1Mjg5OTk5LCJuYmYiOjE3OTUyODY0MDAsImVtYWlsIjoiZGV2ZWxvcGVyQHBsYW5ldGFpaHViLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJyb2xlcyI6WyJzb2x1dGlvbnNfYXJjaGl0ZWN0Il0sIm9yZ19pZCI6Im9yZ185ODdhYmNkZWYifQ.MEQCIBkL8n30F4r9G4c8v10Zk...SAMPLE_SIGNATURE';

const SAMPLE_JWT_EXPIRED =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggVmFuY2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMiwicm9sZSI6ImNvbnRyYWN0b3IifQ.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';

export const JwtCodecTool: React.FC = () => {
  const [activeCodecTab, setActiveCodecTab] = useState<'jwt' | 'base64' | 'url'>('jwt');

  // JWT State
  const [jwtInput, setJwtInput] = useState(SAMPLE_JWT_OIDC);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Base64 & URL State
  const [codecInput, setCodecInput] = useState('Hello PlanetAI Hub! 🚀');
  const [codecMode, setCodecMode] = useState<'encode' | 'decode'>('encode');

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(id);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      // Ignore
    }
  };

  // Safe Base64 UTF-8 helpers
  const utf8ToBase64 = (str: string): string => {
    try {
      return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
    } catch {
      return '';
    }
  };

  const base64ToUtf8 = (str: string): string => {
    try {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(str), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      return 'Error: Invalid Base64 sequence.';
    }
  };

  // JWT Parser
  const parsedJwt = useMemo(() => {
    const raw = jwtInput.trim();
    if (!raw) {
      return { isValid: false, error: 'Please enter or paste a JWT token.' };
    }

    const parts = raw.split('.');
    if (parts.length < 2) {
      return {
        isValid: false,
        error: 'Invalid JWT format: A valid JSON Web Token must contain at least 2 period-separated segments.',
      };
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    let headerObj: Record<string, unknown> | null = null;
    let payloadObj: Record<string, unknown> | null = null;
    let headerJson = '';
    let payloadJson = '';

    try {
      const decodedHeader = base64ToUtf8(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
      headerObj = JSON.parse(decodedHeader);
      headerJson = JSON.stringify(headerObj, null, 2);
    } catch (e) {
      return { isValid: false, error: 'Malformed JWT Header segment.' };
    }

    try {
      const decodedPayload = base64ToUtf8(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      payloadObj = JSON.parse(decodedPayload);
      payloadJson = JSON.stringify(payloadObj, null, 2);
    } catch (e) {
      return { isValid: false, error: 'Malformed JWT Payload segment.' };
    }

    // Expiration analysis
    let expirationStatus: 'none' | 'valid' | 'expired' = 'none';
    let expirationDate: Date | null = null;
    let relativeExpText = '';

    if (payloadObj && typeof payloadObj.exp === 'number') {
      expirationDate = new Date(payloadObj.exp * 1000);
      const now = Date.now();
      const diffMs = expirationDate.getTime() - now;

      if (diffMs > 0) {
        expirationStatus = 'valid';
        const hours = Math.round(diffMs / (1000 * 60 * 60));
        const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
        relativeExpText = days > 1 ? `Valid for next ${days} days` : `Valid for next ${hours} hours`;
      } else {
        expirationStatus = 'expired';
        const pastDays = Math.round(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
        relativeExpText = pastDays > 0 ? `Expired ${pastDays} days ago` : `Expired recently`;
      }
    }

    // Issued at
    let issuedDate: Date | null = null;
    if (payloadObj && typeof payloadObj.iat === 'number') {
      issuedDate = new Date(payloadObj.iat * 1000);
    }

    return {
      isValid: true,
      headerB64,
      payloadB64,
      signatureB64: signatureB64 ?? '',
      headerObj,
      payloadObj,
      headerJson,
      payloadJson,
      expirationStatus,
      expirationDate,
      relativeExpText,
      issuedDate,
      algorithm: (headerObj?.alg as string) ?? 'Unknown',
      subject: (payloadObj?.sub as string) ?? null,
      issuer: (payloadObj?.iss as string) ?? null,
      audience: payloadObj?.aud ? String(payloadObj.aud) : null,
    };
  }, [jwtInput]);

  // Codec Output
  const codecOutput = useMemo(() => {
    if (!codecInput) return '';

    if (activeCodecTab === 'base64') {
      if (codecMode === 'encode') {
        return utf8ToBase64(codecInput);
      } else {
        return base64ToUtf8(codecInput);
      }
    }

    if (activeCodecTab === 'url') {
      if (codecMode === 'encode') {
        try {
          return encodeURIComponent(codecInput);
        } catch {
          return 'Encoding error';
        }
      } else {
        try {
          return decodeURIComponent(codecInput);
        } catch {
          return 'Error: Invalid URL encoded sequence.';
        }
      }
    }

    return '';
  }, [activeCodecTab, codecInput, codecMode]);

  return (
    <div className="space-y-6">
      {/* Sub-Switch: JWT vs Base64 vs URL */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Zero-Leak Local Codecs
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl text-balance">
            JWT Token Inspector &amp; Base64 / URL Codec
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Decode tokens, inspect claims, and convert data safely. Zero network transmissions.
          </p>
        </div>

        {/* Tab Selector */}
        <div
          role="tablist"
          aria-label="Codec tools"
          className="grid w-full grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1.5 sm:inline-flex sm:w-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCodecTab === 'jwt'}
            onClick={() => setActiveCodecTab('jwt')}
            className={`col-span-2 sm:col-span-1 min-h-[38px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold transition-all ${
              activeCodecTab === 'jwt'
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            JWT Inspector
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeCodecTab === 'base64'}
            onClick={() => setActiveCodecTab('base64')}
            className={`min-h-[38px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold transition-all ${
              activeCodecTab === 'base64'
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            Base64 Codec
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeCodecTab === 'url'}
            onClick={() => setActiveCodecTab('url')}
            className={`min-h-[38px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold transition-all ${
              activeCodecTab === 'url'
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            URL Codec
          </button>
        </div>
      </div>

      {/* Security Privacy Notice */}
      <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-xs text-blue-900">
        <Lock className="h-4 w-4 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
        <span>
          <strong>100% Client-Side Privacy:</strong> All string manipulation and decoding execute entirely within your browser memory. Tokens and private claims are never uploaded or cached on a server.
        </span>
      </div>

      {activeCodecTab === 'jwt' ? (
        <div className="space-y-6">
          {/* JWT Input & Presets */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="jwt-input-field" className="text-xs font-bold text-slate-700">
                Encoded JSON Web Token (Paste below):
              </label>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 text-[11px]">Load Sample:</span>
                <button
                  type="button"
                  onClick={() => setJwtInput(SAMPLE_JWT_OIDC)}
                  className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                >
                  Auth0 / OIDC
                </button>
                <button
                  type="button"
                  onClick={() => setJwtInput(SAMPLE_JWT_EXPIRED)}
                  className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                >
                  Expired Token
                </button>
                <button
                  type="button"
                  onClick={() => setJwtInput('')}
                  className="text-[11px] text-slate-500 hover:text-rose-600"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              id="jwt-input-field"
              rows={4}
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              placeholder="Paste token (eyJhbGciOi...)"
              className="input-obsidian w-full p-3 font-mono text-xs leading-relaxed"
            />
          </div>

          {parsedJwt.isValid ? (
            <div className="space-y-6">
              {/* Claims Diagnostic Strip */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Algorithm */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Signing Algorithm
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 font-mono text-sm font-bold text-slate-900">
                    <KeyRound className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
                    <span>{parsedJwt.algorithm}</span>
                  </div>
                </div>

                {/* Expiration Status */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Expiration Status
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-bold">
                    {parsedJwt.expirationStatus === 'valid' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                        <span className="text-emerald-700">{parsedJwt.relativeExpText}</span>
                      </>
                    ) : parsedJwt.expirationStatus === 'expired' ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-rose-600" aria-hidden="true" />
                        <span className="text-rose-700">{parsedJwt.relativeExpText}</span>
                      </>
                    ) : (
                      <span className="text-slate-500 font-mono text-xs">No exp claim</span>
                    )}
                  </div>
                  {parsedJwt.expirationDate && (
                    <p className="mt-0.5 text-[10px] text-slate-400 font-mono">
                      {parsedJwt.expirationDate.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Subject / User ID */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Subject (sub)
                  </span>
                  <p className="mt-1 truncate font-mono text-xs font-semibold text-slate-900">
                    {parsedJwt.subject || 'Not specified'}
                  </p>
                </div>

                {/* Issuer */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Issuer (iss)
                  </span>
                  <p className="mt-1 truncate font-mono text-xs font-semibold text-slate-900">
                    {parsedJwt.issuer || 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Decoded Header & Payload Cards */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Header Card */}
                <div className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-2xs">
                  <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50/70 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500" aria-hidden="true" />
                      <span className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                        Header (Algorithm &amp; Token Type)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(parsedJwt.headerJson ?? '', 'header')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 hover:text-rose-950"
                    >
                      {copiedSection === 'header' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto scroll-touch p-4 font-mono text-xs text-slate-800 bg-slate-50/30">
                    {parsedJwt.headerJson}
                  </pre>
                </div>

                {/* Payload Card */}
                <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-2xs">
                  <div className="flex items-center justify-between border-b border-purple-100 bg-purple-50/70 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-500" aria-hidden="true" />
                      <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                        Payload (Decoded Claims &amp; Data)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(parsedJwt.payloadJson ?? '', 'payload')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 hover:text-purple-950"
                    >
                      {copiedSection === 'payload' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto scroll-touch p-4 font-mono text-xs text-slate-800 bg-slate-50/30 max-h-72">
                    {parsedJwt.payloadJson}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-xs text-rose-900">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <span>Unable to decode token</span>
              </div>
              <p className="mt-1 text-rose-800">{parsedJwt.error}</p>
            </div>
          )}
        </div>
      ) : (
        /* Base64 & URL Codec View */
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Direction:</span>
              <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setCodecMode('encode')}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    codecMode === 'encode'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Encode
                </button>
                <button
                  type="button"
                  onClick={() => setCodecMode('decode')}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    codecMode === 'decode'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Decode
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCodecInput(codecOutput);
                setCodecMode(codecMode === 'encode' ? 'decode' : 'encode');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-[#1D4ED8]" />
              <span>Swap Output to Input</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Input Side */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Input ({codecMode === 'encode' ? 'Raw Text' : activeCodecTab.toUpperCase()}):</span>
                <span className="text-[11px] font-normal text-slate-500 font-mono">
                  {codecInput.length} chars
                </span>
              </div>
              <textarea
                rows={8}
                value={codecInput}
                onChange={(e) => setCodecInput(e.target.value)}
                placeholder="Type or paste content..."
                className="input-obsidian w-full p-3 font-mono text-xs"
              />
            </div>

            {/* Output Side */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Output ({codecMode === 'encode' ? activeCodecTab.toUpperCase() : 'Decoded Text'}):</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(codecOutput, 'codecOut')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                >
                  {copiedSection === 'codecOut' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={codecOutput}
                placeholder="Output will appear here..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 font-mono text-xs text-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

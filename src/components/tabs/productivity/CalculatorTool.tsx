import React, { useCallback, useEffect, useState } from 'react';
import { Delete } from 'lucide-react';

function evaluateExpression(raw: string): string {
  const expr = raw
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, `(${Math.PI})`)
    .replace(/\be\b/g, `(${Math.E})`);

  let pos = 0;

  const skipWhitespace = () => {
    while (pos < expr.length && /\s/.test(expr[pos])) pos++;
  };

  const parseExpression = (): number => {
    let left = parseTerm();
    while (true) {
      skipWhitespace();
      const ch = expr[pos];
      if (ch === '+') {
        pos++;
        left += parseTerm();
      } else if (ch === '-') {
        pos++;
        left -= parseTerm();
      } else {
        break;
      }
    }
    return left;
  };

  const parseTerm = (): number => {
    let left = parsePower();
    while (true) {
      skipWhitespace();
      const ch = expr[pos];
      if (ch === '*') {
        pos++;
        left *= parsePower();
      } else if (ch === '/') {
        pos++;
        const right = parsePower();
        if (right === 0) throw new Error('Division by zero');
        left /= right;
      } else {
        break;
      }
    }
    return left;
  };

  const parsePower = (): number => {
    const base = parseUnary();
    skipWhitespace();
    if (expr[pos] === '^') {
      pos++;
      return Math.pow(base, parsePower());
    }
    return base;
  };

  const parseUnary = (): number => {
    skipWhitespace();
    if (expr[pos] === '+') {
      pos++;
      return parseUnary();
    }
    if (expr[pos] === '-') {
      pos++;
      return -parseUnary();
    }
    return parsePrimary();
  };

  const parsePrimary = (): number => {
    skipWhitespace();

    if (expr[pos] === '(') {
      pos++;
      const val = parseExpression();
      skipWhitespace();
      if (expr[pos] === ')') pos++;
      return val;
    }

    const fnMatch = expr.slice(pos).match(/^(sin|cos|tan|log|ln|sqrt)\(/);
    if (fnMatch) {
      const fnName = fnMatch[1];
      pos += fnName.length + 1;
      const arg = parseExpression();
      skipWhitespace();
      if (expr[pos] === ')') pos++;

      if (fnName === 'sin') return Math.sin(arg);
      if (fnName === 'cos') return Math.cos(arg);
      if (fnName === 'tan') return Math.tan(arg);
      if (fnName === 'log') return Math.log10(arg);
      if (fnName === 'ln') return Math.log(arg);
      if (fnName === 'sqrt') {
        if (arg < 0) throw new Error('Negative sqrt');
        return Math.sqrt(arg);
      }
    }

    const numMatch = expr.slice(pos).match(/^(\d+(\.\d+)?|\.\d+)/);
    if (numMatch) {
      pos += numMatch[0].length;
      let val = parseFloat(numMatch[0]);
      skipWhitespace();
      if (expr[pos] === '%') {
        pos++;
        val = val / 100;
      }
      return val;
    }

    throw new Error('Syntax Error');
  };

  if (!expr.trim()) return '0';
  const result = parseExpression();
  skipWhitespace();
  if (pos < expr.length || !Number.isFinite(result)) {
    throw new Error('Invalid Expression');
  }
  const rounded = Math.round(result * 1e10) / 1e10;
  return String(rounded);
}

export const CalculatorTool: React.FC = () => {
  const [mode, setMode] = useState<'standard' | 'scientific'>('scientific');
  const [expression, setExpression] = useState<string>('');
  const [display, setDisplay] = useState<string>('0');
  const [history, setHistory] = useState<Array<{ expr: string; res: string }>>(
    []
  );

  const appendToken = useCallback((token: string) => {
    setExpression((prev) => {
      const next = prev + token;
      setDisplay(next);
      return next;
    });
  }, []);

  const handleClear = useCallback(() => {
    setExpression('');
    setDisplay('0');
  }, []);

  const handleBackspace = useCallback(() => {
    setExpression((prev) => {
      const next = prev.slice(0, -1);
      setDisplay(next || '0');
      return next;
    });
  }, []);

  const handleEquals = useCallback(() => {
    if (!expression.trim()) return;
    try {
      const result = evaluateExpression(expression);
      setHistory((prev) =>
        [{ expr: expression, res: result }, ...prev].slice(0, 8)
      );
      setExpression(result);
      setDisplay(result);
    } catch {
      setDisplay('Error');
    }
  }, [expression]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }

      if (/^[0-9.+\-*/()^%]$/.test(e.key)) {
        e.preventDefault();
        appendToken(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [appendToken, handleEquals, handleBackspace, handleClear]);

  const standardButtons = [
    ['C', '(', ')', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '%', '='],
  ];

  const scientificKeys = [
    { label: 'sin', token: 'sin(' },
    { label: 'cos', token: 'cos(' },
    { label: 'tan', token: 'tan(' },
    { label: '√', token: 'sqrt(' },
    { label: 'log', token: 'log(' },
    { label: 'ln', token: 'ln(' },
    { label: 'x²', token: '^2' },
    { label: 'xʸ', token: '^' },
    { label: 'π', token: 'π' },
    { label: 'e', token: 'e' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Frosted Cosmic Glass Calculator Body */}
      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 text-slate-50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6 lg:col-span-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#060913]/85 p-1">
            {(['standard', 'scientific'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`min-h-[36px] rounded-lg px-3.5 py-1 text-xs font-semibold capitalize transition-all ${
                  mode === m
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleBackspace}
            aria-label="Backspace"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <Delete className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span>Del</span>
          </button>
        </div>

        {/* Display Screen */}
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#060913]/90 px-4 py-4 text-right shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
          <p className="min-h-[18px] truncate font-mono text-xs text-slate-500 tabular-nums">
            {expression || 'Keyboard supported (0-9, + - * /, Enter)'}
          </p>
          <p className="mt-1 truncate font-mono text-3xl font-bold text-slate-50 tabular-nums sm:text-4xl">
            {display}
          </p>
        </div>

        {/* Scientific Key Row */}
        {mode === 'scientific' && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {scientificKeys.map((k) => (
              <button
                key={k.label}
                type="button"
                onClick={() => appendToken(k.token)}
                className="min-h-[44px] rounded-xl border border-indigo-400/20 bg-indigo-500/10 font-mono text-xs font-semibold text-indigo-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white"
              >
                {k.label}
              </button>
            ))}
          </div>
        )}

        {/* Standard Keypad */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {standardButtons.flat().map((btn) => {
            const isEquals = btn === '=';
            const isClear = btn === 'C';
            const isOp = ['÷', '×', '−', '+'].includes(btn);

            return (
              <button
                key={btn}
                type="button"
                onClick={() => {
                  if (isEquals) handleEquals();
                  else if (isClear) handleClear();
                  else appendToken(btn);
                }}
                className={`min-h-[48px] rounded-xl font-mono text-base font-bold transition-all ${
                  isEquals
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:bg-cyan-300'
                    : isClear
                      ? 'border border-indigo-400/30 bg-indigo-500/20 text-indigo-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-indigo-500/30'
                      : isOp
                        ? 'border border-cyan-500/20 bg-slate-800/70 text-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-slate-700/80'
                        : 'border border-white/[0.08] bg-[#060913]/75 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/20 hover:bg-slate-800/70'
                }`}
              >
                {btn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculation History Tape */}
      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/75 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6 lg:col-span-5">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div>
            <h2 className="font-display text-base font-bold text-slate-50">
              Calculation Tape
            </h2>
            <p className="text-xs text-slate-400">
              Click any past result to reuse it.
            </p>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setHistory([])}
              className="text-xs font-semibold text-slate-400 hover:text-cyan-300"
            >
              Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="py-12 text-center text-xs text-slate-500">
            Recent calculations will appear here. Note: trig functions operate in radians.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-white/[0.06]">
            {history.map((item, idx) => (
              <button
                key={`${item.expr}-${idx}`}
                type="button"
                onClick={() => {
                  setExpression(item.res);
                  setDisplay(item.res);
                }}
                className="flex w-full items-center justify-between rounded-xl px-2.5 py-3 text-left transition-colors hover:bg-white/[0.04]"
              >
                <span className="truncate font-mono text-xs text-slate-400">
                  {item.expr}
                </span>
                <span className="ml-3 shrink-0 font-mono text-sm font-bold text-emerald-400 tabular-nums">
                  = {item.res}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

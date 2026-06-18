import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

const VAR_RE = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const extractVariables = (text = '') => {
  const found = new Set();
  let m;
  const re = new RegExp(VAR_RE.source, 'g');
  while ((m = re.exec(text)) !== null) found.add(m[1]);
  return [...found];
};

import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
  if (!(window as any).process) {
    (window as any).process = {
      env: {},
      browser: true,
      version: '',
      nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
    };
  }
}

export {};

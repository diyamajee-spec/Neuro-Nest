// Temporary type declarations to resolve IDE errors while dependencies are being installed.

declare module 'react' {
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function createContext<T>(defaultValue: T): any;
  export function useContext<T>(context: any): T;
  export type ReactNode = any;
  export interface Context<T> {
    Provider: any;
    Consumer: any;
  }
}

declare namespace React {
  export type ReactNode = any;
  export type FormEvent<T = any> = any;
  export type ChangeEvent<T = any> = any;
  export type ReactElement = any;
}

declare module 'react-dom';

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
}

declare module 'next/server' {
  export class NextRequest extends Request {
    formData(): Promise<FormData>;
    json(): Promise<any>;
  }
  export class NextResponse extends Response {
    static json(body: any, init?: ResponseInit): NextResponse;
  }
}

declare module 'next/navigation' {
  export function useRouter(): any;
  export function useParams(): any;
  export function usePathname(): any;
}

declare module 'next/font/google' {
  export function Inter(options: any): any;
  export function Outfit(options: any): any;
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
}

declare module 'lucide-react';
declare module '@google/generative-ai';
declare module '@supabase/supabase-js';
declare module '@supabase/auth-helpers-nextjs';
declare module 'pdf-parse';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare var process: {
  env: {
    [key: string]: string | undefined;
  };
};

declare interface Buffer extends Uint8Array {
  [index: number]: number;
}
declare var Buffer: {
  from(data: any, encoding?: string): Buffer;
  [key: string]: any;
};

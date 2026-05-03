declare module 'clsx' {
  export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];
  export function clsx(...inputs: ClassValue[]): string;
}

declare module 'tailwind-merge' {
  export function twMerge(...inputs: string[]): string;
}

// Basic Node.js type stubs to satisfy compiler
declare var process: {
  env: {
    [key: string]: string | undefined;
  };
};

declare var module: {
  exports: any;
};

declare var require: any;

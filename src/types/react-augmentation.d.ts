import 'react';

declare module 'react' {
  export function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
}

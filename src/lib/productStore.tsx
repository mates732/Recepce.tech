"use client";

import { createContext, useContext, useState, type ReactNode } from 'react';

import type { ProductMode } from '@/components/shared/ProductToggle';

interface ProductContextValue {
  mode: ProductMode;
  setMode: (mode: ProductMode) => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children, defaultMode = 'asistenti' }: {
  children: ReactNode;
  defaultMode?: ProductMode;
}) {
  const [mode, setModeRaw] = useState(defaultMode);
  const setMode = (m: ProductMode) => {
    setModeRaw(m);
  };
  const contextValue: ProductContextValue = { mode, setMode };
  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProduct must be used within ProductProvider');
  return ctx;
}

export type { ProductMode };

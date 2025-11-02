import React from 'react';
import { LocaleProvider } from './contexts/LocaleContext';

// 导出rootContainer函数，Umi会用它来包装整个应用
export const rootContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <LocaleProvider>
      {children}
    </LocaleProvider>
  );
};
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import zhCN from '../locales/zh-CN/global';
import enUS from '../locales/en-US/global';

// Create Locale Context
interface LocaleContextType {
  locale: string;
  toggleLocale: () => void;
}

export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Custom hook to use Locale Context
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

// 根据浏览器语言设置默认语言
const getDefaultLocale = () => {
  const browserLocale = navigator.language;
  if (browserLocale.startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en-US';
};

// Locale Provider component
export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState(getDefaultLocale());
  const messages = locale === 'zh-CN' ? zhCN : enUS;

  // 切换语言的函数
  const toggleLocale = () => {
    setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN');
  };

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};
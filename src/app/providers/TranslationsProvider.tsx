'use client';

import React, { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n as I18nType } from 'i18next';
import initTranslations from '@/i18n';
import { createInstance } from 'i18next';

interface TranslationsProviderProps {
  children: ReactNode;
  locale: string;
  namespaces: string[];
  resources: Record<string, any>; // Adjust the type according to the structure of your resources
}

const TranslationsProvider: React.FC<TranslationsProviderProps> = ({
  children,
  locale,
  namespaces,
  resources,
}) => {
  const i18n: I18nType = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;

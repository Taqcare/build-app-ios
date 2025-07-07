
import React from 'react';
import { ShoppingCart, Clock } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

const StorePage = () => {
  const { t } = useLanguage();

  return (
    <div className="p-4 pb-20 max-w-5xl mx-auto bg-white dark:bg-gray-900 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('store.title')}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t('store.subtitle')}</p>
        </div>
        <ShoppingCart className="h-8 w-8 text-primary" />
      </header>

      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-6">
          <Clock className="h-24 w-24 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Em Breve
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
          Estamos preparando produtos incríveis para você. Fique ligado!
        </p>
      </div>
    </div>
  );
};

export default StorePage;

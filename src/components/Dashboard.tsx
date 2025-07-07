
import React, { useState } from 'react';
import TreatmentCalendar from './TreatmentCalendar';
import TreatmentStatus from './TreatmentStatus';
import WeeklyProgress from './WeeklyProgress';
import HelpSection from './HelpSection';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { HelpCircle, Image, Upload, Calendar } from 'lucide-react';
import PersonalizedPlan from './Profile/PersonalizedPlan';
import { toast } from './ui/sonner';
import ProgressGallery from './ProgressGallery';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const username = localStorage.getItem('username') || t('dashboard.welcome');
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="p-4 space-y-6 pb-20 max-w-5xl mx-auto">
      <header className="text-left mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('dashboard.hello')}, {username}!</h1>
        <p className="text-gray-600 dark:text-gray-300">{t('dashboard.trackProgress')}</p>
      </header>
      
      <div className="space-y-6">
        {/* Seção 1: Progresso Tratamento */}
        <TreatmentStatus />
        
        {/* Seção 2: Seu Plano Personalizado */}
        <PersonalizedPlan />
        
        {/* Seção 3: Evolução Semanal */}
        <WeeklyProgress />
        
        {/* Seção 4: Fotos do Progresso */}
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              <span>Fotos do Progresso</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ProgressGallery />
          </CardContent>
        </Card>
      </div>

      {/* Botão de ajuda flutuante */}
      <Button
        onClick={() => setHelpOpen(true)}
        className="fixed bottom-20 right-4 rounded-full w-12 h-12 shadow-lg flex items-center justify-center p-0 z-50"
        size="icon"
      >
        <HelpCircle className="w-6 h-6" />
      </Button>
      
      {/* Popup de ajuda */}
      <HelpSection isOpen={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
};

export default Dashboard;

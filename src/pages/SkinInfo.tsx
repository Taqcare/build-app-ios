import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Palette } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from "@/components/ui/sonner";

interface UserPreferences {
  skin_tone: string;
  hair_color: string;
}

const SkinInfo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return;

      try {
        console.log('Fetching preferences for user:', user.id);
        
        const { data, error } = await supabase
          .from('user_preferences')
          .select('skin_tone, hair_color')
          .eq('user_id', user.id)
          .limit(1);

        if (error) {
          console.error('Error fetching user preferences:', error);
          toast.error('Erro ao carregar informações da pele');
          return;
        }

        console.log('Fetched data:', data);
        
        if (data && data.length > 0) {
          setPreferences(data[0]);
        } else {
          console.log('No preferences found for user');
          setPreferences(null);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro ao carregar informações da pele');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPreferences();
  }, [user]);

  const getSkinToneDisplay = (skinTone: string) => {
    const skinToneMap: { [key: string]: string } = {
      'branco': 'Muito Clara',
      'bege': 'Clara',
      'castanho-claro': 'Média',
      'castanho-medio': 'Oliva',
      'castanho-escuro': 'Bronzeada',
      'castanho-muito-escuro': 'Muito Escura'
    };
    return skinToneMap[skinTone] || skinTone;
  };

  const getHairColorDisplay = (hairColor: string) => {
    const hairColorMap: { [key: string]: string } = {
      'loiro': 'Loiro',
      'castanho-claro': 'Castanho Claro',
      'castanho-medio': 'Castanho Médio', 
      'castanho-escuro': 'Castanho Escuro',
      'preto': 'Preto',
      'ruivo': 'Ruivo'
    };
    return hairColorMap[hairColor] || hairColor;
  };

  const getSkinToneColor = (skinTone: string) => {
    const colorMap: { [key: string]: string } = {
      'branco': '#FDF2E9',
      'bege': '#FAE5D3', 
      'castanho-claro': '#DDB892',
      'castanho-medio': '#C9A96E',
      'castanho-escuro': '#A67C52',
      'castanho-muito-escuro': '#8B4513'
    };
    return colorMap[skinTone] || '#E5E7EB';
  };

  const getHairColorColor = (hairColor: string) => {
    const colorMap: { [key: string]: string } = {
      'loiro': '#F7E98E',
      'castanho-claro': '#D2B48C',
      'castanho-medio': '#A0522D',
      'castanho-escuro': '#8B4513',
      'preto': '#2C2C2C',
      'ruivo': '#CD853F'
    };
    return colorMap[hairColor] || '#E5E7EB';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-600 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 pb-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Informações da Pele
            </h1>
          </div>

          {!preferences ? (
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma informação de pele encontrada. Complete o questionário de onboarding para ver suas informações.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Skin Tone Card */}
              <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm rounded-xl">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary-light dark:bg-primary-dark rounded-full p-2">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Tom de Pele
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Seu tom de pele registrado
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                      style={{ backgroundColor: getSkinToneColor(preferences.skin_tone) }}
                    />
                    <div>
                      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        {getSkinToneDisplay(preferences.skin_tone)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Usado para personalizar seu tratamento
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Hair Color Card */}
              <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm rounded-xl">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary-light dark:bg-primary-dark rounded-full p-2">
                      <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Cor do Cabelo
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sua cor de cabelo registrada
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                      style={{ backgroundColor: getHairColorColor(preferences.hair_color) }}
                    />
                    <div>
                      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        {getHairColorDisplay(preferences.hair_color)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Usado para ajustar a intensidade do IPL
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Info Card */}
              <Card className="overflow-hidden bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm rounded-xl">
                <div className="p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>💡 Dica:</strong> Essas informações foram coletadas durante seu onboarding e são usadas para personalizar seu plano de tratamento IPL e garantir a melhor eficácia e segurança.
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkinInfo;

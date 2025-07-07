import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from './ui/chart';
import {
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Line
} from 'recharts';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  getTreatmentCalculation, 
  getCompletedSessionsCount,
  calculateTotalProgress,
  SkinTone,
  HairColor 
} from '@/services/treatmentCalculations';
import { addDays, format, subWeeks, isAfter, isBefore, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const WeeklyProgress = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<Array<{ name: string; progress: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch user preferences - MUDANÇA: usando .limit(1) para pegar apenas um registro
        const { data: userPreferences, error: preferencesError } = await supabase
          .from('user_preferences')
          .select('skin_tone, hair_color')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (preferencesError) {
          console.error("Error fetching user preferences:", preferencesError);
          return;
        }

        // Get skin tone and hair color do primeiro registro se existir
        const skinTone = (userPreferences?.[0]?.skin_tone || 'branco') as SkinTone;
        const hairColor = (userPreferences?.[0]?.hair_color || 'preto') as HairColor;
        
        // Get treatment calculation
        const treatmentCalculation = getTreatmentCalculation(skinTone, hairColor);
        const progressPerSession = treatmentCalculation.progressPerSession;
        
        // Fetch all completed sessions sorted by date
        const { data: completedSessions, error: sessionsError } = await supabase
          .from('treatment_sessions')
          .select('session_date, status')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('session_date', { ascending: true });

        if (sessionsError) {
          console.error("Error fetching completed sessions:", sessionsError);
          return;
        }

        // Create weekly progress data
        const weeklyData = [];
        let cumulativeProgress = 0;
        
        // If we have completed sessions, create progress points based on them
        if (completedSessions && completedSessions.length > 0) {
          // Group sessions by week
          const weekMap = new Map();
          
          completedSessions.forEach(session => {
            const sessionDate = new Date(session.session_date);
            const weekStart = format(sessionDate, 'yyyy-MM-dd');
            const weekKey = `Sem ${weekMap.size + 1}`;
            
            if (!weekMap.has(weekKey)) {
              weekMap.set(weekKey, {
                date: weekStart,
                count: 1
              });
            } else {
              weekMap.get(weekKey).count += 1;
            }
          });
          
          // Create data points from the grouped sessions
          Array.from(weekMap.entries()).forEach(([weekKey, weekData]) => {
            cumulativeProgress += (weekData.count * progressPerSession);
            weeklyData.push({
              name: weekKey,
              progress: Math.min(100, Math.round(cumulativeProgress))
            });
          });
        } else {
          // If no completed sessions, create 6 empty weeks
          for (let i = 0; i < 6; i++) {
            weeklyData.push({
              name: `Sem ${i + 1}`,
              progress: 0
            });
          }
        }
        
        // Ensure we have at least 6 data points
        if (weeklyData.length < 6) {
          const lastProgress = weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].progress : 0;
          
          for (let i = weeklyData.length; i < 6; i++) {
            weeklyData.push({
              name: `Sem ${i + 1}`,
              progress: lastProgress  // Keep the last progress value for future weeks
            });
          }
        }
        
        setChartData(weeklyData);
      } catch (error) {
        console.error("Error loading progress data:", error);
        
        // Fallback data if there's an error
        const fallbackData = [
          { name: 'Sem 1', progress: 0 },
          { name: 'Sem 2', progress: 0 },
          { name: 'Sem 3', progress: 0 },
          { name: 'Sem 4', progress: 0 },
          { name: 'Sem 5', progress: 0 },
          { name: 'Sem 6', progress: 0 },
        ];
        
        setChartData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user]);

  // Render loading state
  if (loading) {
    return (
      <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Evolução Semanal</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">Redução dos pelos ao longo do tempo</p>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full mt-4 bg-gray-100 dark:bg-gray-600 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Evolução Semanal</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">Redução dos pelos ao longo do tempo</p>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FE7E8D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FE7E8D" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                padding={{ top: 20, bottom: 0 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 p-2 shadow-md">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                        <p className="text-sm text-primary font-semibold">
                          {`${payload[0].value}% Redução`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="progress" 
                stroke="#FE7E8D" 
                strokeWidth={3}
                fill="url(#progressGradient)"
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#FE7E8D"
                strokeWidth={3}
                dot={{ 
                  fill: "#FE7E8D", 
                  r: 4,
                  strokeWidth: 2,
                  stroke: "#FFFFFF"
                }}
                activeDot={{ 
                  r: 6,
                  stroke: "#FFFFFF",
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Eye, EyeOff, Mail, Lock, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import ForgotPasswordForm from './ForgotPasswordForm';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm = ({ onToggleForm }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { language, setLanguage } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(
        language === 'pt' ? "Preencha todos os campos" : "Fill in all fields", 
        {
          description: language === 'pt' ? "Email e senha são obrigatórios" : "Email and password are required"
        }
      );
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success(
        language === 'pt' ? "Login realizado com sucesso!" : "Login successful!", 
        {
          description: language === 'pt' ? "Redirecionando..." : "Redirecting..."
        }
      );
    } catch (error: any) {
      toast.error(
        language === 'pt' ? "Falha no login" : "Login failed", 
        {
          description: error.message || (language === 'pt' ? "Verifique suas credenciais e tente novamente" : "Check your credentials and try again")
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang: 'pt' | 'en') => {
    setLanguage(lang);
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm 
        onCancel={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Mail size={18} />
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Lock size={18} />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'pt' ? "Senha" : "Password"}
              required
              className="pl-10 pr-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                type="button"
                className="text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-transparent p-0 h-auto font-normal"
              >
                <Languages className="w-4 h-4 mr-1" />
                {language === 'pt' ? 'PT' : 'EN'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <DropdownMenuItem 
                onClick={() => handleLanguageChange('pt')}
                className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Português
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleLanguageChange('en')}
                className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button 
            type="button" 
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-primary hover:underline"
          >
            {language === 'pt' ? "Esqueceu a senha?" : "Forgot password?"}
          </button>
        </div>
        
        <Button 
          className="w-full h-12 text-base font-medium rounded-full" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? 
            (language === 'pt' ? 'Entrando...' : 'Signing in...') : 
            (language === 'pt' ? 'Entrar' : 'Sign In')
          }
        </Button>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {language === 'pt' ? "Não tem uma conta?" : "Don't have an account?"}{' '}
          <button 
            onClick={onToggleForm} 
            type="button" 
            className="text-primary hover:underline font-medium"
          >
            {language === 'pt' ? "Cadastre-se" : "Sign up"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Mail, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import OtpVerificationForm from './OtpVerificationForm';
import NewPasswordForm from './NewPasswordForm';

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

const ForgotPasswordForm = ({ onCancel }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Digite seu email", {
        description: "Precisamos do seu email para enviar o código de verificação"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const otp = generateOtp();
      setGeneratedOtp(otp);

      const { error } = await supabase.functions.invoke('send-otp', {
        body: { email, otp }
      });
      
      if (error) throw error;
      
      setStep('otp');
      
      toast.success("Código enviado", {
        description: "Verifique sua caixa de entrada para o código de verificação"
      });
    } catch (error: any) {
      toast.error("Falha ao enviar código", {
        description: error.message || "Tente novamente mais tarde"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      const otp = generateOtp();
      setGeneratedOtp(otp);

      const { error } = await supabase.functions.invoke('send-otp', {
        body: { email, otp }
      });
      
      if (error) throw error;
      
      toast.success("Código reenviado", {
        description: "Verifique sua caixa de entrada novamente"
      });
    } catch (error: any) {
      toast.error("Falha ao reenviar código", {
        description: error.message || "Tente novamente mais tarde"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = () => {
    setStep('newPassword');
  };

  const handlePasswordReset = () => {
    toast.success("Senha atualizada com sucesso!", {
      description: "Você pode fazer login com sua nova senha"
    });
    onCancel();
  };

  if (step === 'otp') {
    return (
      <OtpVerificationForm 
        email={email}
        expectedOtp={generatedOtp}
        onVerified={handleOtpVerified}
        onResendCode={handleResend}
        onCancel={() => setStep('email')}
      />
    );
  }

  if (step === 'newPassword') {
    return (
      <NewPasswordForm 
        email={email}
        onSuccess={handlePasswordReset}
        onCancel={() => setStep('email')}
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
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Esqueceu sua senha?</h2>
          <p className="text-sm text-gray-500">
            Digite seu email para receber um código de verificação
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Mail size={18} />
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
        
        <Button 
          className="w-full h-12 text-base font-medium rounded-full" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar código'}
        </Button>
        
        <div className="text-center">
          <button 
            type="button" 
            onClick={onCancel}
            className="text-sm text-primary hover:underline"
          >
            Voltar para login
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgotPasswordForm;

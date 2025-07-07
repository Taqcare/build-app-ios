
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendOtpRequest {
  email: string;
  otp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting send-otp function");
    
    // Get and clean the API key
    const rawApiKey = Deno.env.get("RESEND_API_KEY");
    const apiKey = rawApiKey?.trim().replace(/[\r\n]/g, '');
    
    console.log("Raw API Key exists:", !!rawApiKey);
    console.log("Raw API Key length:", rawApiKey?.length || 0);
    console.log("Cleaned API Key exists:", !!apiKey);
    console.log("Cleaned API Key length:", apiKey?.length || 0);
    
    if (!apiKey || apiKey.length === 0) {
      console.error("RESEND_API_KEY not found or empty after cleaning");
      
      return new Response(
        JSON.stringify({ 
          error: "Configuração do servidor incompleta",
          details: "RESEND_API_KEY não encontrada ou inválida"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Initializing Resend with cleaned API key...");
    const resend = new Resend(apiKey);
    
    const { email, otp }: SendOtpRequest = await req.json();
    console.log("Request received for email:", email);
    console.log("OTP to send:", otp);

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: "Email e OTP são obrigatórios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Attempting to send email with Resend...");

    const emailResponse = await resend.emails.send({
      from: "Taqcare <no-reply@taqcare.com.br>",
      to: [email],
      subject: "Código de verificação - Taqcare",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px;">
            <h1 style="color: #333; margin-bottom: 30px;">Código de Verificação</h1>
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Use o código abaixo para redefinir sua senha:
            </p>
            <div style="background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #333;">
                ${otp}
              </span>
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 20px;">
              Este código expira em 10 minutos por motivos de segurança.
            </p>
            <p style="color: #999; font-size: 14px;">
              Se você não solicitou este código, ignore este email.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Erro interno do servidor",
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

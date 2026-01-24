// Resend integration for sending transactional emails
import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

export async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendLeadConfirmationEmail(toEmail: string, interest: string, name?: string) {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const interestLabels: Record<string, string> = {
      'fraccion': 'Adquirir una fracción',
      'vivirla': 'Vivirla (vacaciones)',
      'ganar': 'Ganar con ella (rentas)',
      'broker': 'Ser Broker / Influencer',
      'lastminute': 'Last Minute Capital',
      'aportar': 'Aportar mi propiedad',
      'vender': 'Vender mi propiedad'
    };

    const interestLabel = interestLabels[interest] || interest;
    const greeting = name ? `Hola ${name}` : 'Hola';

    const { data, error } = await client.emails.send({
      from: fromEmail || 'Fractional Living <noreply@resend.dev>',
      to: [toEmail],
      subject: 'Tu solicitud ha sido recibida - Fractional Living',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; margin: 0; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 300; margin: 0; letter-spacing: 2px;">FRACTIONAL LIVING</h1>
              <p style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin-top: 8px;">All Global Holding LLC</p>
            </div>
            
            <div style="background: rgba(77, 182, 172, 0.1); border: 1px solid rgba(77, 182, 172, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 25px;">
              <p style="color: #4db6ac; font-size: 14px; margin: 0; text-align: center;">✓ Solicitud recibida correctamente</p>
            </div>
            
            <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              ${greeting},
            </p>
            
            <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.8; margin-bottom: 20px;">
              Hemos recibido tu solicitud de interés en: <strong style="color: #4db6ac;">${interestLabel}</strong>
            </p>
            
            <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.8; margin-bottom: 25px;">
              En los próximos <strong style="color: #ffffff;">5 días hábiles</strong> recibirás el estatus de tu solicitud y un asesor se pondrá en contacto contigo.
            </p>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px; margin-top: 25px;">
              <p style="color: rgba(255,255,255,0.5); font-size: 12px; text-align: center; margin: 0;">
                ¿Tienes preguntas? Escríbenos por WhatsApp: <a href="https://wa.me/529984292748" style="color: #4db6ac; text-decoration: none;">+52 998 429 2748</a>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 0;">
                Reserva · Compra · Vive · Renta · Vende con plusvalía
              </p>
              <p style="color: #4db6ac; font-size: 11px; margin-top: 5px;">
                Y vuelve a comenzar
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendLeadConfirmationEmail:', error);
    return { success: false, error };
  }
}

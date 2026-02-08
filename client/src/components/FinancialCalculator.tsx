import { useState } from 'react';
import { Calculator, TrendingUp, Clock, CreditCard, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';

interface FinancialCalculatorProps {
  basePrice: number;
  prices2weeks?: number;
  prices3weeks?: number;
}

export function FinancialCalculator({ 
  basePrice,
  prices2weeks,
  prices3weeks,
}: FinancialCalculatorProps) {
  const [weeks, setWeeks] = useState<1 | 2 | 3>(1);

  const price1 = basePrice;
  const price2 = prices2weeks || Math.round(basePrice * 2 * 0.93);
  const price3 = prices3weeks || Math.round(basePrice * 3 * 0.86);

  const priceMap = { 1: price1, 2: price2, 3: price3 };
  const totalPrice = priceMap[weeks];

  const enganche = Math.round(totalPrice * 0.30);
  const saldoFinanciar = totalPrice - enganche;
  const mensualidad = Math.round(saldoFinanciar / 12);

  const savingsVs2 = weeks === 2 ? (basePrice * 2) - price2 : 0;
  const savingsVs3 = weeks === 3 ? (basePrice * 3) - price3 : 0;
  const savings = savingsVs2 || savingsVs3;

  return (
    <div className="bg-white border border-[#eee] rounded-md overflow-hidden">
      <div className="bg-[#111] p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-md">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Calculadora de Inversión</h3>
            <p className="text-white/60 text-sm font-light">Plan de pagos personalizado</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <p className="text-[#555] font-medium mb-3 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-[#555]" />
            ¿Cuántas semanas quieres?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((w) => (
              <button
                key={w}
                onClick={() => setWeeks(w as 1 | 2 | 3)}
                className={`relative p-4 rounded-md border transition-all duration-200 ${
                  weeks === w
                    ? 'border-[#111] bg-[#111]'
                    : 'border-[#eee] bg-white hover:border-[#999]'
                }`}
                data-testid={`calc-week-${w}`}
              >
                {w > 1 && (
                  <span className="absolute -top-2 -right-2 bg-[#111] text-white text-[9px] font-medium px-2 py-0.5 rounded-sm tracking-wider uppercase">
                    Ahorra
                  </span>
                )}
                <p className={`text-2xl font-light ${weeks === w ? 'text-white' : 'text-[#111]'}`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {w}
                </p>
                <p className={`text-xs mt-1 font-light ${weeks === w ? 'text-white/60' : 'text-[#999]'}`}>
                  {w === 1 ? 'semana' : 'semanas'}
                </p>
                <p className={`text-sm font-medium mt-2 ${weeks === w ? 'text-white' : 'text-[#111]'}`}>
                  ${priceMap[w as 1 | 2 | 3].toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        {savings > 0 && (
          <div className="flex items-center gap-3 p-4 bg-[#111] rounded-md">
            <div className="p-2 bg-white/10 rounded-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Descuento aplicado</p>
              <p className="text-white/60 text-sm font-light">Ahorras ${savings.toLocaleString()} MXN</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-[#eee] rounded-md p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#f5f5f5] rounded-md">
                <CreditCard className="w-5 h-5 text-[#555]" />
              </div>
              <div>
                <p className="text-[#111] font-medium text-sm">Enganche</p>
                <p className="text-[#999] text-xs font-light">30% al firmar</p>
              </div>
            </div>
            <p className="text-[#111] font-medium text-lg">${enganche.toLocaleString()}</p>
          </div>

          <div className="h-px bg-[#eee]" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#111] rounded-md">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[#111] font-medium text-sm">12 Mensualidades</p>
                <p className="text-[#999] text-xs font-light">Sin intereses</p>
              </div>
            </div>
            <p className="text-[#111] font-medium text-lg">${mensualidad.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-[#111] rounded-md p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-light">Inversión Total</p>
              <p className="text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>${totalPrice.toLocaleString()}</p>
              <p className="text-white/50 text-xs font-light">MXN · {weeks} semana{weeks > 1 ? 's' : ''}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-md">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-md p-3 text-center">
              <p className="text-white/50 text-xs font-light">Pagas hoy</p>
              <p className="font-medium">${enganche.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-md p-3 text-center">
              <p className="text-white/50 text-xs font-light">Por mes</p>
              <p className="font-medium">${mensualidad.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#888] text-sm font-light">
            <CheckCircle2 className="w-4 h-4 text-[#555]" />
            <span>30% enganche</span>
          </div>
          <div className="flex items-center gap-2 text-[#888] text-sm font-light">
            <CheckCircle2 className="w-4 h-4 text-[#555]" />
            <span>12 meses sin intereses</span>
          </div>
          <div className="flex items-center gap-2 text-[#888] text-sm font-light">
            <CheckCircle2 className="w-4 h-4 text-[#555]" />
            <span>Propiedad heredable</span>
          </div>
          <div className="flex items-center gap-2 text-[#888] text-sm font-light">
            <CheckCircle2 className="w-4 h-4 text-[#555]" />
            <span>Preventa - máxima plusvalía</span>
          </div>
        </div>

        <a
          href="https://wa.me/529984292748?text=Hola,%20quiero%20información%20sobre%20el%20plan%20de%20pagos"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-[#111] hover:bg-[#000] text-white font-medium rounded-md text-center transition-colors duration-200"
          data-testid="calc-whatsapp"
        >
          Solicitar Plan de Pagos
        </a>
      </div>
    </div>
  );
}

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
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Calculadora de Inversión</h3>
            <p className="text-white/80 text-sm">Plan de pagos personalizado</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <p className="text-gray-700 font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            ¿Cuántas semanas quieres?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((w) => (
              <button
                key={w}
                onClick={() => setWeeks(w as 1 | 2 | 3)}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  weeks === w
                    ? 'border-teal-500 bg-teal-50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
                }`}
                data-testid={`calc-week-${w}`}
              >
                {w > 1 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Ahorra
                  </span>
                )}
                <p className={`text-2xl font-bold ${weeks === w ? 'text-teal-600' : 'text-gray-900'}`}>
                  {w}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {w === 1 ? 'semana' : 'semanas'}
                </p>
                <p className={`text-sm font-semibold mt-2 ${weeks === w ? 'text-teal-600' : 'text-gray-700'}`}>
                  ${priceMap[w as 1 | 2 | 3].toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        {savings > 0 && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
            <div className="p-2 bg-green-100 rounded-xl">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-green-700 font-semibold">¡Descuento aplicado!</p>
              <p className="text-green-600 text-sm">Ahorras ${savings.toLocaleString()} MXN</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">Enganche</p>
                <p className="text-gray-500 text-xs">30% al firmar</p>
              </div>
            </div>
            <p className="text-blue-600 font-bold text-lg">${enganche.toLocaleString()}</p>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">12 Mensualidades</p>
                <p className="text-gray-500 text-xs">Sin intereses</p>
              </div>
            </div>
            <p className="text-purple-600 font-bold text-lg">${mensualidad.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Inversión Total</p>
              <p className="text-3xl font-bold">${totalPrice.toLocaleString()}</p>
              <p className="text-white/70 text-xs">MXN · {weeks} semana{weeks > 1 ? 's' : ''} al año</p>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-white/70 text-xs">Pagas hoy</p>
              <p className="font-bold">${enganche.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-white/70 text-xs">Por mes</p>
              <p className="font-bold">${mensualidad.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
            <span>Propiedad 100% heredable</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
            <span>Estructura fiduciaria protegida</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
            <span>42 semanas disponibles al año</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
            <span>Preventa - máxima plusvalía</span>
          </div>
        </div>

        <a
          href="https://wa.me/529984292748?text=Hola,%20quiero%20información%20sobre%20el%20plan%20de%20pagos"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl text-center transition-colors"
          data-testid="calc-whatsapp"
        >
          💬 Solicitar Plan de Pagos
        </a>
      </div>
    </div>
  );
}

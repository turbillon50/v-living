import { useState } from 'react';
import { Calculator, Wallet, CreditCard, CheckCircle, Sparkles, Clock, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FinancialCalculatorProps {
  basePrice?: number;
  vandefiPrice?: number;
}

export function FinancialCalculator({ 
  basePrice = 650000, 
  vandefiPrice = 600000 
}: FinancialCalculatorProps) {
  const [useVandefi, setUseVandefi] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [financingOption, setFinancingOption] = useState<'12' | '24' | 'contado'>('12');

  const price = useVandefi ? vandefiPrice : basePrice;
  const apartado = 50000;
  const enganchePercent = 0.30;
  const enganche = Math.round(price * enganchePercent);
  const restante = price - apartado - enganche;
  const savings = basePrice - vandefiPrice;

  const monthlyPayment12 = Math.round(restante / 12);
  const interestRate24 = 0.08;
  const totalWithInterest24 = restante * (1 + interestRate24);
  const monthlyPayment24 = Math.round(totalWithInterest24 / 24);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-teal-50 rounded-xl">
          <Calculator className="w-5 h-5 text-teal-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Calculadora Financiera</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setUseVandefi(false)}
          className={`p-4 rounded-xl border-2 transition-all ${
            !useVandefi 
              ? 'border-teal-500 bg-teal-50' 
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
          data-testid="button-price-regular"
        >
          <p className="text-gray-500 text-xs mb-1">Precio Regular</p>
          <p className="text-gray-900 font-bold text-lg">${basePrice.toLocaleString()}</p>
          <p className="text-gray-400 text-xs">MXN</p>
        </button>
        <button
          onClick={() => setUseVandefi(true)}
          className={`p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
            useVandefi 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
          data-testid="button-price-vandefi"
        >
          <div className="absolute top-2 right-2">
            <Sparkles className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-green-600 text-xs mb-1 font-medium">Con VanDeFi</p>
          <p className="text-gray-900 font-bold text-lg">${vandefiPrice.toLocaleString()}</p>
          <p className="text-green-600 text-xs">Ahorras ${savings.toLocaleString()}</p>
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Wallet className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-gray-900 text-sm font-medium">Apartado</p>
              <p className="text-gray-500 text-xs">Para reservar tu fracción</p>
            </div>
          </div>
          <p className="text-amber-600 font-bold">${apartado.toLocaleString()}</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900 text-sm font-medium">Enganche (30%)</p>
              <p className="text-gray-500 text-xs">Requerido al firmar</p>
            </div>
          </div>
          <p className="text-blue-600 font-bold">${enganche.toLocaleString()}</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CheckCircle className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-gray-900 text-sm font-medium">Saldo a financiar</p>
              <p className="text-gray-500 text-xs">Elige tu plan de pago</p>
            </div>
          </div>
          <p className="text-gray-900 font-bold">${restante.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Opciones de Financiamiento
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setFinancingOption('contado')}
            className={`p-3 rounded-xl border-2 transition-all text-center ${
              financingOption === 'contado'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            data-testid="button-financing-contado"
          >
            <p className="text-gray-900 font-bold text-sm">Contado</p>
            <p className="text-green-600 text-xs mt-1">5% desc.</p>
          </button>
          <button
            onClick={() => setFinancingOption('12')}
            className={`p-3 rounded-xl border-2 transition-all text-center ${
              financingOption === '12'
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            data-testid="button-financing-12"
          >
            <p className="text-gray-900 font-bold text-sm">12 Meses</p>
            <p className="text-teal-600 text-xs mt-1">Sin intereses</p>
          </button>
          <button
            onClick={() => setFinancingOption('24')}
            className={`p-3 rounded-xl border-2 transition-all text-center ${
              financingOption === '24'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            data-testid="button-financing-24"
          >
            <p className="text-gray-900 font-bold text-sm">24 Meses</p>
            <p className="text-purple-600 text-xs mt-1">8% anual</p>
          </button>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-xl mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">
              {financingOption === 'contado' 
                ? 'Pago único del saldo' 
                : `Mensualidad a ${financingOption} meses`}
            </p>
            {financingOption === '24' && (
              <p className="text-purple-600 text-xs flex items-center gap-1 mt-1">
                <Percent className="w-3 h-3" />
                8% anual incluido
              </p>
            )}
            {financingOption === '12' && (
              <p className="text-teal-600 text-xs mt-1 font-medium">Sin intereses</p>
            )}
            {financingOption === 'contado' && (
              <p className="text-green-600 text-xs mt-1 font-medium">Descuento 5% aplicado</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-gray-900 font-bold text-2xl">
              ${financingOption === 'contado' 
                ? Math.round(restante * 0.95).toLocaleString()
                : financingOption === '12'
                  ? monthlyPayment12.toLocaleString()
                  : monthlyPayment24.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs">MXN{financingOption !== 'contado' ? ' /mes' : ''}</p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => setShowDetails(!showDetails)}
        className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
        data-testid="button-show-details"
      >
        {showDetails ? 'Ocultar detalles' : 'Ver desglose completo'}
      </Button>

      {showDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-2 text-sm border border-gray-100">
          <div className="flex justify-between text-gray-600">
            <span>Precio fracción {useVandefi ? '(VanDeFi)' : ''}</span>
            <span>${price.toLocaleString()} MXN</span>
          </div>
          <div className="flex justify-between text-amber-600">
            <span>(-) Apartado</span>
            <span>-${apartado.toLocaleString()} MXN</span>
          </div>
          <div className="flex justify-between text-blue-600">
            <span>(-) Enganche 30%</span>
            <span>-${enganche.toLocaleString()} MXN</span>
          </div>
          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between text-gray-900 font-medium">
            <span>= Saldo a financiar</span>
            <span>${restante.toLocaleString()} MXN</span>
          </div>
          
          {financingOption === '12' && (
            <div className="mt-3 p-3 bg-teal-50 border border-teal-100 rounded-lg">
              <p className="text-teal-700 text-xs text-center">
                12 pagos de <span className="font-bold">${monthlyPayment12.toLocaleString()} MXN</span> sin intereses
              </p>
            </div>
          )}
          
          {financingOption === '24' && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded-lg space-y-1">
              <p className="text-purple-700 text-xs text-center">
                24 pagos de <span className="font-bold">${monthlyPayment24.toLocaleString()} MXN</span>
              </p>
              <p className="text-purple-500 text-xs text-center">
                Total con interés: ${Math.round(totalWithInterest24).toLocaleString()} MXN
              </p>
            </div>
          )}
          
          {financingOption === 'contado' && (
            <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg">
              <p className="text-green-700 text-xs text-center">
                Pago único: <span className="font-bold">${Math.round(restante * 0.95).toLocaleString()} MXN</span>
                <span className="text-green-500"> (5% descuento)</span>
              </p>
            </div>
          )}

          {useVandefi && (
            <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg text-center">
              <p className="text-green-700 text-xs">
                Ahorro con VanDeFi: <span className="font-bold">${savings.toLocaleString()} MXN</span>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-xs">
          Incluye 3 semanas de uso anual • Propiedad heredable • Estructura fiduciaria
        </p>
      </div>
    </div>
  );
}

export function PricingBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-900">$650,000</span>
        <span className="text-gray-500 text-sm">MXN</span>
      </div>
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <Sparkles className="w-4 h-4" />
        <span>$600,000 con VanDeFi</span>
      </div>
    </div>
  );
}

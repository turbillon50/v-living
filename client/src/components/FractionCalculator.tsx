import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Calculator, DollarSign, Diamond, ChevronRight } from 'lucide-react';

interface FractionCalculatorProps {
  propertyTitle?: string;
  totalValue?: number;
  fractionPrice?: number;
  onProceedToPayment?: () => void;
}

export function FractionCalculator({ 
  propertyTitle = "Propiedad",
  totalValue = 520000,
  fractionPrice = 65000,
  onProceedToPayment 
}: FractionCalculatorProps) {
  const { language } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<'fiat' | 'crypto'>('fiat');

  const totalFractions = 8;
  const soldFractions = 3;
  const availableFractions = totalFractions - soldFractions;
  
  const fractionPercentage = (1 / totalFractions) * 100;

  const quarters = [
    { id: 'Q1', label: 'Q1: 25%', percentage: 25, color: '#4db6ac' },
    { id: 'Q2', label: 'Q2: 25%', percentage: 25, color: '#81c784' },
    { id: 'Q3', label: 'Q3: 25%', percentage: 25, color: '#ffb74d' },
    { id: 'Q4', label: 'Q4: 25%', percentage: 25, color: '#90a4ae' },
  ];

  const generatePieSlices = () => {
    let cumulativeAngle = 0;
    return quarters.map((quarter, index) => {
      const angle = (quarter.percentage / 100) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle = endAngle;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = 100 + 80 * Math.cos(startRad);
      const y1 = 100 + 80 * Math.sin(startRad);
      const x2 = 100 + 80 * Math.cos(endRad);
      const y2 = 100 + 80 * Math.sin(endRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      return (
        <path
          key={quarter.id}
          d={pathData}
          fill={quarter.color}
          stroke="white"
          strokeWidth="2"
          className="transition-all hover:opacity-80 cursor-pointer"
        />
      );
    });
  };

  return (
    <div className="bg-white border border-stone-200 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-5 h-5 text-[#4db6ac]" />
        <h3 className="text-lg font-medium text-[#2d3a3a]">
          {language === 'es' ? 'Calculadora de Fracciones' : 'Fraction Calculator'}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="flex flex-col items-center">
          <p className="text-sm text-stone-500 mb-4">
            {language === 'es' ? 'Property Shares' : 'Property Shares'}
          </p>
          
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {generatePieSlices()}
              <circle cx="100" cy="100" r="40" fill="white" />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-xs">
            {quarters.map((q) => (
              <div key={q.id} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: q.color }}
                />
                <span className="text-stone-600">{q.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-stone-500 mb-3">
              {language === 'es' ? 'Método de pago' : 'Payment method'}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('fiat')}
                className={`w-full flex items-center gap-4 p-4 border transition-all ${
                  paymentMethod === 'fiat' 
                    ? 'border-[#4db6ac] bg-[#4db6ac]/5' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
                data-testid="payment-fiat"
              >
                <div className="w-12 h-12 bg-[#4db6ac]/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#4db6ac]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#2d3a3a]">
                    {language === 'es' ? 'Moneda Fiat' : 'Fiat Currency'}
                  </p>
                  <p className="text-sm text-stone-500">USD, MXN, EUR</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`w-full flex items-center gap-4 p-4 border transition-all ${
                  paymentMethod === 'crypto' 
                    ? 'border-[#4db6ac] bg-[#4db6ac]/5' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
                data-testid="payment-crypto"
              >
                <div className="w-12 h-12 bg-[#4db6ac]/10 flex items-center justify-center">
                  <Diamond className="w-6 h-6 text-[#4db6ac]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#2d3a3a]">
                    {language === 'es' ? 'Criptomoneda' : 'Cryptocurrency'}
                  </p>
                  <p className="text-sm text-stone-500">BTC, ETH, USDT</p>
                </div>
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">
                {language === 'es' ? 'Valor total propiedad' : 'Total property value'}
              </span>
              <span className="text-stone-900">${totalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">
                {language === 'es' ? 'Precio por fracción' : 'Price per fraction'}
              </span>
              <span className="font-medium text-[#2d3a3a]">${fractionPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">
                {language === 'es' ? 'Semanas de uso anual' : 'Annual usage weeks'}
              </span>
              <span className="text-stone-900">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">
                {language === 'es' ? 'Fracciones disponibles' : 'Available fractions'}
              </span>
              <span className="text-[#4db6ac] font-medium">{availableFractions} / {totalFractions}</span>
            </div>
          </div>

          <button
            onClick={onProceedToPayment}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#2d3a3a] text-white hover:bg-[#3d4a4a] transition-colors"
            data-testid="button-proceed-payment"
          >
            {language === 'es' ? 'Proceder al Pago' : 'Proceed to Payment'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

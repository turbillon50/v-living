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
  fractionPrice = 650000,
  onProceedToPayment 
}: FractionCalculatorProps) {
  const { language } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<'fiat' | 'crypto'>('fiat');

  const totalFractions = 14;
  const soldFractions = 3;
  const availableFractions = totalFractions - soldFractions;
  
  const fractionPercentage = (1 / totalFractions) * 100;

  const quarters = [
    { id: 'Q1', label: 'Q1: 25%', percentage: 25, color: '#111' },
    { id: 'Q2', label: 'Q2: 25%', percentage: 25, color: '#444' },
    { id: 'Q3', label: 'Q3: 25%', percentage: 25, color: '#777' },
    { id: 'Q4', label: 'Q4: 25%', percentage: 25, color: '#aaa' },
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
    <div className="bg-white border border-[#eee] rounded-md p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-5 h-5 text-[#555]" />
        <h3 className="text-lg text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
          {language === 'es' ? 'Calculadora de Fracciones' : 'Fraction Calculator'}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <p className="text-sm text-[#999] mb-4 font-light">
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
                <span className="text-[#888] font-light">{q.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-[#999] mb-3 font-light">
              {language === 'es' ? 'Método de pago' : 'Payment method'}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('fiat')}
                className={`w-full flex items-center gap-4 p-4 border rounded-md transition-all duration-200 ${
                  paymentMethod === 'fiat' 
                    ? 'border-[#111] bg-[#fafafa]' 
                    : 'border-[#eee] hover:border-[#999]'
                }`}
                data-testid="payment-fiat"
              >
                <div className="w-12 h-12 bg-[#f5f5f5] flex items-center justify-center rounded-md">
                  <DollarSign className="w-6 h-6 text-[#555]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#111]">
                    {language === 'es' ? 'Moneda Fiat' : 'Fiat Currency'}
                  </p>
                  <p className="text-sm text-[#999] font-light">USD, MXN, EUR</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`w-full flex items-center gap-4 p-4 border rounded-md transition-all duration-200 ${
                  paymentMethod === 'crypto' 
                    ? 'border-[#111] bg-[#fafafa]' 
                    : 'border-[#eee] hover:border-[#999]'
                }`}
                data-testid="payment-crypto"
              >
                <div className="w-12 h-12 bg-[#f5f5f5] flex items-center justify-center rounded-md">
                  <Diamond className="w-6 h-6 text-[#555]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#111]">
                    {language === 'es' ? 'Criptomoneda' : 'Cryptocurrency'}
                  </p>
                  <p className="text-sm text-[#999] font-light">BTC, ETH, USDT</p>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t border-[#eee] pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#999] font-light">
                {language === 'es' ? 'Valor total propiedad' : 'Total property value'}
              </span>
              <span className="text-[#111]">${totalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#999] font-light">
                {language === 'es' ? 'Precio por fracción' : 'Price per fraction'}
              </span>
              <span className="font-medium text-[#111]">${fractionPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#999] font-light">
                {language === 'es' ? 'Semanas de uso anual' : 'Annual usage weeks'}
              </span>
              <span className="text-[#111]">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#999] font-light">
                {language === 'es' ? 'Fracciones disponibles' : 'Available fractions'}
              </span>
              <span className="text-[#111] font-medium">{availableFractions} / {totalFractions}</span>
            </div>
          </div>

          <button
            onClick={onProceedToPayment}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#111] text-white hover:bg-[#000] transition-colors duration-200 rounded-md font-medium"
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

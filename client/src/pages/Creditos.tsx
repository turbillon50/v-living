import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { AGHFooter } from '@/components/AGHFooter';
import { useLanguage } from '@/lib/LanguageContext';
import { Calculator, Send, CheckCircle, Building2, Clock, Percent, DollarSign, FileText, Phone, ArrowRight, Shield, ChevronRight, Landmark, TrendingUp, CreditCard } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export default function Creditos() {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [propertyValue, setPropertyValue] = useState(500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [termYears, setTermYears] = useState(20);
  const [interestRate, setInterestRate] = useState(9.5);
  const [showResults, setShowResults] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', monthlyIncome: '',
    employmentType: 'empleado', propertyType: 'casa', notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const downPayment = Math.round(propertyValue * downPaymentPercent / 100);
  const loanAmount = propertyValue - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = termYears * 12;
  const monthlyPayment = monthlyRate > 0 
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
    : loanAmount / totalPayments;
  const totalPaid = monthlyPayment * totalPayments;
  const totalInterest = totalPaid - loanAmount;

  const submitMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/credit-applications', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        propertyValue,
        downPayment,
        loanAmount,
        termYears,
        monthlyIncome: formData.monthlyIncome ? parseInt(formData.monthlyIncome) : null,
        employmentType: formData.employmentType,
        propertyType: formData.propertyType,
        notes: formData.notes || null,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: language === 'es' ? '¡Solicitud enviada!' : 'Application sent!',
        description: language === 'es' ? 'Te contactaremos pronto' : 'We will contact you soon',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: language === 'es' ? 'Error al enviar solicitud' : 'Error sending application',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    submitMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#fafcfd] pb-24">
      <Header />
      
      <section className="relative overflow-hidden">
        <div className="relative h-[320px] md:h-[380px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0a1628]/95 to-[#0891b2]/40" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#0891b2]/8 blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#22d3ee]/6 blur-[80px] translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="fl-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#0891b2]/30">
                <Landmark className="w-8 h-8 text-white" />
              </div>
              <p className="text-[#22d3ee] text-[10px] uppercase tracking-[0.35em] mb-3 font-medium">Fractional Living</p>
              <h1 className="text-3xl md:text-4xl text-white tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }} data-testid="hero-title-creditos">
                {language === 'es' ? 'Gestión Bancaria' : 'Banking Services'}
              </h1>
              <p className="text-white/50 text-sm font-light max-w-md mx-auto">
                {language === 'es' ? 'Simulador de crédito hipotecario y pre-aprobación' : 'Mortgage simulator and pre-approval'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0]/60 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl fl-gradient-turquoise flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl text-[#0a1628]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
                {language === 'es' ? 'Simulador de Crédito' : 'Credit Simulator'}
              </h2>
              <p className="text-xs text-[#94a3b8]">{language === 'es' ? 'Calcula tu crédito hipotecario' : 'Calculate your mortgage'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#0a1628]">
                  {language === 'es' ? 'Valor de la propiedad' : 'Property value'}
                </label>
                <span className="text-lg font-bold text-[#0891b2]">{formatCurrency(propertyValue)}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={5000000}
                step={10000}
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#0891b2]"
                data-testid="slider-property-value"
              />
              <div className="flex justify-between text-[10px] text-[#94a3b8] mt-1">
                <span>$50,000</span>
                <span>$5,000,000</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#0a1628]">
                  {language === 'es' ? 'Enganche' : 'Down payment'} ({downPaymentPercent}%)
                </label>
                <span className="text-lg font-bold text-[#0891b2]">{formatCurrency(downPayment)}</span>
              </div>
              <input
                type="range"
                min={5}
                max={80}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#0891b2]"
                data-testid="slider-down-payment"
              />
              <div className="flex justify-between text-[10px] text-[#94a3b8] mt-1">
                <span>5%</span>
                <span>80%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#0a1628]">
                    {language === 'es' ? 'Plazo' : 'Term'}
                  </label>
                  <span className="text-sm font-bold text-[#0891b2]">{termYears} {language === 'es' ? 'años' : 'years'}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#0891b2]"
                  data-testid="slider-term"
                />
                <div className="flex justify-between text-[10px] text-[#94a3b8] mt-1">
                  <span>5</span>
                  <span>30</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#0a1628]">
                    {language === 'es' ? 'Tasa anual' : 'Annual rate'}
                  </label>
                  <span className="text-sm font-bold text-[#0891b2]">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={18}
                  step={0.5}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#0891b2]"
                  data-testid="slider-rate"
                />
                <div className="flex justify-between text-[10px] text-[#94a3b8] mt-1">
                  <span>5%</span>
                  <span>18%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-[#0891b2]/5 to-[#22d3ee]/5 rounded-2xl border border-[#0891b2]/10">
            <h3 className="text-lg font-semibold text-[#0a1628] mb-4 text-center" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? 'Resultado de tu Simulación' : 'Your Simulation Result'}
            </h3>
            
            <div className="text-center mb-6">
              <p className="text-xs text-[#94a3b8] uppercase tracking-wider mb-1">{language === 'es' ? 'Pago Mensual Estimado' : 'Estimated Monthly Payment'}</p>
              <p className="text-4xl font-bold text-[#0891b2]" data-testid="text-monthly-payment">{formatCurrency(monthlyPayment)}</p>
              <p className="text-xs text-[#94a3b8] mt-1">USD / {language === 'es' ? 'mes' : 'month'}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-3 text-center">
                <DollarSign className="w-5 h-5 text-[#0891b2] mx-auto mb-1" />
                <p className="text-xs text-[#94a3b8]">{language === 'es' ? 'Monto crédito' : 'Loan amount'}</p>
                <p className="text-sm font-bold text-[#0a1628]">{formatCurrency(loanAmount)}</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <Clock className="w-5 h-5 text-[#0891b2] mx-auto mb-1" />
                <p className="text-xs text-[#94a3b8]">{language === 'es' ? 'Pagos totales' : 'Total payments'}</p>
                <p className="text-sm font-bold text-[#0a1628]">{totalPayments}</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <Percent className="w-5 h-5 text-[#0891b2] mx-auto mb-1" />
                <p className="text-xs text-[#94a3b8]">{language === 'es' ? 'Interés total' : 'Total interest'}</p>
                <p className="text-sm font-bold text-[#0a1628]">{formatCurrency(totalInterest)}</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <FileText className="w-5 h-5 text-[#0891b2] mx-auto mb-1" />
                <p className="text-xs text-[#94a3b8]">{language === 'es' ? 'Pago total' : 'Total paid'}</p>
                <p className="text-sm font-bold text-[#0a1628]">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </div>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full mt-6 py-4 fl-btn-primary text-sm flex items-center justify-center gap-2"
              data-testid="button-request-preapproval"
            >
              <Send className="w-4 h-4" />
              {language === 'es' ? 'Solicitar Pre-Aprobación' : 'Request Pre-Approval'}
            </button>
          ) : submitted ? (
            <div className="mt-6 p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl text-[#0a1628] mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {language === 'es' ? '¡Solicitud Enviada!' : 'Application Sent!'}
              </h3>
              <p className="text-[#64748b] text-sm mb-4">
                {language === 'es'
                  ? 'Un asesor financiero te contactará en las próximas 24-48 horas para revisar tu solicitud.'
                  : 'A financial advisor will contact you within 24-48 hours to review your application.'}
              </p>
              <a href="https://wa.me/529984292748?text=Hola,%20acabo%20de%20enviar%20mi%20solicitud%20de%20crédito%20hipotecario" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm hover:bg-emerald-600 transition-colors" data-testid="button-whatsapp-credit">
                <Phone className="w-4 h-4" />
                {language === 'es' ? 'Acelerar por WhatsApp' : 'Speed up via WhatsApp'}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                <h4 className="text-sm font-medium text-[#0a1628] mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#0891b2]" />
                  {language === 'es' ? 'Datos para Pre-Aprobación' : 'Pre-Approval Information'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#64748b] mb-1 block">{language === 'es' ? 'Nombre completo' : 'Full name'} *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#0891b2]"
                      data-testid="input-credit-name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#64748b] mb-1 block">{language === 'es' ? 'Correo electrónico' : 'Email'} *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#0891b2]"
                      data-testid="input-credit-email"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#64748b] mb-1 block">{language === 'es' ? 'Teléfono' : 'Phone'} *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#0891b2]"
                      data-testid="input-credit-phone"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#64748b] mb-1 block">{language === 'es' ? 'Ingreso mensual (USD)' : 'Monthly income (USD)'}</label>
                    <input
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#0891b2]"
                      data-testid="input-credit-income"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#64748b] mb-1 block">{language === 'es' ? 'Tipo de empleo' : 'Employment type'}</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#0891b2]"
                      data-testid="select-employment-type"
                    >
                      <option value="empleado">{language === 'es' ? 'Empleado' : 'Employee'}</option>
                      <option value="independiente">{language === 'es' ? 'Independiente' : 'Self-employed'}</option>
                      <option value="empresario">{language === 'es' ? 'Empresario' : 'Business owner'}</option>
                      <option value="jubilado">{language === 'es' ? 'Jubilado' : 'Retired'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#64748b] mb-1 block">{language === 'es' ? 'Tipo de propiedad' : 'Property type'}</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#0891b2]"
                      data-testid="select-property-type"
                    >
                      <option value="casa">{language === 'es' ? 'Casa' : 'House'}</option>
                      <option value="departamento">{language === 'es' ? 'Departamento' : 'Apartment'}</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="terreno">{language === 'es' ? 'Terreno' : 'Land'}</option>
                      <option value="comercial">{language === 'es' ? 'Comercial' : 'Commercial'}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs text-[#64748b] mb-1 block">{language === 'es' ? 'Notas adicionales' : 'Additional notes'}</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#0891b2] resize-none"
                    data-testid="textarea-credit-notes"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-xs text-amber-800">
                  {language === 'es'
                    ? 'Resumen: Propiedad de ' + formatCurrency(propertyValue) + ' con enganche de ' + formatCurrency(downPayment) + ' (' + downPaymentPercent + '%). Crédito de ' + formatCurrency(loanAmount) + ' a ' + termYears + ' años. Pago mensual estimado: ' + formatCurrency(monthlyPayment)
                    : 'Summary: Property of ' + formatCurrency(propertyValue) + ' with down payment of ' + formatCurrency(downPayment) + ' (' + downPaymentPercent + '%). Loan of ' + formatCurrency(loanAmount) + ' over ' + termYears + ' years. Estimated monthly: ' + formatCurrency(monthlyPayment)}
                </p>
              </div>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full py-4 fl-btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="button-submit-credit"
              >
                {submitMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {language === 'es' ? 'Enviar Solicitud de Pre-Aprobación' : 'Submit Pre-Approval Request'}
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/60 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#06b6d4] flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#0891b2]/15">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-medium text-[#0a1628] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? 'Respuesta Rápida' : 'Quick Response'}
            </h3>
            <p className="text-xs text-[#94a3b8]">
              {language === 'es' ? 'Pre-aprobación en 24-48 horas' : 'Pre-approval in 24-48 hours'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/60 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a1628] to-[#0891b2] flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#0891b2]/15">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-medium text-[#0a1628] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? '100% Confidencial' : '100% Confidential'}
            </h3>
            <p className="text-xs text-[#94a3b8]">
              {language === 'es' ? 'Tus datos están protegidos' : 'Your data is protected'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0]/60 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0891b2] to-[#22d3ee] flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#0891b2]/15">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-medium text-[#0a1628] mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {language === 'es' ? 'Múltiples Opciones' : 'Multiple Options'}
            </h3>
            <p className="text-xs text-[#94a3b8]">
              {language === 'es' ? 'Comparamos las mejores tasas' : 'We compare the best rates'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0a1628] to-[#0891b2]/90 rounded-2xl p-8 text-center">
          <h2 className="text-2xl text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {language === 'es' ? '¿Buscas propiedades?' : 'Looking for properties?'}
          </h2>
          <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
            {language === 'es' ? 'Explora nuestro catálogo de propiedades premium en venta' : 'Explore our premium property catalog for sale'}
          </p>
          <Link href="/inmobiliaria">
            <button className="px-8 py-3 bg-white text-[#0891b2] rounded-xl text-sm font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2" data-testid="button-go-realestate">
              {language === 'es' ? 'Ver Propiedades' : 'View Properties'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
      
      <div className="mt-16">
        <AGHFooter />
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Calendar, Check, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeekCalendarProps {
  bookedWeeks?: number[];
  blockedWeeks?: number[];
  selectedWeeks: number[];
  onWeekSelect: (week: number) => void;
  maxSelections?: number;
  year?: number;
}

function getWeekDates(weekNumber: number, year: number = 2026) {
  const janFirst = new Date(year, 0, 1);
  const dayOfWeek = janFirst.getDay();
  const daysToFirstMonday = dayOfWeek === 0 ? 1 : (dayOfWeek === 1 ? 0 : 8 - dayOfWeek);
  const firstMonday = new Date(year, 0, 1 + daysToFirstMonday);
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return {
    start: `${weekStart.getDate()} ${months[weekStart.getMonth()]}`,
    end: `${weekEnd.getDate()} ${months[weekEnd.getMonth()]}`,
    month: months[weekStart.getMonth()]
  };
}

export function WeekCalendar({
  bookedWeeks = [],
  blockedWeeks = [],
  selectedWeeks,
  onWeekSelect,
  maxSelections = 3,
  year = 2026
}: WeekCalendarProps) {
  const { language } = useLanguage();
  const [activeQuarter, setActiveQuarter] = useState(1);

  const quarters = [
    { id: 1, label: 'Q1', months: language === 'es' ? 'Ene - Mar' : 'Jan - Mar', weeks: [1, 13] },
    { id: 2, label: 'Q2', months: language === 'es' ? 'Abr - Jun' : 'Apr - Jun', weeks: [14, 26] },
    { id: 3, label: 'Q3', months: language === 'es' ? 'Jul - Sep' : 'Jul - Sep', weeks: [27, 39] },
    { id: 4, label: 'Q4', months: language === 'es' ? 'Oct - Dic' : 'Oct - Dec', weeks: [40, 52] },
  ];

  const weeks = useMemo(() => {
    const activeQ = quarters.find(q => q.id === activeQuarter)!;
    return Array.from({ length: activeQ.weeks[1] - activeQ.weeks[0] + 1 }, (_, i) => {
      const weekNum = activeQ.weeks[0] + i;
      const dates = getWeekDates(weekNum, year);
      return {
        weekNumber: weekNum,
        isBooked: bookedWeeks.includes(weekNum),
        isBlocked: blockedWeeks.includes(weekNum),
        isSelected: selectedWeeks.includes(weekNum),
        isAvailable: !bookedWeeks.includes(weekNum) && !blockedWeeks.includes(weekNum),
        ...dates
      };
    });
  }, [activeQuarter, bookedWeeks, blockedWeeks, selectedWeeks, year]);

  const handleWeekClick = (weekNum: number) => {
    const week = weeks.find(w => w.weekNumber === weekNum);
    if (!week?.isAvailable) return;
    
    if (selectedWeeks.includes(weekNum)) {
      onWeekSelect(weekNum);
    } else if (selectedWeeks.length < maxSelections) {
      onWeekSelect(weekNum);
    }
  };

  return (
    <div className="bg-white border border-[#eee] rounded-md">
      <div className="p-4 border-b border-[#eee]">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-[#555]" />
          <h3 className="text-lg text-[#111]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
            {language === 'es' ? 'Calendario de Semanas' : 'Week Calendar'} - {year}
          </h3>
        </div>

        <div className="flex gap-2">
          {quarters.map((q) => (
            <button
              key={q.id}
              onClick={() => setActiveQuarter(q.id)}
              className={cn(
                "flex-1 py-3 px-4 text-center transition-all duration-200 rounded-md",
                activeQuarter === q.id
                  ? "bg-[#111] text-white"
                  : "bg-[#f5f5f5] text-[#888] hover:bg-[#eee]"
              )}
              data-testid={`quarter-${q.id}`}
            >
              <p className="font-medium text-sm">{q.label}</p>
              <p className="text-xs opacity-70">{q.months}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#fafafa] border-b border-[#eee]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#888] font-light">
            <Info className="w-4 h-4" />
            <span>
              {language === 'es' 
                ? `Selecciona ${maxSelections} semanas para tu fracción`
                : `Select ${maxSelections} weeks for your fraction`}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#888] font-light">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#111] rounded-sm"></div>
              <span>{language === 'es' ? 'Seleccionada' : 'Selected'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#ccc] rounded-sm"></div>
              <span>{language === 'es' ? 'Reservada' : 'Booked'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 border border-[#ddd] rounded-sm"></div>
              <span>{language === 'es' ? 'Disponible' : 'Available'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2">
          {weeks.map((week) => (
            <button
              key={week.weekNumber}
              onClick={() => handleWeekClick(week.weekNumber)}
              disabled={!week.isAvailable}
              className={cn(
                "relative p-3 text-center transition-all duration-200 border rounded-md",
                week.isSelected && "bg-[#111] text-white border-[#111]",
                week.isBooked && "bg-[#eee] text-[#bbb] cursor-not-allowed border-[#eee]",
                week.isBlocked && "bg-[#f5f5f5] text-[#ccc] cursor-not-allowed border-[#f5f5f5]",
                week.isAvailable && !week.isSelected && "bg-white border-[#eee] hover:border-[#111] hover:bg-[#fafafa] cursor-pointer"
              )}
              data-testid={`week-${week.weekNumber}`}
            >
              <p className="text-sm font-medium">S{week.weekNumber}</p>
              <p className="text-xs opacity-70 mt-0.5">{week.start}</p>
              {week.isSelected && (
                <div className="absolute top-1 right-1">
                  <Check className="w-3 h-3" />
                </div>
              )}
              {week.isBooked && (
                <div className="absolute top-1 right-1">
                  <X className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedWeeks.length > 0 && (
        <div className="p-4 bg-[#fafafa] border-t border-[#eee]">
          <p className="text-sm text-[#111] font-medium mb-2">
            {language === 'es' ? 'Semanas seleccionadas:' : 'Selected weeks:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedWeeks.sort((a, b) => a - b).map((weekNum) => {
              const dates = getWeekDates(weekNum, year);
              return (
                <span 
                  key={weekNum}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white text-sm text-[#111] border border-[#111] rounded-md"
                >
                  S{weekNum}: {dates.start} - {dates.end}
                  <button 
                    onClick={() => onWeekSelect(weekNum)}
                    className="ml-1 text-[#bbb] hover:text-[#111] transition-colors duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

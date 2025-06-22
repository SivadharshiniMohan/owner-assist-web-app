
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface MiniCalendarProps {
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentDateString: string;
  dateEarnings: { [key: string]: string };
  getEarningsForDate: (date: Date) => string;
}

const MiniCalendar = ({ 
  showCalendar, 
  setShowCalendar, 
  selectedDate, 
  setSelectedDate, 
  currentDateString, 
  dateEarnings, 
  getEarningsForDate 
}: MiniCalendarProps) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <button 
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {currentDateString}
        </button>
      </div>

      {/* Calendar Overlay */}
      {showCalendar && (
        <Card className="mb-4 bg-white relative z-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Select Date</h3>
                <div className="text-sm text-gray-600">
                  Selected: {format(selectedDate, "dd MMM yyyy")} - {getEarningsForDate(selectedDate)}
                </div>
              </div>
              <button 
                onClick={() => setShowCalendar(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {/* Simple calendar grid */}
              <div className="text-xs font-medium text-gray-500 py-2">Sun</div>
              <div className="text-xs font-medium text-gray-500 py-2">Mon</div>
              <div className="text-xs font-medium text-gray-500 py-2">Tue</div>
              <div className="text-xs font-medium text-gray-500 py-2">Wed</div>
              <div className="text-xs font-medium text-gray-500 py-2">Thu</div>
              <div className="text-xs font-medium text-gray-500 py-2">Fri</div>
              <div className="text-xs font-medium text-gray-500 py-2">Sat</div>
              
              {/* Calendar dates */}
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(2024, 5, i - 5); // June 2024
                const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                const hasEarnings = dateEarnings[format(date, "yyyy-MM-dd")];
                
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDate(date);
                      setShowCalendar(false);
                    }}
                    className={`
                      w-8 h-8 text-sm rounded-full flex items-center justify-center
                      ${isSelected ? 'bg-blue-600 text-white' : ''}
                      ${isToday && !isSelected ? 'bg-blue-100 text-blue-600' : ''}
                      ${hasEarnings && !isSelected && !isToday ? 'bg-green-100 text-green-600' : ''}
                      ${!hasEarnings && !isSelected && !isToday ? 'text-gray-400' : ''}
                      hover:bg-gray-100 transition-colors
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MiniCalendar;

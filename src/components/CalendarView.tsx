
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";

interface CalendarViewProps {
  onBack: () => void;
}

const CalendarView = ({ onBack }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Mock data for different dates
  const dateEarnings: { [key: string]: string } = {
    "2024-06-17": "₹56,000.00",
    "2024-06-16": "₹42,500.00",
    "2024-06-15": "₹38,200.00",
    "2024-06-14": "₹51,800.00",
    "2024-06-13": "₹47,300.00",
  };

  const getEarningsForDate = (date: Date | undefined) => {
    if (!date) return "₹0.00";
    const dateStr = format(date, "yyyy-MM-dd");
    return dateEarnings[dateStr] || "₹0.00";
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get days to fill the calendar grid (42 days = 6 weeks)
  const firstDayOfWeek = monthStart.getDay();
  const totalCells = 42;
  const daysInCalendar = [];

  // Add previous month's days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(monthStart);
    prevDate.setDate(prevDate.getDate() - (i + 1));
    daysInCalendar.push(prevDate);
  }

  // Add current month's days
  daysInCalendar.push(...calendarDays);

  // Add next month's days to fill remaining cells
  const remainingCells = totalCells - daysInCalendar.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(monthEnd);
    nextDate.setDate(nextDate.getDate() + i);
    daysInCalendar.push(nextDate);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-6 max-w-8xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
          </div>

          {/* Selected Date Earnings */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  {selectedDate ? format(selectedDate, "EEEE, dd MMM yyyy") : "Select a date"}
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {getEarningsForDate(selectedDate)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Total Earnings</div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardContent className="p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">
                  {format(currentMonth, "MMMM yyyy")}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {daysInCalendar.map((date, index) => {
                  const isCurrentMonth = isSameMonth(date, currentMonth);
                  const isTodayDate = isToday(date);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const hasEarnings = dateEarnings[format(date, "yyyy-MM-dd")];

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        h-10 w-10 text-sm rounded-lg flex items-center justify-center transition-colors
                        ${!isCurrentMonth ? 'text-gray-300' : ''}
                        ${isSelected ? 'bg-blue-600 text-white' : ''}
                        ${isTodayDate && !isSelected ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                        ${hasEarnings && !isSelected && !isTodayDate && isCurrentMonth ? 'bg-green-100 text-green-600' : ''}
                        ${!hasEarnings && !isSelected && !isTodayDate && isCurrentMonth ? 'hover:bg-gray-100' : ''}
                        ${isCurrentMonth ? 'text-gray-900' : ''}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Footer buttons */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentMonth(new Date());
                    setSelectedDate(undefined);
                  }}
                  className="text-blue-600"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => {
                    const today = new Date();
                    setCurrentMonth(today);
                    setSelectedDate(today);
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Today
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

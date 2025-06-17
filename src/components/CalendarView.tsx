
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface CalendarViewProps {
  onBack: () => void;
}

const CalendarView = ({ onBack }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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

  return (
    <div className="min-h-screen bg-white">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
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
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

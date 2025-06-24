import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, ArrowUpDown, ChevronLeft, ArrowLeft } from "lucide-react";
import { format, startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

interface ReportPageProps {
  onBack: () => void;
}

interface DriverSummary {
  driverId: number;
  driverName: string;
  phoneNumber: string;
  totalTrips: number;
  amountEarned: number;
  totalDistance: number;
}

// API response interface to match actual response
interface ApiDriverSummary {
  DRIVER_AUTO_ID: number;
  driver_name: string;
  driver_number: string;
  total_trips: number;
  total_amount: number;
  total_distance: number;
}

const ReportPage = ({ onBack }: ReportPageProps) => {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [sortField, setSortField] = useState<keyof DriverSummary | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();


  // Get user data for API calls
  const oaId = localStorage.getItem('oaId');;

  // Fetch driver summary data
  const { data: reportData, isLoading, error } = useQuery({
    queryKey: ['driverSummary', startDate, endDate, oaId],
    queryFn: async () => {
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      
      // Check if date range is within 31 days
      const daysDifference = differenceInDays(endDate, startDate);
      if (daysDifference > 31) {
        throw new Error('Date range cannot exceed 31 days');
      }

      const response = await fetch(
        `https://book.ecargo.co.in/v2/oa/driverSummary?startDate=${startDateStr}&endDate=${endDateStr}&oaId=${oaId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      
      const data = await response.json();
      
      // Map API response to our interface
      const mappedData: DriverSummary[] = (data.data || []).map((item: ApiDriverSummary) => ({
        driverId: item.DRIVER_AUTO_ID,
        driverName: item.driver_name,
        phoneNumber: item.driver_number,
        totalTrips: item.total_trips,
        amountEarned: item.total_amount,
        totalDistance: item.total_distance
      }));
      
      return mappedData;
    },
    enabled: !!startDate && !!endDate,
  });

  // Handle date selection validation
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      // If end date is before new start date, update end date
      if (endDate < date) {
        setEndDate(date);
      }
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      const daysDiff = differenceInDays(date, startDate);
      if (daysDiff > 31) {
        toast({
          title: "Invalid Date Range",
          description: "Maximum date range is 31 days",
          variant: "destructive",
        });
        return;
      }
      setEndDate(date);
    }
  };

  // Handle sorting
  const handleSort = (field: keyof DriverSummary) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort data
  const sortedData = reportData ? [...reportData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-4">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-8xl">
          {/* Header */}
           <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-600 hover:text-green-600 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Report</h1>
            </div>

          {/* Date Range Selector */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Select Date Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd-MM-yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleStartDateSelect}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd-MM-yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={handleEndDateSelect}
                        initialFocus
                        className="p-3 pointer-events-auto"
                        disabled={(date) => date < startDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Selected range: {format(startDate, "dd MMM yyyy")} - {format(endDate, "dd MMM yyyy")} 
                ({differenceInDays(endDate, startDate) + 1} days)
              </p>
            </CardContent>
          </Card>

          {/* Report Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-gray-600">Loading report...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-red-600">Error loading report data</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-50">
                      <TableHead className="w-12 text-center font-semibold">#</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('driverName')}
                      >
                        <div className="flex items-center gap-2">
                          Name
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('phoneNumber')}
                      >
                        <div className="flex items-center gap-2">
                          Phone Number
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-right cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('totalTrips')}
                      >
                        <div className="flex items-center justify-end gap-2">
                          Total Trips
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-right cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('amountEarned')}
                      >
                        <div className="flex items-center justify-end gap-2">
                          Amount Earned
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-right cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('totalDistance')}
                      >
                        <div className="flex items-center justify-end gap-2">
                          Total Distance
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No data available for the selected date range
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedData.map((driver, index) => (
                        <TableRow key={driver.driverId} className="hover:bg-gray-50">
                          <TableCell className="text-center font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{driver.driverName}</TableCell>
                          <TableCell>{driver.phoneNumber}</TableCell>
                          <TableCell className="text-right">{driver.totalTrips}</TableCell>
                          <TableCell className="text-right">₹ {driver.amountEarned?.toLocaleString() || 0}</TableCell>
                          <TableCell className="text-right">{driver.totalDistance}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;

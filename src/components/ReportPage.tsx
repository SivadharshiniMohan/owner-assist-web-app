
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, ArrowUpDown, ChevronLeft } from "lucide-react";
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

interface Trip {
  tripAutoId: number;
  paymentMode: number;
  fare: number;
  status: number;
  date: string;
  time: string;
  pickup: string;
  drop: string;
  driverName: string;
}

const ReportPage = ({ onBack }: ReportPageProps) => {
  const [currentView, setCurrentView] = useState<'trips' | 'driver'>('trips');
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sortField, setSortField] = useState<keyof DriverSummary | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [driverSortField, setDriverSortField] = useState<keyof Trip | null>(null);
  const [driverSortDirection, setDriverSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  // Get user data for API calls
  const userData = apiService.getUserData();
  const oaId = userData?.oaId || 13;

  // Fetch driver summary data for trips view
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
    enabled: !!startDate && !!endDate && currentView === 'trips',
  });

  // Fetch driver trips data for driver view
  const { data: driverTripsData, isLoading: isLoadingDriverTrips, error: driverTripsError } = useQuery({
    queryKey: ['driverTrips', selectedDate, oaId],
    queryFn: async () => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      const response = await fetch(
        `https://book.ecargo.co.in/v2/trips?date=${dateStr}&include=stats%2Cbill%2Cdriver&includeCancel=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch driver trips data');
      }
      
      const data = await response.json();
      
      // Filter by OWNER_ASSIST_ID and map API response to our interface
      const filteredTrips = (data.data || []).filter((trip: any) => trip.OWNER_ASSIST_ID === oaId);
      
      const mappedTrips: Trip[] = filteredTrips.map((trip: any) => ({
        tripAutoId: trip.TRIP_AUTO_ID || trip.trip_id || trip.id,
        paymentMode: trip.PAYMENT_MODE || 0,
        fare: trip.TOTAL_FARE ? (trip.TOTAL_FARE * 85 / 100) : 0,
        status: trip.STATUS || 0,
        date: trip.trip_date || trip.date || dateStr,
        time: trip.trip_time || trip.time || 'N/A',
        pickup: trip.pickup_location || trip.pickup || 'N/A',
        drop: trip.drop_location || trip.drop || 'N/A',
        driverName: trip.driver_name || 'N/A'
      }));
      
      return mappedTrips;
    },
    enabled: !!selectedDate && currentView === 'driver',
  });

  // Handle date selection validation for trips view
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

  // Handle sorting for trips view
  const handleSort = (field: keyof DriverSummary) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle sorting for driver view
  const handleDriverSort = (field: keyof Trip) => {
    if (driverSortField === field) {
      setDriverSortDirection(driverSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setDriverSortField(field);
      setDriverSortDirection('asc');
    }
  };

  // Sort data for trips view
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

  // Sort data for driver view
  const sortedDriverData = driverTripsData ? [...driverTripsData].sort((a, b) => {
    if (!driverSortField) return 0;
    
    const aValue = a[driverSortField];
    const bValue = b[driverSortField];
    
    if (typeof aValue === 'string') {
      return driverSortDirection === 'asc' 
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }
    
    return driverSortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  }) : [];

  const getPaymentModeText = (mode: number) => {
    switch (mode) {
      case 0: return 'Cash';
      case 1: return 'Wallet';
      case 2: return 'Online';
      default: return 'Unknown';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Confirmed';
      case 2: return 'Ongoing';
      case 3: return 'Ended';
      case 4: return 'Completed';
      case 5: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 4: return 'text-green-600 bg-green-50';
      case 5: return 'text-red-600 bg-red-50';
      case 2: return 'text-blue-600 bg-blue-50';
      case 1: return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentModeColor = (mode: number) => {
    switch (mode) {
      case 0: return 'text-green-600 bg-green-50';
      case 1: return 'text-blue-600 bg-blue-50';
      case 2: return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-4">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-8xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="p-2 hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentView === 'trips' ? 'Driver-wise Report' : 'Driver View Report'}
              </h1>
            </div>
            
            {/* View Toggle Buttons */}
            <div className="flex gap-2">
              <Button
                variant={currentView === 'driver' ? 'default' : 'outline'}
                onClick={() => setCurrentView('driver')}
                className="px-4 py-2"
              >
                Driver View
              </Button>
              <Button
                variant={currentView === 'trips' ? 'default' : 'outline'}
                onClick={() => setCurrentView('trips')}
                className="px-4 py-2"
              >
                Trips
              </Button>
            </div>
          </div>

          {/* Date Selector */}
          {currentView === 'trips' ? (
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
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "dd-MM-yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Selected date: {format(selectedDate, "dd MMM yyyy")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Report Table */}
          <Card>
            <CardContent className="p-0">
              {currentView === 'trips' ? (
                <>
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
                </>
              ) : (
                <>
                  {isLoadingDriverTrips ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      <span className="ml-2 text-gray-600">Loading driver trips...</span>
                    </div>
                  ) : driverTripsError ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-red-600">Error loading driver trips data</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-green-50">
                          <TableHead 
                            className="cursor-pointer hover:bg-green-100 font-semibold"
                            onClick={() => handleDriverSort('tripAutoId')}
                          >
                            <div className="flex items-center gap-2">
                              Trip ID
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-green-100 font-semibold"
                            onClick={() => handleDriverSort('driverName')}
                          >
                            <div className="flex items-center gap-2">
                              Driver Name
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-green-100 font-semibold"
                            onClick={() => handleDriverSort('paymentMode')}
                          >
                            <div className="flex items-center gap-2">
                              Payment Mode
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-right cursor-pointer hover:bg-green-100 font-semibold"
                            onClick={() => handleDriverSort('fare')}
                          >
                            <div className="flex items-center justify-end gap-2">
                              Fare (85%)
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-green-100 font-semibold"
                            onClick={() => handleDriverSort('status')}
                          >
                            <div className="flex items-center gap-2">
                              Status
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold">Time</TableHead>
                          <TableHead className="font-semibold">Pickup</TableHead>
                          <TableHead className="font-semibold">Drop</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedDriverData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                              No trips available for the selected date
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedDriverData.map((trip) => (
                            <TableRow key={trip.tripAutoId} className="hover:bg-gray-50">
                              <TableCell className="font-medium">#{trip.tripAutoId}</TableCell>
                              <TableCell className="font-medium">{trip.driverName}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentModeColor(trip.paymentMode)}`}>
                                  {getPaymentModeText(trip.paymentMode)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right font-medium">₹ {trip.fare.toFixed(2)}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                                  {getStatusText(trip.status)}
                                </span>
                              </TableCell>
                              <TableCell>{trip.time}</TableCell>
                              <TableCell className="max-w-xs truncate" title={trip.pickup}>
                                {trip.pickup}
                              </TableCell>
                              <TableCell className="max-w-xs truncate" title={trip.drop}>
                                {trip.drop}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;

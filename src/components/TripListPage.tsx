
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";

interface TripListPageProps {
  onBack: () => void;
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
}

const TripListPage = ({ onBack }: TripListPageProps) => {
  const [sortField, setSortField] = useState<keyof Trip | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const userData = apiService.getUserData();
  const driverID = 39; // Default driver ID, you can make this dynamic

  // Fetch trips data
  const { data: tripsData, isLoading, error } = useQuery({
    queryKey: ['allTrips', today, driverID],
    queryFn: async () => {
      const response = await fetch(
        `https://book.ecargo.co.in/v2/trips?date=${today}&include=stats%2Cbill&includeCancel=true&driverID=${driverID}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch trips data');
      }
      
      const data = await response.json();
      
      // Map API response to our interface
      const mappedTrips: Trip[] = (data.data || []).map((trip: any) => ({
        tripAutoId: trip.TRIP_AUTO_ID || trip.trip_id || trip.id,
        paymentMode: trip.PAYMENT_MODE || 0,
        fare: trip.TOTAL_FARE ? (trip.TOTAL_FARE * 85 / 100) : 0,
        status: trip.STATUS || 0,
        date: trip.trip_date || trip.date || today,
        time: trip.trip_time || trip.time || 'N/A',
        pickup: trip.pickup_location || trip.pickup || 'N/A',
        drop: trip.drop_location || trip.drop || 'N/A'
      }));
      
      return mappedTrips;
    }
  });

  // Handle sorting
  const handleSort = (field: keyof Trip) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort data
  const sortedData = tripsData ? [...tripsData].sort((a, b) => {
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
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trip List</h1>
              <p className="text-gray-600">All trips for {format(new Date(), 'dd MMM yyyy')}</p>
            </div>
          </div>

          {/* Trips Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Trips</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-gray-600">Loading trips...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-red-600">Error loading trips data</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-50">
                      <TableHead 
                        className="cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('tripAutoId')}
                      >
                        <div className="flex items-center gap-2">
                          Trip ID
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('paymentMode')}
                      >
                        <div className="flex items-center gap-2">
                          Payment Mode
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-right cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('fare')}
                      >
                        <div className="flex items-center justify-end gap-2">
                          Fare (85%)
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('status')}
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
                    {sortedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No trips available for today
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedData.map((trip) => (
                        <TableRow key={trip.tripAutoId} className="hover:bg-gray-50">
                          <TableCell className="font-medium">#{trip.tripAutoId}</TableCell>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TripListPage;


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";

interface TripDetailsPageProps {
  onBack: () => void;
  driverID: number;
  driverName: string;
}

interface Trip {
  tripId: number;
  date: string;
  time: string;
  pickup: string;
  drop: string;
  fare: number;
  status: string;
  distance: number;
  duration: string;
}

const TripDetailsPage = ({ onBack, driverID, driverName }: TripDetailsPageProps) => {
  const [sortField, setSortField] = useState<keyof Trip | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const today = format(new Date(), 'yyyy-MM-dd');

  // Fetch trips data
  const { data: tripsData, isLoading, error } = useQuery({
    queryKey: ['trips', driverID, today],
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
        tripId: trip.trip_id || trip.id,
        date: trip.trip_date || trip.date,
        time: trip.trip_time || trip.time,
        pickup: trip.pickup_location || trip.pickup || 'N/A',
        drop: trip.drop_location || trip.drop || 'N/A',
        fare: trip.fare_amount || trip.fare || 0,
        status: trip.trip_status || trip.status || 'Unknown',
        distance: trip.trip_distance || trip.distance || 0,
        duration: trip.trip_duration || trip.duration || 'N/A'
      }));
      
      return mappedTrips;
    },
    enabled: !!driverID,
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'ongoing':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
              <h1 className="text-2xl font-bold text-gray-900">Trip Details</h1>
              <p className="text-gray-600">{driverName} - {format(new Date(), 'dd MMM yyyy')}</p>
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
                      <TableHead className="w-12 text-center font-semibold">#</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('time')}
                      >
                        <div className="flex items-center gap-2">
                          Time
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">Pickup</TableHead>
                      <TableHead className="font-semibold">Drop</TableHead>
                      <TableHead 
                        className="text-right cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('fare')}
                      >
                        <div className="flex items-center justify-end gap-2">
                          Fare
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-right cursor-pointer hover:bg-green-100 font-semibold"
                        onClick={() => handleSort('distance')}
                      >
                        <div className="flex items-center justify-end gap-2">
                          Distance
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">Duration</TableHead>
                      <TableHead className="text-center font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No trips available for today
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedData.map((trip, index) => (
                        <TableRow key={trip.tripId} className="hover:bg-gray-50">
                          <TableCell className="text-center font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{trip.time}</TableCell>
                          <TableCell className="max-w-xs truncate" title={trip.pickup}>
                            {trip.pickup}
                          </TableCell>
                          <TableCell className="max-w-xs truncate" title={trip.drop}>
                            {trip.drop}
                          </TableCell>
                          <TableCell className="text-right">₹ {trip.fare?.toLocaleString() || 0}</TableCell>
                          <TableCell className="text-right">{trip.distance} km</TableCell>
                          <TableCell>{trip.duration}</TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                              {trip.status}
                            </span>
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

export default TripDetailsPage;


import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { apiService } from "@/services/apiService";

const RevenueChart = () => {
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['revenue'],
    queryFn: async () => {
      const response = await apiService.getRevenue('2025-06-01', '2025-06-20', '1,2,3');
      return response.data || [];
    },
  });

  // Transform data for chart - using count instead of revenue
  const chartData = revenueData?.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric' 
    }),
    count: item.count || 0
  })) || [];

  const chartConfig = {
    count: {
      label: "Daily Count",
      color: "#3B82F6", // Blue color
    },
  };

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Trips Count Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Trips Count Trend</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={chartData} margin={{ left: 0, right: 12, top: 12, bottom: 12 }}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#3B82F6"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#3B82F6"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${Number(value).toLocaleString()}`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent 
                formatter={(value) => [`${Number(value).toLocaleString()}`, "Daily Count"]}
              />} 
            />
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#fillCount)"
              fillOpacity={0.4}
              stroke="#3B82F6"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;

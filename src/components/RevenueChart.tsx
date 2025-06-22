
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useRevenue } from "../hooks/useRevenue";
import { format, subDays } from "date-fns";

const RevenueChart = () => {
  const endDate = format(new Date(), "yyyy-MM-dd");
  const startDate = format(subDays(new Date(), 19), "yyyy-MM-dd");
  
  const { data: revenueData = [], isLoading } = useRevenue(startDate, endDate);

  const chartData = revenueData.map((item: any) => ({
    date: format(new Date(item.date), "dd/MM"),
    revenue: item.count
  }));

  if (isLoading) {
    return (
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">Loading chart...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Revenue Analytics</h2>
            <p className="text-sm text-gray-500">Last 20 days performance</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <X isAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;


import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";

interface LedgerPageProps {
  onBack: () => void;
}

const LedgerPage = ({ onBack }: LedgerPageProps) => {
  const [activeTab, setActiveTab] = useState("today");

  const transactions = [
    { 
      id: 1, 
      type: "Trip earnings", 
      time: "10:10 AM • Cash", 
      amount: "₹1,200.00", 
      positive: true,
      icon: "🚗",
      color: "text-green-600"
    },
    { 
      id: 2, 
      type: "Incentives", 
      time: "09:00 PM • Online", 
      amount: "₹100.00", 
      positive: true,
      icon: "🚗",
      color: "text-green-600"
    },
    { 
      id: 3, 
      type: "Penalty", 
      time: "09:15 AM", 
      amount: "₹60.00", 
      positive: false,
      icon: "🚗",
      color: "text-red-600"
    },
    { 
      id: 4, 
      type: "Recharge success", 
      time: "07:16 AM", 
      amount: "₹1,800.00", 
      positive: true,
      icon: "✅",
      color: "text-green-600"
    },
    { 
      id: 5, 
      type: "Recharge failed", 
      time: "06:30 PM", 
      amount: "₹600.00", 
      positive: false,
      icon: "❌",
      color: "text-gray-400"
    },
  ];

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
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Ledger</h1>
              <p className="text-sm text-gray-500">Balance: ₹500.00</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "today" ? "default" : "outline"}
              className={`rounded-full px-6 ${
                activeTab === "today" 
                  ? "bg-blue-900 text-white hover:bg-blue-800" 
                  : "text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("today")}
            >
              Today
            </Button>
            <Button
              variant={activeTab === "weekly" ? "default" : "outline"}
              className={`rounded-full px-6 ${
                activeTab === "weekly" 
                  ? "bg-blue-900 text-white hover:bg-blue-800" 
                  : "text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={activeTab === "custom" ? "default" : "outline"}
              className={`rounded-full px-6 ${
                activeTab === "custom" 
                  ? "bg-blue-900 text-white hover:bg-blue-800" 
                  : "text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("custom")}
            >
              Custom
            </Button>
          </div>

          {/* Transactions Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Transactions (10)</h3>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-gray-500 mb-4">Thu, 5 Sep 2024</div>

          {/* Transactions List */}
          <div className="space-y-0">
            {transactions.map((transaction, index) => (
              <div key={transaction.id} className={`flex items-center justify-between py-4 ${index !== transactions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    {transaction.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{transaction.type}</div>
                    <div className="text-xs text-gray-500">{transaction.time}</div>
                  </div>
                </div>
                <div className={`font-semibold ${transaction.color}`}>
                  {transaction.positive ? '' : '- '}{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerPage;

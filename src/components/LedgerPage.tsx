
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      icon: "trip",
      color: "text-green-600"
    },
    { 
      id: 2, 
      type: "Incentives", 
      time: "09:00 PM • Online", 
      amount: "₹100.00", 
      positive: true,
      icon: "incentive",
      color: "text-green-600"
    },
    { 
      id: 3, 
      type: "Penalty", 
      time: "09:15 AM", 
      amount: "₹60.00", 
      positive: false,
      icon: "penalty",
      color: "text-red-600"
    },
    { 
      id: 4, 
      type: "Recharge success", 
      time: "07:16 AM", 
      amount: "₹1,800.00", 
      positive: true,
      icon: "recharge",
      color: "text-green-600"
    },
    { 
      id: 5, 
      type: "Recharge failed", 
      time: "06:30 PM", 
      amount: "₹600.00", 
      positive: false,
      icon: "failed",
      color: "text-gray-400"
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "trip":
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12m-6-6l6 6-6 6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case "incentive":
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1l2 6h5l-4 3 2 6-5-4-5 4 2-6-4-3h5z" fill="#10B981"/>
            </svg>
          </div>
        );
      case "penalty":
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#EF4444" strokeWidth="2"/>
              <path d="M5.5 5.5l5 5m0-5l-5 5" stroke="#EF4444" strokeWidth="2"/>
            </svg>
          </div>
        );
      case "recharge":
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12m4-8l-4-4-4 4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case "failed":
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#EF4444" strokeWidth="2"/>
              <path d="M8 4v4m0 4h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
            💰
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 10h10M8 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>

          <div className="text-sm text-gray-500 mb-4">Thu, 5 Sep 2024</div>

          {/* Transactions List */}
          <div className="space-y-0">
            {transactions.map((transaction, index) => (
              <div key={transaction.id} className={`flex items-center justify-between py-4 ${index !== transactions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.icon)}
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

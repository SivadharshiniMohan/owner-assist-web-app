
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
      time: "10:10 AM", 
      source: "Cash", 
      amount: "₹1,200.00", 
      positive: true,
      icon: "🚗"
    },
    { 
      id: 2, 
      type: "Incentives", 
      time: "09:00 PM", 
      source: "Online", 
      amount: "₹100.00", 
      positive: true,
      icon: "🎯"
    },
    { 
      id: 3, 
      type: "Penalty", 
      time: "09:15 AM", 
      source: "", 
      amount: "₹60.00", 
      positive: false,
      icon: "⚠️"
    },
    { 
      id: 4, 
      type: "Recharge success", 
      time: "07:16 AM", 
      source: "", 
      amount: "₹1,800.00", 
      positive: true,
      icon: "✅"
    },
    { 
      id: 5, 
      type: "Recharge failed", 
      time: "06:30 PM", 
      source: "", 
      amount: "₹600.00", 
      positive: false,
      icon: "❌"
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Ledger</h1>
            </div>
          </div>

          {/* Balance */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">Balance: <span className="font-semibold">₹500.00</span></p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: "today", label: "Today" },
              { id: "weekly", label: "Weekly" },
              { id: "custom", label: "Custom" }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`px-6 ${
                  activeTab === tab.id 
                    ? "bg-blue-900 text-white hover:bg-blue-800" 
                    : "text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Transactions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Transactions (10)</h3>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-gray-500 mb-4">Thu, 5 Sep 2024</div>

              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                        {transaction.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{transaction.type}</div>
                        <div className="text-xs text-gray-500">
                          {transaction.time}{transaction.source && ` • ${transaction.source}`}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.positive ? '' : '- '}{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LedgerPage;

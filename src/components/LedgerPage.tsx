
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

interface LedgerPageProps {
  onBack: () => void;
}

interface WalletTransaction {
  TRANSACTION_ID: number;
  TRANSACTION_TYPE: string;
  AMOUNT: number;
  CREATED_TIME: string;
  DESCRIPTION?: string;
  TRIP_ID?: number;
  DRIVER_ID: number;
}

const LedgerPage = ({ onBack }: LedgerPageProps) => {
  const [activeTab, setActiveTab] = useState("today");
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [customDate, setCustomDate] = useState<Date>(new Date());

  const getDateRange = () => {
    const today = new Date();
    switch (activeTab) {
      case "today":
        return { start: today, end: today };
      case "weekly":
        return { start: startOfWeek(today), end: endOfWeek(today) };
      case "custom":
        return { start: customDate, end: customDate };
      default:
        return { start: today, end: today };
    }
  };

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['walletTransactions', activeTab, customDate],
    queryFn: async () => {
      const response = await fetch('https://book.ecargo.co.in/v2/driver/walletTxns?id=1&pageNo=1&pageSize=50');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      return data.data || [];
    },
  });

  const getTransactionIcon = (type: string) => {
    if (!type) return getDefaultIcon();
    
    const lowerType = type.toLowerCase();
    
    // Commission
    if (lowerType.includes('commission')) {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l2 6h5l-4 3 2 6-5-4-5 4 2-6-4-3h5z" fill="#3B82F6"/>
          </svg>
        </div>
      );
    }
    
    // Penalty
    if (lowerType.includes('penalty') || lowerType.includes('fine')) {
      return (
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#EF4444" strokeWidth="2"/>
            <path d="M5.5 5.5l5 5m0-5l-5 5" stroke="#EF4444" strokeWidth="2"/>
          </svg>
        </div>
      );
    }
    
    // Recharge
    if (lowerType.includes('recharge') || lowerType.includes('credit')) {
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12m4-8l-4-4-4 4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }
    
    // Withdrawal
    if (lowerType.includes('withdrawal') || lowerType.includes('withdraw')) {
      return (
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 14V2m-4 8l4 4 4-4" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }
    
    // Reward
    if (lowerType.includes('reward') || lowerType.includes('bonus')) {
      return (
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l2 6h5l-4 3 2 6-5-4-5 4 2-6-4-3h5z" fill="#8B5CF6"/>
          </svg>
        </div>
      );
    }
    
    return getDefaultIcon();
  };

  const getDefaultIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
      💰
    </div>
  );

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) + ' • Online';
    } catch {
      return 'N/A';
    }
  };

  const isPositiveTransaction = (type: string, amount: number) => {
    if (!type) return amount > 0;
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes('penalty') || lowerType.includes('fine') || lowerType.includes('withdrawal')) {
      return false;
    }
    return amount > 0;
  };

  const getTransactionColor = (type: string) => {
    if (!type) return 'text-gray-600';
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes('commission')) return 'text-blue-600';
    if (lowerType.includes('penalty') || lowerType.includes('fine')) return 'text-red-600';
    if (lowerType.includes('recharge')) return 'text-green-600';
    if (lowerType.includes('withdrawal')) return 'text-orange-600';
    if (lowerType.includes('reward')) return 'text-purple-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="md:ml-64 pt-4 md:pt-0">
          <div className="container mx-auto px-4 py-4 max-w-8xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading transactions...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="md:ml-64 pt-4 md:pt-0">
          <div className="container mx-auto px-4 py-4 max-w-8xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-red-500">Error loading transactions.
              Please try again.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-8xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-600 hover:text-blue-600 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Ledger</h1>
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
              onClick={() => {
                setActiveTab("custom");
                setShowCustomCalendar(true);
              }}
            >
              Custom
            </Button>
          </div>

          {/* Custom Calendar */}
          {showCustomCalendar && activeTab === "custom" && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Select Custom Date</h3>
                  <button 
                    onClick={() => setShowCustomCalendar(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={(date) => {
                      if (date) {
                        setCustomDate(date);
                        setShowCustomCalendar(false);
                      }
                    }}
                    className="rounded-md border"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Date Display */}
          {activeTab === "custom" && (
            <div className="mb-4 text-sm text-gray-600">
              Selected Date: {format(customDate, "dd MMM yyyy")}
            </div>
          )}

          {/* Transactions Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Transactions ({transactions?.length || 0})</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          <div className="text-sm text-gray-500 mb-4">Recent Transactions</div>

          {/* Transactions List */}
          <div className="space-y-0">
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction: WalletTransaction, index: number) => {
                const isPositive = isPositiveTransaction(transaction.TRANSACTION_TYPE, transaction.AMOUNT);
                return (
                  <div key={transaction.TRANSACTION_ID} className={`flex items-center justify-between py-4 ${index !== transactions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.TRANSACTION_TYPE)}
                      <div>
                        <div className={`font-medium text-sm ${getTransactionColor(transaction.TRANSACTION_TYPE)}`}>
                          {transaction.TRANSACTION_TYPE || 'Unknown Transaction'}
                        </div>
                        <div className="text-xs text-gray-500">{formatTime(transaction.CREATED_TIME)}</div>
                        {transaction.DESCRIPTION && (
                          <div className="text-xs text-gray-400">{transaction.DESCRIPTION}</div>
                        )}
                      </div>
                    </div>
                    <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : '-'}₹{Math.abs(transaction.AMOUNT || 0).toFixed(2)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerPage;

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "./Header";

interface LedgerPageProps {
  onBack: () => void;
  id:number;
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

const LedgerPage = ({ onBack,id }: LedgerPageProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);
console.log("LedgerPage component rendered",transactions);
  const fetchTransactions = async (page: number) => {
    setIsFetchingMore(true);
    try {
      const response = await fetch(
        `https://book.ecargo.co.in/v2/driver/walletTxns?id=${id}&pageNo=${page}&pageSize=${pageSize}`
      );
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setTransactions((prev) => [...prev, ...data.data]);
      }
      if (!data.data || data.data.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setIsFetchingMore(false);
    }
  };
  

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isFetchingMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore, isFetchingMore]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  const getTransactionIcon = (type: string) => {
    const lowerType = type?.toLowerCase() || "";
    const iconClass = "w-8 h-8 rounded-full flex items-center justify-center";

    if (lowerType.includes("commission")) return <div className={`${iconClass} bg-green-100`}>💼</div>;
    if (lowerType.includes("penalty") || lowerType.includes("fine")) return <div className={`${iconClass} bg-red-100`}>⚠️</div>;
    if (lowerType.includes("recharge") || lowerType.includes("credit")) return <div className={`${iconClass} bg-green-100`}>➕</div>;
    if (lowerType.includes("withdraw")) return <div className={`${iconClass} bg-orange-100`}>➖</div>;
    if (lowerType.includes("reward") || lowerType.includes("bonus")) return <div className={`${iconClass} bg-purple-100`}>🎁</div>;

    return <div className={`${iconClass} bg-gray-100`}>💰</div>;
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + " • Online";
    } catch {
      return "N/A";
    }
  };

  const isPositiveTransaction = (type: string, amount: number) => {
    const lowerType = type?.toLowerCase() || "";
    if (lowerType.includes("penalty") || lowerType.includes("fine") || lowerType.includes("withdraw")) return false;
    return amount > 0;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
            <Header/>
      <div className="md:ml-64 pt-4 md:pt-0">
        <div className="container mx-auto px-4 py-4 max-w-8xl">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-600 hover:text-green-600 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
              <h1 className="text-lg font-semibold text-gray-900">Transaction Ledger</h1>
          
          </div>
    

          <div className="text-sm text-gray-500 mb-4">Recent Transactions</div>

          <div className="space-y-0 mb-6">
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                const isPositive = isPositiveTransaction(transaction.TRANSACTION_TYPE, transaction.AMOUNT);
                return (
                  <div
                    key={transaction.TRANSACTION_ID}
                    className="flex items-center justify-between py-4 border-b border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.TRANSACTION_TYPE)}
                      <div>
                        <div className="font-medium text-sm text-gray-800">
                          {transaction.TRANSACTION_TYPE || "Unknown Transaction"}
                        </div>
                        <div className="text-xs text-gray-500">{formatTime(transaction.CREATED_TIME)}</div>
                        {transaction.DESCRIPTION && (
                          <div className="text-xs text-gray-400">{transaction.DESCRIPTION}</div>
                        )}
                      </div>
                    </div>
                    <div className={`font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? "+" : "-"}₹{Math.abs(transaction.AMOUNT || 0).toFixed(2)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">No transactions found</div>
            )}
            {hasMore && (
              <div ref={loader} className="flex justify-center py-6">
                <span className="text-sm text-gray-400">Loading more...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerPage;

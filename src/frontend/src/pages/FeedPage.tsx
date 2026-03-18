import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Clock,
  Coins,
  Copy,
  History,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_pending_approved_rejected } from "../backend.d";
import type { Article } from "../backend.d";
import { ArticleCard } from "../components/ArticleCard";
import {
  useGetNews,
  useMyWithdrawals,
  useRequestWithdrawal,
  useUserStats,
} from "../hooks/useQueries";
import { SAMPLE_ARTICLES, coinsToInr, formatInr } from "../lib/sampleData";

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d"];

interface FeedPageProps {
  onReadArticle: (article: Article) => void;
}

function statusBadgeClass(status: string) {
  if (status === Variant_pending_approved_rejected.approved)
    return "bg-green-100 text-green-700 border-green-200";
  if (status === Variant_pending_approved_rejected.rejected)
    return "bg-red-100 text-red-700 border-red-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

function formatDate(ts: bigint | number) {
  const ms = typeof ts === "bigint" ? Number(ts) / 1_000_000 : ts;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function FeedPage({ onReadArticle }: FeedPageProps) {
  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const { data: stats } = useUserStats();
  const { data: newsData, isLoading: newsLoading } = useGetNews(0);
  const { data: withdrawals } = useMyWithdrawals();
  const requestWithdrawal = useRequestWithdrawal();

  const articles = newsData && newsData.length > 0 ? newsData : SAMPLE_ARTICLES;
  const featuredArticle = articles[0];
  const feedArticles = articles.slice(1);

  const coins = stats ? Number(stats.coinBalance) : 1850;
  const dailyCount = stats ? Number(stats.dailyReadCount) : 12;
  const referralCode = stats?.referralCode ?? "NEWS2026X";
  const inrValue = coinsToInr(coins);
  const dailyProgress = (dailyCount / 250) * 100;

  const latestWithdrawal = withdrawals?.[0];

  const handleCopyReferral = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = () => {
    const amount = Number.parseInt(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid coin amount");
      return;
    }
    if (amount > coins) {
      toast.error("Insufficient coin balance");
      return;
    }
    if (
      !bankAccountName.trim() ||
      !bankAccountNumber.trim() ||
      !ifscCode.trim()
    ) {
      toast.error(
        "Please fill in account holder name, account number, and IFSC code",
      );
      return;
    }
    requestWithdrawal.mutate(
      {
        amount: BigInt(amount),
        bankAccountName: bankAccountName.trim(),
        bankAccountNumber: bankAccountNumber.trim(),
        ifscCode: ifscCode.trim(),
        upiId: upiId.trim(),
      },
      {
        onSuccess: () => {
          toast.success(`Withdrawal request of ${amount} coins submitted!`);
          setWithdrawAmount("");
          setBankAccountName("");
          setBankAccountNumber("");
          setIfscCode("");
          setUpiId("");
        },
        onError: () => toast.error("Failed to submit withdrawal request"),
      },
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10 mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Read News. <span className="text-primary">Earn Rewards.</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          Earn 100 coins per article · 100 coins = ₹5 INR · Max 250 articles/day
        </p>
        <Button
          onClick={() => onReadArticle(featuredArticle)}
          size="lg"
          className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold px-8"
          data-ocid="feed.primary_button"
        >
          Start Reading Now
        </Button>
      </motion.section>

      {/* Main two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-10">
        {/* Active Article */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            Active Article
          </h2>
          {featuredArticle && (
            <div className="card-highlight rounded-2xl overflow-hidden border border-border/50 shadow-card">
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0">
                  {featuredArticle.category}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold leading-tight mb-2">
                  {featuredArticle.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {featuredArticle.summary}
                </p>
                <Separator className="mb-4 bg-border/50" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Read for 10-20 sec to earn
                    </span>
                  </div>
                  <Button
                    onClick={() => onReadArticle(featuredArticle)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold"
                    data-ocid="feed.secondary_button"
                  >
                    <Coins className="w-4 h-4 mr-1.5" />
                    Earn 100 Coins
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Dashboard sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            Dashboard
          </h2>

          {/* Balance card */}
          <div className="card-highlight rounded-xl p-5 border border-border/50 shadow-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">
                Total Balance
              </span>
              <Coins className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-primary">
                {coins.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">coins</span>
            </div>
            <p className="text-base font-semibold text-foreground">
              {formatInr(inrValue)} INR
            </p>
            <Separator className="my-3 bg-border/30" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Today's reads</span>
              <span className="font-semibold">{dailyCount} / 250</span>
            </div>
            <Progress value={dailyProgress} className="mt-2 h-1.5 bg-accent" />
          </div>

          {/* Referral card */}
          <div className="card-highlight rounded-xl p-5 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Referral Code</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Share your code and earn bonus coins when friends join!
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-accent/50 rounded-lg px-3 py-2 font-mono text-sm font-bold text-primary tracking-wider border border-primary/20">
                {referralCode}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyReferral}
                className="border-primary/30 text-primary hover:bg-primary/10 shrink-0"
                data-ocid="feed.toggle"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            {stats && (
              <p className="text-xs text-muted-foreground mt-2">
                {Number(stats.referralCount)} friends referred
              </p>
            )}
          </div>

          {/* Withdrawal card */}
          <div className="card-highlight rounded-xl p-5 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Withdraw Earnings</span>
            </div>
            {latestWithdrawal && (
              <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-accent/30">
                <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Last request:{" "}
                  <span
                    className={`font-medium ${
                      latestWithdrawal.status ===
                      Variant_pending_approved_rejected.approved
                        ? "text-success"
                        : latestWithdrawal.status ===
                            Variant_pending_approved_rejected.rejected
                          ? "text-destructive"
                          : "text-primary"
                    }`}
                  >
                    {latestWithdrawal.status}
                  </span>
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Coins amount"
                className="flex-1 bg-accent/50 border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
                data-ocid="feed.input"
              />
            </div>
            <input
              type="text"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              placeholder="Account Holder Name *"
              className="mt-2 w-full bg-accent/50 border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
              data-ocid="feed.input"
            />
            <input
              type="text"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              placeholder="Bank Account Number *"
              className="mt-2 w-full bg-accent/50 border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
              data-ocid="feed.input"
            />
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              placeholder="IFSC Code *"
              className="mt-2 w-full bg-accent/50 border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
              data-ocid="feed.input"
            />
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="UPI ID (optional)"
              className="mt-2 w-full bg-accent/50 border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
              data-ocid="feed.input"
            />
            <div className="flex gap-2 mt-2">
              <Button
                onClick={handleWithdraw}
                disabled={requestWithdrawal.isPending}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                data-ocid="feed.submit_button"
              >
                {requestWithdrawal.isPending ? "..." : "Request Withdrawal"}
              </Button>
            </div>
            {withdrawAmount && (
              <p className="text-xs text-muted-foreground mt-1.5">
                = {formatInr(coinsToInr(Number.parseInt(withdrawAmount) || 0))}{" "}
                INR
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs text-muted-foreground hover:text-primary"
              onClick={() => setShowHistory(true)}
              data-ocid="feed.button"
            >
              <History className="w-3 h-3 mr-1" />
              View History <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Withdrawal History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent
          className="sm:max-w-lg"
          data-ocid="withdrawal_history.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Withdrawal History
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[420px] pr-1">
            {!withdrawals || withdrawals.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-center"
                data-ocid="withdrawal_history.empty_state"
              >
                <Wallet className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No withdrawals yet
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Your withdrawal requests will appear here
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 py-1">
                {withdrawals.map((w, i) => (
                  <div
                    key={w.id.toString()}
                    className="rounded-xl border border-border/50 bg-accent/20 p-4"
                    data-ocid={`withdrawal_history.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-primary">
                          {Number(w.amount).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          coins
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${statusBadgeClass(w.status)}`}
                      >
                        {w.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {formatInr(coinsToInr(Number(w.amount)))} INR
                      </span>
                      <span>{formatDate(w.createdAt)}</span>
                    </div>
                    {w.bankAccountName && (
                      <p className="text-xs text-muted-foreground mt-1.5 truncate">
                        {w.bankAccountName}
                        {w.bankAccountNumber
                          ? ` · ···${w.bankAccountNumber.slice(-4)}`
                          : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-1"
            onClick={() => setShowHistory(false)}
            data-ocid="withdrawal_history.close_button"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Feed */}
      <section>
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <div className="w-1.5 h-5 bg-primary rounded-full" />
          Feed
        </h2>
        {newsLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-ocid="feed.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <div
                key={k}
                className="card-highlight rounded-xl overflow-hidden border border-border/50 animate-pulse"
              >
                <div className="aspect-video bg-accent/50" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-accent/50 rounded w-16" />
                  <div className="h-4 bg-accent/50 rounded w-3/4" />
                  <div className="h-3 bg-accent/50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedArticles.map((article, i) => (
              <ArticleCard
                key={article.id.toString()}
                article={article}
                index={i + 1}
                onClick={onReadArticle}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

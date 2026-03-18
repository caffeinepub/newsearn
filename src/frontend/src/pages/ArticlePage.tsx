import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, Clock, Coins, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Article } from "../backend.d";
import { useClaimReward, useStartReadingSession } from "../hooks/useQueries";

const MIN_READ_SECONDS = 10;
const MAX_READ_SECONDS = 20;

const PARA_KEYS = [
  "p-intro",
  "p-body1",
  "p-body2",
  "p-body3",
  "p-body4",
  "p-body5",
  "p-body6",
  "p-body7",
  "p-body8",
  "p-body9",
];

interface ArticlePageProps {
  article: Article;
  onBack: () => void;
}

export function ArticlePage({ article, onBack }: ArticlePageProps) {
  const [elapsed, setElapsed] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startReadingSession = useStartReadingSession();
  const claimReward = useClaimReward();
  const articleId = article.id;
  const mutateSession = startReadingSession.mutate;

  const progress = Math.min((elapsed / MAX_READ_SECONDS) * 100, 100);
  const canClaim = elapsed >= MIN_READ_SECONDS && !claimed;
  const timeAgo = getTimeAgo(Number(article.createdAt) / 1_000_000);

  useEffect(() => {
    mutateSession(articleId);

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= MAX_READ_SECONDS) {
          if (timerRef.current) clearInterval(timerRef.current);
          return MAX_READ_SECONDS;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [articleId, mutateSession]);

  const handleClaim = () => {
    claimReward.mutate(undefined, {
      onSuccess: () => {
        setClaimed(true);
        toast.success("🎉 100 Coins earned! Great reading!");
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("already read today")) {
          toast.error("You already read this article today.");
        } else if (msg.includes("Daily read limit")) {
          toast.error("Daily reading limit reached (250 articles).");
        } else if (msg.includes("10 seconds")) {
          toast.error("Please read for at least 10 seconds.");
        } else {
          toast.error("Failed to claim reward. Please try again.");
        }
      },
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const paragraphs = article.content.split("\n\n");

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 text-muted-foreground hover:text-foreground -ml-2"
        data-ocid="article.button"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Feed
      </Button>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Badge
          variant="outline"
          className="mb-3 border-primary/30 text-primary bg-primary/10"
        >
          {article.category}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
          {article.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {timeAgo}
          </span>
          <span>·</span>
          <span>NewsPulse Staff</span>
        </div>

        <div className="rounded-xl overflow-hidden mb-6 border border-border/50">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full aspect-video object-cover"
          />
        </div>

        {/* Reading timer card */}
        <div className="card-highlight rounded-xl p-5 border border-border/50 mb-6 sticky top-20 z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Reading Progress
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-foreground">
                  {formatTime(elapsed)}
                </span>
                <span className="text-muted-foreground text-sm">
                  / {formatTime(MAX_READ_SECONDS)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Reward</div>
              <div className="flex items-center gap-1.5 text-primary font-bold">
                <Coins className="w-4 h-4" />
                <span>100 Coins</span>
              </div>
              <div className="text-xs text-muted-foreground">= ₹5.00 INR</div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <AnimatePresence mode="wait">
                {claimed ? (
                  <motion.div
                    key="claimed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-success font-semibold"
                    data-ocid="article.success_state"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Claimed!
                  </motion.div>
                ) : (
                  <motion.div key="claim">
                    <Button
                      onClick={handleClaim}
                      disabled={!canClaim || claimReward.isPending}
                      className={`rounded-full font-bold transition-all ${
                        canClaim
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 pulse-gold"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                      data-ocid="article.primary_button"
                    >
                      {claimReward.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Coins className="w-4 h-4 mr-2" />
                      )}
                      {canClaim
                        ? "Claim 100 Coins"
                        : `Wait ${MIN_READ_SECONDS - elapsed}s...`}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Progress value={progress} className="mt-3 h-1.5 bg-accent" />

          {elapsed < MIN_READ_SECONDS && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Keep reading for {MIN_READ_SECONDS - elapsed} more seconds to
              unlock your reward
            </p>
          )}
        </div>

        {/* Article content */}
        <div className="prose prose-invert prose-sm max-w-none">
          {paragraphs.map((para, i) => (
            <p
              key={PARA_KEYS[i] ?? `p-${para.slice(0, 10)}`}
              className="text-muted-foreground leading-relaxed mb-4"
            >
              {para}
            </p>
          ))}
        </div>
      </motion.article>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

import { Badge } from "@/components/ui/badge";
import { Clock, Coins } from "lucide-react";
import type { Article } from "../backend.d";

interface ArticleCardProps {
  article: Article;
  index: number;
  onClick: (article: Article) => void;
}

export function ArticleCard({ article, index, onClick }: ArticleCardProps) {
  const timeAgo = getTimeAgo(Number(article.createdAt) / 1_000_000);

  return (
    <button
      type="button"
      onClick={() => onClick(article)}
      data-ocid={`feed.item.${index}`}
      className="group text-left card-highlight rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-gold"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={
            article.imageUrl ||
            "/assets/generated/article-economy.dim_800x450.jpg"
          }
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <Badge
          variant="outline"
          className="text-xs mb-2 border-primary/30 text-primary bg-primary/10"
        >
          {article.category}
        </Badge>
        <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </span>
          <span className="text-xs font-semibold text-primary flex items-center gap-1">
            <Coins className="w-3 h-3" />
            +100 coins
          </span>
        </div>
      </div>
    </button>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

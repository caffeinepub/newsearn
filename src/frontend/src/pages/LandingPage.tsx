import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Coins,
  Gift,
  Newspaper,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { SAMPLE_ARTICLES } from "../lib/sampleData";

export function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  const features = [
    {
      icon: Newspaper,
      title: "Read Daily News",
      desc: "Earn 100 coins for every article you read (10-20 sec)",
    },
    {
      icon: Coins,
      title: "Instant Rewards",
      desc: "100 coins = ₹5 INR. Up to 250 articles per day",
    },
    {
      icon: Gift,
      title: "Referral Bonus",
      desc: "Share your code and earn when friends join",
    },
    {
      icon: TrendingUp,
      title: "Withdraw Anytime",
      desc: "Request bank transfer once you've earned enough",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/8 blur-3xl" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Earn real money reading news
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-5 leading-tight">
              Read News.
              <br />
              <span className="text-primary">Earn Rewards.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Earn 100 coins for every article you read. 100 coins = ₹5 INR.
              Read up to 250 articles per day and withdraw your earnings
              directly to your bank.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full px-8 py-6 text-base pulse-gold"
              data-ocid="landing.primary_button"
            >
              {isLoggingIn ? "Connecting..." : "Start Reading Now"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 mt-14 text-center"
          >
            {[
              { value: "250", label: "Articles / Day" },
              { value: "₹5", label: "Per 100 Coins" },
              { value: "10s", label: "Min Read Time" },
              { value: "∞", label: "Referral Bonus" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-primary">{value}</div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-10"
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-highlight rounded-xl p-6 border border-border/50"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preview articles */}
      <section className="max-w-[1200px] mx-auto px-6 py-8 pb-20">
        <h2 className="text-xl font-bold mb-6">Today's Top Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_ARTICLES.slice(0, 3).map((article) => (
            <div
              key={article.id.toString()}
              className="card-highlight rounded-xl overflow-hidden border border-border/50 opacity-80"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="text-xs text-primary font-medium mb-1.5">
                  {article.category}
                </div>
                <h3 className="font-semibold text-sm line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                  {article.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button
            onClick={login}
            variant="outline"
            size="lg"
            className="border-primary/40 text-primary hover:bg-primary/10 rounded-full"
            data-ocid="landing.secondary_button"
          >
            Login to Start Earning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer attribution */}
      <div className="border-t border-border/30 text-center py-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

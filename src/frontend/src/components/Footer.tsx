import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  const footerLinks = ["About", "FAQ", "Terms", "Privacy", "Contact"];

  return (
    <footer className="border-t border-border/50 mt-16">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                N
              </div>
              <span className="font-bold text-lg tracking-tight">
                NEWSPULSE
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Read news. Earn rewards. Get paid for staying informed.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, label: "Twitter" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            100 coins = ₹5.00 INR · Max 250 articles/day
          </p>
        </div>
      </div>
    </footer>
  );
}

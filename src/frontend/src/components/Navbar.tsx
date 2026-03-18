import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Smartphone } from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserStats } from "../hooks/useQueries";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin?: boolean;
}

export function Navbar({ currentPage, onNavigate, isAdmin }: NavbarProps) {
  const { identity, clear } = useInternetIdentity();
  const { data: stats } = useUserStats();
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortName = principal ? `${principal.slice(0, 5)}...` : "User";
  const coins = stats ? Number(stats.coinBalance) : 0;

  const navLinks: { label: string; page: Page }[] = [
    { label: "Feed", page: "feed" },
    { label: "Top Stories", page: "feed" },
    ...(isAdmin ? [{ label: "Admin", page: "admin" as Page }] : []),
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md"
      style={{ background: "oklch(0.118 0.024 220 / 0.92)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate("feed")}
          className="flex items-center gap-2.5 shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            N
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            NEWSPULSE
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => onNavigate(link.page)}
              data-ocid="nav.link"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors relative ${
                currentPage === link.page && link.page !== "admin"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {currentPage === link.page && link.page !== "admin" && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* User area */}
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border-primary/30 bg-primary/10 text-primary"
          >
            <Coins className="w-3.5 h-3.5" />
            <span className="font-semibold text-sm">
              {coins.toLocaleString()}
            </span>
          </Badge>

          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border border-border">
              <AvatarFallback className="bg-accent text-foreground text-xs font-bold">
                {shortName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium text-foreground">
              {shortName}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-muted-foreground hover:text-foreground text-xs"
            data-ocid="nav.button"
          >
            Logout
          </Button>

          <Button
            size="sm"
            className="hidden md:flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full px-4"
            data-ocid="nav.primary_button"
          >
            <Smartphone className="w-3.5 h-3.5" />
            Get Mobile App
          </Button>
        </div>
      </div>
    </header>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2, Settings2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Article, UserRole } from "./backend.d";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useInitializeAdmin,
  useIsAdmin,
  useRegisterUser,
  useUserRole,
} from "./hooks/useQueries";
import { AdminPage } from "./pages/AdminPage";
import { ArticlePage } from "./pages/ArticlePage";
import { FeedPage } from "./pages/FeedPage";
import { LandingPage } from "./pages/LandingPage";

export type Page = "feed" | "article" | "admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30_000 },
  },
});

function AdminSetupDialog() {
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState("");
  const { mutate, isPending } = useInitializeAdmin();

  const handleClaim = () => {
    mutate(secret, {
      onSuccess: () => {
        toast.success("Admin access granted!");
        setOpen(false);
        setSecret("");
      },
      onError: () => {
        toast.error("Invalid token or admin already assigned");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          data-ocid="admin_setup.open_modal_button"
          className="flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          title="Admin Setup"
        >
          <Settings2 className="w-3 h-3" />
          Admin Setup
        </button>
      </DialogTrigger>
      <DialogContent data-ocid="admin_setup.dialog" className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Admin Setup</DialogTitle>
          <DialogDescription>
            Enter the admin secret token to claim admin access. Only the first
            person to enter the correct token becomes admin.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <Label htmlFor="admin-secret">Admin Secret Token</Label>
          <Input
            id="admin-secret"
            data-ocid="admin_setup.input"
            type="password"
            placeholder="Enter secret token…"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isPending && handleClaim()}
          />
        </div>
        <DialogFooter>
          <Button
            data-ocid="admin_setup.submit_button"
            onClick={handleClaim}
            disabled={isPending || !secret}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Claim Admin Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const [page, setPage] = useState<Page>("feed");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const { data: isAdmin } = useIsAdmin();
  const { data: userRole } = useUserRole();
  const registerUser = useRegisterUser();
  const hasTriedRegister = useRef(false);

  const isLoggedIn = !!identity;

  useEffect(() => {
    if (
      isLoggedIn &&
      userRole === ("guest" as UserRole) &&
      !hasTriedRegister.current &&
      !registerUser.isPending
    ) {
      hasTriedRegister.current = true;
      registerUser.mutate();
    }
  }, [isLoggedIn, userRole, registerUser]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <div className="w-5 h-5 rounded border-2 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Loading NewsEarn...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LandingPage />;
  }

  const handleReadArticle = (article: Article) => {
    setActiveArticle(article);
    setPage("article");
  };

  const handleBack = () => {
    setActiveArticle(null);
    setPage("feed");
  };

  const handleNavigate = (p: Page) => {
    if (p === "admin" && !isAdmin) return;
    setPage(p);
    if (p !== "article") setActiveArticle(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentPage={page}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
      />
      <main className="flex-1">
        {page === "feed" && <FeedPage onReadArticle={handleReadArticle} />}
        {page === "article" && activeArticle && (
          <ArticlePage article={activeArticle} onBack={handleBack} />
        )}
        {page === "admin" && isAdmin && <AdminPage />}
        {page === "admin" && !isAdmin && (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            Access denied. Admin only.
          </div>
        )}
      </main>
      <Footer />
      {isLoggedIn && !isAdmin && (
        <div className="fixed bottom-4 right-4 z-50">
          <AdminSetupDialog />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

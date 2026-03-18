import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Edit2,
  Loader2,
  Newspaper,
  Plus,
  Trash2,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_pending_approved_rejected } from "../backend.d";
import type { Article } from "../backend.d";
import {
  useAddArticle,
  useApproveWithdrawal,
  useDeleteArticle,
  useGetAllUsers,
  useGetNews,
  useGetWithdrawalRequests,
  useRejectWithdrawal,
  useUpdateArticle,
} from "../hooks/useQueries";
import { SAMPLE_ARTICLES, coinsToInr, formatInr } from "../lib/sampleData";

type ArticleForm = {
  title: string;
  content: string;
  summary: string;
  category: string;
  imageUrl: string;
};
const EMPTY_FORM: ArticleForm = {
  title: "",
  content: "",
  summary: "",
  category: "",
  imageUrl: "",
};

export function AdminPage() {
  const [tab, setTab] = useState("articles");
  const [articleDialog, setArticleDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});

  const { data: newsData } = useGetNews(0);
  const articles = newsData && newsData.length > 0 ? newsData : SAMPLE_ARTICLES;
  const { data: users } = useGetAllUsers();
  const { data: withdrawals } = useGetWithdrawalRequests();

  const addArticle = useAddArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const approveWithdrawal = useApproveWithdrawal();
  const rejectWithdrawal = useRejectWithdrawal();

  const openAddDialog = () => {
    setEditingArticle(null);
    setForm(EMPTY_FORM);
    setArticleDialog(true);
  };

  const openEditDialog = (article: Article) => {
    setEditingArticle(article);
    setForm({
      title: article.title,
      content: article.content,
      summary: article.summary,
      category: article.category,
      imageUrl: article.imageUrl,
    });
    setArticleDialog(true);
  };

  const handleSaveArticle = () => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }
    if (editingArticle) {
      updateArticle.mutate(
        { id: editingArticle.id, ...form },
        {
          onSuccess: () => {
            toast.success("Article updated");
            setArticleDialog(false);
          },
          onError: () => toast.error("Failed to update article"),
        },
      );
    } else {
      addArticle.mutate(form, {
        onSuccess: () => {
          toast.success("Article added");
          setArticleDialog(false);
          setForm(EMPTY_FORM);
        },
        onError: () => toast.error("Failed to add article"),
      });
    }
  };

  const handleDelete = (id: bigint) => {
    deleteArticle.mutate(id, {
      onSuccess: () => toast.success("Article deleted"),
      onError: () => toast.error("Failed to delete"),
    });
  };

  const handleApprove = (id: bigint) => {
    const note = noteMap[id.toString()] ?? "Approved by admin";
    approveWithdrawal.mutate(
      { id, note },
      {
        onSuccess: () => toast.success("Withdrawal approved"),
        onError: () => toast.error("Failed to approve"),
      },
    );
  };

  const handleReject = (id: bigint) => {
    const note = noteMap[id.toString()] ?? "Rejected by admin";
    rejectWithdrawal.mutate(
      { id, note },
      {
        onSuccess: () => toast.success("Withdrawal rejected"),
        onError: () => toast.error("Failed to reject"),
      },
    );
  };

  const pendingWithdrawals =
    withdrawals?.filter(
      (w) => w.status === Variant_pending_approved_rejected.pending,
    ) ?? [];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage articles, users, and withdrawals
            </p>
          </div>
          <div className="flex gap-3">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/10"
            >
              <Newspaper className="w-3 h-3 mr-1.5" />
              {articles.length} Articles
            </Badge>
            <Badge
              variant="outline"
              className="border-success/30 text-success bg-success/10"
            >
              <Wallet className="w-3 h-3 mr-1.5" />
              {pendingWithdrawals.length} Pending
            </Badge>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-card border border-border/50 mb-6">
            <TabsTrigger
              value="articles"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="admin.tab"
            >
              <Newspaper className="w-4 h-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="admin.tab"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="withdrawals"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="admin.tab"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Withdrawals
              {pendingWithdrawals.length > 0 && (
                <span className="ml-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                  {pendingWithdrawals.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Articles tab */}
          <TabsContent value="articles">
            <div className="flex justify-end mb-4">
              <Dialog open={articleDialog} onOpenChange={setArticleDialog}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openAddDialog}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-ocid="admin.open_modal_button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Article
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="bg-card border-border/50 max-w-lg"
                  data-ocid="admin.dialog"
                >
                  <DialogHeader>
                    <DialogTitle>
                      {editingArticle ? "Edit Article" : "Add New Article"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <Input
                      placeholder="Title"
                      value={form.title}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                      className="bg-accent/50 border-border/50"
                      data-ocid="admin.input"
                    />
                    <Input
                      placeholder="Category (e.g. Technology)"
                      value={form.category}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, category: e.target.value }))
                      }
                      className="bg-accent/50 border-border/50"
                      data-ocid="admin.input"
                    />
                    <Input
                      placeholder="Image URL"
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, imageUrl: e.target.value }))
                      }
                      className="bg-accent/50 border-border/50"
                      data-ocid="admin.input"
                    />
                    <Textarea
                      placeholder="Summary (1-2 sentences)"
                      value={form.summary}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, summary: e.target.value }))
                      }
                      rows={2}
                      className="bg-accent/50 border-border/50 resize-none"
                      data-ocid="admin.textarea"
                    />
                    <Textarea
                      placeholder="Full article content..."
                      value={form.content}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, content: e.target.value }))
                      }
                      rows={5}
                      className="bg-accent/50 border-border/50 resize-none"
                      data-ocid="admin.textarea"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setArticleDialog(false)}
                      data-ocid="admin.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveArticle}
                      disabled={addArticle.isPending || updateArticle.isPending}
                      className="bg-primary text-primary-foreground"
                      data-ocid="admin.submit_button"
                    >
                      {(addArticle.isPending || updateArticle.isPending) && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      )}
                      {editingArticle ? "Update" : "Add Article"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div
              className="card-highlight rounded-xl border border-border/50 overflow-hidden"
              data-ocid="admin.table"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Title
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article, i) => (
                    <TableRow
                      key={article.id.toString()}
                      className="border-border/30 hover:bg-accent/20"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="font-medium max-w-xs">
                        <p className="truncate">{article.title}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {article.summary}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-primary/30 text-primary text-xs"
                        >
                          {article.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(article)}
                            className="text-muted-foreground hover:text-foreground"
                            data-ocid={`admin.edit_button.${i + 1}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(article.id)}
                            className="text-muted-foreground hover:text-destructive"
                            disabled={deleteArticle.isPending}
                            data-ocid={`admin.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Users tab */}
          <TabsContent value="users">
            <div
              className="card-highlight rounded-xl border border-border/50 overflow-hidden"
              data-ocid="admin.table"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Principal
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Coins
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      INR Value
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Daily Reads
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Referrals
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users.map(([principal, stats], i) => (
                      <TableRow
                        key={principal.toString()}
                        className="border-border/30 hover:bg-accent/20"
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {principal.toString().slice(0, 20)}...
                        </TableCell>
                        <TableCell className="font-semibold text-primary">
                          {Number(stats.coinBalance).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {formatInr(coinsToInr(Number(stats.coinBalance)))}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {Number(stats.dailyReadCount)} / 250
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {Number(stats.referralCount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-10"
                        data-ocid="admin.empty_state"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Withdrawals tab */}
          <TabsContent value="withdrawals">
            <div
              className="card-highlight rounded-xl border border-border/50 overflow-hidden"
              data-ocid="admin.table"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      User
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Amount
                    </TableHead>
                    <TableHead className="text-muted-foreground">INR</TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Account Name
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Account No.
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      IFSC
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      UPI ID
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Note
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals && withdrawals.length > 0 ? (
                    withdrawals.map((w, i) => (
                      <TableRow
                        key={w.id.toString()}
                        className="border-border/30 hover:bg-accent/20"
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {w.user.toString().slice(0, 15)}...
                        </TableCell>
                        <TableCell className="font-semibold text-primary">
                          {Number(w.amount).toLocaleString()} coins
                        </TableCell>
                        <TableCell>
                          {formatInr(coinsToInr(Number(w.amount)))}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              w.status ===
                              Variant_pending_approved_rejected.approved
                                ? "border-success/30 text-success bg-success/10"
                                : w.status ===
                                    Variant_pending_approved_rejected.rejected
                                  ? "border-destructive/30 text-destructive bg-destructive/10"
                                  : "border-primary/30 text-primary bg-primary/10"
                            }`}
                          >
                            {w.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {w.status ===
                            Variant_pending_approved_rejected.pending && (
                            <Input
                              placeholder="Note..."
                              value={noteMap[w.id.toString()] ?? ""}
                              onChange={(e) =>
                                setNoteMap((p) => ({
                                  ...p,
                                  [w.id.toString()]: e.target.value,
                                }))
                              }
                              className="bg-accent/50 border-border/50 h-7 text-xs w-32"
                              data-ocid={`admin.input.${i + 1}`}
                            />
                          )}
                          {w.note &&
                            w.status !==
                              Variant_pending_approved_rejected.pending && (
                              <span className="text-xs text-muted-foreground">
                                {w.note}
                              </span>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                          {w.status ===
                            Variant_pending_approved_rejected.pending && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(w.id)}
                                disabled={approveWithdrawal.isPending}
                                className="bg-success/20 text-success hover:bg-success/30 border-0 h-7 text-xs"
                                data-ocid={`admin.confirm_button.${i + 1}`}
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReject(w.id)}
                                disabled={rejectWithdrawal.isPending}
                                className="text-destructive hover:bg-destructive/10 h-7 text-xs"
                                data-ocid={`admin.delete_button.${i + 1}`}
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center text-muted-foreground py-10"
                        data-ocid="admin.empty_state"
                      >
                        No withdrawal requests
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Article,
  UserRole,
  UserStats,
  WithdrawalRequest,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetNews(page = 0) {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["news", page],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNews(BigInt(page), BigInt(10));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticle(articleId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Article | null>({
    queryKey: ["article", articleId?.toString()],
    queryFn: async () => {
      if (!actor || articleId === null) return null;
      return actor.getArticle(articleId);
    },
    enabled: !!actor && !isFetching && articleId !== null,
  });
}

export function useUserStats() {
  const { actor, isFetching } = useActor();
  return useQuery<UserStats>({
    queryKey: ["userStats"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getUserStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      try {
        return await actor.getCallerUserRole();
      } catch {
        return "guest" as UserRole;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyWithdrawals() {
  const { actor, isFetching } = useActor();
  return useQuery<WithdrawalRequest[]>({
    queryKey: ["myWithdrawals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyWithdrawals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<[import("@icp-sdk/core/principal").Principal, UserStats][]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWithdrawalRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<WithdrawalRequest[]>({
    queryKey: ["withdrawalRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWithdrawalRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStartReadingSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (articleId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.startReadingSession(articleId);
    },
  });
}

export function useClaimReward() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.claimReward();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}

export function useRequestWithdrawal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      amount,
      bankAccountName,
      bankAccountNumber,
      ifscCode,
      upiId,
    }: {
      amount: bigint;
      bankAccountName: string;
      bankAccountNumber: string;
      ifscCode: string;
      upiId: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.requestWithdrawal(
        amount,
        bankAccountName,
        bankAccountNumber,
        ifscCode,
        upiId,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myWithdrawals"] });
      qc.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}

export function useRegisterWithReferral() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("No actor");
      return actor.registerWithReferral(code);
    },
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return (actor as any).registerUser();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userRole"] });
      qc.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}

export function useAddArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (a: {
      title: string;
      content: string;
      summary: string;
      category: string;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addArticle(
        a.title,
        a.content,
        a.summary,
        a.category,
        a.imageUrl,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (a: {
      id: bigint;
      title: string;
      content: string;
      summary: string;
      category: string;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateArticle(
        a.id,
        a.title,
        a.content,
        a.summary,
        a.category,
        a.imageUrl,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteArticle(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });
}

export function useApproveWithdrawal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: bigint; note: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.approveWithdrawal(id, note);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["withdrawalRequests"] }),
  });
}

export function useRejectWithdrawal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: bigint; note: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.rejectWithdrawal(id, note);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["withdrawalRequests"] }),
  });
}

export function useInitializeAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (secret: string) => {
      if (!actor) throw new Error("No actor");
      return actor._initializeAccessControlWithSecret(secret);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
      qc.invalidateQueries({ queryKey: ["userRole"] });
    },
  });
}

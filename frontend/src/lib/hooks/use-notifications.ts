import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi, type NotificationQuery } from "@/lib/api/notifications";

const NOTIFICATIONS_KEY = ["notifications"] as const;

export function useNotificationsQuery(query: NotificationQuery) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, query],
    queryFn: () => notificationsApi.list(query),
  });
}

export function useMarkNotificationReadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationsApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useMarkAllNotificationsReadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

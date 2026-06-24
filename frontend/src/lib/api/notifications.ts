import { http, unwrap } from "./axios";
import type { Notification, PageResult } from "@/lib/types";

export type NotificationQuery = {
  /** 0 = 未读, 1 = 已读, 不传 = 全部 */
  readStatus?: number;
  page?: number;
  pageSize?: number;
};

export const notificationsApi = {
  list: (params: NotificationQuery) =>
    unwrap<PageResult<Notification>>(http.get("/notifications", { params })),
  markRead: (id: number) =>
    unwrap<void>(http.post(`/notifications/${id}/read`)),
  markAllRead: () => unwrap<void>(http.post("/notifications/read-all")),
};

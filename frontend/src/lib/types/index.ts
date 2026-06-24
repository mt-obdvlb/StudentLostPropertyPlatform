export type UserRole = "VISITOR" | "USER" | "ADMIN" | "SUPER_ADMIN";

export type UserStatus = "ACTIVE" | "DISABLED";

export type User = {
  id: number;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type PostType = "LOST" | "FOUND";

export type PostStatus = "PROCESSING" | "CLAIMED" | "EXPIRED" | "REMOVED";

export type Post = {
  id: number;
  title: string;
  type: PostType;
  category: string;
  description: string;
  imageUrl?: string;
  location: string;
  occurredAt: string;
  contact: string;
  status: PostStatus;
  ownerId: number;
  ownerName?: string;
  duplicateScore?: number;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type Claim = {
  id: number;
  postId: number;
  postTitle: string;
  claimerId: number;
  claimerName: string;
  reason: string;
  proofDescription?: string;
  status: ClaimStatus;
  reviewComment?: string;
  reviewerId?: number;
  reviewerName?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationType =
  | "CLAIM_CREATED"
  | "CLAIM_APPROVED"
  | "CLAIM_REJECTED"
  | "POST_EXPIRED"
  | "SYSTEM";

export type Notification = {
  id: number;
  userId: number;
  title: string;
  content: string;
  type: NotificationType;
  /** 0 = 未读, 1 = 已读 */
  readStatus: number;
  createdAt: string;
};

export type AdminStats = {
  userCount: number;
  activeUserCount: number;
  lostPostCount: number;
  foundPostCount: number;
  processingPostCount: number;
  claimedPostCount: number;
  expiredPostCount: number;
  removedPostCount: number;
  pendingClaimCount: number;
  approvedClaimCount: number;
  rejectedClaimCount: number;
  unreadNotificationCount: number;
};

export type DuplicateLevel = "HIGH" | "MEDIUM" | "NORMAL";

export type DuplicateCheckResult = {
  duplicateScore: number;
  level: DuplicateLevel;
  duplicate: boolean;
  matchedPost: Post | null;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type PageResult<T> = {
  records: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type SortBy = "createdAtDesc" | "expiredAtAsc" | "updatedAtDesc";

export type PostQuery = {
  keyword?: string;
  type?: PostType;
  status?: PostStatus;
  location?: string;
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
};

export type ClaimQuery = {
  status?: ClaimStatus;
  page?: number;
  pageSize?: number;
};

export type PostCreateRequest = {
  title: string;
  type: PostType;
  category: string;
  description: string;
  imageUrl?: string;
  location: string;
  occurredAt: string;
  expiredAt: string;
  contact: string;
  confirmDuplicate?: boolean;
};

export type PostUpdateRequest = Partial<PostCreateRequest>;

export type ClaimCreateRequest = {
  postId: number;
  reason: string;
  proofDescription: string;
};

export type ClaimReviewRequest = {
  reviewComment?: string;
};

export type RemovePostRequest = {
  reason?: string;
};

export type UserRoleUpdateRequest = {
  role: UserRole;
};

export type UserStatusUpdateRequest = {
  status: UserStatus;
};

export type UserQuery = {
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  pageSize?: number;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  nickname: string;
  email: string;
  phone?: string;
};

export type ApiError = {
  code: number;
  message: string;
  status?: number;
};

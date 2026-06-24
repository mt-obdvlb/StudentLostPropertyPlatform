USE lost_found;

INSERT INTO users (id, username, password_hash, nickname, email, phone, role, status, deleted)
VALUES
  (1, 'admin', '$2y$10$3qt5StKf8FsU6Gx42BvdieRRTCfN6gtKheO984TPP3FqCMWP/gjOq', '系统管理员', 'admin@example.edu.cn', '13800000000', 'ADMIN', 'ACTIVE', 0),
  (2, 'user1', '$2y$10$u8niYT5ftOkWYWHXLLzwMe4jYRde5WmsQO3mOvP8n9Fzg4uYOAGEi', '普通用户一', 'user1@example.edu.cn', '13800000001', 'USER', 'ACTIVE', 0),
  (3, 'user2', '$2y$10$u8niYT5ftOkWYWHXLLzwMe4jYRde5WmsQO3mOvP8n9Fzg4uYOAGEi', '普通用户二', 'user2@example.edu.cn', '13800000002', 'USER', 'ACTIVE', 0)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  nickname = VALUES(nickname),
  email = VALUES(email),
  phone = VALUES(phone),
  role = VALUES(role),
  status = VALUES(status),
  deleted = VALUES(deleted);

INSERT INTO posts (
  id, title, type, category, description, image_url, location, occurred_at,
  contact, status, owner_id, duplicate_score, expired_at, version, deleted
)
VALUES
  (1, '图书馆捡到黑色雨伞', 'FOUND', '生活用品', '在图书馆二楼自习区捡到一把黑色长柄雨伞，伞柄有银色标记。', NULL, '图书馆二楼', NOW() - INTERVAL 1 DAY, '站内信联系', 'PROCESSING', 2, 0.0000, NOW() + INTERVAL 30 DAY, 0, 0),
  (2, '丢失蓝色校园卡', 'LOST', '证件卡片', '本人在一食堂附近丢失蓝色校园卡，卡面有姓名贴纸。', NULL, '一食堂门口', NOW() - INTERVAL 2 DAY, 'user2@example.edu.cn', 'PROCESSING', 3, 0.0000, NOW() + INTERVAL 30 DAY, 0, 0),
  (3, '拾到白色无线耳机', 'FOUND', '电子设备', '在教学楼 A 座 302 教室拾到白色无线耳机盒。', NULL, '教学楼 A 座 302', NOW() - INTERVAL 5 DAY, 'admin@example.edu.cn', 'CLAIMED', 1, 0.0000, NOW() + INTERVAL 25 DAY, 1, 0),
  (4, '丢失黑色双肩包', 'LOST', '箱包', '在操场看台附近丢失黑色双肩包，包内有教材和水杯。', NULL, '操场看台', NOW() - INTERVAL 3 DAY, 'user1@example.edu.cn', 'PROCESSING', 2, 0.0000, NOW() + INTERVAL 30 DAY, 0, 0),
  (5, '过期测试拾物信息', 'FOUND', '电子设备', '用于验证自动过期任务的测试数据。', NULL, '教学楼 B 座', NOW() - INTERVAL 40 DAY, 'admin@example.edu.cn', 'PROCESSING', 1, 0.0000, NOW() - INTERVAL 1 DAY, 0, 0)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  type = VALUES(type),
  category = VALUES(category),
  description = VALUES(description),
  image_url = VALUES(image_url),
  location = VALUES(location),
  occurred_at = VALUES(occurred_at),
  contact = VALUES(contact),
  status = VALUES(status),
  owner_id = VALUES(owner_id),
  duplicate_score = VALUES(duplicate_score),
  expired_at = VALUES(expired_at),
  version = VALUES(version),
  deleted = VALUES(deleted);

INSERT INTO claims (
  id, post_id, claimer_id, reason, proof_description, status,
  review_comment, reviewer_id, reviewed_at, version, deleted
)
VALUES
  (1, 1, 3, '这把雨伞可能是我昨天在图书馆遗失的。', '雨伞伞柄有一圈银色胶带，伞面内侧有小划痕。', 'PENDING', NULL, NULL, NULL, 0, 0),
  (2, 3, 2, '耳机是我在课后遗留的。', '耳机盒背面有一处浅色划痕，可以提供购买记录。', 'APPROVED', '描述与实物一致', 1, NOW() - INTERVAL 1 DAY, 1, 0),
  (3, 3, 3, '可能是我的耳机。', '只能描述颜色，无法提供更多证明。', 'REJECTED', '证明信息不足', 1, NOW() - INTERVAL 1 DAY, 1, 0)
ON DUPLICATE KEY UPDATE
  reason = VALUES(reason),
  proof_description = VALUES(proof_description),
  status = VALUES(status),
  review_comment = VALUES(review_comment),
  reviewer_id = VALUES(reviewer_id),
  reviewed_at = VALUES(reviewed_at),
  version = VALUES(version),
  deleted = VALUES(deleted);

INSERT INTO notifications (id, user_id, title, content, type, read_status)
VALUES
  (1, 1, '新的认领申请', '用户 user2 对“图书馆捡到黑色雨伞”提交了认领申请。', 'CLAIM_CREATED', 0),
  (2, 3, '认领申请已提交', '你的认领申请已提交，请等待管理员审核。', 'CLAIM_CREATED', 0),
  (3, 2, '认领申请已通过', '你对“拾到白色无线耳机”的认领申请已通过。', 'CLAIM_APPROVED', 0),
  (4, 3, '认领申请已驳回', '你对“拾到白色无线耳机”的认领申请已驳回。', 'CLAIM_REJECTED', 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  content = VALUES(content),
  type = VALUES(type),
  read_status = VALUES(read_status);

INSERT INTO operation_logs (id, operator_id, action, target_type, target_id, detail, ip)
VALUES
  (1, 1, 'INIT_DATA', 'SYSTEM', 0, '初始化课程演示数据', '127.0.0.1'),
  (2, 1, 'APPROVE_CLAIM', 'CLAIM', 2, '描述与实物一致', '127.0.0.1'),
  (3, 1, 'REJECT_CLAIM', 'CLAIM', 3, '证明信息不足', '127.0.0.1')
ON DUPLICATE KEY UPDATE
  action = VALUES(action),
  target_type = VALUES(target_type),
  target_id = VALUES(target_id),
  detail = VALUES(detail),
  ip = VALUES(ip);

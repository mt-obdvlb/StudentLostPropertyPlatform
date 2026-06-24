CREATE DATABASE IF NOT EXISTS lost_found
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE lost_found;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  nickname VARCHAR(64) NOT NULL,
  email VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'USER',
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted TINYINT NOT NULL DEFAULT 0,
  UNIQUE KEY idx_user_username (username),
  UNIQUE KEY idx_user_email (email),
  CONSTRAINT chk_users_role CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN')),
  CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'DISABLED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS posts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  type VARCHAR(16) NOT NULL,
  category VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  image_url LONGTEXT NULL,
  location VARCHAR(128) NOT NULL,
  occurred_at DATETIME NOT NULL,
  contact VARCHAR(128) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PROCESSING',
  owner_id BIGINT NOT NULL,
  duplicate_score DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
  expired_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  version INT NOT NULL DEFAULT 0,
  deleted TINYINT NOT NULL DEFAULT 0,
  CONSTRAINT fk_posts_owner_id FOREIGN KEY (owner_id) REFERENCES users (id),
  CONSTRAINT chk_posts_type CHECK (type IN ('LOST', 'FOUND')),
  CONSTRAINT chk_posts_status CHECK (status IN ('PROCESSING', 'CLAIMED', 'EXPIRED', 'REMOVED')),
  KEY idx_post_type_status_created_at (type, status, created_at),
  KEY idx_post_owner_id (owner_id),
  KEY idx_post_expired_at_status (expired_at, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS claims (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  claimer_id BIGINT NOT NULL,
  reason VARCHAR(512) NOT NULL,
  proof_description VARCHAR(1000) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  review_comment VARCHAR(512) NULL,
  reviewer_id BIGINT NULL,
  reviewed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  version INT NOT NULL DEFAULT 0,
  deleted TINYINT NOT NULL DEFAULT 0,
  CONSTRAINT fk_claims_post_id FOREIGN KEY (post_id) REFERENCES posts (id),
  CONSTRAINT fk_claims_claimer_id FOREIGN KEY (claimer_id) REFERENCES users (id),
  CONSTRAINT fk_claims_reviewer_id FOREIGN KEY (reviewer_id) REFERENCES users (id),
  CONSTRAINT chk_claims_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
  UNIQUE KEY uk_claims_post_claimer_deleted (post_id, claimer_id, deleted),
  KEY idx_claim_post_id_status (post_id, status),
  KEY idx_claim_claimer_id (claimer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content VARCHAR(1000) NOT NULL,
  type VARCHAR(64) NOT NULL,
  read_status TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT chk_notifications_read_status CHECK (read_status IN (0, 1)),
  KEY idx_notification_user_read (user_id, read_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS operation_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  operator_id BIGINT NOT NULL,
  action VARCHAR(64) NOT NULL,
  target_type VARCHAR(64) NOT NULL,
  target_id BIGINT NOT NULL,
  detail VARCHAR(1000) NULL,
  ip VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_operation_logs_operator_id FOREIGN KEY (operator_id) REFERENCES users (id),
  KEY idx_operation_operator_created (operator_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 兼容旧库：将 image_url 升级为 LONGTEXT 以承载 Base64 图片数据
ALTER TABLE posts MODIFY COLUMN image_url LONGTEXT NULL;

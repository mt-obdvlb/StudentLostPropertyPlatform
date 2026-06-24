package com.example.lostfound.common.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    BAD_REQUEST(40000, "请求参数错误"),
    UNAUTHORIZED(40100, "请先登录"),
    FORBIDDEN(40300, "权限不足"),
    NOT_FOUND(40400, "资源不存在"),
    CONFLICT(40900, "数据状态冲突"),
    VALIDATION_FAILED(42200, "参数校验失败"),
    INTERNAL_ERROR(50000, "服务器内部错误"),

    USERNAME_EXISTS(10001, "用户名已存在"),
    EMAIL_EXISTS(10002, "邮箱已存在"),
    INVALID_CREDENTIALS(10003, "用户名或密码错误"),
    USER_DISABLED(10004, "用户已被禁用"),

    POST_NOT_FOUND(20001, "物品信息不存在"),
    POST_FORBIDDEN(20002, "无权操作该物品信息"),
    POST_NOT_PROCESSING(20003, "物品当前状态不允许该操作"),

    CLAIM_NOT_FOUND(30001, "认领申请不存在"),
    CLAIM_DUPLICATED(30002, "不能重复申请认领同一物品"),
    CLAIM_FORBIDDEN(30003, "无权操作该认领申请"),
    CLAIM_INVALID_POST(30004, "该物品不允许认领"),
    CLAIM_INVALID_STATUS(30005, "认领申请状态不允许该操作"),
    CLAIM_SELF_POST(30006, "不能认领自己发布的拾物"),

    NOTIFICATION_NOT_FOUND(40001, "通知不存在");

    private final Integer code;
    private final String message;

    ErrorCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}

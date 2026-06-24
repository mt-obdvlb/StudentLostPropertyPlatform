package com.example.lostfound.module.log.service;

import com.example.lostfound.common.util.RequestContextUtils;
import com.example.lostfound.module.log.entity.OperationLog;
import com.example.lostfound.module.log.mapper.OperationLogMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OperationLogService {

    private final OperationLogMapper operationLogMapper;

    public OperationLogService(OperationLogMapper operationLogMapper) {
        this.operationLogMapper = operationLogMapper;
    }

    public void log(Long operatorId, String action, String targetType, Long targetId, String detail) {
        OperationLog log = new OperationLog();
        log.setOperatorId(operatorId);
        log.setAction(action);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setDetail(detail);
        log.setIp(RequestContextUtils.currentIp());
        log.setCreatedAt(LocalDateTime.now());
        operationLogMapper.insert(log);
    }
}

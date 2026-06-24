package com.example.lostfound.common.api;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "统一分页响应")
public class PageResult<T> {

    @Schema(description = "当前页记录")
    private List<T> records;

    @Schema(description = "总记录数")
    private Long total;

    @Schema(description = "页码，从 1 开始")
    private Long page;

    @Schema(description = "每页数量")
    private Long pageSize;
}

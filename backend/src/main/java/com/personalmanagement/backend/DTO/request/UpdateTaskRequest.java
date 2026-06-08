package com.personalmanagement.backend.DTO.request;

import java.time.LocalDate;
import java.time.LocalTime;

import com.personalmanagement.backend.Entity.TaskPriority;
import com.personalmanagement.backend.Entity.TaskStatus;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateTaskRequest(
    @NotBlank(message = "Không được để trống tiêu đề")   
    String title,

    @Size(max = 1000, message = "Mô tả không được vượt quá 1000 ký tự")
    String description,
    TaskStatus status,
    TaskPriority priority,
    LocalDate startDate,
    LocalTime startTime,

    @FutureOrPresent(message = "Hạn chót không được ở quá khứ")
    LocalDate dueDate,
    LocalTime dueTime
) {
}

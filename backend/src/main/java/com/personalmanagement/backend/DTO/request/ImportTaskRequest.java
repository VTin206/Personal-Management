package com.personalmanagement.backend.DTO.request;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ImportTaskRequest(
    @NotBlank(message = "Legacy task ID is required")
    @Size(max = 128, message = "Legacy task ID must be at most 128 characters")
    String legacyId,

    @NotBlank(message = "Task title is required")
    @Size(max = 200, message = "Task title must be at most 200 characters")
    String title,

    @Size(max = 1000, message = "Task description must be at most 1000 characters")
    String description,
    String status,
    String priority,
    LocalDate startDate,
    LocalTime startTime,
    LocalDate dueDate,
    LocalTime dueTime,
    Long focusSeconds,
    Map<String, Long> focusLog,
    Long shortBreakSeconds,
    Map<String, Long> shortBreakLog,
    Long longBreakSeconds,
    Map<String, Long> longBreakLog,
    Instant createdAt,
    Instant updatedAt,
    Instant completedAt
) {
}

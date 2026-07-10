package com.personalmanagement.backend.DTO.request;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateTaskRequest(
    @NotBlank(message = "Task title is required")
    String title,

    @Size(max = 1000, message = "Task description must be at most 1000 characters")
    String description,
    String status,
    String priority,
    LocalDate startDate,
    LocalTime startTime,

    @FutureOrPresent(message = "Due date cannot be in the past")
    LocalDate dueDate,
    LocalTime dueTime,
    Long focusSeconds,
    Map<String, Long> focusLog,
    Long shortBreakSeconds,
    Map<String, Long> shortBreakLog,
    Long longBreakSeconds,
    Map<String, Long> longBreakLog
) {
}

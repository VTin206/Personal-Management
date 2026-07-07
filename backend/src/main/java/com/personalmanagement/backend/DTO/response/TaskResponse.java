package com.personalmanagement.backend.DTO.response;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

import com.personalmanagement.backend.Entity.Task;
import com.personalmanagement.backend.Entity.TaskPriority;
import com.personalmanagement.backend.Entity.TaskStatus;

public record TaskResponse(
    Long id,
    String userId,
    String title,
    String description,
    TaskStatus status,
    TaskPriority priority,
    LocalDate startDate,
    LocalTime startTime,
    LocalDate dueDate,
    LocalTime dueTime,
    Long focusSeconds,
    Long shortBreakSeconds,
    Long longBreakSeconds,
    Instant createdAt,
    Instant updatedAt,
    Instant completedAt
) {
    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getUserId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getStartDate(),
                task.getStartTime(),
                task.getDueDate(),
                task.getDueTime(),
                task.getFocusSeconds(),
                task.getShortBreakSeconds(),
                task.getLongBreakSeconds(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getCompletedAt());
    }
}

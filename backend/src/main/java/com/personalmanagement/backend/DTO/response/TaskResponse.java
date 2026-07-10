package com.personalmanagement.backend.DTO.response;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import com.personalmanagement.backend.Entity.Task;
import com.personalmanagement.backend.Entity.TaskPriority;
import com.personalmanagement.backend.Entity.TaskStatus;

public record TaskResponse(
    String id,
    String userId,
    String title,
    String description,
    String status,
    String priority,
    LocalDate startDate,
    String startTime,
    LocalDate dueDate,
    String dueTime,
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
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId() == null ? null : task.getId().toString(),
                task.getUserId(),
                task.getTitle(),
                task.getDescription(),
                statusValue(task.getStatus()),
                priorityValue(task.getPriority()),
                task.getStartDate(),
                formatTime(task.getStartTime()),
                task.getDueDate(),
                formatTime(task.getDueTime()),
                task.getFocusSeconds(),
                task.getFocusLog(),
                task.getShortBreakSeconds(),
                task.getShortBreakLog(),
                task.getLongBreakSeconds(),
                task.getLongBreakLog(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getCompletedAt());
    }

    private static String statusValue(TaskStatus status) {
        return status == null ? TaskStatus.TODO.getValue() : status.getValue();
    }

    private static String priorityValue(TaskPriority priority) {
        return priority == null ? TaskPriority.MEDIUM.getValue() : priority.getValue();
    }

    private static String formatTime(LocalTime time) {
        return time == null ? null : time.format(TIME_FORMATTER);
    }
}

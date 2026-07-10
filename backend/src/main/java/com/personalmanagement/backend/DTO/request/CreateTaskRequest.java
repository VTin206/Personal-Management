package com.personalmanagement.backend.DTO.request;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTaskRequest(
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
    @AssertTrue(message = "Due date must be on or after start date")
    public boolean isDueDateValid() {
        if (startDate == null || dueDate == null) {
            return true;
        }

        return !dueDate.isBefore(startDate);
    }

    @AssertTrue(message = "Due time must be after start time")
    public boolean isDueTimeValid() {
        if (startDate == null || dueDate == null || startTime == null || dueTime == null) {
            return true;
        }

        if (!startDate.equals(dueDate)) {
            return true;
        }

        return dueTime.isAfter(startTime);
    }
}

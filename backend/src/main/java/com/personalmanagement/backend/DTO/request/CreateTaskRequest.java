package com.personalmanagement.backend.DTO.request;

import java.time.LocalDate;
import java.time.LocalTime;

import com.personalmanagement.backend.Entity.TaskPriority;
import com.personalmanagement.backend.Entity.TaskStatus;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTaskRequest(
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
       @AssertTrue(message = "Hạn chót phải sau hoặc bằng ngày bắt đầu")
    public boolean isDueDateValid() {
        if (startDate == null || dueDate == null) {
            return true;
        }

        return !dueDate.isBefore(startDate);
    }

    @AssertTrue(message = "Nếu cùng ngày, giờ hạn chót phải sau giờ bắt đầu")
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

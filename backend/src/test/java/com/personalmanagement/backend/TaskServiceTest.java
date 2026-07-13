package com.personalmanagement.backend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;

import com.personalmanagement.backend.DTO.request.CreateTaskRequest;
import com.personalmanagement.backend.DTO.request.ImportTaskRequest;
import com.personalmanagement.backend.DTO.request.UpdateTaskRequest;
import com.personalmanagement.backend.Entity.Task;
import com.personalmanagement.backend.Entity.TaskPriority;
import com.personalmanagement.backend.Entity.TaskStatus;
import com.personalmanagement.backend.Repository.TaskRepository;
import com.personalmanagement.backend.Service.TaskService;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {
    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void createTask_shouldMapFrontendTaskContract() {
        LocalDate today = LocalDate.now();
        CreateTaskRequest request = new CreateTaskRequest(
                " Hoc Spring Boot ",
                "Backend task",
                "in-progress",
                "high",
                today,
                LocalTime.of(8, 30),
                today.plusDays(1),
                LocalTime.of(23, 59),
                120L,
                Map.of("2026-07-07", 120L),
                30L,
                Map.of("2026-07-07", 30L),
                60L,
                Map.of("2026-07-07", 60L));

        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task task = taskService.createTask(" user-123 ", request);

        assertThat(task.getUserId()).isEqualTo("user-123");
        assertThat(task.getTitle()).isEqualTo("Hoc Spring Boot");
        assertThat(task.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        assertThat(task.getPriority()).isEqualTo(TaskPriority.HIGH);
        assertThat(task.getFocusSeconds()).isEqualTo(120L);
        assertThat(task.getFocusLog()).containsEntry("2026-07-07", 120L);
        assertThat(task.getShortBreakSeconds()).isEqualTo(30L);
        assertThat(task.getShortBreakLog()).containsEntry("2026-07-07", 30L);
        assertThat(task.getLongBreakSeconds()).isEqualTo(60L);
        assertThat(task.getLongBreakLog()).containsEntry("2026-07-07", 60L);
    }

    @Test
    void updateTask_shouldApplyFrontendPartialSessionUpdates() {
        Task task = new Task();
        task.setId(1L);
        task.setUserId("user-123");
        task.setTitle("Hoc Spring Boot");
        task.setStatus(TaskStatus.TODO);
        task.setPriority(TaskPriority.MEDIUM);

        UpdateTaskRequest request = new UpdateTaskRequest(
                null,
                null,
                "completed",
                null,
                null,
                null,
                null,
                null,
                180L,
                Map.of("2026-07-07", 180L),
                45L,
                Map.of("2026-07-07", 45L),
                null,
                null);

        when(taskRepository.findByIdAndUserId(1L, "user-123")).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task updatedTask = taskService.updateTask("user-123", 1L, request);

        assertThat(updatedTask.getStatus()).isEqualTo(TaskStatus.COMPLETED);
        assertThat(updatedTask.getPriority()).isEqualTo(TaskPriority.MEDIUM);
        assertThat(updatedTask.getFocusSeconds()).isEqualTo(180L);
        assertThat(updatedTask.getFocusLog()).containsEntry("2026-07-07", 180L);
        assertThat(updatedTask.getShortBreakSeconds()).isEqualTo(45L);
        assertThat(updatedTask.getShortBreakLog()).containsEntry("2026-07-07", 45L);
        assertThat(updatedTask.getLongBreakSeconds()).isEqualTo(0L);
        assertThat(updatedTask.getLongBreakLog()).isEmpty();
    }

    @Test
    void importTasks_shouldPreserveLegacyDataAndAllowPastDueDate() {
        Instant createdAt = Instant.parse("2025-01-01T01:00:00Z");
        Instant updatedAt = Instant.parse("2025-01-02T01:00:00Z");
        Instant completedAt = Instant.parse("2025-01-02T02:00:00Z");
        ImportTaskRequest request = new ImportTaskRequest(
                " firestore-task-1 ",
                " Legacy task ",
                "Imported from Firestore",
                "completed",
                "high",
                LocalDate.of(2024, 12, 31),
                LocalTime.of(8, 0),
                LocalDate.of(2025, 1, 1),
                LocalTime.of(17, 0),
                300L,
                Map.of("2025-01-01", 300L),
                60L,
                Map.of("2025-01-01", 60L),
                120L,
                Map.of("2025-01-01", 120L),
                createdAt,
                updatedAt,
                completedAt);
        when(taskRepository.existsByUserIdAndLegacyId("user-123", "firestore-task-1")).thenReturn(false);

        taskService.importTasks(" user-123 ", List.of(request));

        ArgumentCaptor<Task> taskCaptor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(taskCaptor.capture());
        Task importedTask = taskCaptor.getValue();
        assertThat(importedTask.getUserId()).isEqualTo("user-123");
        assertThat(importedTask.getLegacyId()).isEqualTo("firestore-task-1");
        assertThat(importedTask.getTitle()).isEqualTo("Legacy task");
        assertThat(importedTask.getStatus()).isEqualTo(TaskStatus.COMPLETED);
        assertThat(importedTask.getDueDate()).isEqualTo(LocalDate.of(2025, 1, 1));
        assertThat(importedTask.getCreatedAt()).isEqualTo(createdAt);
        assertThat(importedTask.getUpdatedAt()).isEqualTo(updatedAt);
        assertThat(importedTask.getCompletedAt()).isEqualTo(completedAt);
    }

    @Test
    void importTasks_shouldSkipExistingLegacyTask() {
        ImportTaskRequest request = new ImportTaskRequest(
                "firestore-task-1", "Legacy task", null, null, null,
                null, null, null, null,
                null, null, null, null, null, null,
                null, null, null);
        when(taskRepository.existsByUserIdAndLegacyId("user-123", "firestore-task-1")).thenReturn(true);

        taskService.importTasks("user-123", List.of(request));

        verify(taskRepository, never()).save(any(Task.class));
        verify(taskRepository).existsByUserIdAndLegacyId(eq("user-123"), eq("firestore-task-1"));
    }
}

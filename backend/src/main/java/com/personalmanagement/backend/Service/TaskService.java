package com.personalmanagement.backend.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.personalmanagement.backend.DTO.request.CreateTaskRequest;
import com.personalmanagement.backend.DTO.request.ImportTaskRequest;
import com.personalmanagement.backend.DTO.request.UpdateTaskRequest;
import com.personalmanagement.backend.Entity.Task;
import com.personalmanagement.backend.Entity.TaskPriority;
import com.personalmanagement.backend.Entity.TaskStatus;
import com.personalmanagement.backend.Repository.TaskRepository;

@Service
public class TaskService {
    private static final int MAX_TITLE_LENGTH = 200;
    private static final int MAX_DESCRIPTION_LENGTH = 1000;

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks(String userId) {
        return taskRepository.findByUserIdOrderByCreatedAtDesc(requireUserId(userId));
    }

    public Task getTaskById(String userId, Long id) {
        return taskRepository.findByIdAndUserId(id, requireUserId(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
    }

    public Task createTask(String userId, CreateTaskRequest request) {
        validateDueDateNotPast(request.dueDate());
        validateSchedule(request.startDate(), request.startTime(), request.dueDate(), request.dueTime());

        Task task = toTaskEntity(request);
        task.setUserId(requireUserId(userId));
        return taskRepository.save(task);
    }

    public Task updateTask(String userId, Long id, UpdateTaskRequest request) {
        Task task = getTaskById(userId, id);
        validateUpdateRequest(task, request);

        if (request.title() != null) {
            task.setTitle(requireTitle(request.title()));
        }

        if (request.description() != null) {
            task.setDescription(validateDescription(request.description()));
        }

        if (request.status() != null) {
            task.setStatus(TaskStatus.fromValue(request.status()));
        }

        if (request.priority() != null) {
            task.setPriority(TaskPriority.fromValue(request.priority()));
        }

        if (request.startDate() != null) {
            task.setStartDate(request.startDate());
        }

        if (request.startTime() != null) {
            task.setStartTime(request.startTime());
        }

        if (request.dueDate() != null) {
            task.setDueDate(request.dueDate());
        }

        if (request.dueTime() != null) {
            task.setDueTime(request.dueTime());
        }

        applySessionUpdates(task, request);

        return taskRepository.save(task);
    }

    public void deleteTask(String userId, Long id) {
        Task task = getTaskById(userId, id);
        taskRepository.delete(task);
    }

    @Transactional
    public void importTasks(String userId, List<ImportTaskRequest> requests) {
        String normalizedUserId = requireUserId(userId);

        for (ImportTaskRequest request : requests) {
            String legacyId = requireLegacyId(request.legacyId());
            if (taskRepository.existsByUserIdAndLegacyId(normalizedUserId, legacyId)) {
                continue;
            }

            validateSchedule(request.startDate(), request.startTime(), request.dueDate(), request.dueTime());

            Task task = toImportedTask(request);
            task.setUserId(normalizedUserId);
            task.setLegacyId(legacyId);
            taskRepository.save(task);
        }
    }

    private Task toTaskEntity(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(requireTitle(request.title()));
        task.setDescription(validateDescription(request.description()));
        task.setStatus(request.status() == null ? TaskStatus.TODO : TaskStatus.fromValue(request.status()));
        task.setPriority(request.priority() == null ? TaskPriority.MEDIUM : TaskPriority.fromValue(request.priority()));
        task.setStartDate(request.startDate());
        task.setStartTime(request.startTime());
        task.setDueDate(request.dueDate());
        task.setDueTime(request.dueTime());
        task.setFocusSeconds(defaultSeconds(request.focusSeconds(), "focusSeconds"));
        task.setFocusLog(validateLog(request.focusLog(), "focusLog"));
        task.setShortBreakSeconds(defaultSeconds(request.shortBreakSeconds(), "shortBreakSeconds"));
        task.setShortBreakLog(validateLog(request.shortBreakLog(), "shortBreakLog"));
        task.setLongBreakSeconds(defaultSeconds(request.longBreakSeconds(), "longBreakSeconds"));
        task.setLongBreakLog(validateLog(request.longBreakLog(), "longBreakLog"));

        return task;
    }

    private Task toImportedTask(ImportTaskRequest request) {
        Task task = new Task();
        task.setTitle(requireTitle(request.title()));
        task.setDescription(validateDescription(request.description()));
        task.setStatus(request.status() == null ? TaskStatus.TODO : TaskStatus.fromValue(request.status()));
        task.setPriority(request.priority() == null ? TaskPriority.MEDIUM : TaskPriority.fromValue(request.priority()));
        task.setStartDate(request.startDate());
        task.setStartTime(request.startTime());
        task.setDueDate(request.dueDate());
        task.setDueTime(request.dueTime());
        task.setFocusSeconds(defaultSeconds(request.focusSeconds(), "focusSeconds"));
        task.setFocusLog(validateLog(request.focusLog(), "focusLog"));
        task.setShortBreakSeconds(defaultSeconds(request.shortBreakSeconds(), "shortBreakSeconds"));
        task.setShortBreakLog(validateLog(request.shortBreakLog(), "shortBreakLog"));
        task.setLongBreakSeconds(defaultSeconds(request.longBreakSeconds(), "longBreakSeconds"));
        task.setLongBreakLog(validateLog(request.longBreakLog(), "longBreakLog"));
        task.setCreatedAt(request.createdAt());
        task.setUpdatedAt(request.updatedAt());
        task.setCompletedAt(request.completedAt());
        return task;
    }

    private String requireUserId(String userId) {
        if (!StringUtils.hasText(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "X-User-Id header is required");
        }

        return userId.trim();
    }

    private String requireLegacyId(String legacyId) {
        if (!StringUtils.hasText(legacyId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Legacy task ID is required");
        }

        String normalized = legacyId.trim();
        if (normalized.length() > 128) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Legacy task ID must be at most 128 characters");
        }

        return normalized;
    }

    private String requireTitle(String title) {
        if (!StringUtils.hasText(title)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task title is required");
        }

        String normalized = title.trim();
        if (normalized.length() > MAX_TITLE_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task title must be at most 200 characters");
        }

        return normalized;
    }

    private String validateDescription(String description) {
        if (description != null && description.length() > MAX_DESCRIPTION_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Task description must be at most 1000 characters");
        }

        return description;
    }

    private void validateUpdateRequest(Task task, UpdateTaskRequest request) {
        validateDueDateNotPast(request.dueDate());

        boolean scheduleChanged = request.startDate() != null
                || request.startTime() != null
                || request.dueDate() != null
                || request.dueTime() != null;

        if (!scheduleChanged) {
            return;
        }

        LocalDate startDate = request.startDate() != null ? request.startDate() : task.getStartDate();
        LocalTime startTime = request.startTime() != null ? request.startTime() : task.getStartTime();
        LocalDate dueDate = request.dueDate() != null ? request.dueDate() : task.getDueDate();
        LocalTime dueTime = request.dueTime() != null ? request.dueTime() : task.getDueTime();

        validateSchedule(startDate, startTime, dueDate, dueTime);
    }

    private void validateDueDateNotPast(LocalDate dueDate) {
        if (dueDate != null && dueDate.isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Due date cannot be in the past");
        }
    }

    private void validateSchedule(LocalDate startDate, LocalTime startTime, LocalDate dueDate, LocalTime dueTime) {
        if (startDate == null || dueDate == null) {
            return;
        }

        if (dueDate.isBefore(startDate)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Due date must be on or after start date");
        }

        if (startDate.equals(dueDate) && startTime != null && dueTime != null && !dueTime.isAfter(startTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Due time must be after start time");
        }
    }

    private void applySessionUpdates(Task task, UpdateTaskRequest request) {
        if (request.focusSeconds() != null) {
            task.setFocusSeconds(validateSeconds(request.focusSeconds(), "focusSeconds"));
        }

        if (request.focusLog() != null) {
            task.setFocusLog(validateLog(request.focusLog(), "focusLog"));
        }

        if (request.shortBreakSeconds() != null) {
            task.setShortBreakSeconds(validateSeconds(request.shortBreakSeconds(), "shortBreakSeconds"));
        }

        if (request.shortBreakLog() != null) {
            task.setShortBreakLog(validateLog(request.shortBreakLog(), "shortBreakLog"));
        }

        if (request.longBreakSeconds() != null) {
            task.setLongBreakSeconds(validateSeconds(request.longBreakSeconds(), "longBreakSeconds"));
        }

        if (request.longBreakLog() != null) {
            task.setLongBreakLog(validateLog(request.longBreakLog(), "longBreakLog"));
        }
    }

    private Long defaultSeconds(Long seconds, String fieldName) {
        if (seconds == null) {
            return 0L;
        }

        return validateSeconds(seconds, fieldName);
    }

    private Long validateSeconds(Long seconds, String fieldName) {
        if (seconds < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " must be greater than or equal to 0");
        }

        return seconds;
    }

    private Map<String, Long> validateLog(Map<String, Long> log, String fieldName) {
        if (log == null) {
            return Map.of();
        }

        log.forEach((date, seconds) -> {
            if (!StringUtils.hasText(date)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " contains an empty date key");
            }

            if (seconds == null || seconds < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        fieldName + " values must be greater than or equal to 0");
            }
        });

        return log;
    }
}

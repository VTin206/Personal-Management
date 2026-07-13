package com.personalmanagement.backend.Entity;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "tasks",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_tasks_user_legacy_id",
                columnNames = {"user_id", "legacy_id"}))
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "legacy_id", length = 128)
    private String legacyId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    private TaskPriority priority;

    private LocalDate startDate;
    private LocalTime startTime;

    private LocalDate dueDate;
    private LocalTime dueTime;

    private Long focusSeconds = 0L;
    private Long shortBreakSeconds = 0L;
    private Long longBreakSeconds = 0L;

    @ElementCollection
    @CollectionTable(name = "task_focus_log", joinColumns = @JoinColumn(name = "task_id"))
    @MapKeyColumn(name = "log_date")
    @Column(name = "seconds", nullable = false)
    private Map<String, Long> focusLog = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "task_short_break_log", joinColumns = @JoinColumn(name = "task_id"))
    @MapKeyColumn(name = "log_date")
    @Column(name = "seconds", nullable = false)
    private Map<String, Long> shortBreakLog = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "task_long_break_log", joinColumns = @JoinColumn(name = "task_id"))
    @MapKeyColumn(name = "log_date")
    @Column(name = "seconds", nullable = false)
    private Map<String, Long> longBreakLog = new HashMap<>();

    private Instant createdAt;
    private Instant updatedAt;
    private Instant completedAt;

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public String getLegacyId() {
        return legacyId;
    }

    public void setLegacyId(String legacyId) {
        this.legacyId = legacyId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalTime getDueTime() {
        return dueTime;
    }

    public void setDueTime(LocalTime dueTime) {
        this.dueTime = dueTime;
    }

    public Long getFocusSeconds() {
        return focusSeconds;
    }

    public void setFocusSeconds(Long focusSeconds) {
        this.focusSeconds = focusSeconds;
    }

    public Map<String, Long> getFocusLog() {
        return focusLog;
    }

    public void setFocusLog(Map<String, Long> focusLog) {
        this.focusLog = normalizeLog(focusLog);
    }

    public Long getShortBreakSeconds() {
        return shortBreakSeconds;
    }

    public void setShortBreakSeconds(Long shortBreakSeconds) {
        this.shortBreakSeconds = shortBreakSeconds;
    }

    public Map<String, Long> getShortBreakLog() {
        return shortBreakLog;
    }

    public void setShortBreakLog(Map<String, Long> shortBreakLog) {
        this.shortBreakLog = normalizeLog(shortBreakLog);
    }

    public Long getLongBreakSeconds() {
        return longBreakSeconds;
    }

    public void setLongBreakSeconds(Long longBreakSeconds) {
        this.longBreakSeconds = longBreakSeconds;
    }

    public Map<String, Long> getLongBreakLog() {
        return longBreakLog;
    }

    public void setLongBreakLog(Map<String, Long> longBreakLog) {
        this.longBreakLog = normalizeLog(longBreakLog);
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    @PrePersist
    public void onCreate() {
        Instant now = Instant.now();
        applyDefaults();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
        syncCompletedAt(now);
    }

    @PreUpdate
    public void onUpdate() {
        applyDefaults();
        updatedAt = Instant.now();
        syncCompletedAt(updatedAt);
    }

    private void applyDefaults() {
        if (status == null) {
            status = TaskStatus.TODO;
        }

        if (priority == null) {
            priority = TaskPriority.MEDIUM;
        }

        if (focusSeconds == null || focusSeconds < 0) {
            focusSeconds = 0L;
        }

        if (shortBreakSeconds == null || shortBreakSeconds < 0) {
            shortBreakSeconds = 0L;
        }

        if (longBreakSeconds == null || longBreakSeconds < 0) {
            longBreakSeconds = 0L;
        }

        if (focusLog == null) {
            focusLog = new HashMap<>();
        }

        if (shortBreakLog == null) {
            shortBreakLog = new HashMap<>();
        }

        if (longBreakLog == null) {
            longBreakLog = new HashMap<>();
        }
    }

    private void syncCompletedAt(Instant now) {
        if (status == TaskStatus.COMPLETED) {
            if (completedAt == null) {
                completedAt = now;
            }
            return;
        }

        completedAt = null;
    }

    private Map<String, Long> normalizeLog(Map<String, Long> log) {
        Map<String, Long> nextLog = new HashMap<>();
        if (log == null) {
            return nextLog;
        }

        log.forEach((date, seconds) -> {
            if (date != null && !date.isBlank() && seconds != null) {
                nextLog.put(date, Math.max(0L, seconds));
            }
        });

        return nextLog;
    }
}

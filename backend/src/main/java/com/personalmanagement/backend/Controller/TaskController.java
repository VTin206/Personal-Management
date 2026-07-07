package com.personalmanagement.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.personalmanagement.backend.DTO.request.CreateTaskRequest;
import com.personalmanagement.backend.DTO.request.UpdateTaskRequest;
import com.personalmanagement.backend.DTO.response.TaskResponse;
import com.personalmanagement.backend.Service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private static final String USER_ID_HEADER = "X-User-Id";

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(@RequestHeader(USER_ID_HEADER) String userId) {
        return ResponseEntity.ok(taskService.getAllTasks(userId).stream()
                .map(TaskResponse::from)
                .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            @RequestHeader(USER_ID_HEADER) String userId,
            @PathVariable Long id) {
        return ResponseEntity.ok(TaskResponse.from(taskService.getTaskById(userId, id)));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @RequestHeader(USER_ID_HEADER) String userId,
            @Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.status(201).body(TaskResponse.from(taskService.createTask(userId, request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @RequestHeader(USER_ID_HEADER) String userId,
            @PathVariable Long id,
            @RequestBody UpdateTaskRequest request) {
        return ResponseEntity.ok(TaskResponse.from(taskService.updateTask(userId, id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @RequestHeader(USER_ID_HEADER) String userId,
            @PathVariable Long id) {
        taskService.deleteTask(userId, id);
        return ResponseEntity.noContent().build();
    }
}

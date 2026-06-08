package com.personalmanagement.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.personalmanagement.backend.DTO.request.CreateTaskRequest;
import com.personalmanagement.backend.DTO.request.UpdateTaskRequest;
import com.personalmanagement.backend.Entity.Task;
import com.personalmanagement.backend.Repository.TaskRepository;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task Not Found"));
    }

    public Task createTask(CreateTaskRequest request) {
        return taskRepository.save(toTaskEntity(request));
    }

    public Task updateTask(Long id, UpdateTaskRequest request) {
        Task task = getTaskById(id);
        if (request.title() != null) {
            task.setTitle(request.title());
        }

        if (request.description() != null) {
            task.setDescription(request.description());
        }

        if (request.status() != null) {
            task.setStatus(request.status());
        }

        if (request.priority() != null) {
            task.setPriority(request.priority());
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

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }

    private Task toTaskEntity(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setStartDate(request.startDate());
        task.setStartTime(request.startTime());
        task.setDueDate(request.dueDate());
        task.setDueTime(request.dueTime());

        return task;
    }
}

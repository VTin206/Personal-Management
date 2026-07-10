package com.personalmanagement.backend;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.personalmanagement.backend.DTO.request.CreateTaskRequest;
import com.personalmanagement.backend.DTO.request.UpdateTaskRequest;
import com.personalmanagement.backend.Controller.TaskController;
import com.personalmanagement.backend.Entity.Task;
import com.personalmanagement.backend.Entity.TaskPriority;
import com.personalmanagement.backend.Entity.TaskStatus;
import com.personalmanagement.backend.Service.TaskService;

@WebMvcTest(TaskController.class)
class TaskControllerTest {
    private static final String USER_ID = "user-123";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @Test
    void getAllTasks_shouldReturnOk() throws Exception {
        when(taskService.getAllTasks(USER_ID)).thenReturn(List.of());

        mockMvc.perform(get("/api/tasks").header("X-User-Id", USER_ID))
                .andExpect(status().isOk());
    }

    @Test
    void getAllTasks_shouldReturnBadRequestWhenUserHeaderMissing() throws Exception {
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("X-User-Id header is required"));
    }

    @Test
    void getTaskById_shouldReturnOk() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setUserId(USER_ID);
        task.setTitle("Hoc Spring Boot");
        task.setStatus(TaskStatus.TODO);
        task.setPriority(TaskPriority.MEDIUM);

        when(taskService.getTaskById(USER_ID, 1L)).thenReturn(task);

        mockMvc.perform(get("/api/tasks/1").header("X-User-Id", USER_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.userId").value(USER_ID))
                .andExpect(jsonPath("$.title").value("Hoc Spring Boot"))
                .andExpect(jsonPath("$.status").value("todo"))
                .andExpect(jsonPath("$.priority").value("medium"))
                .andExpect(jsonPath("$.focusLog").isMap())
                .andExpect(jsonPath("$.shortBreakLog").isMap())
                .andExpect(jsonPath("$.longBreakLog").isMap());
    }

    @Test
    void createTask_shouldReturnCreated() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setUserId(USER_ID);
        task.setTitle("Hoc Spring Boot");
        task.setStatus(TaskStatus.TODO);
        task.setPriority(TaskPriority.MEDIUM);

        when(taskService.createTask(eq(USER_ID), any(CreateTaskRequest.class))).thenReturn(task);

        mockMvc.perform(post("/api/tasks")
                .header("X-User-Id", USER_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "title": "Hoc Spring Boot",
                          "status": "todo",
                          "priority": "medium",
                          "focusSeconds": 0,
                          "focusLog": {},
                          "shortBreakSeconds": 0,
                          "shortBreakLog": {},
                          "longBreakSeconds": 0,
                          "longBreakLog": {}
                        }
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Hoc Spring Boot"))
                .andExpect(jsonPath("$.status").value("todo"))
                .andExpect(jsonPath("$.priority").value("medium"));
    }

    @Test
    void updateTask_shouldReturnOk() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setUserId(USER_ID);
        task.setTitle("Hoc Spring Boot");
        task.setStatus(TaskStatus.IN_PROGRESS);
        task.setPriority(TaskPriority.HIGH);
        task.setFocusSeconds(180L);
        task.setFocusLog(Map.of("2026-07-07", 180L));

        when(taskService.updateTask(eq(USER_ID), eq(1L), any(UpdateTaskRequest.class))).thenReturn(task);

        mockMvc.perform(put("/api/tasks/1")
                .header("X-User-Id", USER_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "status": "in-progress",
                          "priority": "high",
                          "focusSeconds": 180,
                          "focusLog": {
                            "2026-07-07": 180
                          }
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("in-progress"))
                .andExpect(jsonPath("$.priority").value("high"))
                .andExpect(jsonPath("$.focusSeconds").value(180))
                .andExpect(jsonPath("$.focusLog.2026-07-07").value(180));
    }

    @Test
    void patchTask_shouldReturnOk() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setUserId(USER_ID);
        task.setTitle("Hoc Spring Boot");
        task.setStatus(TaskStatus.COMPLETED);
        task.setPriority(TaskPriority.MEDIUM);

        when(taskService.updateTask(eq(USER_ID), eq(1L), any(UpdateTaskRequest.class))).thenReturn(task);

        mockMvc.perform(patch("/api/tasks/1")
                .header("X-User-Id", USER_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "status": "completed"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("completed"));
    }

    @Test
    void deleteTask_shouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/tasks/1").header("X-User-Id", USER_ID))
                .andExpect(status().isNoContent());

        verify(taskService).deleteTask(USER_ID, 1L);
    }
}

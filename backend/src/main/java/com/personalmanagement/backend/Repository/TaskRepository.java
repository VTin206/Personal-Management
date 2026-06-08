package com.personalmanagement.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.personalmanagement.backend.Entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

}

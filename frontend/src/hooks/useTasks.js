import { useCallback, useEffect, useState } from 'react'

import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  getTasks as getTasksService,
  updateTask as updateTaskService,
} from '@/services/taskService'
import { useAuth } from '@/hooks/useAuth'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'

export function useTasks() {
  const { user } = useAuth()
  const userId = user?.uid
  const [tasks, setTasks] = useState([])
  const [loadedUserId, setLoadedUserId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) return undefined

    let active = true

    getTasksService()
      .then((nextTasks) => {
        if (!active) return
        setTasks(nextTasks)
        setError('')
      })
      .catch((requestError) => {
        if (!active) return
        setTasks([])
        setError(getFirebaseErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoadedUserId(userId)
      })

    return () => {
      active = false
    }
  }, [userId])

  const createTask = useCallback(
    (task) => {
      if (!userId) {
        throw new Error('Bạn cần đăng nhập để tạo task.')
      }

      return createTaskService(task).then((createdTask) => {
        setTasks((currentTasks) => [createdTask, ...currentTasks])
        return createdTask
      })
    },
    [userId],
  )

  const updateTask = useCallback((taskId, updates) => updateTaskService(taskId, updates).then((updatedTask) => {
    setTasks((currentTasks) => currentTasks.map((task) => (task.id === taskId ? updatedTask : task)))
    return updatedTask
  }), [])

  const deleteTask = useCallback((taskId) => deleteTaskService(taskId).then(() => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }), [])

  return {
    tasks: loadedUserId === userId ? tasks : [],
    loading: Boolean(userId) && loadedUserId !== userId,
    error: loadedUserId === userId ? error : '',
    createTask,
    updateTask,
    deleteTask,
  }
}

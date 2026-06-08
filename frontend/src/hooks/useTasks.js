import { useCallback, useEffect, useState } from 'react'

import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  listenToUserTasks,
  updateTask as updateTaskService,
} from '@/services/taskService'
import { useAuth } from '@/hooks/useAuth'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'

export function useTasks() {
  const { user } = useAuth()
  const userId = user?.uid
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(Boolean(userId))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) return undefined

    const unsubscribe = listenToUserTasks(
      userId,
      (nextTasks) => {
        setTasks(nextTasks)
        setLoading(false)
        setError('')
      },
      (snapshotError) => {
        setError(getFirebaseErrorMessage(snapshotError))
        setLoading(false)
      },
    )

    return unsubscribe
  }, [userId])

  const createTask = useCallback(
    (task) => {
      if (!userId) {
        throw new Error('Bạn cần đăng nhập để tạo task.')
      }

      return createTaskService(userId, task)
    },
    [userId],
  )

  const updateTask = useCallback((taskId, updates) => updateTaskService(taskId, updates), [])
  const deleteTask = useCallback((taskId) => deleteTaskService(taskId), [])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  }
}

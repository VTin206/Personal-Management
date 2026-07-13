import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TaskContext } from '@/contexts/task-context'
import { useAuth } from '@/hooks/useAuth'
import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  getTasks as getTasksService,
  updateTask as updateTaskService,
} from '@/services/taskService'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'

export function TaskProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.uid
  const currentUserIdRef = useRef(userId)
  const [tasks, setTasks] = useState([])
  const [loadedUserId, setLoadedUserId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    currentUserIdRef.current = userId
  }, [userId])

  useEffect(() => {
    if (!userId) return undefined

    let active = true

    getTasksService()
      .then((nextTasks) => {
        if (!active || currentUserIdRef.current !== userId) return
        setTasks(nextTasks)
        setError('')
      })
      .catch((requestError) => {
        if (!active || currentUserIdRef.current !== userId) return
        setTasks([])
        setError(getFirebaseErrorMessage(requestError))
      })
      .finally(() => {
        if (active && currentUserIdRef.current === userId) setLoadedUserId(userId)
      })

    return () => {
      active = false
    }
  }, [userId])

  const createTask = useCallback(async (task) => {
    const requestUserId = currentUserIdRef.current
    if (!requestUserId) {
      throw new Error('Ban can dang nhap de tao task.')
    }

    const createdTask = await createTaskService(task)
    if (currentUserIdRef.current === requestUserId) {
      setTasks((currentTasks) => [createdTask, ...currentTasks])
      setError('')
    }
    return createdTask
  }, [])

  const updateTask = useCallback(async (taskId, updates) => {
    const requestUserId = currentUserIdRef.current
    const updatedTask = await updateTaskService(taskId, updates)
    if (currentUserIdRef.current === requestUserId) {
      setTasks((currentTasks) => currentTasks.map((task) => (task.id === taskId ? updatedTask : task)))
      setError('')
    }
    return updatedTask
  }, [])

  const deleteTask = useCallback(async (taskId) => {
    const requestUserId = currentUserIdRef.current
    await deleteTaskService(taskId)
    if (currentUserIdRef.current === requestUserId) {
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
      setError('')
    }
  }, [])

  const value = useMemo(() => ({
    tasks: loadedUserId === userId ? tasks : [],
    loading: Boolean(userId) && loadedUserId !== userId,
    error: loadedUserId === userId ? error : '',
    createTask,
    updateTask,
    deleteTask,
  }), [createTask, deleteTask, error, loadedUserId, tasks, updateTask, userId])

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

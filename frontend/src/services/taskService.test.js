import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getDocs: vi.fn(),
  getIdToken: vi.fn(),
}))

vi.mock('@/config/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'user-123',
      getIdToken: mocks.getIdToken,
    },
  },
  db: { name: 'firestore' },
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ name: 'tasks' })),
  getDocs: mocks.getDocs,
  query: vi.fn((...parts) => parts),
  where: vi.fn(() => ({ field: 'userId' })),
}))

function jsonResponse(payload, status = 200) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => 'application/json' },
    json: async () => payload,
  }
}

function noContentResponse() {
  return {
    status: 204,
    ok: true,
    headers: { get: () => null },
  }
}

describe('taskService', () => {
  let taskService
  let storage

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    storage = new Map()
    vi.stubGlobal('localStorage', {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    })
    mocks.getIdToken.mockResolvedValue('firebase-id-token')
    mocks.getDocs.mockResolvedValue({ docs: [] })
    taskService = await import('@/services/taskService')
  })

  it('loads tasks with a Firebase bearer token and runs migration once', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse([{ id: '1', title: 'Task 1' }]))
      .mockResolvedValueOnce(jsonResponse([{ id: '1', title: 'Task 1' }]))
    vi.stubGlobal('fetch', fetchMock)

    await taskService.getTasks()
    await taskService.getTasks()

    expect(mocks.getDocs).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/tasks')
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer firebase-id-token')
  })

  it('imports legacy Firestore tasks before loading the API list', async () => {
    const createdAt = new Date('2025-01-01T01:00:00Z')
    mocks.getDocs.mockResolvedValue({
      docs: [{
        id: 'legacy-task-1',
        data: () => ({
          userId: 'user-123',
          title: 'Legacy task',
          status: 'completed',
          priority: 'high',
          dueDate: '2025-01-01',
          focusSeconds: 300,
          focusLog: { '2025-01-01': 300 },
          createdAt: { toDate: () => createdAt },
          completedAt: { toDate: () => createdAt },
        }),
      }],
    })
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(noContentResponse())
      .mockResolvedValueOnce(jsonResponse([{ id: '7', title: 'Legacy task' }]))
    vi.stubGlobal('fetch', fetchMock)

    const tasks = await taskService.getTasks()

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8080/api/tasks/import')
    const importPayload = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(importPayload[0]).toMatchObject({
      legacyId: 'legacy-task-1',
      title: 'Legacy task',
      dueDate: '2025-01-01',
      createdAt: '2025-01-01T01:00:00.000Z',
    })
    expect(tasks).toHaveLength(1)
    expect(storage.size).toBe(1)
  })

  it('strips server-owned fields from update payloads', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      id: '1',
      userId: 'user-123',
      title: 'Updated task',
    }))
    vi.stubGlobal('fetch', fetchMock)

    await taskService.updateTask('1', {
      id: '1',
      userId: 'another-user',
      title: 'Updated task',
      createdAt: new Date('2025-01-01T01:00:00Z'),
    })

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ title: 'Updated task' })
  })
})

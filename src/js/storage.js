/**
 * Storage Service - Manages LocalStorage persistence for Tasks and Settings
 */

const STORAGE_KEY_TASKS = 'nordic_todo_tasks_v1';
const STORAGE_KEY_SETTINGS = 'nordic_todo_settings_v1';

// Initial default tasks for first-time visitors
const DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Design Nordic UI layout & color system',
    category: 'Work',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'task-2',
    title: '30-minute evening mindful walk in nature',
    category: 'Health',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0], // Today
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'task-3',
    title: 'Plan weekly grocery list & Scandinavian recipes',
    category: 'Personal',
    priority: 'Low',
    dueDate: '',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  theme: 'light'
};

export const Storage = {
  getTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TASKS);
      if (!data) {
        this.saveTasks(DEFAULT_TASKS);
        return DEFAULT_TASKS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read tasks from LocalStorage:', e);
      return DEFAULT_TASKS;
    }
  },

  saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to LocalStorage:', e);
    }
  },

  addTask(taskData) {
    const tasks = this.getTasks();
    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title: taskData.title.trim(),
      category: taskData.category || 'General',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || '',
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
    this.saveTasks(tasks);
    return { tasks, newTask };
  },

  updateTask(id, updates) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.saveTasks(tasks);
    }
    return tasks;
  },

  toggleTask(id) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks(tasks);
    }
    return { tasks, task };
  },

  deleteTask(id) {
    let tasks = this.getTasks();
    const deletedTask = tasks.find(t => t.id === id);
    tasks = tasks.filter(t => t.id !== id);
    this.saveTasks(tasks);
    return { tasks, deletedTask };
  },

  restoreTask(task, originalIndex) {
    const tasks = this.getTasks();
    if (typeof originalIndex === 'number' && originalIndex >= 0 && originalIndex <= tasks.length) {
      tasks.splice(originalIndex, 0, task);
    } else {
      tasks.unshift(task);
    }
    this.saveTasks(tasks);
    return tasks;
  },

  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }
};

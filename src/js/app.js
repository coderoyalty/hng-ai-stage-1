/**
 * Main Application Orchestrator
 */
import { Storage } from './storage.js';
import { AudioFX } from './audio.js';
import { UI } from './ui.js';

class App {
  constructor() {
    this.tasks = [];
    this.currentFilter = 'All';
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.editingTaskId = null;

    this.settings = Storage.getSettings();
    AudioFX.setEnabled(this.settings.soundEnabled);
  }

  init() {
    this.tasks = Storage.getTasks();
    
    this.bindEvents();
    this.updateAudioToggleUI();
    this.render();
  }

  bindEvents() {
    // Sound Toggle
    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        Storage.saveSettings(this.settings);
        AudioFX.setEnabled(this.settings.soundEnabled);
        this.updateAudioToggleUI();
        if (this.settings.soundEnabled) AudioFX.playCheck();
      });
    }

    // Add Task Form
    const addForm = document.getElementById('add-task-form');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddTask();
      });
    }

    // Filter Tabs (All, Active, Completed)
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        filterTabs.forEach(t => t.classList.remove('bg-slate-900', 'text-white'));
        filterTabs.forEach(t => t.classList.add('bg-white/80', 'text-slate-600'));

        e.currentTarget.classList.remove('bg-white/80', 'text-slate-600');
        e.currentTarget.classList.add('bg-slate-900', 'text-white');

        this.currentFilter = e.currentTarget.getAttribute('data-filter');
        AudioFX.playClick();
        this.render();
      });
    });

    // Search Bar Input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.render();
      });
    }

    // Clear Search Button
    const clearSearchBtn = document.getElementById('clear-search');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          this.searchQuery = '';
          this.render();
        }
      });
    }

    // Task List Delegated Events (Check, Edit, Delete)
    const taskList = document.getElementById('task-list');
    if (taskList) {
      taskList.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.getAttribute('data-action');
        const taskId = actionBtn.getAttribute('data-id');

        if (action === 'toggle') {
          this.handleToggleTask(taskId);
        } else if (action === 'edit') {
          this.handleOpenEditModal(taskId);
        } else if (action === 'delete') {
          this.handleDeleteTask(taskId);
        }
      });
    }

    // Modal Form Submit & Cancel
    const editForm = document.getElementById('edit-task-form');
    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveEdit();
      });
    }

    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => {
        this.closeEditModal();
      });
    }

    // Close Modal on Overlay Click or Escape Key
    const modalOverlay = document.getElementById('edit-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) this.closeEditModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeEditModal();
    });
  }

  updateAudioToggleUI() {
    const soundBtn = document.getElementById('sound-toggle');
    if (!soundBtn) return;

    if (this.settings.soundEnabled) {
      soundBtn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4 text-emerald-600"></i><span class="text-xs text-slate-600 font-medium">Sound On</span>`;
    } else {
      soundBtn.innerHTML = `<i data-lucide="volume-x" class="w-4 h-4 text-slate-400"></i><span class="text-xs text-slate-400 font-medium">Sound Off</span>`;
    }
    if (window.lucide) window.lucide.createIcons();
  }

  handleAddTask() {
    const titleInput = document.getElementById('task-title-input');
    const categorySelect = document.getElementById('task-category-select');
    const prioritySelect = document.getElementById('task-priority-select');
    const dueDateInput = document.getElementById('task-date-input');

    const title = titleInput ? titleInput.value : '';
    if (!title.trim()) return;

    const taskData = {
      title: title,
      category: categorySelect ? categorySelect.value : 'General',
      priority: prioritySelect ? prioritySelect.value : 'Medium',
      dueDate: dueDateInput ? dueDateInput.value : ''
    };

    const { tasks } = Storage.addTask(taskData);
    this.tasks = tasks;

    // Reset Form
    if (titleInput) titleInput.value = '';
    if (dueDateInput) dueDateInput.value = '';

    AudioFX.playClick();
    UI.showToast('Task added successfully');
    this.render();
  }

  handleToggleTask(taskId) {
    const { tasks, task } = Storage.toggleTask(taskId);
    this.tasks = tasks;

    if (task) {
      if (task.completed) {
        AudioFX.playCheck();
        // Check if all active tasks in current view are completed or if it was a high priority task
        const activeRemaining = this.tasks.filter(t => !t.completed).length;
        if (activeRemaining === 0 || task.priority === 'High') {
          UI.triggerConfetti();
          AudioFX.playChime();
        }
      } else {
        AudioFX.playUncheck();
      }
    }

    this.render();
  }

  handleDeleteTask(taskId) {
    const originalIndex = this.tasks.findIndex(t => t.id === taskId);
    const { tasks, deletedTask } = Storage.deleteTask(taskId);
    this.tasks = tasks;

    AudioFX.playClick();

    if (deletedTask) {
      UI.showToast(`Task "${deletedTask.title.slice(0, 20)}..." deleted`, () => {
        // Undo callback
        this.tasks = Storage.restoreTask(deletedTask, originalIndex);
        AudioFX.playClick();
        this.render();
      });
    }

    this.render();
  }

  handleOpenEditModal(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    this.editingTaskId = taskId;

    const editTitle = document.getElementById('edit-title-input');
    const editCat = document.getElementById('edit-category-select');
    const editPriority = document.getElementById('edit-priority-select');
    const editDate = document.getElementById('edit-date-input');
    const modal = document.getElementById('edit-modal');

    if (editTitle) editTitle.value = task.title;
    if (editCat) editCat.value = task.category;
    if (editPriority) editPriority.value = task.priority;
    if (editDate) editDate.value = task.dueDate || '';

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    this.editingTaskId = null;
  }

  handleSaveEdit() {
    if (!this.editingTaskId) return;

    const editTitle = document.getElementById('edit-title-input');
    const editCat = document.getElementById('edit-category-select');
    const editPriority = document.getElementById('edit-priority-select');
    const editDate = document.getElementById('edit-date-input');

    const newTitle = editTitle ? editTitle.value.trim() : '';
    if (!newTitle) return;

    const updates = {
      title: newTitle,
      category: editCat ? editCat.value : 'General',
      priority: editPriority ? editPriority.value : 'Medium',
      dueDate: editDate ? editDate.value : ''
    };

    this.tasks = Storage.updateTask(this.editingTaskId, updates);
    this.closeEditModal();
    AudioFX.playClick();
    UI.showToast('Task updated');
    this.render();
  }

  render() {
    UI.renderStats(this.tasks);
    UI.renderCategories(this.tasks, this.currentCategory, (cat) => {
      this.currentCategory = cat;
      AudioFX.playClick();
      this.render();
    });
    UI.renderTasks(this.tasks, this.currentFilter, this.currentCategory, this.searchQuery);
  }
}

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

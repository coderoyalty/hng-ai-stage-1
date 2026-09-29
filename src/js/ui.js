/**
 * UI Renderer Module - Manages DOM rendering, animations, toasts, and confetti
 */

export const UI = {
  // Category badge color mappings
  categoryColors: {
    Work: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    Personal: 'bg-purple-50 text-purple-700 border-purple-200/80',
    Health: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    Finance: 'bg-teal-50 text-teal-700 border-teal-200/80',
    Ideas: 'bg-amber-50 text-amber-700 border-amber-200/80',
    General: 'bg-slate-100 text-slate-600 border-slate-200'
  },

  // Priority badge styling
  priorityColors: {
    High: 'bg-rose-50 text-rose-700 border-rose-200/80 icon-rose',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200/80 icon-amber',
    Low: 'bg-slate-100 text-slate-600 border-slate-200 icon-slate'
  },

  renderStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const statsText = document.getElementById('stats-text');
    const progressBar = document.getElementById('progress-bar');
    const statsPercent = document.getElementById('stats-percent');

    if (statsText) {
      statsText.textContent = `${completed} of ${total} tasks completed`;
    }
    if (statsPercent) {
      statsPercent.textContent = `${percent}%`;
    }
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
  },

  renderCategories(tasks, activeCategory, onSelectCategory) {
    const categoryContainer = document.getElementById('category-pills');
    if (!categoryContainer) return;

    // Get unique categories from tasks plus defaults
    const defaultCats = ['All', 'Work', 'Personal', 'Health', 'Finance', 'Ideas'];
    const customCats = tasks.map(t => t.category).filter(Boolean);
    const allCategories = Array.from(new Set([...defaultCats, ...customCats]));

    categoryContainer.innerHTML = allCategories.map(cat => {
      const isSelected = activeCategory === cat;
      const baseStyle = isSelected
        ? 'bg-slate-900 text-white shadow-sm'
        : 'bg-white/80 text-slate-600 hover:bg-slate-100/80 border border-slate-200/80';

      return `
        <button 
          data-category="${cat}" 
          class="category-pill px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-95 ${baseStyle}">
          ${cat}
        </button>
      `;
    }).join('');

    categoryContainer.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        onSelectCategory(e.currentTarget.getAttribute('data-category'));
      });
    });
  },

  formatDueDate(dateStr) {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [year, month, day] = dateStr.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue (${Math.abs(diffDays)}d)`, status: 'overdue' };
    } else if (diffDays === 0) {
      return { text: 'Due Today', status: 'today' };
    } else if (diffDays === 1) {
      return { text: 'Due Tomorrow', status: 'upcoming' };
    } else {
      const options = { month: 'short', day: 'numeric' };
      return { text: targetDate.toLocaleDateString(undefined, options), status: 'upcoming' };
    }
  },

  renderTasks(tasks, activeFilter = 'All', activeCategory = 'All', searchQuery = '') {
    const taskListContainer = document.getElementById('task-list');
    if (!taskListContainer) return;

    // Filter tasks
    let filtered = tasks.filter(task => {
      // Status filter
      if (activeFilter === 'Active' && task.completed) return false;
      if (activeFilter === 'Completed' && !task.completed) return false;

      // Category filter
      if (activeCategory !== 'All' && task.category !== activeCategory) return false;

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesCat = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCat) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      let emptyMsg = 'No tasks found';
      let emptySub = 'Relax and enjoy your day, or create a new task above.';

      if (searchQuery) {
        emptyMsg = 'No matching tasks';
        emptySub = `No tasks matching "${searchQuery}"`;
      } else if (activeFilter === 'Completed') {
        emptyMsg = 'No completed tasks yet';
        emptySub = 'Completed items will appear here once checked off.';
      } else if (activeFilter === 'Active') {
        emptyMsg = 'All caught up!';
        emptySub = 'You have no active tasks left to complete.';
      }

      taskListContainer.innerHTML = `
        <div class="py-16 text-center animate-fade-in flex flex-col items-center justify-center">
          <div class="w-16 h-16 mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <i data-lucide="sparkles" class="w-8 h-8"></i>
          </div>
          <h3 class="text-base font-semibold text-slate-800 mb-1">${emptyMsg}</h3>
          <p class="text-xs text-slate-500 max-w-xs leading-relaxed">${emptySub}</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    taskListContainer.innerHTML = filtered.map(task => {
      const catStyle = this.categoryColors[task.category] || this.categoryColors.General;
      const priorityStyle = this.priorityColors[task.priority] || this.priorityColors.Medium;
      const dueDateObj = this.formatDueDate(task.dueDate);

      let dateBadge = '';
      if (dueDateObj) {
        let badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
        if (dueDateObj.status === 'overdue') {
          badgeColor = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
        } else if (dueDateObj.status === 'today') {
          badgeColor = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
        }
        dateBadge = `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs border ${badgeColor}">
            <i data-lucide="calendar" class="w-3 h-3"></i>
            ${dueDateObj.text}
          </span>
        `;
      }

      return `
        <div data-id="${task.id}" class="task-item group nordic-card p-4 rounded-2xl transition-all duration-200 ${task.completed ? 'task-completed opacity-70' : ''} animate-slide-down">
          <div class="flex items-start justify-between gap-3">
            
            <!-- Checkbox & Task Main Content -->
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <button 
                data-action="toggle" 
                data-id="${task.id}" 
                aria-label="Toggle task status"
                class="task-checkbox mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 active:scale-90 flex-shrink-0 ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white animate-pop' : 'border-slate-300 hover:border-slate-400 bg-white'}">
                ${task.completed ? '<i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>' : ''}
              </button>

              <div class="flex-1 min-w-0">
                <p class="task-title text-sm font-medium text-slate-800 leading-snug break-words cursor-pointer select-none" data-action="toggle" data-id="${task.id}">
                  ${this.escapeHtml(task.title)}
                </p>
                
                <!-- Badges & Metadata -->
                <div class="flex flex-wrap items-center gap-2 mt-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${catStyle}">
                    ${task.category}
                  </span>
                  
                  <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${priorityStyle}">
                    ${task.priority}
                  </span>

                  ${dateBadge}
                </div>
              </div>
            </div>

            <!-- Task Actions -->
            <div class="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
              <button 
                data-action="edit" 
                data-id="${task.id}"
                aria-label="Edit task"
                class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors active:scale-95">
                <i data-lucide="pencil" class="w-4 h-4"></i>
              </button>
              <button 
                data-action="delete" 
                data-id="${task.id}"
                aria-label="Delete task"
                class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors active:scale-95">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>

          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  showToast(message, onUndo = null) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastId = 'toast-' + Date.now();
    const undoButton = onUndo ? `
      <button id="${toastId}-undo" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 ml-3 underline underline-offset-2 transition-colors">
        Undo
      </button>
    ` : '';

    const toastEl = document.createElement('div');
    toastEl.id = toastId;
    toastEl.className = 'nordic-card px-4 py-3 rounded-xl shadow-lg text-xs text-slate-700 font-medium flex items-center justify-between gap-2 animate-toast max-w-sm w-full border border-slate-200/90';
    toastEl.innerHTML = `
      <div class="flex items-center gap-2">
        <i data-lucide="info" class="w-4 h-4 text-slate-500"></i>
        <span>${message}</span>
      </div>
      ${undoButton}
    `;

    container.appendChild(toastEl);
    if (window.lucide) window.lucide.createIcons();

    if (onUndo) {
      const btn = document.getElementById(`${toastId}-undo`);
      if (btn) {
        btn.addEventListener('click', () => {
          onUndo();
          toastEl.remove();
        });
      }
    }

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      if (toastEl.parentNode) {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(10px)';
        toastEl.style.transition = 'all 0.2s ease';
        setTimeout(() => toastEl.remove(), 200);
      }
    }, 4000);
  },

  triggerConfetti() {
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#84A98C', '#B8C0EC', '#F4A261', '#38BDF8', '#A7F3D0']
      });
    }
  },

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

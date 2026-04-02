// ══════════════════════════════════════
//   NAVIGATION
// ══════════════════════════════════════

const pageNames = {
  dashboard: 'Dashboard',
  marks: 'Marks',
  assignments: 'Assignments',
  attendance: 'Attendance',
  physical: 'Physical Activities',
  competitions: 'Competitions'
};

function showToast(message, type = 'success') {
  const host = document.getElementById('toast-container');
  if (!host) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  host.appendChild(toast);
  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(8px)';
  }, 2400);
  window.setTimeout(() => toast.remove(), 2700);
}

function setTableLoading(tableWrapSelector, isLoading, label = 'Loading...') {
  const wrap = document.querySelector(tableWrapSelector);
  if (!wrap) return;
  wrap.classList.toggle('loading-overlay', isLoading);
  let overlay = wrap.querySelector('.loading-overlay-content');
  if (isLoading) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay-content';
      overlay.innerHTML = '<span class="spinner"></span><span></span>';
      wrap.appendChild(overlay);
    }
    overlay.querySelector('span:last-child').textContent = label;
  } else if (overlay) {
    overlay.remove();
  }
}

function showDashboardLoading(show) {
  const stats = document.getElementById('dashboard-stats');
  const trendCard = document.getElementById('dash-trend-card');
  if (!stats || !trendCard) return;

  if (show) {
    stats.dataset.prevHtml = stats.innerHTML;
    trendCard.dataset.prevHtml = trendCard.innerHTML;
    stats.innerHTML = Array.from({ length: 4 }, () => '<div class="skeleton stat-skeleton"></div>').join('');
    trendCard.innerHTML = '<div class="card-title"><span class="dot" style="background:var(--accent)"></span>Performance Trend</div><div class="skeleton chart-skeleton"></div>';
  } else {
    if (stats.dataset.prevHtml) stats.innerHTML = stats.dataset.prevHtml;
    if (trendCard.dataset.prevHtml) trendCard.innerHTML = trendCard.dataset.prevHtml;
  }
}

function withFakeFetchState(start, done, delay = 450) {
  start();
  return new Promise(resolve => {
    setTimeout(() => {
      done();
      resolve();
    }, delay);
  });
}

window.addEventListener('unhandledrejection', () => {
  showToast('Failed to fetch data', 'error');
});

window.addEventListener('error', () => {
  showToast('Something went wrong', 'error');
});

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.textContent.trim().toLowerCase().includes(pageNames[id].split(' ')[0].toLowerCase()))
      n.classList.add('active');
  });
  document.getElementById('topbar-title').textContent = pageNames[id];
  if (id === 'marks') renderMarks(1);
  if (id === 'assignments') renderAssignments();
  if (id === 'attendance') renderAttendance();
  if (id === 'physical') renderPhysical();
  if (id === 'competitions') renderCompetitions();
}

// ══════════════════════════════════════
//   CHART HELPERS
// ══════════════════════════════════════

let chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}

function chartOpts(label) {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a2236', borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1, titleColor: '#e8edf5', bodyColor: '#8b9ab5', padding: 10,
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9ab5', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9ab5', font: { size: 11 } } }
    }
  };
}

// ══════════════════════════════════════
//   APP INIT
// ══════════════════════════════════════

function initApp(uid) {
  renderDashboard();
}

window.addEventListener('load', () => {
  if (document.getElementById('app').style.display === 'block') renderDashboard();
});

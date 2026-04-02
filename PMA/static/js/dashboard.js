// ══════════════════════════════════════
//   DASHBOARD
// ══════════════════════════════════════

const dashboardDateData = {
  '7': { labels: ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Today'], gpa: [8.0, 8.1, 8.2, 8.1, 8.3, 8.4, 8.5], attendance: 90, pendingAssignments: 2, competitions: 1 },
  '30': { labels: ['W1', 'W2', 'W3', 'W4'], gpa: [8.1, 8.3, 8.4, 8.6], attendance: 87, pendingAssignments: 3, competitions: 2 },
  semester: { labels: ['M1', 'M2', 'M3', 'M4', 'M5'], gpa: [7.8, 8.1, 8.4, 8.6, 8.9], attendance: 85, pendingAssignments: 4, competitions: 5 },
};

let activeDashboardRange = '30';

function renderDashboardStats(rangeKey) {
  const selected = dashboardDateData[rangeKey] || dashboardDateData['30'];
  const gpaAvg = (selected.gpa.reduce((a, b) => a + b, 0) / selected.gpa.length).toFixed(1);

  document.querySelector('#dash-stat-gpa .stat-value').textContent = gpaAvg;
  document.querySelector('#dash-stat-attendance .stat-value').textContent = `${selected.attendance}%`;
  document.querySelector('#dash-stat-assignments .stat-value').textContent = String(selected.pendingAssignments);
  document.querySelector('#dash-stat-competitions .stat-value').textContent = String(selected.competitions);
}

function renderDashboardCharts(rangeKey) {
  const selected = dashboardDateData[rangeKey] || dashboardDateData['30'];
  destroyChart('dashTrend');
  destroyChart('dashRadar');

  chartInstances['dashTrend'] = new Chart(document.getElementById('dashTrendChart'), {
    type: 'line',
    data: {
      labels: selected.labels,
      datasets: [{
        label: 'GPA',
        data: selected.gpa,
        borderColor: '#4f8ef7',
        backgroundColor: 'rgba(79,142,247,0.1)',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4f8ef7',
        pointRadius: 4,
      }]
    },
    options: chartOpts('GPA')
  });

  chartInstances['dashRadar'] = new Chart(document.getElementById('dashRadarChart'), {
    type: 'radar',
    data: {
      labels: ['Maths', 'Physics', 'Chemistry', 'English', 'CS'],
      datasets: [{
        label: 'Score %',
        data: rangeKey === '7' ? [86, 80, 90, 74, 93] : rangeKey === '30' ? [85, 78, 88, 72, 92] : [87, 82, 90, 76, 94],
        backgroundColor: 'rgba(124,92,252,0.2)',
        borderColor: '#7c5cfc',
        pointBackgroundColor: '#7c5cfc',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          ticks: { color: '#5a6a82', font: { size: 10 }, backdropColor: 'transparent' },
          grid: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: { color: '#8b9ab5', font: { size: 11 } },
          suggestedMin: 0, suggestedMax: 100,
        }
      }
    }
  });
}

function applyDashboardDateFilter(value) {
  activeDashboardRange = value;
  withFakeFetchState(
    () => showDashboardLoading(true),
    () => {
      showDashboardLoading(false);
      renderDashboardStats(activeDashboardRange);
      renderDashboardCharts(activeDashboardRange);
    }
  ).catch(() => showToast('Failed to fetch data', 'error'));
}

function renderDashboard() {
  const filterEl = document.getElementById('dashboard-date-filter');
  if (filterEl) filterEl.value = activeDashboardRange;
  applyDashboardDateFilter(activeDashboardRange);
}

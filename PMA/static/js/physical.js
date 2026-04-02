// ══════════════════════════════════════
//   PHYSICAL ACTIVITIES
// ══════════════════════════════════════

const activities = [
  {
    name: 'Football', icon: '⚽',
    color: 'rgba(79,142,247,0.2)', colorBorder: 'rgba(79,142,247,0.4)',
    schedule: ['Mon', 'Wed', 'Fri'], nextClass: 'Today 4:30 PM',
    performance: 4, level: 'Intermediate',
    desc: 'District level team player',
  },
  {
    name: 'Yoga', icon: '🧘',
    color: 'rgba(0,212,170,0.2)', colorBorder: 'rgba(0,212,170,0.4)',
    schedule: ['Mon', 'Tue', 'Thu', 'Sat'], nextClass: 'Tomorrow 7:00 AM',
    performance: 5, level: 'Advanced',
    desc: '2 years of practice',
  },
  {
    name: 'Music', icon: '🎵',
    color: 'rgba(124,92,252,0.2)', colorBorder: 'rgba(124,92,252,0.4)',
    schedule: ['Tue', 'Thu'], nextClass: 'Wed 5:00 PM',
    performance: 3, level: 'Beginner',
    desc: 'Learning classical guitar',
  },
  {
    name: 'Dance', icon: '💃',
    color: 'rgba(247,79,142,0.2)', colorBorder: 'rgba(247,79,142,0.4)',
    schedule: ['Wed', 'Fri'], nextClass: 'Fri 4:00 PM',
    performance: 4, level: 'Intermediate',
    desc: 'Bharatanatyam',
  },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const physLog = [
  { activity: 'Football', date: '2026-03-06', duration: '90 min', rating: '⭐⭐⭐⭐', notes: 'Great session, scored twice' },
  { activity: 'Yoga', date: '2026-03-05', duration: '60 min', rating: '⭐⭐⭐⭐⭐', notes: 'Perfected headstand pose' },
  { activity: 'Dance', date: '2026-03-04', duration: '75 min', rating: '⭐⭐⭐⭐', notes: 'Improved footwork' },
  { activity: 'Music', date: '2026-03-03', duration: '45 min', rating: '⭐⭐⭐', notes: 'Practiced C major scales' },
  { activity: 'Football', date: '2026-03-01', duration: '90 min', rating: '⭐⭐⭐⭐', notes: 'Team drill practice' },
  { activity: 'Yoga', date: '2026-02-28', duration: '60 min', rating: '⭐⭐⭐⭐⭐', notes: 'Morning flow session' },
];
let physicalLogPage = 1;
const physicalLogPageSize = 3;

function updatePhysicalLogPagination(totalRows) {
  const totalPages = Math.max(1, Math.ceil(totalRows / physicalLogPageSize));
  if (physicalLogPage > totalPages) physicalLogPage = totalPages;
  const info = document.getElementById('phys-page-info');
  const prev = document.getElementById('phys-prev');
  const next = document.getElementById('phys-next');
  if (info) info.textContent = `Page ${physicalLogPage} of ${totalPages}`;
  if (prev) prev.disabled = physicalLogPage <= 1;
  if (next) next.disabled = physicalLogPage >= totalPages;
}

function changePhysicalLogPage(step) {
  physicalLogPage += step;
  if (physicalLogPage < 1) physicalLogPage = 1;
  renderPhysical();
}

function renderPhysical() {
  const grid = document.getElementById('activity-grid');
  grid.innerHTML = activities.map(a => `
    <div class="activity-card">
      <div class="activity-header">
        <div class="activity-icon" style="background:${a.color};border:1px solid ${a.colorBorder}">${a.icon}</div>
        <div>
          <div class="activity-name">${a.name}</div>
          <div class="activity-next">⏰ Next: ${a.nextClass}</div>
        </div>
        <div style="margin-left:auto"><span class="badge badge-blue">${a.level}</span></div>
      </div>
      <div style="font-size:13px;color:var(--text2)">${a.desc}</div>
      <div>
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Schedule</div>
        <div class="activity-schedule">
          ${days.map(d => `<div class="day-chip ${a.schedule.includes(d) ? 'active' : ''}">${d}</div>`).join('')}
        </div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Performance</div>
        <div class="performance-stars">${'⭐'.repeat(a.performance)}${'☆'.repeat(5 - a.performance)}</div>
      </div>
    </div>
  `).join('');

  updatePhysicalLogPagination(physLog.length);
  const start = (physicalLogPage - 1) * physicalLogPageSize;
  const paged = physLog.slice(start, start + physicalLogPageSize);
  const logTbody = document.getElementById('phys-log-tbody');
  logTbody.innerHTML = paged.map(l => `
    <tr>
      <td class="td-subject">${l.activity}</td>
      <td>${l.date}</td>
      <td>${l.duration}</td>
      <td>${l.rating}</td>
      <td class="text-muted text-sm">${l.notes}</td>
    </tr>
  `).join('');

  setTimeout(() => {
    destroyChart('physLine');
    chartInstances['physLine'] = new Chart(document.getElementById('physLineChart'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          { label: 'Football', data: [3, 4, 4], borderColor: '#4f8ef7', backgroundColor: 'rgba(79,142,247,0.1)', tension: 0.4, borderWidth: 2, fill: true, pointRadius: 4 },
          { label: 'Yoga', data: [4, 4, 5], borderColor: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.08)', tension: 0.4, borderWidth: 2, fill: true, pointRadius: 4 },
          { label: 'Music', data: [2, 2, 3], borderColor: '#7c5cfc', backgroundColor: 'rgba(124,92,252,0.08)', tension: 0.4, borderWidth: 2, fill: true, pointRadius: 4 },
          { label: 'Dance', data: [3, 3, 4], borderColor: '#f74f8e', backgroundColor: 'rgba(247,79,142,0.08)', tension: 0.4, borderWidth: 2, fill: true, pointRadius: 4 },
        ]
      },
      options: {
        ...chartOpts(),
        plugins: { legend: { labels: { color: '#8b9ab5', font: { size: 11 } }, display: true } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9ab5', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9ab5', font: { size: 11 } }, min: 0, max: 5, stepSize: 1 }
        }
      }
    });
  }, 100);
}

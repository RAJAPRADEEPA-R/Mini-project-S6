// ══════════════════════════════════════
//   COMPETITIONS
// ══════════════════════════════════════

const competitions = [
  { name: 'State Science Quiz', category: 'Academic', date: '2026-01-15', position: '1st', target: 'Top 3', targetMet: true, icon: '🔬', color: 'rgba(79,142,247,0.2)' },
  { name: 'Inter-College Football', category: 'Sports', date: '2026-02-08', position: 'Runner-up', target: 'Win', targetMet: false, icon: '⚽', color: 'rgba(0,212,247,0.2)' },
  { name: 'Classical Dance Fest', category: 'Cultural', date: '2026-01-28', position: '3rd', target: 'Top 5', targetMet: true, icon: '💃', color: 'rgba(247,79,142,0.2)' },
  { name: 'Coding Hackathon', category: 'Technical', date: '2025-12-10', position: '1st', target: 'Top 3', targetMet: true, icon: '💻', color: 'rgba(124,92,252,0.2)' },
  { name: 'State Yoga Championship', category: 'Sports', date: '2025-11-20', position: '4th', target: 'Top 3', targetMet: false, icon: '🧘', color: 'rgba(0,212,170,0.2)' },
];

function getFilteredCompetitions() {
  const filter = document.getElementById('comp-target-filter')?.value || '';
  if (!filter) return competitions;
  return competitions.filter(c => (filter === 'achieved' ? c.targetMet : !c.targetMet));
}

function updateCompetitionFilter() {
  renderCompetitions();
}

function renderCompetitions() {
  const filtered = getFilteredCompetitions();
  const list = document.getElementById('comp-list');
  list.innerHTML = filtered.map(c => `
    <div class="comp-card">
      <div class="comp-icon" style="background:${c.color}">${c.icon}</div>
      <div class="comp-info">
        <div class="comp-name">${c.name}</div>
        <div class="comp-meta">${c.category} · ${c.date}</div>
        <div style="margin-top:6px"><span class="badge badge-purple">${c.position}</span></div>
      </div>
      <div class="comp-target">
        <div class="comp-target-label">Target</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:4px">${c.target}</div>
        ${c.targetMet
      ? '<div class="target-achieved">✅ Achieved</div>'
      : '<div class="target-missed">❌ Missed</div>'}
      </div>
    </div>
  `).join('') || '<div class="empty-state">No competitions match this filter.</div>';

  setTimeout(() => {
    destroyChart('compPie');
    destroyChart('compBar');
    const achievedCount = filtered.filter(c => c.targetMet).length;
    const missedCount = filtered.filter(c => !c.targetMet).length;

    chartInstances['compPie'] = new Chart(document.getElementById('compPieChart'), {
      type: 'doughnut',
      data: {
        labels: ['Target Met', 'Target Missed'],
        datasets: [{ data: [achievedCount, missedCount], backgroundColor: ['#22c55e', '#ef4444'], borderWidth: 0, hoverOffset: 6 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { color: '#8b9ab5', font: { size: 11 }, padding: 16 } } }
      }
    });

    const categories = [...new Set(filtered.map(c => c.category))];
    chartInstances['compBar'] = new Chart(document.getElementById('compBarChart'), {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Count',
          data: categories.map(cat => filtered.filter(c => c.category === cat).length),
          backgroundColor: ['rgba(79,142,247,0.7)', 'rgba(0,212,170,0.7)', 'rgba(247,79,142,0.7)', 'rgba(124,92,252,0.7)'],
          borderRadius: 8,
        }]
      },
      options: {
        ...chartOpts(),
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9ab5', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9ab5', font: { size: 11 } }, stepSize: 1, min: 0 }
        }
      }
    });
  }, 100);
}

// ══════════════════════════════════════
//   ASSIGNMENTS
// ══════════════════════════════════════

const assignData = [
  { subject: 'Mathematics', title: 'Integration Problems', due: '2026-02-20', submitted: '2026-02-19', score: 18, max: 20, status: 'submitted' },
  { subject: 'Physics', title: 'Wave Optics Lab Report', due: '2026-03-10', submitted: null, score: null, max: 20, status: 'pending' },
  { subject: 'Chemistry', title: 'Organic Reactions Essay', due: '2026-03-08', submitted: null, score: null, max: 20, status: 'overdue' },
  { subject: 'Computer Sci', title: 'Data Structures Project', due: '2026-02-28', submitted: '2026-02-26', score: 19, max: 20, status: 'submitted' },
  { subject: 'English', title: 'Literary Analysis', due: '2026-02-15', submitted: '2026-02-14', score: 16, max: 20, status: 'submitted' },
  { subject: 'Mathematics', title: 'Probability Problems', due: '2026-03-15', submitted: null, score: null, max: 20, status: 'pending' },
  { subject: 'Physics', title: 'Mechanics Numericals', due: '2026-02-10', submitted: '2026-02-09', score: 17, max: 20, status: 'submitted' },
  { subject: 'Chemistry', title: 'Titration Report', due: '2026-02-22', submitted: '2026-02-21', score: 18, max: 20, status: 'submitted' },
  { subject: 'Computer Sci', title: 'Algorithm Analysis', due: '2026-03-20', submitted: null, score: null, max: 20, status: 'pending' },
  { subject: 'English', title: 'Creative Writing', due: '2026-02-25', submitted: '2026-02-24', score: 15, max: 20, status: 'submitted' },
  { subject: 'Mathematics', title: 'Calculus Test', due: '2026-02-05', submitted: '2026-02-05', score: 19, max: 20, status: 'submitted' },
  { subject: 'Physics', title: 'Thermodynamics', due: '2026-02-18', submitted: '2026-02-17', score: 16, max: 20, status: 'submitted' },
];

let assignmentCurrentPage = 1;
const assignmentPageSize = 10;

function normalizeStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function populateAssignmentSubjects() {
  const subjectFilter = document.getElementById('assign-subject-filter');
  if (!subjectFilter || subjectFilter.dataset.loaded === '1') return;
  const subjects = [...new Set(assignData.map(a => a.subject))];
  subjectFilter.innerHTML = '<option value="">All Subjects</option>' + subjects.map(s => `<option value="${s}">${s}</option>`).join('');
  subjectFilter.dataset.loaded = '1';
}

function getFilteredAssignments() {
  const q = (document.getElementById('assign-search')?.value || '').toLowerCase().trim();
  const status = document.getElementById('assign-status-filter')?.value || '';
  const subject = document.getElementById('assign-subject-filter')?.value || '';
  const dueFilter = document.getElementById('assign-due-filter')?.value || '';
  const today = new Date().toISOString().slice(0, 10);

  let filtered = assignData.filter(a => {
    const matchesSearch = !q || a.subject.toLowerCase().includes(q) || a.title.toLowerCase().includes(q);
    const matchesStatus = !status || a.status === status;
    const matchesSubject = !subject || a.subject === subject;
    const matchesUpcoming = dueFilter !== 'upcoming' || (a.due >= today && a.status !== 'submitted');
    return matchesSearch && matchesStatus && matchesSubject && matchesUpcoming;
  });

  if (dueFilter === 'asc' || dueFilter === 'upcoming') filtered = filtered.sort((a, b) => a.due.localeCompare(b.due));
  if (dueFilter === 'desc') filtered = filtered.sort((a, b) => b.due.localeCompare(a.due));
  return filtered;
}

function updateAssignmentsPagination(totalRows) {
  const totalPages = Math.max(1, Math.ceil(totalRows / assignmentPageSize));
  if (assignmentCurrentPage > totalPages) assignmentCurrentPage = totalPages;
  document.getElementById('assign-page-info').textContent = `Page ${assignmentCurrentPage} of ${totalPages}`;
  document.getElementById('assign-prev').disabled = assignmentCurrentPage <= 1;
  document.getElementById('assign-next').disabled = assignmentCurrentPage >= totalPages;
}

function updateAssignmentFilters() {
  assignmentCurrentPage = 1;
  setTableLoading('#page-assignments .table-wrap', true, 'Filtering assignments...');
  setTimeout(() => {
    renderAssignments();
    setTableLoading('#page-assignments .table-wrap', false);
  }, 350);
}

function changeAssignmentPage(step) {
  assignmentCurrentPage += step;
  renderAssignments();
}

function renderAssignments() {
  populateAssignmentSubjects();
  const filtered = getFilteredAssignments();
  updateAssignmentsPagination(filtered.length);
  const start = (assignmentCurrentPage - 1) * assignmentPageSize;
  const paged = filtered.slice(start, start + assignmentPageSize);
  const tbody = document.getElementById('assign-tbody');
  const empty = document.getElementById('assign-empty');
  empty.style.display = filtered.length ? 'none' : 'block';
  tbody.innerHTML = paged.map(a => `
    <tr>
      <td class="td-subject">${a.subject}</td>
      <td>${a.title}</td>
      <td>${a.due}</td>
      <td>${a.submitted || '—'}</td>
      <td>${a.score !== null ? `${a.score}/${a.max}` : '—'}</td>
      <td><span class="badge ${a.status === 'submitted' ? 'badge-green' : a.status === 'pending' ? 'badge-yellow' : 'badge-red'}">${normalizeStatus(a.status)}</span></td>
    </tr>
  `).join('');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Sci'];
  const barsEl = document.getElementById('assign-subject-bars');
  barsEl.innerHTML = subjects.map(s => {
    const total = filtered.filter(a => a.subject === s).length;
    const submitted = filtered.filter(a => a.subject === s && a.status === 'submitted').length;
    const pct = total ? Math.round(submitted / total * 100) : 0;
    return `<div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
        <span class="fw-700">${s}</span>
        <span class="text-muted">${submitted}/${total}</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-bar" style="width:${pct}%;background:linear-gradient(90deg,var(--accent),var(--accent2))"></div>
      </div>
    </div>`;
  }).join('');

  setTimeout(() => {
    destroyChart('assignPie');
    const submitted = filtered.filter(a => a.status === 'submitted').length;
    const pending = filtered.filter(a => a.status === 'pending').length;
    const overdue = filtered.filter(a => a.status === 'overdue').length;
    chartInstances['assignPie'] = new Chart(document.getElementById('assignPieChart'), {
      type: 'doughnut',
      data: {
        labels: ['Submitted', 'Pending', 'Overdue'],
        datasets: [{ data: [submitted, pending, overdue], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'], borderWidth: 0, hoverOffset: 6 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { color: '#8b9ab5', font: { size: 11 }, padding: 16 } } }
      }
    });
  }, 100);
}

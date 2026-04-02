// ══════════════════════════════════════
//   MARKS
// ══════════════════════════════════════


const allMarksData = {
  1: [
    { subject: 'Mathematics', internal: 38, external: 68, total: 106, grade: 'A', max: 125 },
    { subject: 'Physics', internal: 35, external: 62, total: 97, grade: 'B+', max: 125 },
    { subject: 'Chemistry', internal: 40, external: 70, total: 110, grade: 'A+', max: 125 },
    { subject: 'English', internal: 32, external: 58, total: 90, grade: 'B', max: 125 },
    { subject: 'Computer Sci', internal: 39, external: 72, total: 111, grade: 'A+', max: 125 },
  ],
  2: [
    { subject: 'Mathematics', internal: 36, external: 65, total: 101, grade: 'A', max: 125 },
    { subject: 'Physics', internal: 37, external: 66, total: 103, grade: 'A', max: 125 },
    { subject: 'Chemistry', internal: 38, external: 68, total: 106, grade: 'A', max: 125 },
    { subject: 'English', internal: 33, external: 60, total: 93, grade: 'B+', max: 125 },
    { subject: 'Computer Sci', internal: 40, external: 74, total: 114, grade: 'A+', max: 125 },
  ],
  3: [
    { subject: 'Mathematics', internal: 37, external: 67, total: 104, grade: 'A', max: 125 },
    { subject: 'Physics', internal: 36, external: 64, total: 100, grade: 'A', max: 125 },
    { subject: 'Chemistry', internal: 39, external: 69, total: 108, grade: 'A', max: 125 },
    { subject: 'English', internal: 34, external: 61, total: 95, grade: 'B+', max: 125 },
    { subject: 'Computer Sci', internal: 40, external: 76, total: 116, grade: 'A+', max: 125 },
  ],
  4: [
    { subject: 'Mathematics', internal: 38, external: 70, total: 108, grade: 'A', max: 125 },
    { subject: 'Physics', internal: 37, external: 67, total: 104, grade: 'A', max: 125 },
    { subject: 'Chemistry', internal: 40, external: 72, total: 112, grade: 'A+', max: 125 },
    { subject: 'English', internal: 35, external: 63, total: 98, grade: 'A', max: 125 },
    { subject: 'Computer Sci', internal: 40, external: 78, total: 118, grade: 'A+', max: 125 },
  ],
  5: [
    { subject: 'Mathematics', internal: 39, external: 71, total: 110, grade: 'A', max: 125 },
    { subject: 'Physics', internal: 38, external: 68, total: 106, grade: 'A', max: 125 },
    { subject: 'Chemistry', internal: 40, external: 73, total: 113, grade: 'A+', max: 125 },
    { subject: 'English', internal: 35, external: 64, total: 99, grade: 'A', max: 125 },
    { subject: 'Computer Sci', internal: 40, external: 80, total: 120, grade: 'A+', max: 125 },
  ],
};

const gradeColors = { 'A+': '#22c55e', 'A': '#4f8ef7', 'B+': '#7c5cfc', 'B': '#f59e0b', 'C': '#ef4444' };
let currentSem = 1;
let marksCurrentPage = 1;
const marksPageSize = 3;

function selectSem(el, sem) {
  document.querySelectorAll('.sem-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentSem = sem;
  marksCurrentPage = 1;
  renderMarks(sem);
}

function getFilteredMarksData(sem) {
  const data = allMarksData[sem] || allMarksData[1];
  const q = (document.getElementById('marks-search')?.value || '').toLowerCase().trim();
  const grade = document.getElementById('marks-grade-filter')?.value || '';
  const result = document.getElementById('marks-result-filter')?.value || '';
  return data.filter(row => {
    const matchesSearch = !q || row.subject.toLowerCase().includes(q);
    const matchesGrade = !grade || row.grade === grade;
    const rowResult = row.total >= 75 ? 'Pass' : 'Fail';
    const matchesResult = !result || rowResult === result;
    return matchesSearch && matchesGrade && matchesResult;
  });
}

function updateMarksPagination(totalRows) {
  const totalPages = Math.max(1, Math.ceil(totalRows / marksPageSize));
  if (marksCurrentPage > totalPages) marksCurrentPage = totalPages;
  document.getElementById('marks-page-info').textContent = `Page ${marksCurrentPage} of ${totalPages}`;
  document.getElementById('marks-prev').disabled = marksCurrentPage <= 1;
  document.getElementById('marks-next').disabled = marksCurrentPage >= totalPages;
}

function updateMarksFilters() {
  marksCurrentPage = 1;
  setTableLoading('#page-marks .table-wrap', true, 'Filtering subjects...');
  setTimeout(() => {
    renderMarks(currentSem);
    setTableLoading('#page-marks .table-wrap', false);
  }, 350);
}

function changeMarksPage(step) {
  marksCurrentPage += step;
  if (marksCurrentPage < 1) marksCurrentPage = 1;
  renderMarks(currentSem);
}

function renderMarks(sem) {
  document.getElementById('sem-title').textContent = `Semester ${sem}`;
  const data = getFilteredMarksData(sem);
  updateMarksPagination(data.length);
  const start = (marksCurrentPage - 1) * marksPageSize;
  const paged = data.slice(start, start + marksPageSize);
  const tbody = document.getElementById('marks-tbody');
  const empty = document.getElementById('marks-empty');
  empty.style.display = data.length ? 'none' : 'block';

  tbody.innerHTML = paged.map(r => `
    <tr>
      <td class="td-subject">${r.subject}</td>
      <td>${r.internal}/40</td>
      <td>${r.external}/85</td>
      <td class="fw-700">${r.total}/${r.max}</td>
      <td><div class="grade-circle" style="background:${gradeColors[r.grade]}20;color:${gradeColors[r.grade]}">${r.grade}</div></td>
      <td><span class="badge ${r.total >= 75 ? 'badge-green' : 'badge-red'}">${r.total >= 75 ? 'Pass' : 'Fail'}</span></td>
      <td style="min-width:100px">
        <div class="progress-wrap">
          <div class="progress-bar" style="width:${(r.total / r.max * 100).toFixed(0)}%;background:${gradeColors[r.grade]}"></div>
        </div>
        <div class="text-sm text-muted" style="margin-top:4px">${(r.total / r.max * 100).toFixed(0)}%</div>
      </td>
    </tr>
  `).join('');

  setTimeout(() => {
    destroyChart('marksBar');
    destroyChart('gpaLine');

    chartInstances['marksBar'] = new Chart(document.getElementById('marksBarChart'), {
      type: 'bar',
      data: {
        labels: (data.length ? data : (allMarksData[sem] || allMarksData[1])).map(d => d.subject.split(' ')[0]),
        datasets: [
          { label: 'Internal', data: (data.length ? data : (allMarksData[sem] || allMarksData[1])).map(d => d.internal), backgroundColor: 'rgba(79,142,247,0.7)', borderRadius: 6 },
          { label: 'External', data: (data.length ? data : (allMarksData[sem] || allMarksData[1])).map(d => d.external), backgroundColor: 'rgba(124,92,252,0.7)', borderRadius: 6 },
        ]
      },
      options: {
        ...chartOpts(),
        plugins: { legend: { labels: { color: '#8b9ab5', font: { size: 11 } }, display: true } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9ab5', font: { size: 11 } }, stacked: false },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9ab5', font: { size: 11 } } }
        }
      }
    });

    chartInstances['gpaLine'] = new Chart(document.getElementById('gpaLineChart'), {
      type: 'line',
      data: {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
        datasets: [{
          label: 'GPA',
          data: [7.8, 8.1, 8.4, 8.6, 8.9],
          borderColor: '#00d4aa',
          backgroundColor: 'rgba(0,212,170,0.1)',
          borderWidth: 2.5, tension: 0.4, fill: true,
          pointBackgroundColor: '#00d4aa', pointRadius: 5,
        }]
      },
      options: chartOpts('GPA')
    });
  }, 100);
}

// ══════════════════════════════════════
//   ATTENDANCE
// ══════════════════════════════════════

let calYear = 2026, calMonth = 2; // 0-indexed: 2 = March

const attendanceMap = {};
(function generateAttData() {
  const year = 2026;
  const month = 2;
  const today = new Date();
  for (let d = 1; d <= 28; d++) {
    const dt = new Date(year, month, d);
    if (dt > today) break;
    if (dt.getDay() === 0 || dt.getDay() === 6) continue;
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    attendanceMap[key] = Math.random() > 0.18 ? 'present' : 'absent';
  }
  for (let d = 1; d <= 28; d++) {
    const key = `2026-02-${String(d).padStart(2, '0')}`;
    const dt = new Date(2026, 1, d);
    if (dt.getDay() === 0 || dt.getDay() === 6) continue;
    attendanceMap[key] = Math.random() > 0.15 ? 'present' : 'absent';
  }
})();

function renderAttendance() {
  renderCalendar();
  renderHourly();
  renderAttCharts();
  updateAttStats();
}

function updateAttStats() {
  const keys = Object.keys(attendanceMap).filter(k => k.startsWith('2026-03'));
  const present = keys.filter(k => attendanceMap[k] === 'present').length;
  const absent = keys.filter(k => attendanceMap[k] === 'absent').length;
  const total = present + absent;
  document.getElementById('att-present').textContent = present;
  document.getElementById('att-absent').textContent = absent;
  document.getElementById('att-pct').textContent = total ? Math.round(present / total * 100) + '%' : '—';
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
}

function renderCalendar() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('cal-month-label').textContent = `${months[calMonth]} ${calYear}`;
  const grid = document.getElementById('cal-grid');
  const today = new Date();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  let html = dayLabels.map(d => `<div class="cal-day-label">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(calYear, calMonth, d);
    const key = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const status = attendanceMap[key];
    const isToday = dt.toDateString() === today.toDateString();
    const isFuture = dt > today;
    let cls = 'cal-day';
    if (status === 'present') cls += ' present';
    else if (status === 'absent') cls += ' absent';
    if (isToday) cls += ' today';
    if (isFuture) cls += ' future';
    html += `<div class="${cls}" onclick="showDayPopup(event, '${key}', ${d})">${d}</div>`;
  }
  grid.innerHTML = html;
}

function showDayPopup(e, key, day) {
  const status = attendanceMap[key];
  if (!status) return;
  const popup = document.getElementById('att-popup');
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('popup-date').textContent = `${months[calMonth]} ${day}, ${calYear}`;
  if (status === 'present') {
    document.getElementById('popup-status').innerHTML = '<span style="color:#4ade80">✅ Present</span>';
    document.getElementById('popup-detail').textContent = 'You attended classes on this day.';
    document.getElementById('popup-hours').textContent = `${Math.floor(Math.random() * 2) + 5}/7`;
  } else {
    document.getElementById('popup-status').innerHTML = '<span style="color:#f87171">❌ Absent</span>';
    document.getElementById('popup-detail').textContent = 'You were absent on this day.';
    document.getElementById('popup-hours').textContent = '0/7';
  }
  popup.style.display = 'block';
  const rect = e.target.getBoundingClientRect();
  popup.style.top = (rect.bottom + window.scrollY + 8) + 'px';
  popup.style.left = Math.min(rect.left + window.scrollX, window.innerWidth - 240) + 'px';
  e.stopPropagation();
}

function closePopup() { document.getElementById('att-popup').style.display = 'none'; }
document.addEventListener('click', () => closePopup());

const hourSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Sci', 'English', 'Lab', 'Sports'];

function renderHourly() {
  const grid = document.getElementById('hour-grid');
  grid.innerHTML = hourSubjects.map((sub, i) => {
    const present = Math.random() > 0.2;
    return `<div class="hour-cell ${present ? 'present' : 'absent'}">
      <div class="hour-num">${i + 1}</div>
      <div class="hour-sub">${sub}</div>
      <div class="hour-status">${present ? 'Present' : 'Absent'}</div>
    </div>`;
  }).join('');
}

function renderAttCharts() {
  setTimeout(() => {
    destroyChart('attWeek');
    destroyChart('attMonth');

    chartInstances['attWeek'] = new Chart(document.getElementById('attWeekChart'), {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Hours',
          data: [6, 7, 5, 7, 6],
          backgroundColor: 'rgba(0,212,170,0.6)',
          borderRadius: 8,
        }]
      },
      options: {
        ...chartOpts(), scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9ab5', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9ab5', font: { size: 11 } }, max: 8 }
        }
      }
    });

    chartInstances['attMonth'] = new Chart(document.getElementById('attMonthChart'), {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Attendance %',
          data: [90, 85, 88, 82],
          borderColor: '#7c5cfc',
          backgroundColor: 'rgba(124,92,252,0.1)',
          borderWidth: 2.5, tension: 0.4, fill: true,
          pointBackgroundColor: '#7c5cfc', pointRadius: 5,
        }]
      },
      options: chartOpts()
    });
  }, 100);
}

// ══════════════════════════════════════
//   AUTH
// ══════════════════════════════════════

function toggleAuth(mode) {
  document.getElementById('login-form').style.display = mode === 'login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = mode === 'signup' ? 'block' : 'none';
}

async function loginUser() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');
  const originalText = loginBtn.textContent;
  errEl.style.display = 'none';
  loginBtn.disabled = true;
  loginBtn.textContent = 'Verifying...';
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    showToast('Login successful', 'success');
  } catch (e) {
    const msg = (e.code && e.code.includes('auth')) ? 'Invalid credentials' : 'Something went wrong';
    errEl.textContent = msg;
    errEl.style.display = 'block';
    showToast(msg, 'error');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = originalText;
  }
}

async function registerUser() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');
  errEl.style.display = 'none';
  if (!name) { errEl.textContent = 'Please enter your name'; errEl.style.display = 'block'; return; }
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    await db.collection('users').doc(cred.user.uid).set({ name, email, createdAt: new Date() });
    seedDemoData(cred.user.uid);
  } catch (e) {
    errEl.textContent = e.message;
    errEl.style.display = 'block';
    showToast('Something went wrong', 'error');
  }
}

function logoutUser() {
  auth.signOut();
}

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    // const name = user.displayName || user.email.split('@')[0];
    const name = user.displayName;
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    document.getElementById('user-initials').textContent = initials;
    document.getElementById('user-display-name').textContent = name;
    document.getElementById('greeting-name').textContent = name.split(' ')[0];
    const hr = new Date().getHours();
    document.getElementById('greeting-time').textContent = hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : 'evening';
    initApp(user.uid);
  } else {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
  }
});

// ══════════════════════════════════════
//   DEMO DATA SEED
// ══════════════════════════════════════
async function seedDemoData(uid) {
  const batch = db.batch();
  const marksData = {
    sem1: [
      { subject: 'Mathematics', internal: 38, external: 68, total: 106, grade: 'A', max: 125 },
      { subject: 'Physics', internal: 35, external: 62, total: 97, grade: 'B+', max: 125 },
      { subject: 'Chemistry', internal: 40, external: 70, total: 110, grade: 'A+', max: 125 },
      { subject: 'English', internal: 32, external: 58, total: 90, grade: 'B', max: 125 },
      { subject: 'Computer Sci', internal: 39, external: 72, total: 111, grade: 'A+', max: 125 },
    ],
    sem2: [
      { subject: 'Mathematics', internal: 36, external: 65, total: 101, grade: 'A', max: 125 },
      { subject: 'Physics', internal: 37, external: 66, total: 103, grade: 'A', max: 125 },
      { subject: 'Chemistry', internal: 38, external: 68, total: 106, grade: 'A', max: 125 },
      { subject: 'English', internal: 33, external: 60, total: 93, grade: 'B+', max: 125 },
      { subject: 'Computer Sci', internal: 40, external: 74, total: 114, grade: 'A+', max: 125 },
    ],
    sem3: [
      { subject: 'Mathematics', internal: 37, external: 67, total: 104, grade: 'A', max: 125 },
      { subject: 'Physics', internal: 36, external: 64, total: 100, grade: 'A', max: 125 },
      { subject: 'Chemistry', internal: 39, external: 69, total: 108, grade: 'A', max: 125 },
      { subject: 'English', internal: 34, external: 61, total: 95, grade: 'B+', max: 125 },
      { subject: 'Computer Sci', internal: 40, external: 76, total: 116, grade: 'A+', max: 125 },
    ],
  };
  batch.set(db.collection('marks').doc(uid), marksData);
  batch.set(db.collection('assignments').doc(uid), {
    list: [
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
    ]
  });
  await batch.commit();
}

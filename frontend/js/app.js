// ── Navbar scroll effect ──
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 100; // Threshold for triggering the effect
  const headerLinks = document.querySelectorAll('header a[href^="#"]'); // Target only section links (Earnings, About, Contact)
  headerLinks.forEach(link => {
    if (scrolled) {
      link.classList.add('nav-link-scrolled');
    } else {
      link.classList.remove('nav-link-scrolled');
    }
  });
});


// ── Eye toggle ──
const eyeOpen   = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
const eyeClosed = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>';

function bindEye(btnId, iconId, inputId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const inp = document.getElementById(inputId);
    const hidden = inp.type === 'password';
    inp.type = hidden ? 'text' : 'password';
    document.getElementById(iconId).innerHTML = hidden ? eyeClosed : eyeOpen;
  });
}

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ── LOGIN page logic ──
let selectedRole = 'affiliate';

function handleSignIn() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  const btn   = document.getElementById('signInBtn');
  if (!email)                                         { showToast('⚠️ Please enter your email.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))     { showToast('⚠️ Enter a valid email address.'); return; }
  if (!pass)                                          { showToast('⚠️ Please enter your password.'); return; }
  btn.classList.add('loading');
  setTimeout(() => {
    btn.classList.remove('loading');
    const role = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
    showToast('✓ Signed in as ' + role);
    setTimeout(() => { window.location.href = '../../frontend/affiliator/affiliator-dashboard.html'; }, 1600);  // Redirect to Affiliate dashboard
  }, 1800);
}

// ── REGISTER page logic ──
function checkStrength() {
  const pw   = document.getElementById('regPassword').value;
  const fill = document.getElementById('strengthFill');
  let score  = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const widths = ['0%','25%','50%','75%','100%'];
  const colors = ['#e5e7eb','#ef4444','#f97316','#eab308','#22c55e'];
  fill.style.width      = widths[score];
  fill.style.background = colors[score];
}

// ── ADMIN LOGIN page logic ──
function handleAdminSignIn() {
  const email = document.getElementById('adminEmail').value.trim();
  const pass = document.getElementById('adminPassword').value;
  const btn = document.getElementById('adminSignInBtn');
  if (!email) { showToast('⚠️ Please enter your email.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('⚠️ Enter a valid email address.'); return; }
  if (!pass) { showToast('⚠️ Please enter your password.'); return; }
  btn.classList.add('loading');
  setTimeout(() => {
    btn.classList.remove('loading');
    showToast('✓ Signed in as Admin');
    setTimeout(() => { window.location.href = '../../frontend/admin/admin-dashboard.html'; }, 1600);  // Redirect to admin dashboard
  }, 1800);
}

function handleCreate() {
  const name    = document.getElementById('regName').value.trim();
  const email   = document.getElementById('regEmail').value.trim();
  const phone   = document.getElementById('regPhone').value.trim();
  const pass    = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const btn     = document.getElementById('createBtn');
  if (!name)                                          { showToast('⚠️ Please enter your full name.'); return; }
  if (!email)                                         { showToast('⚠️ Please enter your email.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))     { showToast('⚠️ Enter a valid email address.'); return; }
  if (!phone)                                         { showToast('⚠️ Please enter your phone number.'); return; }
  if (pass.length < 8)                                { showToast('⚠️ Password must be at least 8 characters.'); return; }
  if (pass !== confirm)                               { showToast('⚠️ Passwords do not match.'); return; }
  btn.classList.add('loading');
  setTimeout(() => {
    btn.classList.remove('loading');
    showToast('🎉 Account created! Redirecting to login…');
    setTimeout(() => { window.location.href = '../../frontend/affiliate/affiliate-login.html'; }, 1600);
  }, 1800);
}


// ── Init eye toggles after DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  bindEye('loginEyeBtn', 'loginEyeIcon', 'loginPassword');
  bindEye('regEyeBtn',   'regEyeIcon',   'regPassword');
  bindEye('regEyeBtn2',  'regEyeIcon2',  'regConfirm');
  bindEye('adminEyeBtn', 'adminEyeIcon', 'adminPassword'); 

  // Enter key
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    if (document.getElementById('signInBtn'))  handleSignIn();
    if (document.getElementById('createBtn'))  handleCreate();
    if (document.getElementById('adminSignInBtn')) handleAdminSignIn();  
  });
});

// Tailwind Custom Design
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'ku-deep':   '#3b0764',
            'ku-violet': '#7c3aed',
            'ku-purple': '#590C70',
            'ku-purple-dark': '#420954',
            'ku-purple-mid': '#824893',
            'ku-purple-light': '#AC85B7',
            'ku-purple-pale': '#D5C2DB',            
          },
          fontFamily: {
            playfair: ['"Playfair Display"', 'serif'],
            dm:       ['"DM Sans"', 'sans-serif'],
            poppins: ['Poppins', 'sans-serif'],
          },
          keyframes: {
            pulse: {
              '0%, 100%': { transform: 'scale(1)',   opacity: '0.6' },
              '50%':       { transform: 'scale(1.1)', opacity: '1'   },
            },
            fadeUp: {
              from: { opacity: '0', transform: 'translateY(24px)' },
              to:   { opacity: '1', transform: 'translateY(0)'    },
            },
            spin: { to: { transform: 'rotate(360deg)' } },
          },
          animation: {
            'pulse-slow':   'pulse 6s ease-in-out infinite',
            'pulse-slow-r': 'pulse 6s ease-in-out infinite reverse',
            'fade-up':      'fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both',
          },
        },
      },
    };

//Affiliate Password Recovery
  function handleForgotPassword() {
  const email = document.getElementById('forgotEmail').value.trim();
  const btn = document.getElementById('sendRecoveryBtn');
  if (!email) { showToast('⚠️ Please enter your email.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('⚠️ Enter a valid email address.'); return; }
  btn.classList.add('loading');
  setTimeout(() => {
    btn.classList.remove('loading');
    showToast('📧 Recovery email sent! Check your inbox.');
  }, 1800);
}





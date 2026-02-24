// ==========================================
// AFFILIATOR.JS — COMBINED SCRIPT
// Covers: Dashboard (single-page), and all
// split pages: Dashboard, Affiliate Links,
// Earnings, Analytics, Profile
// ==========================================


// ==========================================
// SIDEBAR TOGGLE
// ==========================================
let sidebarCollapsed = false;

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('mainContent');

    if (window.innerWidth <= 1024) {
        toggleMobileSidebar();
        return;
    }

    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed', sidebarCollapsed);
    main.classList.toggle('expanded', sidebarCollapsed);
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('show');
}

// Close mobile sidebar on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        document.getElementById('sidebarOverlay').classList.remove('show');
        document.getElementById('sidebar').classList.remove('mobile-open');
    }
});


// ==========================================
// PAGE NAVIGATION (single-page app only)
// Not used in split HTML pages — each page
// is its own file with direct <a href> links
// ==========================================
function navigateTo(page, navEl, event) {
    if (event) event.preventDefault();

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (navEl) navEl.classList.add('active');

    // Switch pages
    document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
    const targetPage = document.getElementById('page-' + page);
    if (targetPage) targetPage.classList.add('active');

    // Update top bar
    const titles = {
        dashboard: { title: 'Dashboard', subtitle: 'Welcome back, Diomar! Here\'s your overview.' },
        links: { title: 'Affiliate Links', subtitle: 'Manage and track your referral links.' },
        earnings: { title: 'Earnings', subtitle: 'Track your revenue and payouts.' },
        analytics: { title: 'Analytics', subtitle: 'Deep dive into your performance metrics.' },
        profile: { title: 'Profile', subtitle: 'Manage your account information.' }
    };

    if (titles[page]) {
        document.getElementById('pageTitle').textContent = titles[page].title;
        document.getElementById('pageSubtitle').textContent = titles[page].subtitle;
    }

    // Close mobile sidebar
    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.remove('mobile-open');
        document.getElementById('sidebarOverlay').classList.remove('show');
    }

    // Re-trigger animations
    triggerAnimations();

    // Draw charts if needed
    if (page === 'dashboard') {
        setTimeout(() => drawEarningsChart(), 200);
    } else if (page === 'earnings') {
        setTimeout(() => {
            const canvas = document.getElementById('earningsPageChart');
            if (canvas) { canvas.width = 0; canvas.height = 0; }
            drawEarningsPageChart();
        }, 50);
    } else if (page === 'analytics') {
        setTimeout(() => drawClicksChart(), 200);
    }

    // Close dropdowns
    const profileDropdown = document.getElementById('profileDropdown');
    const notifPanel = document.getElementById('notifPanel');
    if (profileDropdown) profileDropdown.classList.remove('show');
    if (notifPanel) notifPanel.classList.add('hidden');
}


// ==========================================
// ANIMATIONS
// ==========================================
function triggerAnimations() {
    // Animate performance bars
    setTimeout(() => {
        document.querySelectorAll('.performance-fill').forEach(bar => {
            const target = bar.getAttribute('data-width');
            if (target) {
                bar.style.width = target;
            }
        });
    }, 300);

    // Animate count-ups
    document.querySelectorAll('.count-up').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        if (!target) return;
        animateCounter(el, target);
    });
}

function animateCounter(el, target) {
    const prefix = el.textContent.includes('₱') ? '₱' : '';
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = prefix + Math.floor(current).toLocaleString();
    }, 30);
}


// ==========================================
// COPY LINK
// ==========================================
function copyLink(btn, link) {
    navigator.clipboard.writeText(link).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.add('copied');
        showToast('Link copied to clipboard!');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback for browsers without clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.add('copied');
        showToast('Link copied to clipboard!');
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}


// ==========================================
// GENERATE AFFILIATE LINK MODAL
// Used in: single-page app + affiliator-affiliatelinks.html
// ==========================================

function openModal() {
    const modal = document.getElementById('generateModal');
    modal.classList.add('show');

    // Reset everything
    document.getElementById('customUrlInput').value = '';
    document.getElementById('customResultBox').classList.add('hidden');
    document.getElementById('bulkUrlInput').value = '';
    document.getElementById('bulkResultBox').classList.add('hidden');
    document.getElementById('subIdSection').classList.add('hidden');
    document.getElementById('subIdArrow').style.transform = 'rotate(0deg)';
    ['subId1', 'subId2', 'subId3', 'subId4', 'bulkSubId'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const bulkSource = document.getElementById('bulkSource');
    if (bulkSource) bulkSource.value = '';
    updateUrlCounter();

    // Reset to first tab
    document.querySelectorAll('.modal-tab')[0].click();
}

function closeModal() {
    document.getElementById('generateModal').classList.remove('show');
}

// Tab switching inside modal
function switchModalTab(btn, tab) {
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
}

// Toggle Sub ID parameters section
function toggleSubIds() {
    const section = document.getElementById('subIdSection');
    const arrow = document.getElementById('subIdArrow');
    const isHidden = section.classList.contains('hidden');

    section.classList.toggle('hidden');
    arrow.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
}

// Validate URL format
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Live URL validation + bulk URL counter — set up on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Close modal on outside click (works for both single-page and split pages)
    const generateModal = document.getElementById('generateModal');
    if (generateModal) {
        generateModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }

    // Live validation on custom URL input
    const urlInput = document.getElementById('customUrlInput');
    if (urlInput) {
        urlInput.addEventListener('input', function () {
            const val = this.value.trim();
            this.classList.remove('url-valid', 'url-invalid');
            if (val.length > 5) {
                this.classList.add(isValidUrl(val) ? 'url-valid' : 'url-invalid');
            }
        });
    }

    // Live counter on bulk URL textarea
    const bulkInput = document.getElementById('bulkUrlInput');
    if (bulkInput) {
        bulkInput.addEventListener('input', updateUrlCounter);
    }
});

// URL counter for bulk tab
function updateUrlCounter() {
    const textarea = document.getElementById('bulkUrlInput');
    const counter = document.getElementById('urlCounter');
    if (!textarea || !counter) return;

    const lines = textarea.value.split('\n').filter(line => line.trim() !== '');
    const isOver = lines.length > 5;

    counter.innerHTML = `<span class="${isOver ? 'text-red-500' : 'text-primary-dark'}">${lines.length}</span><span class="text-gray-400">/5 URLs</span>`;
}

// Build the affiliate URL from an original URL + optional sub IDs
function buildAffiliateUrl(originalUrl, subIds = {}) {
    const affiliateBase = 'https://kusina.ph/aff/';
    const affiliateId = 'KU-AFF-0042';

    let slug = '';
    try {
        const url = new URL(originalUrl);
        slug = url.pathname.replace(/^\//, '').replace(/\//g, '-') || 'home';
    } catch (e) {
        slug = 'custom-' + Math.random().toString(36).substring(2, 8);
    }

    let affiliateLink = `${affiliateBase}${affiliateId}/${slug}`;

    // Append sub IDs as query params
    const params = [];
    Object.entries(subIds).forEach(([key, value]) => {
        if (value && value.trim()) {
            params.push(`${key}=${encodeURIComponent(value.trim())}`);
        }
    });

    if (params.length > 0) {
        affiliateLink += '?' + params.join('&');
    }

    return affiliateLink;
}

// Generate a single custom affiliate link
function generateCustomLink() {
    const urlInput = document.getElementById('customUrlInput');
    const url = urlInput.value.trim();
    const btn = document.getElementById('generateCustomBtn');

    if (!url) {
        urlInput.classList.add('url-invalid');
        urlInput.focus();
        showToast('Please paste a URL to convert!', 'warning');
        return;
    }

    if (!isValidUrl(url)) {
        urlInput.classList.add('url-invalid');
        showToast('Please enter a valid URL (include https://)', 'warning');
        return;
    }

    // Show loading state on button
    btn.classList.add('btn-loading');
    btn.innerHTML = '<i class="fas fa-spinner"></i> Generating...';

    // Gather sub IDs
    const subIds = {
        sub_id1: document.getElementById('subId1')?.value || '',
        sub_id2: document.getElementById('subId2')?.value || '',
        sub_id3: document.getElementById('subId3')?.value || '',
        sub_id4: document.getElementById('subId4')?.value || ''
    };

    // Simulate short processing delay
    setTimeout(() => {
        const affiliateLink = buildAffiliateUrl(url, subIds);

        document.getElementById('customResultLink').value = affiliateLink;
        document.getElementById('customResultBox').classList.remove('hidden');

        // Reset button
        btn.classList.remove('btn-loading');
        btn.innerHTML = '<i class="fas fa-bolt"></i> Convert to Affiliate Link';

        // Add to links table (if present on the page)
        addLinkToTable(url, affiliateLink);

        showToast('Affiliate link generated successfully!');

        // Scroll result into view inside modal
        document.getElementById('customResultBox').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 800);
}

// Reset the custom link form for a new entry
function generateAnother() {
    document.getElementById('customUrlInput').value = '';
    document.getElementById('customUrlInput').classList.remove('url-valid', 'url-invalid');
    document.getElementById('customResultBox').classList.add('hidden');
    document.getElementById('customUrlInput').focus();
}

// Generate affiliate links in bulk (up to 5 URLs)
function generateBulkLinks() {
    const textarea = document.getElementById('bulkUrlInput');
    const lines = textarea.value.split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0) {
        showToast('Please paste at least one URL!', 'warning');
        textarea.focus();
        return;
    }

    if (lines.length > 5) {
        showToast('Maximum 5 URLs allowed! Remove extra lines.', 'warning');
        return;
    }

    // Validate all URLs before generating
    const invalidUrls = lines.filter(line => !isValidUrl(line.trim()));
    if (invalidUrls.length > 0) {
        showToast(`${invalidUrls.length} invalid URL(s) found. Please check your links.`, 'warning');
        return;
    }

    const bulkSubId = document.getElementById('bulkSubId')?.value || '';
    const bulkSource = document.getElementById('bulkSource')?.value || '';
    const subIds = {};
    if (bulkSubId) subIds.sub_id1 = bulkSubId;
    if (bulkSource) subIds.sub_id2 = bulkSource;

    const resultList = document.getElementById('bulkResultList');
    resultList.innerHTML = '';

    // Generate and render each link
    lines.forEach((line, index) => {
        const originalUrl = line.trim();
        const affiliateLink = buildAffiliateUrl(originalUrl, subIds);

        const item = document.createElement('div');
        item.className = 'bulk-link-item';
        item.style.animation = `fadeIn 0.3s ease ${index * 0.1}s forwards`;
        item.style.opacity = '0';
        item.innerHTML = `
            <span class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold text-primary">${index + 1}</span>
            </span>
            <input type="text" value="${affiliateLink}"
                   class="flex-1 bg-transparent text-xs text-primary-dark outline-none font-mono truncate"
                   readonly id="bulkLink${index}">
            <button onclick="copyResultLink('bulkLink${index}', this)" class="copy-btn text-xs flex-shrink-0">
                <i class="fas fa-copy"></i>
            </button>
        `;
        resultList.appendChild(item);

        // Also add to the main links table
        addLinkToTable(originalUrl, affiliateLink);
    });

    document.getElementById('bulkResultBox').classList.remove('hidden');
    showToast(`${lines.length} affiliate link(s) generated!`);
}

// Copy a single result link by input element ID
function copyResultLink(inputId, btn) {
    const input = document.getElementById(inputId);
    const link = input.value;

    navigator.clipboard.writeText(link).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.add('copied');
        showToast('Link copied to clipboard!');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback
        input.select();
        document.execCommand('copy');
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.add('copied');
        showToast('Link copied to clipboard!');
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy mr-1"></i> Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// Copy all bulk generated links at once
function copyAllBulkLinks() {
    const links = [];
    document.querySelectorAll('#bulkResultList input').forEach(input => {
        links.push(input.value);
    });
    const allLinks = links.join('\n');

    navigator.clipboard.writeText(allLinks).then(() => {
        showToast(`${links.length} links copied to clipboard!`);
    });
}

// Open share dialog for Facebook or Twitter
function shareLink(inputId, platform) {
    const link = document.getElementById(inputId).value;
    const text = encodeURIComponent('Check out this course from Kusina University!');
    const encodedLink = encodeURIComponent(link);

    let shareUrl = '';
    if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodedLink}`;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    showToast(`Opening ${platform} share dialog...`);
}

// Add a newly generated link as a new row in the links table
function addLinkToTable(originalUrl, affiliateLink) {
    const tbody = document.getElementById('linksTableBody');
    if (!tbody) return;

    // Derive a human-readable product name from the URL path
    let productName = 'Custom Link';
    try {
        const url = new URL(originalUrl);
        const path = url.pathname.split('/').filter(p => p);
        if (path.length > 0) {
            productName = path[path.length - 1]
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
        }
    } catch (e) {
        productName = 'Custom Link';
    }

    // Truncate for display
    const shortLink = affiliateLink.replace('https://', '').substring(0, 35) + '...';

    const newRow = document.createElement('tr');
    newRow.style.animation = 'fadeIn 0.5s ease';
    newRow.innerHTML = `
        <td class="font-medium">${productName}</td>
        <td><code class="text-xs bg-bg-light px-2 py-1 rounded text-primary">${shortLink}</code></td>
        <td>0</td>
        <td>0</td>
        <td class="font-semibold text-green-600">₱0</td>
        <td><span class="status-badge status-active">Active</span></td>
        <td>
            <button class="copy-btn" onclick="copyLink(this, '${affiliateLink}')">
                <i class="fas fa-copy"></i> Copy
            </button>
        </td>
    `;
    tbody.insertBefore(newRow, tbody.firstChild);
}


// ==========================================
// FILTER LINKS TABLE
// Used in: single-page app + affiliator-affiliatelinks.html
// ==========================================
function filterLinks(query) {
    const rows = document.querySelectorAll('#linksTableBody tr');
    query = query.toLowerCase();
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}


// ==========================================
// TOAST NOTIFICATION
// Used in: all pages
// ==========================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastMessage.textContent = message;

    if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle text-yellow-400';
    } else {
        toastIcon.className = 'fas fa-check-circle text-green-400';
    }

    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
    }, 3000);
}


// ==========================================
// DROPDOWN TOGGLES
// Used in: all pages
// ==========================================
function toggleProfileDropdown() {
    document.getElementById('profileDropdown').classList.toggle('show');
    const notifPanel = document.getElementById('notifPanel');
    if (notifPanel) notifPanel.classList.add('hidden');
}

function toggleNotifications() {
    const notifPanel = document.getElementById('notifPanel');
    if (notifPanel) notifPanel.classList.toggle('hidden');
    document.getElementById('profileDropdown').classList.remove('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.relative') && !e.target.closest('#notifPanel')) {
        document.getElementById('profileDropdown').classList.remove('show');
    }
    if (!e.target.closest('#notifPanel') && !e.target.closest('[onclick*="toggleNotifications"]')) {
        const notifPanel = document.getElementById('notifPanel');
        if (notifPanel) notifPanel.classList.add('hidden');
    }
});


// ==========================================
// LOGOUT
// Used in: all pages
// ==========================================
function handleLogout(event) {
    if (event) event.preventDefault();
    showToast('Logging out...');
    setTimeout(() => {
        showToast('Redirecting to login page...');
        window.location.href = '../../frontend/affiliator/affiliator-login.html';
    }, 1500);
}


// ==========================================
// SAVE PROFILE
// Used in: single-page app + affiliator-profile.html
// ==========================================
function saveProfile(event) {
    event.preventDefault();
    showToast('Profile saved successfully!');
}


// ==========================================
// CHART: EARNINGS OVERVIEW (bar chart)
// Used in: single-page app + affiliator-dashboard.html
// ==========================================
function drawEarningsChart(type = 'weekly') {
    const canvas = document.getElementById('earningsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Set canvas size based on container
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 56;
    canvas.height = 280;

    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    let labels, data1, data2;

    if (type === 'weekly') {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data1 = [1200, 1800, 1500, 2200, 2800, 3200, 2400];
        data2 = [800, 1200, 1000, 1600, 2000, 2400, 1800];
    } else if (type === 'monthly') {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        data1 = [8500, 12000, 9800, 15200, 18500, 22000];
        data2 = [5200, 8000, 6500, 10000, 13000, 16000];
    } else {
        labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
        data1 = [45000, 68000, 95000, 125000, 180000, 210000];
        data2 = [30000, 45000, 65000, 85000, 120000, 155000];
    }

    const maxVal = Math.max(...data1, ...data2) * 1.15;

    ctx.clearRect(0, 0, w, h);

    // Draw static grid lines + Y-axis labels
    ctx.strokeStyle = '#F1EEF6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartH / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        const val = maxVal - (maxVal / 5) * i;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('₱' + (val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val.toFixed(0)), padding.left - 8, y + 4);
    }

    // Draw X-axis labels
    const barGroupWidth = chartW / labels.length;
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
        const x = padding.left + barGroupWidth * i + barGroupWidth / 2;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(label, x, h - 10);
    });

    // Animate bars growing up
    const barWidth = Math.min(barGroupWidth * 0.3, 24);
    const gap = 4;
    let progress = 0;

    function animateBars() {
        progress += 0.04;
        if (progress > 1) progress = 1;

        ctx.clearRect(padding.left, padding.top, chartW, chartH + 1);

        // Redraw grid lines inside chart area each frame
        ctx.strokeStyle = '#F1EEF6';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartH / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();
        }

        labels.forEach((label, i) => {
            const groupX = padding.left + barGroupWidth * i + barGroupWidth / 2;

            // Primary (dark) bar
            const h1 = (data1[i] / maxVal) * chartH * progress;
            const x1 = groupX - barWidth - gap / 2;
            const y1 = padding.top + chartH - h1;
            const grad1 = ctx.createLinearGradient(x1, y1, x1, padding.top + chartH);
            grad1.addColorStop(0, '#590C70');
            grad1.addColorStop(1, '#824893');
            ctx.fillStyle = grad1;
            roundRect(ctx, x1, y1, barWidth, h1, 4);

            // Secondary (light) bar
            const h2 = (data2[i] / maxVal) * chartH * progress;
            const x2 = groupX + gap / 2;
            const y2 = padding.top + chartH - h2;
            const grad2 = ctx.createLinearGradient(x2, y2, x2, padding.top + chartH);
            grad2.addColorStop(0, '#c4a7d4');
            grad2.addColorStop(1, '#ddd0e6');
            ctx.fillStyle = grad2;
            roundRect(ctx, x2, y2, barWidth, h2, 4);
        });

        if (progress < 1) requestAnimationFrame(animateBars);
    }
    animateBars();
}

// Helper: draw a rounded rectangle on a canvas context
function roundRect(ctx, x, y, width, height, radius) {
    if (height < 0) return;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

// Switch between Weekly / Monthly / Yearly chart tabs
function switchChartTab(btn, type) {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    drawEarningsChart(type);
}


// ==========================================
// CHART: CLICKS LINE CHART
// Used in: single-page app + affiliator-analytics.html
// ==========================================
function drawClicksChart() {
    const canvas = document.getElementById('clicksChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Walk up DOM to find ancestor with a real rendered width
    // (fixes the hidden-page zero-width bug)
    let container = canvas.parentElement;
    while (container && container.clientWidth === 0) {
        container = container.parentElement;
    }
    canvas.width = (container ? container.clientWidth : window.innerWidth - 300) - 56;
    canvas.height = 280;

    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const data = [320, 450, 380, 520, 480, 610, 550, 720, 680, 590, 430, 510, 640, 780, 850,
                  720, 690, 810, 750, 620, 540, 470, 580, 660, 730, 800, 710, 650, 580, 490];
    const labels = data.map((_, i) => i + 1);
    const maxVal = Math.max(...data) * 1.15;

    ctx.clearRect(0, 0, w, h);

    // Static grid + Y-axis labels
    ctx.strokeStyle = '#F1EEF6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartH / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(w - padding.right, y);
        ctx.stroke();

        const val = maxVal - (maxVal / 5) * i;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(val).toString(), padding.left - 8, y + 4);
    }

    // Animate line drawing left to right
    let progress = 0;
    function animateLine() {
        progress += 0.03;
        if (progress > 1) progress = 1;

        ctx.clearRect(padding.left, 0, chartW + padding.right, h);

        // Redraw grid each frame
        ctx.strokeStyle = '#F1EEF6';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartH / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();
        }

        const pointsToShow = Math.ceil(data.length * progress);
        const stepX = chartW / (data.length - 1);

        // Area fill under the line
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartH);
        for (let i = 0; i < pointsToShow; i++) {
            const x = padding.left + stepX * i;
            const y = padding.top + chartH - (data[i] / maxVal) * chartH;
            ctx.lineTo(x, y);
        }
        const lastX = padding.left + stepX * (pointsToShow - 1);
        ctx.lineTo(lastX, padding.top + chartH);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        gradient.addColorStop(0, 'rgba(89, 12, 112, 0.15)');
        gradient.addColorStop(1, 'rgba(89, 12, 112, 0.01)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Stroke the line
        ctx.beginPath();
        ctx.strokeStyle = '#590C70';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        for (let i = 0; i < pointsToShow; i++) {
            const x = padding.left + stepX * i;
            const y = padding.top + chartH - (data[i] / maxVal) * chartH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Data point dots (every 5th + last)
        for (let i = 0; i < pointsToShow; i++) {
            const x = padding.left + stepX * i;
            const y = padding.top + chartH - (data[i] / maxVal) * chartH;
            if (i % 5 === 0 || i === pointsToShow - 1) {
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#590C70';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            }
        }

        // X-axis day labels
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        for (let i = 0; i < data.length; i += 5) {
            const x = padding.left + stepX * i;
            ctx.fillText('Day ' + labels[i], x, h - 10);
        }

        if (progress < 1) requestAnimationFrame(animateLine);
    }
    animateLine();
}


// ==========================================
// CHART: REVENUE BREAKDOWN (multi-line)
// Used in: single-page app + affiliator-earnings.html
// FIX: walks up DOM to get real container width,
// and uses drawStaticLayer() to preserve axis
// labels during animation clearRect calls
// ==========================================
function drawEarningsPageChart() {
    const canvas = document.getElementById('earningsPageChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Walk up DOM to find ancestor with a real rendered width
    // (fixes the hidden-page zero-width bug on single-page app)
    let container = canvas.parentElement;
    while (container && container.clientWidth === 0) {
        container = container.parentElement;
    }
    const containerWidth = container ? container.clientWidth : window.innerWidth - 300;
    canvas.width = containerWidth - 56;
    canvas.height = 280;

    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const datasets = [
        { data: [3200, 4500, 3800, 5200, 6800, 7500], color: '#590C70', label: 'Masterclass' },
        { data: [2100, 3000, 2500, 3800, 4200, 5000], color: '#824893', label: 'Baking 101' },
        { data: [1500, 2200, 1800, 2800, 3500, 4000], color: '#c4a7d4', label: 'Others' },
    ];

    const maxVal = Math.max(...datasets.flatMap(d => d.data)) * 1.15;
    const stepX = chartW / (labels.length - 1);

    ctx.clearRect(0, 0, w, h);

    // Draw static grid, Y-axis labels, and X-axis labels
    // Called both before animation and inside each frame so
    // clearRect doesn't wipe the axis text
    function drawStaticLayer() {
        ctx.strokeStyle = '#F1EEF6';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartH / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();

            const val = maxVal - (maxVal / 5) * i;
            ctx.fillStyle = '#9ca3af';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('₱' + (val / 1000).toFixed(1) + 'K', padding.left - 8, y + 4);
        }

        // X-axis month labels
        ctx.textAlign = 'center';
        labels.forEach((label, i) => {
            ctx.fillStyle = '#9ca3af';
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(label, padding.left + stepX * i, h - 10);
        });
    }

    let progress = 0;
    function animate() {
        progress += 0.03;
        if (progress > 1) progress = 1;

        // Only clear the inner chart area so axis labels outside it are preserved
        ctx.clearRect(padding.left, 0, chartW + padding.right + 1, h - padding.bottom + 1);

        // Redraw static layer every frame (grid lines are inside the cleared area)
        drawStaticLayer();

        datasets.forEach((ds) => {
            const pointsToShow = Math.ceil(ds.data.length * progress);

            // Area fill under each line
            ctx.beginPath();
            ctx.moveTo(padding.left, padding.top + chartH);
            for (let i = 0; i < pointsToShow; i++) {
                const x = padding.left + stepX * i;
                const y = padding.top + chartH - (ds.data[i] / maxVal) * chartH;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(padding.left + stepX * (pointsToShow - 1), padding.top + chartH);
            ctx.closePath();
            ctx.fillStyle = ds.color + '15';
            ctx.fill();

            // Stroke the line
            ctx.beginPath();
            ctx.strokeStyle = ds.color;
            ctx.lineWidth = 2.5;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            for (let i = 0; i < pointsToShow; i++) {
                const x = padding.left + stepX * i;
                const y = padding.top + chartH - (ds.data[i] / maxVal) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Data point dots
            for (let i = 0; i < pointsToShow; i++) {
                const x = padding.left + stepX * i;
                const y = padding.top + chartH - (ds.data[i] / maxVal) * chartH;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = ds.color;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            }
        });

        if (progress < 1) requestAnimationFrame(animate);
    }

    // Draw static layer once before animation starts, then begin
    drawStaticLayer();
    animate();
}


// ==========================================
// INITIALIZATION
// Used in: single-page app (multi-page apps
// each call their own chart on window load)
// ==========================================
window.addEventListener('load', () => {
    triggerAnimations();
    setTimeout(() => drawEarningsChart(), 400);
});


// ==========================================
// RESIZE HANDLER — redraw active chart
// Used in: all pages
// ==========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Single-page app: check which section is active
        const activePage = document.querySelector('.page-section.active');
        if (activePage) {
            if (activePage.id === 'page-dashboard') drawEarningsChart();
            if (activePage.id === 'page-earnings') drawEarningsPageChart();
            if (activePage.id === 'page-analytics') drawClicksChart();
            return;
        }
        // Split-page apps: redraw whichever chart canvas exists on this page
        if (document.getElementById('earningsChart')) drawEarningsChart();
        if (document.getElementById('earningsPageChart')) drawEarningsPageChart();
        if (document.getElementById('clicksChart')) drawClicksChart();
    }, 250);
});
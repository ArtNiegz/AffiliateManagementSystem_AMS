    // ============================================================
    // ADMIN.JS — Shared scripts for all Kusina University admin pages
    // ============================================================


    // ==========================================
    // SIDEBAR TOGGLE
    // ==========================================
    let sidebarCollapsed = false;

    function toggleSidebar() {
        if (window.innerWidth <= 1024) {
            toggleMobileSidebar();
            return;
        }
        sidebarCollapsed = !sidebarCollapsed;
        const sidebar = document.getElementById('sidebar');
        const main    = document.getElementById('mainContent');
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
        if (main) main.classList.toggle('expanded', sidebarCollapsed);
    }

    function toggleMobileSidebar() {
        document.getElementById('sidebar').classList.toggle('mobile-open');
        document.getElementById('sidebarOverlay').classList.toggle('show');
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            const overlay = document.getElementById('sidebarOverlay');
            if (overlay) overlay.classList.remove('show');
            document.getElementById('sidebar').classList.remove('mobile-open');
        }
    });


    // ==========================================
    // NOTIFICATION PANEL
    // Notifications are admin-specific reminders:
    // payout requests, new affiliates, alerts, etc.
    // ==========================================

    // Admin notification data — different per page context,
    // but the panel structure and toggle logic is shared here.
    const adminNotifications = [
        {
            id: 1,
            type: 'payout',
            icon: 'fa-money-bill-wave',
            title: '2 Payout Requests Pending',
            text: 'Maria Santos & Juan Dela Cruz are awaiting approval.',
            time: '5m ago',
            unread: true
        },
        {
            id: 2,
            type: 'affiliate',
            icon: 'fa-user-plus',
            title: 'New Affiliate Registered',
            text: 'Roberto Reyes joined the affiliate program.',
            time: '23m ago',
            unread: true
        },
        {
            id: 3,
            type: 'alert',
            icon: 'fa-exclamation-triangle',
            title: 'Commission Rate Override',
            text: 'Ana Rodriguez\'s custom rate was updated to 20%.',
            time: '1h ago',
            unread: true
        },
        {
            id: 4,
            type: 'info',
            icon: 'fa-chart-line',
            title: 'Monthly Report Ready',
            text: 'February 2026 affiliate performance report is ready.',
            time: '3h ago',
            unread: false
        },
        {
            id: 5,
            type: 'success',
            icon: 'fa-check-circle',
            title: 'Payout Completed',
            text: 'Carlos Mendoza\'s payout of ₱8,900 was processed.',
            time: '1d ago',
            unread: false
        },
        {
            id: 6,
            type: 'alert',
            icon: 'fa-link',
            title: 'Suspicious Link Activity',
            text: 'Unusual click spike detected on link /ref/CM901234.',
            time: '2d ago',
            unread: false
        }
    ];

    let unreadCount = adminNotifications.filter(n => n.unread).length;

    // Build and inject the notification panel HTML into the topbar
    function initNotifPanel() {
        const container = document.getElementById('notifContainer');
        if (!container) return;

        container.innerHTML = `
            <button class="topbar-icon-btn" id="notifBtn" onclick="toggleNotifications(event)">
                <i class="fas fa-bell"></i>
                ${unreadCount > 0 ? `<span class="notif-dot" id="notifDot"></span>` : ''}
            </button>
            <div class="notif-panel hidden" id="notifPanel">
                <div class="notif-header">
                    <h4>Notifications <span style="font-size:11px;font-weight:500;color:var(--text-muted);">(${unreadCount} unread)</span></h4>
                    <button onclick="markAllRead()">Mark all read</button>
                </div>
                <div class="notif-list" id="notifList"></div>
                <div class="notif-footer"><a href="#">View all notifications</a></div>
            </div>
        `;

        renderNotifications();
    }

    function renderNotifications() {
        const list = document.getElementById('notifList');
        if (!list) return;

        list.innerHTML = adminNotifications.map(n => `
            <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="readNotif(${n.id})">
                <div class="notif-icon ${n.type}">
                    <i class="fas ${n.icon}"></i>
                </div>
                <div class="notif-item-content">
                    <div class="notif-item-title">${n.title}</div>
                    <div class="notif-item-text">${n.text}</div>
                </div>
                <div class="notif-item-time">${n.time}</div>
            </div>
        `).join('');
    }

    function toggleNotifications(event) {
        if (event) event.stopPropagation();
        const panel = document.getElementById('notifPanel');
        if (!panel) return;
        panel.classList.toggle('hidden');

        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }

    function readNotif(id) {
        const n = adminNotifications.find(n => n.id === id);
        if (n && n.unread) {
            n.unread = false;
            unreadCount = Math.max(0, unreadCount - 1);
            renderNotifications();
            updateNotifBadge();
        }
    }

    function markAllRead() {
        adminNotifications.forEach(n => n.unread = false);
        unreadCount = 0;
        renderNotifications();
        updateNotifBadge();
    }

    function updateNotifBadge() {
        const dot = document.getElementById('notifDot');
        const header = document.querySelector('.notif-header h4');
        if (dot) {
            dot.style.display = unreadCount > 0 ? 'block' : 'none';
        }
        if (header) {
            header.innerHTML = `Notifications <span style="font-size:11px;font-weight:500;color:var(--text-muted);">(${unreadCount} unread)</span>`;
        }
    }


    // ==========================================
    // PROFILE DROPDOWN
    // ==========================================
    function toggleProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) dropdown.classList.toggle('show');
        const panel = document.getElementById('notifPanel');
        if (panel) panel.classList.add('hidden');
    }

    // Close both panels when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('profileDropdown');
        const notifPanel = document.getElementById('notifPanel');

        if (dropdown && !e.target.closest('#profileDropdownContainer')) {
            dropdown.classList.remove('show');
        }
        if (notifPanel && !e.target.closest('#notifContainer')) {
            notifPanel.classList.add('hidden');
        }
    });


    // ==========================================
    // LOGOUT
    // ==========================================
    function handleLogout(event) {
        if (event) event.preventDefault();
        showToast('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = '../../frontend/admin/admin-login.html';
        }, 1500);
    }


    // ==========================================
    // TOAST NOTIFICATION
    // ==========================================
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');

        if (!toast) return;

        toastMsg.textContent = message;

        const icons = {
            success: 'fa-check-circle',
            error:   'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info:    'fa-info-circle'
        };

        toastIcon.className = `fas ${icons[type] || icons.success}`;
        toast.className = `toast show ${type}`;

        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }


    // ==========================================
    // MOBILE MENU
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
        if (sidebarToggleBtn) {
            sidebarToggleBtn.addEventListener('click', toggleSidebar);
        }

        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => toggleSidebar());
        }

        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                document.getElementById('sidebar').classList.remove('mobile-open');
                overlay.classList.remove('show');
            });
        }

        initNotifPanel();
    });


    // ==========================================
    // PAGE-SPECIFIC DATA STORES
    // ==========================================

    const affiliatesData = [
        { id: 1, name: 'Maria Santos',   email: 'maria.santos@email.com',   status: 'active',    clicks: 12453, earnings: '₱68,420', commission: 18 },
        { id: 2, name: 'Juan Dela Cruz', email: 'juan.delacruz@email.com',  status: 'active',    clicks: 9823,  earnings: '₱54,230', commission: 18 },
        { id: 3, name: 'Ana Rodriguez',  email: 'ana.rodriguez@email.com',  status: 'active',    clicks: 8765,  earnings: '₱48,950', commission: 20 },
        { id: 4, name: 'Carlos Mendoza', email: 'carlos.mendoza@email.com', status: 'suspended', clicks: 7654,  earnings: '₱42,110', commission: 18 },
        { id: 5, name: 'Lisa Garcia',    email: 'lisa.garcia@email.com',    status: 'active',    clicks: 6543,  earnings: '₱38,780', commission: 15 }
    ];

    const linksData = [
        { id: 1, affiliate: 'Maria Santos',   product: 'Kusina Masterclass Bundle',  link: 'https://kusina.ph/ref/MS123456', clicks: 2453, conversions: 142, status: 'active'   },
        { id: 2, affiliate: 'Juan Dela Cruz', product: 'Baking 101: Fundamentals',   link: 'https://kusina.ph/ref/JD789012', clicks: 1823, conversions: 98,  status: 'active'   },
        { id: 3, affiliate: 'Ana Rodriguez',  product: 'Filipino Cuisine Mastery',   link: 'https://kusina.ph/ref/AR345678', clicks: 1567, conversions: 87,  status: 'active'   },
        { id: 4, affiliate: 'Carlos Mendoza', product: 'Pastry Arts Professional',   link: 'https://kusina.ph/ref/CM901234', clicks: 1234, conversions: 65,  status: 'disabled' },
        { id: 5, affiliate: 'Lisa Garcia',    product: 'Weekly Meal Prep Course',    link: 'https://kusina.ph/ref/LG567890', clicks: 987,  conversions: 54,  status: 'active'   }
    ];

    const payoutsData = [
        { id: 1, affiliate: 'Maria Santos',   amount: 15000, method: 'GCash',   date: '2026-02-10', status: 'pending'  },
        { id: 2, affiliate: 'Juan Dela Cruz', amount: 12500, method: 'PayPal',  date: '2026-02-09', status: 'pending'  },
        { id: 3, affiliate: 'Ana Rodriguez',  amount: 18200, method: 'PayMaya', date: '2026-02-08', status: 'approved' },
        { id: 4, affiliate: 'Carlos Mendoza', amount: 8900,  method: 'GCash',   date: '2026-02-07', status: 'paid'     },
        { id: 5, affiliate: 'Lisa Garcia',    amount: 22000, method: 'PayPal',  date: '2026-02-06', status: 'rejected' }
    ];

    let defaultCommissionRate = 18;
    const commissionRates = [
        { name: 'Maria Santos',   rate: 18, custom: false },
        { name: 'Juan Dela Cruz', rate: 18, custom: false },
        { name: 'Ana Rodriguez',  rate: 20, custom: true  },
        { name: 'Carlos Mendoza', rate: 18, custom: false },
        { name: 'Lisa Garcia',    rate: 15, custom: true  }
    ];


    // ==========================================
    // DASHBOARD PAGE CHARTS
    // Used in: admin-dashboard.html
    // ==========================================
    function initDashboardCharts() {
        const earningsEl = document.getElementById('earningsChart');
        const conversionEl = document.getElementById('conversionChart');

        if (earningsEl) {
            new Chart(earningsEl, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Earnings (₱)',
                        data: [145000, 178000, 165000, 210000, 195000, 245000],
                        backgroundColor: 'rgba(89,12,112,0.85)',
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#F1EEF6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        if (conversionEl) {
            new Chart(conversionEl, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Conversion Rate (%)',
                        data: [2.5, 3.2, 2.8, 4.1, 3.9, 4.5],
                        borderColor: '#824893',
                        backgroundColor: 'rgba(130,72,147,0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3,
                        pointBackgroundColor: '#590C70',
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#F1EEF6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    }


    // ==========================================
    // ANALYTICS PAGE CHARTS
    // Used in: admin-analytics.html
    // ==========================================
    function initAnalyticsCharts() {
        const revenueEl  = document.getElementById('revenueChart');
        const trafficEl  = document.getElementById('trafficChart');
        const deviceEl   = document.getElementById('deviceChart');
        const funnelEl   = document.getElementById('funnelChart');

        if (revenueEl) {
            new Chart(revenueEl, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Revenue (₱)',
                            data: [145000, 178000, 165000, 210000, 195000, 245000],
                            borderColor: '#590C70',
                            backgroundColor: 'rgba(89,12,112,0.08)',
                            tension: 0.4, fill: true, borderWidth: 3,
                            pointBackgroundColor: '#590C70', pointRadius: 5
                        },
                        {
                            label: 'Conversions',
                            data: [342, 456, 398, 521, 478, 612],
                            borderColor: '#C8A96A',
                            backgroundColor: 'rgba(200,169,106,0.08)',
                            tension: 0.4, fill: true, borderWidth: 3,
                            pointBackgroundColor: '#C8A96A', pointRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: true,
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#F1EEF6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        if (trafficEl) {
            new Chart(trafficEl, {
                type: 'doughnut',
                data: {
                    labels: ['Facebook', 'Instagram', 'Twitter', 'Direct', 'Others'],
                    datasets: [{
                        data: [4500, 3200, 2100, 1800, 1200],
                        backgroundColor: ['#3b5998', '#E1306C', '#1DA1F2', '#590C70', '#824893'],
                        borderWidth: 3,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        if (deviceEl) {
            new Chart(deviceEl, {
                type: 'bar',
                data: {
                    labels: ['Desktop', 'Mobile', 'Tablet'],
                    datasets: [{
                        label: 'Users',
                        data: [5420, 8950, 2340],
                        backgroundColor: ['#590C70', '#824893', '#AC85B7'],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#F1EEF6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        if (funnelEl) {
            new Chart(funnelEl, {
                type: 'bar',
                data: {
                    labels: ['Visits', 'Clicks', 'Leads', 'Conversions'],
                    datasets: [{
                        label: 'Count',
                        data: [124583, 45230, 12456, 3842],
                        backgroundColor: ['#590C70', '#824893', '#AC85B7', '#C8A96A'],
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true, maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { beginAtZero: true, grid: { color: '#F1EEF6' } },
                        y: { grid: { display: false } }
                    }
                }
            });
        }
    }


    // ==========================================
    // AFFILIATES PAGE
    // Used in: admin-affiliates.html
    // ==========================================
    let currentEditId = null;

    function renderAffiliates() {
        const searchQuery  = (document.getElementById('searchInput')?.value || '').toLowerCase();
        const statusFilter = document.getElementById('statusFilter')?.value || 'all';

        const filtered = affiliatesData.filter(aff => {
            const matchSearch = aff.name.toLowerCase().includes(searchQuery) || aff.email.toLowerCase().includes(searchQuery);
            const matchStatus = statusFilter === 'all' || aff.status === statusFilter;
            return matchSearch && matchStatus;
        });

        const countEl = document.getElementById('totalCount');
        if (countEl) countEl.textContent = filtered.length;

        const tbody = document.getElementById('affiliatesTable');
        if (!tbody) return;

        tbody.innerHTML = filtered.map(aff => `
            <tr>
                <td>
                    <div class="flex items-center gap-3">
                        <div class="topbar-avatar" style="width:32px;height:32px;font-size:12px;">${aff.name.split(' ').map(w=>w[0]).join('')}</div>
                        <div>
                            <div style="font-weight:600;color:var(--text-dark);font-size:13px;">${aff.name}</div>
                            <div style="font-size:11px;color:var(--text-muted);">${aff.email}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-${aff.status}">${aff.status}</span></td>
                <td>${aff.clicks.toLocaleString()}</td>
                <td style="color:var(--primary);font-weight:600;">${aff.earnings}</td>
                <td>${aff.commission}%</td>
                <td>
                    <div class="flex gap-2">
                        <button class="btn-icon edit" onclick="editAffiliate(${aff.id})" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon ${aff.status === 'active' ? 'warn' : 'success'}" onclick="toggleAffiliateStatus(${aff.id})" title="${aff.status === 'active' ? 'Suspend' : 'Activate'}">
                            <i class="fas ${aff.status === 'active' ? 'fa-ban' : 'fa-check'}"></i>
                        </button>
                        <button class="btn-icon danger" onclick="deleteAffiliate(${aff.id})" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function editAffiliate(id) {
        const aff = affiliatesData.find(a => a.id === id);
        if (!aff) return;
        currentEditId = id;
        document.getElementById('editName').value       = aff.name;
        document.getElementById('editEmail').value      = aff.email;
        document.getElementById('editCommission').value = aff.commission;
        document.getElementById('editModal').classList.add('show');
    }

    function closeEditModal() {
        document.getElementById('editModal').classList.remove('show');
        currentEditId = null;
    }

    function saveEdit() {
        if (currentEditId === null) return;
        const aff = affiliatesData.find(a => a.id === currentEditId);
        if (!aff) return;
        aff.name       = document.getElementById('editName').value;
        aff.email      = document.getElementById('editEmail').value;
        aff.commission = parseFloat(document.getElementById('editCommission').value);
        renderAffiliates();
        closeEditModal();
        showToast('Affiliate updated successfully!');
    }

    function toggleAffiliateStatus(id) {
        const aff = affiliatesData.find(a => a.id === id);
        if (!aff) return;
        aff.status = aff.status === 'active' ? 'suspended' : 'active';
        renderAffiliates();
        showToast(`Affiliate ${aff.status === 'active' ? 'activated' : 'suspended'} successfully!`);
    }

    function deleteAffiliate(id) {
        if (!confirm('Are you sure you want to delete this affiliate?')) return;
        const idx = affiliatesData.findIndex(a => a.id === id);
        if (idx !== -1) {
            affiliatesData.splice(idx, 1);
            renderAffiliates();
            showToast('Affiliate deleted successfully!');
        }
    }


    // ==========================================
    // LINKS PAGE
    // Used in: admin-links.html
    // ==========================================
    function renderLinks() {
        const query    = (document.getElementById('searchInput')?.value || '').toLowerCase();
        const filtered = linksData.filter(l =>
            l.affiliate.toLowerCase().includes(query) ||
            l.product.toLowerCase().includes(query) ||
            l.link.toLowerCase().includes(query)
        );

        const countEl = document.getElementById('totalCount');
        if (countEl) countEl.textContent = filtered.length;

        const tbody = document.getElementById('linksTable');
        if (!tbody) return;

        tbody.innerHTML = filtered.map(l => `
            <tr>
                <td style="font-weight:600;">${l.affiliate}</td>
                <td style="font-size:12px;color:var(--text-muted);">${l.product}</td>
                <td style="font-size:12px;">
                    <code style="background:var(--bg-light);padding:3px 7px;border-radius:5px;color:var(--primary);font-size:11px;">
                        ${l.link.replace('https://','').substring(0,32)}...
                    </code>
                </td>
                <td>${l.clicks.toLocaleString()}</td>
                <td>${l.conversions}</td>
                <td><span class="badge badge-${l.status}">${l.status}</span></td>
                <td>
                    <div class="flex gap-2">
                        <button class="btn-icon ${l.status === 'active' ? 'warn' : 'success'}" onclick="toggleLinkStatus(${l.id})" title="${l.status === 'active' ? 'Disable' : 'Enable'}">
                            <i class="fas ${l.status === 'active' ? 'fa-ban' : 'fa-check'}"></i>
                        </button>
                        <button class="btn-icon" onclick="copyAdminLink('${l.link}')" title="Copy"><i class="fas fa-copy"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function toggleLinkStatus(id) {
        const link = linksData.find(l => l.id === id);
        if (!link) return;
        link.status = link.status === 'active' ? 'disabled' : 'active';
        renderLinks();
        showToast(`Link ${link.status === 'active' ? 'enabled' : 'disabled'} successfully!`);
    }

    function copyAdminLink(url) {
        navigator.clipboard.writeText(url).then(() => showToast('Link copied to clipboard!'));
    }


    // ==========================================
    // PAYOUTS PAGE
    // Used in: admin-payouts.html
    // ==========================================
    function renderPayouts() {
        updatePayoutSummary();

        const tbody = document.getElementById('payoutsTable');
        if (!tbody) return;

        tbody.innerHTML = payoutsData.map(p => `
            <tr>
                <td style="font-weight:600;">${p.affiliate}</td>
                <td style="color:var(--primary);font-weight:700;">₱${p.amount.toLocaleString()}</td>
                <td style="font-size:12px;">${p.method}</td>
                <td style="font-size:12px;color:var(--text-muted);">${p.date}</td>
                <td><span class="badge badge-${p.status}">${p.status}</span></td>
                <td>${getPayoutActions(p)}</td>
            </tr>
        `).join('');
    }

    function getPayoutActions(p) {
        if (p.status === 'pending') {
            return `
                <div class="flex gap-2">
                    <button class="btn btn-sm btn-success" onclick="approvePayout(${p.id})"><i class="fas fa-check"></i> Approve</button>
                    <button class="btn btn-sm btn-danger"  onclick="rejectPayout(${p.id})"><i class="fas fa-times"></i> Reject</button>
                </div>`;
        } else if (p.status === 'approved') {
            return `<button class="btn btn-sm btn-primary" onclick="markPaid(${p.id})"><i class="fas fa-money-bill"></i> Mark Paid</button>`;
        }
        return `<span style="font-size:12px;color:var(--text-muted);font-style:italic;">${p.status === 'paid' ? 'Completed' : 'Closed'}</span>`;
    }

    function updatePayoutSummary() {
        const pending  = payoutsData.filter(p => p.status === 'pending');
        const approved = payoutsData.filter(p => p.status === 'approved');
        const paid     = payoutsData.filter(p => p.status === 'paid');

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

        set('pendingAmount',  '₱' + pending.reduce((s, p) => s + p.amount, 0).toLocaleString());
        set('pendingCount',   pending.length);
        set('approvedAmount', '₱' + approved.reduce((s, p) => s + p.amount, 0).toLocaleString());
        set('approvedCount',  approved.length);
        set('paidAmount',     '₱' + paid.reduce((s, p) => s + p.amount, 0).toLocaleString());
        set('paidCount',      paid.length);
    }

    function approvePayout(id) {
        const p = payoutsData.find(p => p.id === id);
        if (p) { p.status = 'approved'; renderPayouts(); showToast('Payout approved!'); }
    }

    function rejectPayout(id) {
        const p = payoutsData.find(p => p.id === id);
        if (p) { p.status = 'rejected'; renderPayouts(); showToast('Payout rejected.', 'warning'); }
    }

    function markPaid(id) {
        const p = payoutsData.find(p => p.id === id);
        if (p) { p.status = 'paid'; renderPayouts(); showToast('Marked as paid!'); }
    }


    // ==========================================
    // COMMISSION SETTINGS PAGE
    // Used in: admin-comsettings.html
    // ==========================================
    function renderRates() {
        const tbody = document.getElementById('ratesTable');
        if (!tbody) return;

        tbody.innerHTML = commissionRates.map((aff, i) => `
            <tr>
                <td style="font-weight:600;">${aff.name}</td>
                <td>
                    <div class="flex items-center gap-2">
                        <input type="number" step="0.1" value="${aff.rate}"
                            onchange="updateRate(${i}, this.value)"
                            style="width:80px;padding:6px 10px;border:1.5px solid var(--border);border-radius:6px;font-size:13px;font-family:inherit;outline:none;"
                            onfocus="this.style.borderColor='var(--primary-light)'"
                            onblur="this.style.borderColor='var(--border)'">
                        <span style="font-size:12px;color:var(--text-muted);">%</span>
                    </div>
                </td>
                <td><span class="badge ${aff.custom ? 'badge-custom' : 'badge-default'}">${aff.custom ? 'Custom' : 'Default'}</span></td>
                <td>
                    ${aff.custom
                        ? `<button class="btn btn-ghost btn-sm" onclick="resetToDefault(${i})">Reset to Default</button>`
                        : ''}
                </td>
            </tr>
        `).join('');
    }

    function updateRate(index, newRate) {
        commissionRates[index].rate   = parseFloat(newRate);
        commissionRates[index].custom = true;
        renderRates();
        showToast('Commission rate updated!');
    }

    function resetToDefault(index) {
        commissionRates[index].rate   = defaultCommissionRate;
        commissionRates[index].custom = false;
        renderRates();
        showToast('Reset to default rate.');
    }

    function saveDefaultRate() {
        const input = document.getElementById('defaultRate');
        if (!input) return;
        defaultCommissionRate = parseFloat(input.value);
        showToast('Default commission rate saved!');
    }

    function createCampaign() {
        const name  = document.getElementById('campaignName')?.value;
        const rate  = document.getElementById('campaignRate')?.value;
        const start = document.getElementById('campaignStart')?.value;
        const end   = document.getElementById('campaignEnd')?.value;

        if (!name || !rate || !start || !end) {
            showToast('Please fill in all campaign fields.', 'warning');
            return;
        }

        showToast('Bonus campaign created successfully!');
        ['campaignName','campaignRate','campaignStart','campaignEnd'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const cb = document.getElementById('activateNow');
        if (cb) cb.checked = false;
    }


    // ==========================================
    // ADMIN PROFILE PAGE
    // Used in: admin-profile.html
    // All identifiers prefixed with "adminProfile_"
    // to avoid collisions with other page scripts.
    // ==========================================

    // Activity log entries — profile page only
    const adminProfile_activityLogs = [
        { action: 'Approved payout request',        ip: '192.168.1.1', datetime: '2026-02-10 14:35', dot: 'dot-green'  },
        { action: 'Updated affiliate commission rate', ip: '192.168.1.1', datetime: '2026-02-10 12:20', dot: 'dot-blue'   },
        { action: 'Disabled affiliate link',         ip: '192.168.1.1', datetime: '2026-02-09 16:45', dot: 'dot-orange' },
        { action: 'Created bonus campaign',          ip: '192.168.1.1', datetime: '2026-02-09 10:15', dot: 'dot-purple' },
        { action: 'Logged in',                       ip: '192.168.1.1', datetime: '2026-02-09 09:00', dot: 'dot-purple' }
    ];

    // Stored originals for reset — set on DOMContentLoaded
    let adminProfile_origName  = '';
    let adminProfile_origEmail = '';

    function adminProfile_renderActivityLogs() {
        const list = document.getElementById('activityList');
        if (!list) return;

        list.innerHTML = adminProfile_activityLogs.map((log, i) => {
            const isLast = i === adminProfile_activityLogs.length - 1;
            return `
                <li class="activity-item">
                    <div class="activity-dot-wrap">
                        <div class="activity-dot ${log.dot}"></div>
                        ${!isLast ? '<div class="activity-line"></div>' : ''}
                    </div>
                    <div class="activity-content">
                        <div class="activity-action">${log.action}</div>
                        <div class="activity-meta">
                            <span class="activity-ip">
                                <i class="fas fa-network-wired"></i>
                                IP: ${log.ip}
                            </span>
                            <span class="activity-time">
                                <i class="fas fa-clock"></i>
                                ${log.datetime}
                            </span>
                        </div>
                    </div>
                </li>
            `;
        }).join('');
    }

    function adminProfile_resetForm() {
        const nameEl  = document.getElementById('profileName');
        const emailEl = document.getElementById('profileEmail');
        if (!nameEl || !emailEl) return;
        nameEl.value  = adminProfile_origName;
        emailEl.value = adminProfile_origEmail;
        nameEl.classList.remove('input-success');
        emailEl.classList.remove('input-success');
    }

    function adminProfile_saveInfo() {
        const nameEl  = document.getElementById('profileName');
        const emailEl = document.getElementById('profileEmail');
        if (!nameEl || !emailEl) return;

        const name  = nameEl.value.trim();
        const email = emailEl.value.trim();

        if (!name || !email) {
            showToast('Please fill in all profile fields.', 'warning');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        nameEl.classList.add('input-success');
        emailEl.classList.add('input-success');

        // Update hero card
        const heroName  = document.querySelector('.profile-hero-name');
        const heroEmail = document.querySelector('.profile-hero-email');
        if (heroName)  heroName.textContent = name;
        if (heroEmail) heroEmail.innerHTML  = `<i class="fas fa-envelope" style="font-size:12px;opacity:0.8;"></i> ${email}`;

        // Sync topbar & sidebar display name
        document.querySelectorAll('.topbar-user-info p:first-child, .user-info-text p:first-child')
            .forEach(el => el.textContent = name);

        setTimeout(() => {
            nameEl.classList.remove('input-success');
            emailEl.classList.remove('input-success');
        }, 2000);

        showToast('Profile updated successfully!');
    }

    function adminProfile_togglePw(inputId, btn) {
        const input = document.getElementById(inputId);
        const icon  = btn.querySelector('i');
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    function adminProfile_checkStrength(val) {
        const bar   = document.getElementById('strengthBar');
        const fill  = document.getElementById('strengthFill');
        const label = document.getElementById('strengthLabel');
        if (!bar || !fill || !label) return;

        if (!val) { bar.style.display = 'none'; return; }
        bar.style.display = 'block';

        let score = 0;
        if (val.length >= 8)           score++;
        if (/[A-Z]/.test(val))         score++;
        if (/[0-9]/.test(val))         score++;
        if (/[^A-Za-z0-9]/.test(val))  score++;

        const levels = [
            { pct: '25%',  color: '#ef4444', text: 'Weak'   },
            { pct: '50%',  color: '#f59e0b', text: 'Fair'   },
            { pct: '75%',  color: '#3b82f6', text: 'Good'   },
            { pct: '100%', color: '#22c55e', text: 'Strong' }
        ];
        const lvl = levels[Math.max(0, score - 1)];
        fill.style.width      = lvl.pct;
        fill.style.background = lvl.color;
        label.style.color     = lvl.color;
        label.textContent     = lvl.text;
    }

    function adminProfile_changePassword() {
        const current = document.getElementById('currentPassword')?.value;
        const newPw   = document.getElementById('newPassword')?.value;
        const confirm = document.getElementById('confirmPassword')?.value;

        if (!current || !newPw || !confirm) {
            showToast('Please fill in all password fields.', 'warning');
            return;
        }
        if (newPw.length < 8) {
            showToast('New password must be at least 8 characters.', 'error');
            return;
        }
        if (newPw !== confirm) {
            showToast('Passwords do not match.', 'error');
            document.getElementById('confirmPassword').focus();
            return;
        }

        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value     = '';
        document.getElementById('confirmPassword').value = '';
        const bar = document.getElementById('strengthBar');
        if (bar) bar.style.display = 'none';

        showToast('Password changed successfully!');
    }

    // Init hook — called from the shared DOMContentLoaded above
    // but only runs if the profile page elements actually exist.
    function adminProfile_init() {
        const nameEl  = document.getElementById('profileName');
        const emailEl = document.getElementById('profileEmail');
        if (!nameEl || !emailEl) return;   // not the profile page, bail out

        adminProfile_origName  = nameEl.value;
        adminProfile_origEmail = emailEl.value;
        adminProfile_renderActivityLogs();
    }

    // Hook into the shared DOMContentLoaded listener
    document.addEventListener('DOMContentLoaded', adminProfile_init);

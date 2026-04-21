const STORAGE_USERS = 'aps_users';
const STORAGE_COMPLAINTS = 'aps_complaints';
const STORAGE_CURRENT = 'aps_current_user';

const showNotification = (message, type = 'info') => {
    const alertBox = document.createElement('div');
    alertBox.className = `note-toast note-${type}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.remove();
    }, 3000);
};

const saveUsers = (users) => localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
const saveComplaints = (complaints) => localStorage.setItem(STORAGE_COMPLAINTS, JSON.stringify(complaints));
const getComplaints = () => JSON.parse(localStorage.getItem(STORAGE_COMPLAINTS) || '[]');
const setCurrentUser = (user) => localStorage.setItem(STORAGE_CURRENT, JSON.stringify(user));
const getCurrentUser = () => JSON.parse(localStorage.getItem(STORAGE_CURRENT) || 'null');
const clearCurrentUser = () => localStorage.removeItem(STORAGE_CURRENT);

const redirect = (url) => {
    setTimeout(() => {
        window.location.href = url;
    }, 1200);
};

const getPageName = () => window.location.pathname.split('/').pop();

const initForms = () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = registerForm.name.value.trim();
            const email = registerForm.email.value.trim().toLowerCase();
            const password = registerForm.password.value.trim();
            const role = registerForm.role.value;
            const users = getUsers();

            if (users.some((user) => user.email === email)) {
                showNotification('Email already registered.', 'error');
                return;
            }

            users.push({ name, email, password, role });
            saveUsers(users);
            showNotification('Registration complete. Redirecting to login...', 'success');
            registerForm.reset();
            redirect('login.html');
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = loginForm.email.value.trim().toLowerCase();
            const password = loginForm.password.value.trim();
            const users = getUsers();
            const user = users.find((item) => item.email === email && item.password === password);

            if (!user) {
                showNotification('Invalid email or password.', 'error');
                return;
            }

            setCurrentUser(user);
            showNotification(`Welcome back, ${user.name}! Redirecting...`, 'success');
            loginForm.reset();
            redirect('dashboard.html');
        });
    }

    const complaintForm = document.getElementById('complaint-form');
    if (complaintForm) {
        complaintForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showNotification('Please login first.', 'error');
                redirect('login.html');
                return;
            }
            if (currentUser.role !== 'citizen') {
                showNotification('Only citizens can file complaints.', 'error');
                redirect('dashboard.html');
                return;
            }

            const title = complaintForm.title.value.trim();
            const category = complaintForm.category.value;
            const description = complaintForm.description.value.trim();
            const complaints = getComplaints();
            const id = Date.now();

            complaints.push({
                id,
                title,
                category,
                description,
                status: 'pending',
                userEmail: currentUser.email,
                userName: currentUser.name,
                createdAt: new Date().toISOString(),
            });
            saveComplaints(complaints);
            showNotification('Complaint filed successfully.', 'success');
            complaintForm.reset();
            redirect('dashboard.html');
        });
    }
};

const renderDashboard = () => {
    const dashboardArea = document.getElementById('dashboard-area');
    if (!dashboardArea) return;
    const currentUser = getCurrentUser();
    if (!currentUser) {
        dashboardArea.innerHTML = `
            <div class="dashboard-message">
                <h2>Sign in to access your dashboard</h2>
                <p>Login as a citizen or officer to view your cases and reports.</p>
                <a href="login.html" class="btn btn-primary">Login Now</a>
            </div>
        `;
        return;
    }

    const complaints = getComplaints();
    const visibleComplaints = currentUser.role === 'officer'
        ? complaints
        : complaints.filter((item) => item.userEmail === currentUser.email);

    const stats = visibleComplaints.reduce(
        (acc, item) => {
            acc[item.status] += 1;
            return acc;
        },
        { pending: 0, in_progress: 0, resolved: 0 }
    );

    dashboardArea.innerHTML = `
        <div class="dashboard-welcome">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Dashboard" class="dashboard-image">
            <h1>Welcome, ${currentUser.name}</h1>
            <p>${currentUser.role === 'officer' ? 'Review and update police reports.' : 'Track your complaint status and case progress.'}</p>
            <button id="logout-button" class="btn btn-outline">Logout</button>
        </div>
        <div class="dashboard-grid">
            <div class="status-card"><h2>Pending</h2><p>${stats.pending}</p></div>
            <div class="status-card"><h2>In Progress</h2><p>${stats.in_progress}</p></div>
            <div class="status-card"><h2>Resolved</h2><p>${stats.resolved}</p></div>
        </div>
        <div class="table-card">
            <h2>Recent Reports</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        ${currentUser.role === 'officer' ? '<th>Citizen</th>' : ''}
                        ${currentUser.role === 'officer' ? '<th>Update</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${visibleComplaints.map((complaint) => `
                        <tr>
                            <td>${complaint.id}</td>
                            <td>${complaint.title}</td>
                            <td>${complaint.category}</td>
                            <td>${complaint.status.replace('_', ' ')}</td>
                            ${currentUser.role === 'officer' ? `<td>${complaint.userName}</td>` : ''}
                            ${currentUser.role === 'officer' ? `<td><select class="status-select" data-id="${complaint.id}">
                                <option value="pending" ${complaint.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="in_progress" ${complaint.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                                <option value="resolved" ${complaint.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                            </select></td>` : ''}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('logout-button')?.addEventListener('click', () => {
        clearCurrentUser();
        showNotification('Logged out successfully.', 'success');
        redirect('login.html');
    });

    document.querySelectorAll('.status-select').forEach((select) => {
        select.addEventListener('change', (event) => {
            const complaintId = Number(event.target.dataset.id);
            const status = event.target.value;
            const complaints = getComplaints();
            const next = complaints.map((item) => item.id === complaintId ? { ...item, status } : item);
            saveComplaints(next);
            showNotification('Complaint status updated.', 'success');
            renderDashboard();
        });
    });
};

const initServiceButtons = () => {
    const buttons = document.querySelectorAll('.service-button');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const serviceName = button.dataset.service || button.textContent.trim();
            showNotification(`Opening ${serviceName} service...`, 'success');
            buttons.forEach((btn) => btn.classList.remove('active-service'));
            button.classList.add('active-service');
        });
    });
};

const initPage = () => {
    document.querySelectorAll('.main-nav a').forEach((link) => {
        if (link.href.includes('dashboard.html') || link.href.includes('complaint.html')) {
            link.addEventListener('click', (event) => {
                const currentUser = getCurrentUser();
                if (!currentUser) {
                    event.preventDefault();
                    showNotification('Please login to continue.', 'error');
                    redirect('login.html');
                }
            });
        }
    });

    initForms();
    const page = getPageName();
    if (page === 'dashboard.html') {
        renderDashboard();
    }
};

// Add cinematic fade-in effect on page load
window.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.features article, .step-card, .form-panel, .dashboard-panel, .hero');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
    initPage();
    initServiceButtons();
});

const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let userId = localStorage.getItem('userId');

// DOM Elements
const authSection = document.getElementById('authSection');
const mainSection = document.getElementById('mainSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginSubmit = document.getElementById('loginSubmit');
const registerSubmit = document.getElementById('registerSubmit');

// Initialize
if (token) {
    showMainSection();
} else {
    showAuthSection();
}

// Event Listeners
loginBtn.addEventListener('click', () => {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
});

registerBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

logoutBtn.addEventListener('click', logout);

loginSubmit.addEventListener('click', async () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            userId = data.userId;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            showMainSection();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Login failed');
    }
});

registerSubmit.addEventListener('click', async () => {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Registration failed');
    }
});

// Tasks
document.getElementById('addTask').addEventListener('click', async () => {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    
    if (!title) return;
    
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });
        
        if (response.ok) {
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            loadTasks();
        }
    } catch (error) {
        alert('Failed to add task');
    }
});

// Habits
document.getElementById('addHabit').addEventListener('click', async () => {
    const name = document.getElementById('habitName').value;
    const frequency = document.getElementById('habitFrequency').value;
    
    if (!name) return;
    
    try {
        const response = await fetch(`${API_URL}/habits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, frequency })
        });
        
        if (response.ok) {
            document.getElementById('habitName').value = '';
            document.getElementById('habitFrequency').value = '';
            loadHabits();
        }
    } catch (error) {
        alert('Failed to add habit');
    }
});

// Functions
function showAuthSection() {
    authSection.style.display = 'block';
    mainSection.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
}

function showMainSection() {
    authSection.style.display = 'none';
    mainSection.style.display = 'block';
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    loadTasks();
    loadHabits();
}

function logout() {
    token = null;
    userId = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    showAuthSection();
}

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const tasks = await response.json();
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.title} - ${task.description}</span>
                <div>
                    <button class="complete-btn" onclick="toggleTask(${task.id}, ${task.completed})">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            tasksList.appendChild(li);
        });
    } catch (error) {
        console.error('Failed to load tasks');
    }
}

async function loadHabits() {
    try {
        const response = await fetch(`${API_URL}/habits`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const habits = await response.json();
        const habitsList = document.getElementById('habitsList');
        habitsList.innerHTML = '';
        
        habits.forEach(habit => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${habit.name} - ${habit.frequency} (Streak: ${habit.streak})</span>
                <div>
                    <button class="complete-btn" onclick="incrementStreak(${habit.id}, '${habit.name}', '${habit.frequency}', ${habit.streak})">+1</button>
                    <button class="delete-btn" onclick="deleteHabit(${habit.id})">Delete</button>
                </div>
            `;
            habitsList.appendChild(li);
        });
    } catch (error) {
        console.error('Failed to load habits');
    }
}

async function toggleTask(taskId, completed) {
    try {
        await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed: !completed })
        });
        loadTasks();
    } catch (error) {
        alert('Failed to update task');
    }
}

async function deleteTask(taskId) {
    try {
        await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadTasks();
    } catch (error) {
        alert('Failed to delete task');
    }
}

async function incrementStreak(habitId, name, frequency, streak) {
    try {
        await fetch(`${API_URL}/habits/${habitId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, frequency, streak: streak + 1 })
        });
        loadHabits();
    } catch (error) {
        alert('Failed to update habit');
    }
}

async function deleteHabit(habitId) {
    try {
        await fetch(`${API_URL}/habits/${habitId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadHabits();
    } catch (error) {
        alert('Failed to delete habit');
    }
}

// Ta lentKonnect Modules JavaScript

// Mock API for simulating backend calls
const mockAPI = {
    // POST /api/credits/convert
    async convertCredits() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    newCreditBalance: 196,
                    newTokenBalance: 138,
                    convertedAmount: 49
                });
            }, 1000);
        });
    },
   
    // GET /api/tokens/balance
    async getTokenBalance() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    tokenBalance: 89,
                    creditBalance: 245
                });
            }, 500);
        });
    },
   
    // GET /api/notifications
    async getNotifications() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        message: "Credit Earned! You gained 5 credits for sharing a productivity tip.",
                        time: "2 hours ago",
                        type: "credit"
                    },
                    {
                        id: 2,
                        message: "Raffle Reminder: Don't forget to enter tonight's raffle draw!",
                        time: "5 hours ago",
                        type: "raffle"
                    }
                ]);
            }, 300);
        });
    },
   
    // POST /api/notifications/{id}/ack
    async acknowledgeNotification(id) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`Notification ${id} acknowledged`);
                resolve({ success: true });
            }, 200);
        });
    }
};

// ===========================================
// MODULE 7: CREDIT-TO-TOKEN CONVERSION
// ===========================================

function showConversionModal() {
    const modal = document.getElementById('conversionModal');
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('conversionModal');
    modal.classList.remove('show');
}

async function confirmConversion() {
    closeModal();
    showLoadingState();
   
    try {
        // POST /api/credits/convert
        const result = await mockAPI.convertCredits();
       
        if (result.success) {
            // Update balances in UI
            document.getElementById('creditBalance').textContent = result.newCreditBalance;
            document.getElementById('tokenBalance').textContent = result.newTokenBalance;
           
            // Hide conversion status after successful conversion
            const conversionStatus = document.getElementById('conversionStatus');
            conversionStatus.style.display = 'none';
           
            showSuccessPopup(`Converted ${result.convertedAmount} credits to TalentTokens!`);
        }
    } catch (error) {
        console.error('Conversion failed:', error);
        showErrorMessage('Conversion failed. Please try again.');
    } finally {
        hideLoadingState();
    }
}

async function checkBalance() {
    showLoadingState();
   
    try {
        // GET /api/tokens/balance
        const result = await mockAPI.getTokenBalance();
       
        // Update UI with fresh balance data
        document.getElementById('tokenBalance').textContent = result.tokenBalance;
        document.getElementById('creditBalance').textContent = result.creditBalance;
       
        showSuccessPopup('Balance updated successfully!');
    } catch (error) {
        console.error('Failed to fetch balance:', error);
        showErrorMessage('Failed to refresh balance. Please try again.');
    } finally {
        hideLoadingState();
    }
}

// ===========================================
// MODULE 8: NOTIFICATIONS & REMINDERS
// ===========================================

function dismissBanner() {
    const banner = document.getElementById('notificationBanner');
   
    // Add slide-up animation
    banner.style.animation = 'slideUp 0.3s ease-out';
   
    setTimeout(() => {
        banner.classList.add('hidden');
    }, 300);
   
    // POST /api/notifications/{id}/ack - mark banner as acknowledged
    mockAPI.acknowledgeNotification('banner-1');
}

async function loadNotifications() {
    try {
        // GET /api/notifications
        const notifications = await mockAPI.getNotifications();
       
        // Update notifications list (for demo, they're already rendered)
        console.log('Loaded notifications:', notifications);
       
        // In a real app, you would update the DOM here
        // updateNotificationsList(notifications);
       
    } catch (error) {
        console.error('Failed to load notifications:', error);
    }
}

function saveNotificationSettings() {
    // Collect settings from checkboxes
    const settings = {
        pushNotifications: document.getElementById('pushNotifications').checked,
        smsReminders: document.getElementById('smsReminders').checked,
        whatsappUpdates: document.getElementById('whatsappUpdates').checked
    };
   
    console.log('Saving notification settings:', settings);
   
    // Simulate API call to save settings
    // POST /api/user/notification-settings
   
    showSuccessPopup('Notification settings saved successfully!');
   
    // Edge case: Handle when user blocks browser notifications
    if (!settings.pushNotifications && 'Notification' in window && Notification.permission === 'denied') {
        console.log('User has blocked browser notifications - logging via API');
        // In production, this would log to your analytics API
        // analytics.track('notification_blocked', { reason: 'browser_permission_denied' });
    }
}

function testNotification() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            // Show test notification
            const notification = new Notification('TalentKonnect Test', {
                body: 'This is a test notification from TalentKonnect!',
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
           
            // Auto-close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
           
        } else if (Notification.permission !== 'denied') {
            // Request permission first
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('TalentKonnect Test', {
                        body: 'Notifications enabled successfully!',
                        icon: '/favicon.ico'
                    });
                } else {
                    showErrorMessage('Notification permission denied');
                }
            });
        } else {
            showErrorMessage('Notifications are blocked in your browser settings');
        }
    } else {
        showErrorMessage('Browser notifications are not supported');
    }
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function showSuccessPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.textContent = message;
    document.body.appendChild(popup);
   
    // Auto-remove after 2 seconds
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 2000);
}

function showLoadingState() {
    document.body.style.cursor = 'wait';
   
    // Disable buttons during loading
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
    });
}

function hideLoadingState() {
    document.body.style.cursor = 'default';
   
    // Re-enable buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
}

function showErrorMessage(message) {
    // In production, use a proper toast/notification system
    alert(message);
}

// ===========================================
// NAVIGATION & PAGE INTERACTION
// ===========================================

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
   
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
           
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
           
            // Smooth scroll to target section
            const target = item.getAttribute('href').substring(1);
            const targetElement = document.getElementById(target);
           
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===========================================
// INITIALIZATION & AUTO-FEATURES
// ===========================================

function simulateRealTimeNotifications() {
    // Simulate new notifications appearing
    const messages = [
        "🎯 New Gig Available! 5-minute survey task - Earn 3 credits",
        "💰 Bonus Credits! Double credits for next hour only",
        "🏆 Weekly Raffle Starting Soon! Get your entries ready",
        "📢 New Community Challenge: Share your workspace setup"
    ];
   
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every interval
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const banner = document.getElementById('notificationBanner');
           
            // Update banner content
            banner.innerHTML = `
                <div><strong>${randomMessage}</strong></div>
                <button class="close-btn" onclick="dismissBanner()">&times;</button>
            `;
           
            // Show banner if hidden
            banner.classList.remove('hidden');
            banner.style.animation = 'slideDown 0.3s ease-out';
        }
    }, 15000); // Check every 15 seconds
}

// ===========================================
// PAGE LOAD EVENT HANDLERS
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('TalentKonnect Modules Loaded');
   
    // Initialize navigation
    initializeNavigation();
   
    // Load initial notifications
    loadNotifications();
   
    // Start real-time notification simulation
    simulateRealTimeNotifications();
   
    // Check if user has notification permissions
    if ('Notification' in window && Notification.permission === 'default') {
        console.log('Notification permission not set - will request when user tests notifications');
    }
   
    // Initialize tooltips (if using a tooltip library)
    // initializeTooltips();
   
    console.log('All modules initialized successfully');
});

// Handle page visibility changes (for pausing notifications when tab is not active)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - reducing notification frequency');
    } else {
        console.log('Page visible - resuming normal notification frequency');
        loadNotifications(); // Refresh notifications when user returns
    }
});

// ===========================================
// ERROR HANDLING
// ===========================================

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, send errors to monitoring service
    // errorTracker.track(e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault(); // Prevent default browser error handling
});
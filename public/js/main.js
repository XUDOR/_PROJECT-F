document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-menu a');
    const loadingIndicator = document.querySelector('.loading');
    const notificationsDiv = document.getElementById('notifications');
    const restartButton = document.getElementById('restart-polling-btn');

    let retryCount = 0;
    const maxRetries = 5;
    let pollingInterval;

    // Navigation handling
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.dataset.section;
            handleNavigation(section);
        });
    });

    // Handle navigation with loading state
    function handleNavigation(section) {
        showLoading();

        // Simulate API call or page load
        setTimeout(() => {
            hideLoading();
            updateContent(section);
        }, 1000);
    }

    // Loading state functions
    function showLoading() {
        loadingIndicator.style.display = 'block';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    // Update content based on section
    function updateContent(section) {
        console.log(`Navigating to ${section}`);
    }

    // Function to display a notification
    function displayNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.classList.add('notification-item');
        notificationsDiv.appendChild(notification);
        console.log(message);
    }

    // Fetch notifications from an API endpoint
    async function fetchNotification() {
        try {
            const response = await fetch('/api/notifications');
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            const data = await response.json();
            displayNotification(`New job posted: ${data.job_title} at ${data.company_name}`);
            retryCount = 0; // Reset retry count on success
        } catch (error) {
            console.error('Error fetching notification:', error.message);
            retryCount += 1;

            if (retryCount >= maxRetries) {
                console.error(`Max retries reached (${maxRetries}). Stopping polling.`);
                clearInterval(pollingInterval);
            }
        }
    }

    // Start polling function
    function startPolling() {
        pollingInterval = setInterval(fetchNotification, 10000);
        console.log('Polling started...');
    }

    // Restart polling manually
    restartButton.addEventListener('click', function () {
        retryCount = 0;
        startPolling();
        console.log('Polling restarted manually.');
    });

    // Initial polling start
    startPolling();
});

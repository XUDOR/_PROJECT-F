document.addEventListener('DOMContentLoaded', function () {
    const notificationsDiv = document.getElementById('notifications');
    const restartButton = document.getElementById('restart-polling-btn');
    const pollingControlsDiv = document.getElementById('polling-controls');
    let retryCount = 0;
    const maxRetries = 5;
    let pollingInterval;
    let lastNotification = null; // To store the last notification
    let isPollingActive = false;

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
            const newNotification = `${data.job_title} at ${data.company_name}`;

            // Display the notification only if it's different from the last one
            if (newNotification !== lastNotification) {
                displayNotification(`New job posted: ${newNotification}`);
                lastNotification = newNotification; // Update the last notification
                retryCount = 0; // Reset retry count on success
            } else {
                console.log('No new notifications');
            }
        } catch (error) {
            console.error('Error fetching notification:', error.message);
            retryCount += 1;

            if (retryCount >= maxRetries) {
                console.error(`Max retries reached (${maxRetries}). Stopping polling.`);
                stopPolling();
            }
        }
    }

    // Start polling function
    function startPolling() {
        if (!isPollingActive) {
            pollingInterval = setInterval(fetchNotification, 10000);
            isPollingActive = true;
            console.log('Polling started...');
        }
    }

    // Stop polling function
    function stopPolling() {
        clearInterval(pollingInterval);
        isPollingActive = false;
        console.log('Polling stopped.');
    }

    // Restart polling manually
    restartButton.addEventListener('click', function () {
        stopPolling();
        retryCount = 0;
        startPolling();
        console.log('Polling restarted manually.');
    });

    // Add Start and Stop buttons to the polling controls div
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Polling';
    startButton.addEventListener('click', startPolling);

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop Polling';
    stopButton.addEventListener('click', stopPolling);

    pollingControlsDiv.appendChild(startButton);
    pollingControlsDiv.appendChild(stopButton);

    // Initial polling start
    startPolling();
});

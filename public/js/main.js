document.addEventListener('DOMContentLoaded', function () {
    const notificationsDiv = document.getElementById('notifications');
    const apiColumnDiv = document.getElementById('api-contents');
    const refreshApiButton = document.getElementById('refresh-api-btn');
    const clearApiButton = document.getElementById('clear-api-btn');

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

    // Function to display API messages
    function displayApiMessage(message) {
        const apiMessage = document.createElement('div');
        apiMessage.textContent = message;
        apiMessage.classList.add('notification-item');
        apiColumnDiv.appendChild(apiMessage);
        console.log(`API Message: ${message}`);
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

    // Fetch API messages from an API endpoint
    async function fetchApiMessages() {
        apiColumnDiv.innerHTML = ''; // Clear existing messages immediately
        apiColumnDiv.textContent = 'Loading...'; // Show loading state

        try {
            const response = await fetch(`/api/api-messages?_=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch API messages');
            }

            const data = await response.json();
            apiColumnDiv.innerHTML = ''; // Clear loading state

            if (data.length === 0) {
                apiColumnDiv.textContent = 'No API messages available.';
                return;
            }

            data.forEach(msg => {
                displayApiMessage(`${msg.message} - ${new Date(msg.timestamp).toLocaleString()}`);
            });
        } catch (error) {
            console.error('Error fetching API messages:', error.message);
            apiColumnDiv.textContent = 'Failed to load API messages.';
        }
    }
    
    // Event listener to refresh API messages
    if (refreshApiButton) {
        refreshApiButton.addEventListener('click', fetchApiMessages);
    }

    clearApiButton.addEventListener('click', () => {
        apiColumnDiv.innerHTML = ''; // Clear the contents of the API messages div
        console.log('API messages cleared');
    });

    // Initial polling start
   
    fetchApiMessages(); // Initial fetch for API messages
});

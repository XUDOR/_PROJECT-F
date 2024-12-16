document.addEventListener('DOMContentLoaded', function () {
    const refreshNotificationsBtn = document.getElementById('refresh-notifications-btn');
    const apiColumnDiv = document.getElementById('api-contents');
    const refreshApiButton = document.getElementById('refresh-api-btn');
    const clearApiButton = document.getElementById('clear-api-btn');

    // Function to display a single notification
    function displayNotification(message) {
        const notificationsDiv = document.getElementById('notifications');
        const notificationElement = document.createElement('div');
        notificationElement.textContent = message;
        notificationElement.classList.add('notification-item');
        
        // Append normally so that after sorting, the newest is placed first, then older follow
        notificationsDiv.appendChild(notificationElement);
    }

    // Function to fetch and display all notifications (sorted newest to oldest)
    async function fetchAllNotifications() {
        try {
            console.log('Fetching notifications...'); // Add this
            const response = await fetch('/api/notifications');
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
    
            const data = await response.json();
            console.log('Received notifications:', data);

            // Sort notifications by timestamp descending (newest first)
            data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            const notificationsDiv = document.getElementById('notifications');
            notificationsDiv.innerHTML = ''; // Clear existing notifications

            data.forEach(notification => {
                displayNotification(`${notification.message} - ${new Date(notification.timestamp).toLocaleString()}`);
            });
        } catch (error) {
            console.error('Error fetching notifications:', error.message);
        }
    }

    // Function to display API messages
    function displayApiMessage(message) {
        const apiMessage = document.createElement('div');
        apiMessage.textContent = message;
        apiMessage.classList.add('notification-item');
        apiColumnDiv.appendChild(apiMessage);
        console.log(`API Message: ${message}`);
    }

    // Function to fetch API messages
    async function fetchApiMessages() {
        try {
            console.log('Fetching API messages...'); // Add this
            const response = await fetch(`/api/api-messages?_=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch API messages');
            }
    
            const data = await response.json();
            console.log('Received API messages:', data); // Add this
            apiColumnDiv.innerHTML = ''; // Clear loading state
    
            if (data.length === 0) {
                apiColumnDiv.textContent = 'No API messages available.';
                return;
            }
    
            // Reverse the messages to display new-to-old order
            data.reverse().forEach(msg => {
                displayApiMessage(`${msg.message} - ${new Date(msg.timestamp).toLocaleString()}`);
            });
        } catch (error) {
            console.error('Error fetching API messages:', error.message);
            apiColumnDiv.textContent = 'Failed to load API messages.';
        }
    }

    // Event listener to refresh notifications
    if (refreshNotificationsBtn) {
        refreshNotificationsBtn.addEventListener('click', fetchAllNotifications);
    }

    // Event listener to refresh API messages
    if (refreshApiButton) {
        refreshApiButton.addEventListener('click', fetchApiMessages);
    }

    // Clear API messages button
    clearApiButton.addEventListener('click', () => {
        apiColumnDiv.innerHTML = ''; // Clear the contents of the API messages div
        console.log('API messages cleared');
    });

    // Initial fetches
    fetchApiMessages(); // Initial fetch for API messages
    // Optionally, you could also fetch notifications on page load:
    fetchAllNotifications();
});

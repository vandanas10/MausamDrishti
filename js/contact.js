document.getElementById('submit-button').addEventListener('click', function () {
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const subject = document.getElementById('subject-input').value;
    const message = document.getElementById('message-input').value;

    // Validate form
    if (name === '' || email === '' || subject === '' || message === '') {
        alert('All fields are required.');
        return;
    }

    // Create data object
    const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message
    };

    // Send data to server
    fetch('http://localhost:3300/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Show success message
            loadFeedback(); // Reload feedback messages after submission
            document.getElementById('contact-form').reset(); // Clear the form
        })
        .catch(error => console.error('Error:', error));
});

// Function to load previously submitted messages
function loadFeedback() {
    fetch('http://localhost:3300/feedback')
        .then(response => response.json())
        .then(messages => {
            const results = document.getElementById('results');
            const feedbackList = document.createElement('ul');

            feedbackList.innerHTML = ''; // Clear previous feedback list

            messages.forEach(feedback => {
                const feedbackItem = document.createElement('li');
                feedbackItem.innerHTML = `<strong>${feedback.name}</strong> (${feedback.email}): ${feedback.message}`;
                feedbackList.appendChild(feedbackItem);
            });

            results.appendChild(feedbackList);
        })
        .catch(error => console.error('Error loading feedback:', error));
}

// Load feedback when the page loads
window.onload = function () {
    loadFeedback();
};

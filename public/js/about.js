// about.js

// Function to submit the form
async function submitForm(name, email, message) {
    const response = await fetch('https://bloomprint.xyz/visitor_log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
    });
    return response;
}


// Add event listener to the form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = form.name.value;
        const email = form.email.value;
        const message = form.message.value;

        try {
            const response = await submitForm(name, email, message);
            if (response.ok) {
                alert('Form submitted successfully!');
                form.reset();
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                alert('An error occurred while submitting the form. Response: ' + errorText);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the form. Error: ' + error.message);
        }
    });
});



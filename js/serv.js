document.getElementById('sendDataButton').addEventListener('click', function(event) {
    event.preventDefault();  // Prevents traditional form submission

    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Simple regex for email validation

    if (!email || !emailRegex.test(email)) {
        alert('Please provide a valid email address');
        return;
    }

    // Show loading indication
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('overlay').style.opacity = 1;  // Make overlay visible
    document.getElementById('spinner').style.display = 'block';  // Display the spinner
    document.getElementById('spinner').style.opacity = 1;  // Make spinner visible
    document.getElementById('spinner').innerHTML = ''; // Reset the spinner to not show checkmark
    document.getElementById('sendDataButton').disabled = true;  // Disable the button to prevent multiple sends

    const dataToSend = {
        students: Object.keys(students).map(name => ({
            name: name,
            durations: students[name].durations,
            checkOutCount: students[name].checkOutCount,
            totalDuration: students[name].totalDuration
        })),
        email: email  // Attach the provided email to the payload
    };

    $.ajax({
        url: 'https://249b-3-143-218-26.ngrok-free.app/upload',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dataToSend),
        success: (response) => {
            console.log('Data sent successfully');
            document.getElementById('spinner').style.animation = 'none'; // Stop spinning animation
            document.getElementById('spinner').innerHTML = '✅'; // Show checkmark

            // Clear the onbeforeunload event before showing the alert
            window.onbeforeunload = null;

            // Hide the spinner and overlay before alert
            document.getElementById('overlay').style.opacity = 0;
            document.getElementById('spinner').style.opacity = 0;

            setTimeout(function() {
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('spinner').style.display = 'none';


                // Reload page after alert is closed
                window.location.reload();
            }, 900); // Wait for the fade out transition before alerting
        },
        error: (error) => {
            console.log('Error sending data', error);
            alert('Error sending data: ' + (error.statusText || 'Unknown error'));
            window.onbeforeunload = null;  // Also clear on errors before user actions

            // Re-enable the button on error
            document.getElementById('sendDataButton').disabled = false;
        },
        complete: () => {
            // This block remains empty since error and success cases are handled individually
        }
    });
});

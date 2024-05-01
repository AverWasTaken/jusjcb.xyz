document.getElementById('sendDataButton').addEventListener('click', function() {
    const email = document.getElementById('email').value;

    if (!email) {
        alert('Please provide an email address');
        return;
    }

    // Show loading indication
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('sendDataButton').disabled = true;  // Disable the button to prevent multiple sends

    const dataToSend = {
        students: Object.keys(students).map(name => ({
            name: name,
            durations: students[name].durations,
            checkOutCount: students[name].checkOutCount,
            totalDuration: students[name].totalDuration
        })),
        email: email    // Attach the provided email to the payload
    };

    $.ajax({
        url: 'https://249b-3-143-218-26.ngrok-free.app/upload',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dataToSend),
        success: (response) => {
            console.log('Data sent successfully');
            alert('Data sent successfully to: ' + email);
        },
        error: (error) => {
            console.log('Error sending data', error);
            alert('Error sending data: ' + error.statusText);
        },
        complete: () => {
            // Hide loading indicator and re-enable button regardless of AJAX success or failure
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('sendDataButton').disabled = false;
        }
    });
});

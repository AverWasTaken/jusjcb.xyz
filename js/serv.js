document.addEventListener("DOMContentLoaded", function() {
    // Handle the submission of initial data
    document.getElementById('submitInfoButton').addEventListener('click', function(event) {
        event.preventDefault();

        var teacherName = document.getElementById('teacherName').value.trim();
        var periodNumber = document.getElementById('periodNumber').value.trim();
        var periodRegex = /^[1-4][AB]$/;  // Regex to ensure format like "1A", "2B", etc.

        if (!teacherName || !periodNumber.match(periodRegex)) {
            alert('Please enter valid name and period (e.g., "1A", "2B").');
            return;
        }

        sessionStorage.setItem('teacherName', teacherName);
        sessionStorage.setItem('periodNumber', periodNumber);

        document.querySelector('.header-content h1').textContent = 'Welcome ' + teacherName + ',\n' + " This Is Period " + periodNumber;

        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('mainProgram').style.display = 'block';
        document.getElementById('sendDataButton').style.display = '';
        document.getElementById('stats').style.display = '';
    });

    document.getElementById('sendDataButton').addEventListener('click', function(event) {
        event.preventDefault();
    
        // Show loading indication
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('overlay').style.opacity = 1;  // Make overlay visible
        document.getElementById('spinner').style.display = 'block';  // Display the spinner
        document.getElementById('spinner').style.opacity = 1;  // Make spinner visible
        document.getElementById('spinner').innerHTML = ''; // Reset the spinner to not show checkmark
        document.getElementById('sendDataButton').disabled = true;  // Disable the button to prevent multiple sends
    
        const teacherName = sessionStorage.getItem('teacherName');
        const periodNumber = sessionStorage.getItem('periodNumber');
        const dataToSend = {
            students: Object.keys(students).map(name => ({
                name: name,
                durations: students[name].durations,
                checkOutCount: students[name].checkOutCount,
                totalDuration: students[name].totalDuration,
                checkTimes: students[name].checkTimes
            })),
            teacherName: teacherName,
            periodNumber: periodNumber
        };
    
        // Send data to the backend
        $.ajax({
            url: 'https://249b-3-143-218-26.ngrok-free.app/upload',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataToSend),
            success: function(response) {
                setTimeout(function() {
                    document.getElementById('overlay').style.display = 'none';
                    document.getElementById('spinner').style.display = 'none';
                    document.getElementById('sendDataButton').disabled = false;  // Re-enable the send button
                    alert("Data was successfully updated in the master sheet.");
                    window.location.reload();
                }, 900);  // Adjust this timeout as necessary
            },
            error: function(error) {
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('spinner').style.display = 'none';
                document.getElementById('sendDataButton').disabled = false;  // Re-enable the send button
                alert('Error sending data: ' + (error.statusText || 'Unknown error'));
            }
        });
    });

    // Clear sessionStorage immediately on page load
    sessionStorage.clear();

    // Set up the global warning for navigating away
    window.onbeforeunload = function() {
        return "Are you sure you want to leave? Changes you made may not be saved.";
    };
});

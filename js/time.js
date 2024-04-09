// Function to update time
function updateTime() {
    console.log('Attempting to update time...'); // Log attempt to update time
  
    // Use moment.js to get current time in H:mm format with AM/PM
    const now = moment().format('h:mm A'); // Note: 'h:mm A' format for AM/PM
    console.log(`Current time is: ${now}`); // Log current time
  
    // Find all elements with class "clock" and set their text to the current time
    const clockElements = document.querySelectorAll('.clock');
    console.log(`Found ${clockElements.length} element(s) with class 'clock'.`); // Log number of found elements
  
    clockElements.forEach(function(clockElement, index) {
      clockElement.textContent = now;
      console.log(`Updated element ${index + 1} with current time.`); // Log each element update
    });
  }
  
  // Update time immediately when the script loads
  updateTime();
  
  // Update time every minute (60000 milliseconds)
  setInterval(updateTime, 60000);
  
  console.log('Time update script loaded. Waiting for the first minute update...'); // Log initial load
  
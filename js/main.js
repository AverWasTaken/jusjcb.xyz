let students = {};
let intervalId = {};

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    checkOut();
  }
}

function checkOut() {
  let name = document.getElementById('studentName').value.trim();
  if (name === '') {
      alert('Please enter a student name.');
      return;
  }

  // Check for invalid characters
  if (/[\$\%\^\&\*\(\)\@]/.test(name)) {
      alert('The name contains invalid characters.');
      return;
  }

  // Convert to lowercase for further processing
  name = name.toLowerCase();

  // Ensure that both first and last names are present, and each part has a minimum length of 2 characters
  const nameParts = name.split(' ').filter(part => part.length > 1);
  if (nameParts.length < 2) {
      alert('Please enter both a first and a last name, each with at least 2 letters.');
      return;
  }

  // Ensure the name is formatted properly as 'Firstname Lastname'
  name = nameParts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // List of blacklisted names
  const blacklistedNames = ['Ben Dover', 'Mike Hawk', 'Mike Oxlong', 'Mike Oxmaul', 'Mike Rotch', 'Jenna Tills', 'Penis Penis', 'Fuck Fuck', 'Bitch Bitch', 'Cock Cock', 'Nigga Nigga', 'Nigger Nigger'];

  // Check if the formatted name is in the blacklisted names list
  if (blacklistedNames.includes(name)) {
      alert('This name is disallowed. Please enter appropriate names only.');
      return;
  }

  if (students[name] && !students[name].checkedIn) {
      alert('This student has already checked out and not checked back in.');
      return;
  }

  const now = new Date();
  if (!students[name]) {
      students[name] = { durations: [], checkOutCount: 0, totalDuration: 0, checkTimes: [] };
  }
  students[name].checkOutCount += 1;
  students[name].checkOutTime = now;
  students[name].checkedIn = false;
  students[name].checkTimes.push({ left: now.toLocaleTimeString() });  // Store checkout time

  clearInterval(intervalId[name]);
  intervalId[name] = setInterval(() => updateLiveTime(name), 1000);
  displayLog(name, formatDuration(0), true);
  displayStatistics();
}

function checkIn(name) {
  clearInterval(intervalId[name]);
  const checkOutTime = students[name].checkOutTime;
  const now = new Date();
  const duration = Math.floor((now - checkOutTime) / 1000);
  students[name].totalDuration += duration;
  students[name].durations.push(duration);
  students[name].checkTimes[students[name].checkTimes.length - 1].returned = now.toLocaleTimeString(); // Store check-in time
  students[name].checkedIn = true;
  displayLog(name, students[name].durations, false); // Pass false to update without appending
  displayStatistics();
}

function updateLiveTime(name) {
  const checkOutTime = students[name].checkOutTime;
  const currentDuration = Math.floor((new Date() - checkOutTime) / 1000);
  const durations = [...students[name].durations, currentDuration];
  const shouldHighlightRed = currentDuration >= 300; // Highlight red if 5 minutes passed

  // Update log continuously with current live duration
  displayLog(name, durations, true, shouldHighlightRed);
}

function displayStatistics() {
  // Count only students who are currently checked out
  const currentStudentsOut = Object.values(students).reduce((count, student) => {
      return count + (!student.checkedIn ? 1 : 0);
  }, 0);

  // Count all students who have checked out at least once
  const totalStudentsCheckedOut = Object.keys(students).length;

  // Update statistics display
  document.getElementById('currentStudentsOut').textContent = `Current Students Out: ${currentStudentsOut}`;
  document.getElementById('totalStudentsCheckedOut').textContent = `Total Check Outs: ${totalStudentsCheckedOut}`;

  // Manage the visibility of the 'Action' column
  const actionColumn = document.querySelectorAll('th:nth-child(3), td:nth-child(3)');
  actionColumn.forEach(cell => {
      if (currentStudentsOut > 0) {
          cell.classList.remove('hidden-column'); // Show the column
      } else {
          cell.classList.add('hidden-column'); // Hide the column
      }
  });
}


window.onload = function() {
  displayStatistics();  // Initialize the display
};

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  return `${minutes}m ${seconds}s`;
}

function displayLog(name, durations, update = false) {
  let row = document.querySelector(`tr[data-name="${name}"]`);

  
  // Ensure 'durations' is an array before trying to use .map or modify it
  if (!Array.isArray(durations)) {
    console.error('Expected durations to be an array, but received:', durations);
    durations = []; // Fallback to an empty array to prevent errors
  }

  // Apply red text if any duration exceeds 5 minutes (300 seconds)
  const formattedDurations = durations.map((d, index) => {
      const durationText = `${index + 1}. ${formatDuration(d)}`;
      return d >= 300 ? `<span class="red-text">${durationText}</span>` : durationText;
  }).join('<br>');

  if (!row) {
    row = document.createElement('tr');
    row.setAttribute('data-name', name);
    row.innerHTML = `
      <td>${name} ${students[name].checkOutCount > 1 ? '(' + students[name].checkOutCount + ')' : ''}</td>
      <td>${formattedDurations}</td>
      <td>${!students[name].checkedIn ? "<button class='checkinButton' onclick='checkIn(\"" + name + "\")'>Check Back In</button>" : ''}</td>
    `;
    document.getElementById('log').appendChild(row);
  } else {
    row.children[0].innerHTML = `${name} ${students[name].checkOutCount > 1 ? '(' + students[name].checkOutCount + ')' : ''}`;
    row.children[1].innerHTML = formattedDurations;
    row.children[2].innerHTML = !students[name].checkedIn ? "<button class='checkinButton' onclick='checkIn(\"" + name + "\")'>Check Back In</button>" : '';
  }
}


window.onload = displayStatistics;

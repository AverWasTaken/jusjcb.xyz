let students = {};
let intervalId = {};

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    checkOut();
  }
}

function checkOut() {
  const name = document.getElementById('studentName').value.trim().toLowerCase();
  if (name === '') {
    alert('Please enter a student name.');
    return;
  }

  if (students[name] && !students[name].checkedIn) {
    alert('This student has already checked out and not checked back in.');
    return;
  }

  const now = new Date();
  if (!students[name]) {
    students[name] = { durations: [], checkOutCount: 0 };
  }
  students[name].checkOutCount += 1;
  students[name].checkOutTime = now;
  students[name].checkedIn = false;

  clearInterval(intervalId[name]);
  intervalId[name] = setInterval(() => updateLiveTime(name), 1000);
  displayLog(name, formatDuration(0), true);
  displayStatistics();
}

function checkIn(name) {
  clearInterval(intervalId[name]);
  const checkOutTime = students[name].checkOutTime;
  const duration = Math.floor((new Date() - checkOutTime) / 1000);
  students[name].totalDuration += duration;
  students[name].durations.push(duration);
  students[name].checkedIn = true;
  displayLog(name, students[name].durations);
  displayStatistics();
}

function updateLiveTime(name) {
  const checkOutTime = students[name].checkOutTime;
  const currentDuration = Math.floor((new Date() - checkOutTime) / 1000);
  const durations = [...students[name].durations, currentDuration];
  const shouldHighlightRed = currentDuration >= 300; // Highlight red if 5 minutes passed
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
  
  // Ensure 'durations' is an array before trying to use .map
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

function updateDay() {
    let knownBday = new Date('2024-01-22'); // Known "B day"
    knownBday.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    let today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    let daySpan = document.querySelector('.day .sel');
    let pDay = document.querySelector('.day'); // Get the paragraph element that includes day text

    // Calculate the difference in days from the known "B day"
    let diffTime = today - knownBday;
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let dayType = diffDays % 2 === 0 ? 'B' : 'A';

    if (today.getDay() === 0 || today.getDay() === 6) {
        // Update the message for the weekend
        pDay.innerHTML = `Today is the weekend! It will be a ${dayType} day on Monday`;
    } else {
        // For weekdays
        if (daySpan && pDay) {
            pDay.innerHTML = `Today is a, <span class="day sel">${dayType} day</span>`;
        }
    }
}

window.addEventListener('load', updateDay);

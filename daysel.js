function updateDay() {
    let knownBday = new Date('2024-01-22'); // Known "B day"
    let today = new Date();
    let daySpan = document.querySelector('.day .sel');
    let pDay = document.querySelector('.day'); // Get the paragraph element that includes day text

    // Check if today is Saturday (6) or Sunday (0)
    if (today.getDay() === 0 || today.getDay() === 6) {
        let nextMonday = new Date(today);
        // If today is Sunday, add 1 day; if it's Saturday, add 2 days to get to Monday
        nextMonday.setDate(today.getDate() + (today.getDay() === 0 ? 1 : 2));

        // Calculate the difference in days from the known "B day"
        let diffTime = Math.abs(nextMonday - knownBday);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Determine if next Monday will be an A day or B day
        let dayType = diffDays % 2 === 0 ? 'B' : 'A';
        
        // Update the message for the weekend
        if (daySpan && pDay) {
            pDay.innerHTML = `Today is the weekend! It will be a ${dayType} day on Monday`;
        }
    } else {
        // For weekdays, calculate as before
        let diffTime = Math.abs(today - knownBday);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let dayType = diffDays % 2 === 0 ? 'B' : 'A';

        if (daySpan && pDay) {
            pDay.innerHTML = `Today is A, <span class="day sel">${dayType} day</span>`;
        }
    }
}

window.addEventListener('load', updateDay);

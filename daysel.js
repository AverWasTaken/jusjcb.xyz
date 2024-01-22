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

        let diffTime = Math.abs(today - knownBday);
        let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        let dayType = diffDays % 2 === 0 ? 'B' : 'A';
        
        if (daySpan && pDay) {
            pDay.innerHTML = `Today is a, <span class="day sel">${dayType} day</span>`;
        }
    } else {
        // For weekdays, calculate as before
        let diffTime = Math.abs(today - knownBday);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let dayType = diffDays % 2 === 0 ? 'B' : 'A';

        if (daySpan && pDay) {
            pDay.innerHTML = `Today is a, <span class="day sel">${dayType} day</span>`;
        }
    }
}

window.addEventListener('load', updateDay);

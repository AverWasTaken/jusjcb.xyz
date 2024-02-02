function updateDay() {
    let knownAday = new Date('2024-01-25'); // Known "A day"
    knownAday.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    let today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    let daySpan = document.querySelector('.day');
    let daySpanMobile = document.querySelector('.dayMobile')

    // Calculate the difference in days from the known "A day"
    let diffTime = today - knownAday;
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Determine day type based on difference in days, including weekends
    // Since we're starting from an "A" day, an even difference means "A" day, odd means "B" day
    let dayType = diffDays % 2 === 0 ? 'A' : 'B';

    // Display logic for weekends
    if (today.getDay() === 0 || today.getDay() === 6) {
        daySpan.innerHTML = `It will be ${dayType === 'A' ? 'an' : 'a'} ${dayType} day on Monday.`;
    } else {
        // Display logic for weekdays
        if (daySpan) {
            daySpan.innerHTML = `<span class="day">${dayType} Day</span>`;
            daySpanMobile.innerHTML = `<span class="dayMobile">${dayType} Day</span>`;
        }
    }
}

window.addEventListener('load', updateDay);
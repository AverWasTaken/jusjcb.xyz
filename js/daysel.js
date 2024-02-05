function updateDay() {
    let knownAday = new Date('2024-02-5'); // Known "A day"
    knownAday.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    let today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    let daySpan = document.querySelector('.day');
    let daySpanMobile = document.querySelector('.dayMobile');

    // Calculate the difference in days from the known "A day"
    let diffTime = today - knownAday;
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Determine day type based on difference in days, including weekends
    let dayType = diffDays % 2 === 0 ? 'A' : 'B';

    // If today is a weekend, calculate and display the day type for the upcoming Monday
    if (today.getDay() === 0 || today.getDay() === 6) {
        // Calculate the difference in days to the next Monday
        let daysToMonday = 8 - today.getDay(); // For Saturday (6) -> 2, For Sunday (0) -> 1
        let mondayType = (diffDays + daysToMonday) % 2 === 0 ? 'A' : 'B';
        daySpan.innerHTML = `It will be ${mondayType === 'A' ? 'an' : 'a'} ${mondayType} day on Monday.`;
        if (daySpanMobile) {
            daySpanMobile.innerHTML = `It will be ${mondayType === 'A' ? 'an' : 'a'} ${mondayType} day on Monday.`;
        }
    } else {
        // Display the current day type for weekdays
        if (daySpan) {
            daySpan.innerHTML = `<span class="day">${dayType} Day</span>`;
        }
        if (daySpanMobile) {
            daySpanMobile.innerHTML = `<span class="dayMobile">${dayType} Day</span>`;
        }
    }
}

window.addEventListener('load', updateDay);

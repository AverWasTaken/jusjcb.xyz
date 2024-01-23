function updateDay() {
    let knownBday = new Date('2024-01-23'); // Known "B day"
    knownBday.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    let today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    let daySpan = document.querySelector('.day');

    // Calculate the difference in days from the known "B day"
    let diffTime = today - knownBday;
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let dayType = diffDays % 2 === 0 ? 'B' : 'A';

    if (today.getDay() === 0 || today.getDay() === 6) {
        
        if (dayType === 'A') {
            daySpan.innerHTML = `It will be an ${dayType} day on Monday`;
        } else { 
            daySpan.innerHTML = `It will be a ${dayType} day on Monday`;
        }
    } else {
        
        if (daySpan) {
            daySpan.innerHTML = `<span class="day">${dayType} day</span>`;
        }
    }
}

window.addEventListener('load', updateDay);

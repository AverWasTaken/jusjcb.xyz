 // Helper function to parse time strings
function parseTime(timeStr) {
    const [time, modifier] = timeStr.split(/(AM|PM)/);
    return new Date(`01/01/2000 ${time} ${modifier}`);
}

// Helper function to format remaining time
function formatRemainingTime(endDate) {
    const now = new Date();
    let diff = endDate.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours > 0 ? `${hours}H ` : ''}${minutes}M & ${seconds}S`;
}

// Determine the current period
function getCurrentPeriod(schedule) {
    const now = new Date();
    for (const period of schedule) {
        const start = parseTime(period.start);
        const end = parseTime(period.end);

        if (now >= start && now < end) {
            return { ...period, remainingTime: formatRemainingTime(end) };
        }
    }
    return null;
}

// Update the page with the schedule information
function updateSchedule() {
    const regularSchedule = [        
    { start: '7:00AM', end: '7:55AM', period: 'Early Bird' },
    { start: '8:05AM', end: '9:25AM', period: '1st Period ' },
    { start: '9:30AM', end: '10:50AM', period: '2nd Period ' },
    { start: '10:50AM', end: '11:25AM', period: 'Bulldog Time' },
    { start: '11:25AM', end: '12:05PM', period: 'Lunch' },
    { start: '12:05AM', end: '1:25PM', period: '3rd Period ' },
    { start: '1:30PM', end: '2:50PM', period: '4th Period ' }];
    const earlyReleaseSchedule = [        
    { start: '7:00AM', end: '7:55AM', period: 'Early Bird' },
    { start: '8:05AM', end: '9:18AM', period: '1st Period ' },
    { start: '9:23AM', end: '10:39AM', period: '2nd Period ' },
    { start: '10:44AM', end: '11:57AM', period: '3rd Period ' },
    { start: '11:57AM', end: '12:37PM', period: 'Lunch' },
    { start: '12:37PM', end: '1:50PM', period: '4th Period ' }];

    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const isEarlyRelease = now.getDay() === 5;

    const schedule = isEarlyRelease ? earlyReleaseSchedule : regularSchedule;
    const currentPeriod = getCurrentPeriod(schedule);

    const schoolStartContentArea = document.querySelector('.start');
    const periodContentArea = document.querySelector('.period');
    const timeLeftContentArea = document.querySelector('.time');

    if (isWeekend) {
        schoolStartContentArea.innerHTML = 'Enjoy the Weekend!';
        periodContentArea.innerHTML = 'Yay! The weekend!';
        timeLeftContentArea.innerHTML = '';
    } else if (currentPeriod) {
        schoolStartContentArea.innerHTML = `School Remaining (${currentPeriod.remainingTime})`;
        periodContentArea.innerHTML = `<span class="period">${currentPeriod.period}</span>`;
        timeLeftContentArea.innerHTML = `${currentPeriod.remainingTime}`;
    } else {
        schoolStartContentArea.innerHTML = ' (School is Over)';
        periodContentArea.innerHTML = 'Out Of School';
        timeLeftContentArea.innerHTML = 'Out Of School';
    }
}

// Initialize and update every second
window.addEventListener('load', updateSchedule);
setInterval(updateSchedule, 1000);

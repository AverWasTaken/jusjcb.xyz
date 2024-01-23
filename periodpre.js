function updatePeriod() {
    const regularSchedule = [
        { start: '7:00AM', end: '7:55AM', period: 'Early Bird' },
        { start: '8:05AM', end: '9:25AM', period: '1st Period ' },
        { start: '9:30AM', end: '10:50AM', period: '2nd Period ' },
        { start: '10:50AM', end: '11:25AM', period: 'Bulldog Time' },
        { start: '11:25AM', end: '12:05PM', period: 'Lunch' },
        { start: '12:05PM', end: '1:25PM', period: '3rd Period ' },
        { start: '1:30PM', end: '2:50PM', period: '4th Period ' }
    ];
    const earlyReleaseSchedule = [
        { start: '7:00AM', end: '7:55AM', period: 'Early Bird' },
        { start: '8:05AM', end: '9:18AM', period: '1st Period ' },
        { start: '9:23AM', end: '10:39AM', period: '2nd Period ' },
        { start: '10:44AM', end: '11:57AM', period: '3rd Period ' },
        { start: '11:57AM', end: '12:37PM', period: 'Lunch' },
        { start: '12:37PM', end: '1:50PM', period: '4th Period ' }
    ];

    const parseTime = (timeStr) => {
        const [hours, minutesPart] = timeStr.split(':');
        let hoursInt = parseInt(hours, 10);
        const minutes = parseInt(minutesPart, 10);

        // Adjust for PM times
        if (timeStr.includes('PM') && hoursInt < 12) {
            hoursInt += 12;
        } else if (timeStr.includes('AM') && hoursInt === 12) {
            hoursInt = 0;
        }

        const time = new Date();
        time.setHours(hoursInt, minutes, 0, 0);
        return time;
    };

    const formatRemainingTime = (endDate) => {
        const now = new Date();
        let diff = endDate - now;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} minutes and ${remainingSeconds} seconds`;
    };

    const today = new Date();
    const isEarlyRelease = today.getDay() === 5;
    const schedule = isEarlyRelease ? earlyReleaseSchedule : regularSchedule;

    const currentTime = new Date();
    const currentPeriod = schedule.find((slot) => {
        const startTime = parseTime(slot.start);
        const endTime = parseTime(slot.end);
        return currentTime >= startTime && currentTime < endTime;
    });

    const contentArea = document.querySelector('.content-area p');
    if (currentPeriod) {
        const remainingTime = formatRemainingTime(parseTime(currentPeriod.end));
        contentArea.innerHTML = `You're in ${currentPeriod.period}.<br> Time Remaining - ${remainingTime}.`;
    } else {
        contentArea.textContent = 'You\'re currently outside of school hours, or in a passing period.';
    }
}

window.addEventListener('load', updatePeriod);
setInterval(updatePeriod, 1000); // Update every second

async function fetchServerTime() {
    try {
        // Replace 'your-time-server-url' with the URL of the time server you'll be using
        const response = await fetch('your-time-server-url');
        const data = await response.json();
        return new Date(data.datetime); // Assuming the server returns an object with a datetime property
    } catch (error) {
        console.error('Error fetching server time:', error);
        return new Date(); // Fallback to local time in case of an error
    }
}

function parseTime(timeStr, baseDate) {
    const [hours, minutes] = timeStr.split(':').map(str => parseInt(str, 10));
    const time = new Date(baseDate.getTime());
    time.setHours(hours, minutes, 0, 0); // set hours and minutes, seconds and ms to 0
    return time;
}

function formatRemainingTime(endDate, currentDate) {
    let diff = endDate - currentDate; // difference in milliseconds
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    return `${hours > 0 ? hours + ' hours, ' : ''}${remainingMinutes > 0 ? remainingMinutes + ' minutes, and ' : ''}${remainingSeconds} seconds`;
}

function isPeriodBeforeLunch(period, index, schedule) {
    return schedule[index + 1] && schedule[index + 1].period === 'Lunch';
}

function generateMessage(currentPeriod, remainingTime, schedule) {
    if (!currentPeriod) {
        return `You're currently outside of school hours.`;
    } else if (currentPeriod.period === 'Lunch') {
        return `Awh, Lunch ends in ${remainingTime}. :(`;
    } else {
        const nextPeriodMessage = isPeriodBeforeLunch(currentPeriod, schedule.indexOf(currentPeriod), schedule)
            ? ' <br><span style="display:block; margin-top: 10px;">Lunch is next!'
            : '';
        return `Looks like you're in ${currentPeriod.period}.<br><span style="display: block; margin-top: 10px;"></span>Time Remaining - ${remainingTime}.${nextPeriodMessage}`;
    }
}

function getCurrentPeriod(schedule, currentTime) {
    return schedule.find((slot) => {
        const startTime = parseTime(slot.start, currentTime);
        const endTime = parseTime(slot.end, currentTime);
        return currentTime >= startTime && currentTime < endTime;
    });
}

async function updatePeriod() {
    const regularSchedule = [
        { start: '7:00AM', end: '7:55AM', period: 'Early Bird' },
        { start: '8:05AM', end: '9:25AM', period: '1st Period ' },
        { start: '9:30AM', end: '10:50AM', period: '2nd Period ' },
        { start: '10:50AM', end: '11:25AM', period: 'Bulldog Time' },
        { start: '11:25AM', end: '12:05PM', period: 'Lunch' },
        { start: '12:05PM', end: '1:25PM', period: '3rd Period ' },
        { start: '1:30PM', end: '2:50PM', period: '4th Period ' }
    const earlyReleaseSchedule = [
        { start: '7:00AM', end: '7:55AM', period: 'Early Bird' },
        { start: '8:05AM', end: '9:18AM', period: '1st Period ' },
        { start: '9:23AM', end: '10:39AM', period: '2nd Period ' },
        { start: '10:44AM', end: '11:57AM', period: '3rd Period ' },
        { start: '11:57AM', end: '12:37PM', period: 'Lunch' },
        { start: '12:37PM', end: '1:50PM', period: '4th Period ' }
    ];

    const currentTime = await fetchServerTime();
    const today = new Date(currentTime.getTime()); // Create a new Date object based on server time
    const isEarlyRelease = today.getDay() === 5; // 5 is Friday
    const schedule = isEarlyRelease ? earlyReleaseSchedule : regularSchedule;
    const currentPeriod = getCurrentPeriod(schedule, currentTime);

    const contentArea = document.querySelector('.content-area p');
    if (currentPeriod) {
        const remainingTime = formatRemainingTime(parseTime(currentPeriod.end, currentTime), currentTime);
        contentArea.innerHTML = generateMessage(currentPeriod, remainingTime, schedule);
    } else {
        // If it's not within any period, check if we are approaching lunch
        const nextPeriod = schedule.find(slot => currentTime < parseTime(slot.start, currentTime));
        if (nextPeriod && nextPeriod.period === 'Lunch') {
            const remainingTimeToLunch = formatRemainingTime(parseTime(nextPeriod.start, currentTime), currentTime);
            contentArea.textContent = `Yay! Your period ends in ${remainingTimeToLunch}, Lunch is next!`;
        } else {
            contentArea.textContent = `You're currently outside of school hours, or in a passing period.`;
        }
    }
}

// Call this function when the window loads and also every minute to update the period and remaining time
window.addEventListener('load', updatePeriod);
setInterval(updatePeriod, 1000); // Update every second

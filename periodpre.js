function updatePeriod() {
    const regularSchedule = [
        { start: '7:00', end: '7:55', period: 'Early Bird' },
        { start: '8:05', end: '9:25', period: '1st Period ' },
        { start: '9:30', end: '10:50', period: '2nd Period ' },
        { start: '10:50', end: '11:25', period: 'Bulldog Time' },
        { start: '11:25', end: '12:05', period: 'Lunch' },
        { start: '12:05', end: '1:25', period: '3rd Period ' },
        { start: '1:30', end: '2:50', period: '4th Period ' }
    ];
    const earlyReleaseSchedule = [
        { start: '7:00', end: '7:55', period: 'Early Bird' },
        { start: '8:05', end: '9:18', period: '1st Period ' },
        { start: '9:23', end: '10:39', period: '2nd Period ' },
        { start: '10:44', end: '11:57', period: '3rd Period ' },
        { start: '11:57', end: '12:37', period: 'Lunch' },
        { start: '12:37', end: '1:50', period: '4th Period ' }
    ];

    const parseTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(str => parseInt(str, 10));
        const time = new Date();
        time.setHours(hours, minutes, 0, 0); // set hours and minutes, seconds and ms to 0
        return time;
    };

    const formatRemainingTime = (endDate) => {
        const now = new Date();
        let diff = endDate - now; // difference in milliseconds
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingSeconds = seconds % 60;
        const remainingMinutes = minutes % 60;
        return `${hours > 0 ? hours + ' hours, ' : ''}${remainingMinutes > 0 ? remainingMinutes + ' minutes, and ' : ''}${remainingSeconds} seconds`;
    };

    const timeUntilSchoolOrWeekendMessage = () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const schoolStartTime = parseTime('8:05'); // School start time for reference

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            // Weekend
            return "Yay! It's the weekend!";
        } else if (now < schoolStartTime) {
            // Before school starts on a weekday
            return `School starts in ${formatRemainingTime(schoolStartTime)}.`;
        }
        return ""; // Empty if school has started
    };

    const isPeriodBeforeLunch = (period, index, schedule) => {
        return schedule[index + 1] && schedule[index + 1].period === 'Lunch';
    };

    const generateMessage = (currentPeriod, remainingTime) => {
        if (!currentPeriod) {
            return `You're currently outside of school hours.`;
        } else if (currentPeriod.period === 'Lunch') {
            return `Awh, Lunch ends in ${remainingTime}. :(`;
        } else {
            const nextPeriodMessage = isPeriodBeforeLunch(currentPeriod, schedule.indexOf(currentPeriod), schedule)
                ? ' Lunch is next!'
                : '';
            return `Looks like you're in ${currentPeriod.period}. It will end in ${remainingTime}.${nextPeriodMessage}`;
        }
    };

    // Check time until school starts or if it's a weekend first
    const schoolStartOrWeekendMessage = timeUntilSchoolOrWeekendMessage();
    const contentArea = document.querySelector('.content-area p');
    if (schoolStartOrWeekendMessage) {
        contentArea.textContent = schoolStartOrWeekendMessage;
        return; // Exit the function early as no further checks are needed
    }

    // Determine if it's a regular day or early release (Friday)
    const today = new Date();
    const isEarlyRelease = today.getDay() === 5; // 5 is Friday
    const schedule = isEarlyRelease ? earlyReleaseSchedule : regularSchedule;

    // Find the current period based on current time
    const currentTime = new Date();
    const currentPeriod = schedule.find((slot) => {
        const startTime = parseTime(slot.start);
        const endTime = parseTime(slot.end);
        return currentTime >= startTime && currentTime < endTime;
    });

    if (currentPeriod) {
        const remainingTime = formatRemainingTime(parseTime(currentPeriod.end));
        contentArea.textContent = generateMessage(currentPeriod, remainingTime);
    } else {
        // If it's not within any period, check if we are approaching lunch
        const nextPeriod = schedule.find(slot => currentTime < parseTime(slot.start));
        if (nextPeriod && nextPeriod.period === 'Lunch') {
            const remainingTimeToLunch = formatRemainingTime(parseTime(nextPeriod.start));
            contentArea.textContent = `Yay! Your period ends in ${remainingTimeToLunch}, Lunch is next!`;
        } else {
            contentArea.textContent = `You're currently outside of school hours.`;
        }
    }
}

// Call this function when the window loads and also every minute to update the period and remaining time
window.addEventListener('load', updatePeriod);
setInterval(updatePeriod, 1000); // Update every second

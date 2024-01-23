
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
    
    function calculateSchoolStartTime(schedule) {
        const now = new Date();
        const firstPeriodStart = parseTime(schedule[0].start);
        
        if (now < firstPeriodStart) {
            return formatRemainingTime(firstPeriodStart);
        } else {
            return null; // Indicates that the school has already started
        }
    }
    
    function timeUntilEndOfSchool(schedule) {
        const now = new Date();
        const lastPeriod = schedule[schedule.length - 1];
        const endOfSchool = parseTime(lastPeriod.end);
    
        if (now < endOfSchool) {
            return formatRemainingTime(endOfSchool);
        } else {
            return null; // Indicates that the school day has ended
        }
    }

    const formatRemainingTime = (endDate) => {
        const now = new Date();
        let diff = endDate - now;
    
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * 1000 * 60;
        const seconds = Math.floor(diff / 1000);
    
        let timeString = "";
        if (hours > 0) {
            timeString += `${hours}H `;
        }
        timeString += `${minutes}M & ${seconds}S`;
    
        return timeString;
    };
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const isEarlyRelease = now.getDay() === 5;
    const schedule = isEarlyRelease ? earlyReleaseSchedule : regularSchedule;
    const schoolStartContentArea = document.querySelector('.start');
    const schoolStartTime = calculateSchoolStartTime(schedule);
    const endTimeContent = timeUntilEndOfSchool(schedule);

    if (isWeekend) {
        schoolStartContentArea.textContent = 'Enjoy the Weekend!';
    } else if (schoolStartTime) {
        schoolStartContentArea.textContent = `School Starts In ${schoolStartTime}`;
    } else if (endTimeContent) {
        schoolStartContentArea.textContent = `School Ends In ${endTimeContent}`;
    } else {
        schoolStartContentArea.textContent = 'School is Over for Today';
    }

    // Check if it's a passing period or out of school
    for (let i = 0; i < schedule.length; i++) {
        const periodStart = parseTime(schedule[i].start);
        const periodEnd = parseTime(schedule[i].end);
        const nextPeriodStart = i < schedule.length - 1 ? parseTime(schedule[i + 1].start) : null;

        if (now >= periodEnd && nextPeriodStart && now < nextPeriodStart) {
            // Within a passing period (5 minutes after the end of a period)
            currentPeriod = { period: 'Passing Period', end: nextPeriodStart.toTimeString() };
            break;
        } else if (now >= periodStart && now < periodEnd) {
            // Within a scheduled period
            currentPeriod = schedule[i];
            break;
        }
    }


    // Define content areas
    const periodContentArea = document.querySelector('.period');
    const timeLeftContentArea = document.querySelector('.time');

    // Update content based on current period or time of day
    if (isWeekend) {
        periodContentArea.textContent = 'Yay! The weekend!';
        timeLeftContentArea.textContent = '';
    } else if (currentPeriod) {
        const remainingTime = formatRemainingTime(parseTime(currentPeriod.end));
        periodContentArea.textContent = `${currentPeriod.period}`;
        timeLeftContentArea.textContent = `${remainingTime}`;
    } else {
        periodContentArea.textContent = 'Out Of School';
        timeLeftContentArea.textContent = 'Out Of School';
    }
}

window.addEventListener('load', updatePeriod);
setInterval(updatePeriod, 1000); // Update every second

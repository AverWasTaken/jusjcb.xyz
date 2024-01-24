// Helper function to parse time strings
function parseTime(timeStr) {
    // Assuming the current date, format the time string to a Moment object
    const currentTime = moment();
    const timeComponents = timeStr.match(/(\d+):(\d+)(AM|PM)/);

    if (timeComponents) {
        const hours = timeComponents[1];
        const minutes = timeComponents[2];
        const modifier = timeComponents[3];

        return currentTime.clone().hour(hours).minute(minutes).second(0).millisecond(0).add(modifier === 'PM' && hours !== '12' ? 12 : 0, 'hours');
    } else {
        console.error(`Invalid time format: ${timeStr}`);
        return null;
    }
}

// Helper function to format remaining time
function formatRemainingTime(endMoment) {
    const now = moment();
    console.log(`Current Time: ${now.format('hh:mm:ss A')}`);
    console.log(`End Time: ${endMoment.format('hh:mm:ss A')}`);

    let diff = endMoment.diff(now);
    console.log(`Time Difference (ms): ${diff}`);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const formattedTime = `${hours > 0 ? `${hours}H ` : ''}${minutes}M & ${seconds}S`;
    console.log(`Formatted Time Left: ${formattedTime}`);
    return formattedTime;
}

const scheduleData = {
    "regularSchedule": [
        { "start": "7:00AM", "end": "7:55AM", "period": "Early Bird" },
        { "start": "8:05AM", "end": "9:25AM", "period": "1st Period" },
        { "start": "9:30AM", "end": "10:50AM", "period": "2nd Period" },
        { "start": "10:55AM", "end": "11:25AM", "period": "Bulldog Time" },
        { "start": "11:25AM", "end": "12:00PM", "period": "Lunch" },
        { "start": "12:05PM", "end": "1:25PM", "period": "3rd Period" },
        { "start": "1:30PM", "end": "2:50PM", "period": "4th Period" }
    ],
    "earlyReleaseSchedule": [
        { "start": "7:00AM", "end": "7:55AM", "period": "Early Bird" },
        { "start": "8:05AM", "end": "9:18AM", "period": "1st Period" },
        { "start": "9:23AM", "end": "10:39AM", "period": "2nd Period" },
        { "start": "10:44AM", "end": "11:57AM", "period": "3rd Period" },
        { "start": "11:57AM", "end": "12:37PM", "period": "Lunch" },
        { "start": "12:37PM", "end": "1:50PM", "period": "4th Period" }
    ]
};

// Determine the current period
function getCurrentPeriod(schedule) {
    const now = moment();
    for (let i = 0; i < schedule.length; i++) {
        const period = schedule[i];
        const start = parseTime(period.start);
        const end = parseTime(period.end);

        if (now.isSameOrAfter(start) && now.isBefore(end)) {
            return { ...period, remainingTime: formatRemainingTime(end) };
        }

        if (i < schedule.length - 1) {
            const nextPeriodStart = parseTime(schedule[i + 1].start);
            const passingPeriodEnd = end.clone().add(5, 'minutes');
            if (now.isSameOrAfter(end) && now.isBefore(passingPeriodEnd)) {
                return { period: 'Passing Period', remainingTime: formatRemainingTime(nextPeriodStart) };
            }
        }
    }
    return null;
}

// Fetch and update the schedule
async function updateSchedule() {
    try {
        const now = new Date();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        const isEarlyRelease = now.getDay() === 5;
        const schedule = isEarlyRelease ? scheduleData.earlyReleaseSchedule : scheduleData.regularSchedule;

        const currentPeriod = getCurrentPeriod(schedule);

        const schoolStartContentArea = document.querySelector('.start');
        const periodContentArea = document.querySelector('.period');
        const timeLeftContentArea = document.querySelector('.time');
        console.log(`Current Period: ${currentPeriod ? currentPeriod.period : 'None'}`);
        console.log(`Debug: Current period is ${currentPeriod ? currentPeriod.period : 'none'}, Remaining time is ${currentPeriod ? currentPeriod.remainingTime : 'none'}`);
        if (isWeekend) {
            schoolStartContentArea.innerHTML = 'Enjoy Your Weekend!';
            periodContentArea.innerHTML = 'Enjoy Your Weekend!';
            timeLeftContentArea.innerHTML = '';
        } else if (currentPeriod) {
            schoolStartContentArea.innerHTML = `Make It A Good One!`;
            periodContentArea.innerHTML = `${currentPeriod.period}`;
            timeLeftContentArea.innerHTML = `${currentPeriod.remainingTime}`; 
        } else {
            schoolStartContentArea.innerHTML = 'School is Over';
            periodContentArea.innerHTML = 'Day Over.';
            timeLeftContentArea.innerHTML = 'Day Over.';
        }

    } catch (error) {
        console.error('Error updating schedule:', error);
    }
}


function refreshPage() {
    setTimeout(() => {
        window.location.reload();
    }, 30 * 60 * 1000); // 30 minutes in milliseconds
}


window.addEventListener('load', () => {
    updateSchedule();
    setInterval(updateSchedule, 1000);
    refreshPage(); // Call the refresh function
});

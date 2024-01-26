// Helper function to parse time strings
function parseTime(timeStr) {
    const currentTime = moment();
    const timeComponents = timeStr.match(/(\d+):(\d+)(AM|PM)/);

    if (!timeComponents) {
        console.error(`Invalid time format: ${timeStr}`);
        return null;
    }

    let [_, hours, minutes, modifier] = timeComponents;
    hours = parseInt(hours) + (modifier === 'PM' && hours !== '12' ? 12 : 0);

    return currentTime.clone().hour(hours).minute(minutes).second(0).millisecond(0);
}

// Helper function to format remaining time
function formatRemainingTime(endMoment) {
    const diff = moment.duration(endMoment.diff(moment()));
    const hours = Math.floor(diff.asHours());
    const minutes = diff.minutes();
    const seconds = diff.seconds();

    return `${hours > 0 ? `${hours}H ` : ''}${minutes}M & ${seconds}S`;
}

const scheduleData = {
    "regularSchedule": [
        { "start": "7:00AM", "end": "7:55AM", "period": "Early Bird" },
        { "start": "8:05AM", "end": "9:25AM", "period": "1st Period " },
        { "start": "9:30AM", "end": "10:50AM", "period": "2nd Period " },
        { "start": "10:50AM", "end": "11:25AM", "period": "Bulldog Time" },
        { "start": "11:25AM", "end": "12:05PM", "period": "Lunch" },
        { "start": "12:05PM", "end": "1:25PM", "period": "3rd Period " },
        { "start": "1:30PM", "end": "2:50PM", "period": "4th Period " }
    ],
    "earlyReleaseSchedule": [
        { "start": "7:00AM", "end": "7:55AM", "period": "Early Bird" },
        { "start": "8:05AM", "end": "9:18AM", "period": "1st Period " },
        { "start": "9:23AM", "end": "10:39AM", "period": "2nd Period " },
        { "start": "10:44AM", "end": "11:57AM", "period": "3rd Period " },
        { "start": "11:57AM", "end": "12:37PM", "period": "Lunch" },
        { "start": "12:37PM", "end": "1:50PM", "period": "4th Period " }
    ]
};

// Determine the current period
// Determine the current period
function getCurrentPeriod(schedule) {
    const now = moment();

    for (let i = 0; i < schedule.length; i++) {
        const { start, end } = schedule[i];
        const startMoment = parseTime(start);
        const endMoment = parseTime(end);

        if (now.isBetween(startMoment, endMoment)) {
            return { ...schedule[i], remainingTime: formatRemainingTime(endMoment) };
        }

        // Adjusted logic for passing period
        if (i < schedule.length - 1) {
            const nextPeriodStart = parseTime(schedule[i + 1].start);
            if (now.isBetween(endMoment, nextPeriodStart)) {
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
        const isWeekend = [0, 6].includes(now.getDay());
        const isEarlyRelease = now.getDay() === 5;
        const schedule = isEarlyRelease ? scheduleData.earlyReleaseSchedule : scheduleData.regularSchedule;
        const currentPeriod = getCurrentPeriod(schedule);

        // DOM Elements
        const schoolStartContentArea = document.querySelector('.start');
        const periodElement = document.querySelector('.period');
        const timeLeftElement = document.querySelector('.time');

        // Get the parent 'li' elements
        const periodListItem = periodElement.parentNode;
        const timeLeftListItem = timeLeftElement.parentNode;

        if (isWeekend) {
            schoolStartContentArea.textContent = 'Enjoy Your Weekend!';
            periodListItem.style.display = 'none';
            timeLeftListItem.style.display = 'none';
        } else if (currentPeriod) {
            schoolStartContentArea.textContent = 'Make It A Good One!';
            periodListItem.style.display = 'list-item';
            timeLeftListItem.style.display = 'list-item';
            periodElement.textContent = currentPeriod.period;
            timeLeftElement.textContent = currentPeriod.remainingTime;
        } else {
            schoolStartContentArea.textContent = 'Your Day Is Over!';
            periodListItem.style.display = 'none';
            timeLeftListItem.style.display = 'none';
        }
    } catch (error) {
        console.error('Error updating schedule:', error);
    }
}

function refreshPage() {
    setTimeout(() => window.location.reload(), 1800000); // 30 minutes
}

window.addEventListener('load', () => {
    updateSchedule();
    setInterval(updateSchedule, 1000);
    refreshPage();
});

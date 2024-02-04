// Helper function to parse time strings into Moment objects
// timeStr: String representing time (e.g., "7:00AM")
// Returns: Moment object or null if invalid format
function parseTime(timeStr) {
    const currentTime = moment();
    const timeComponents = timeStr.match(/(\d+):(\d+)(AM|PM)/);

    if (!timeComponents) {
        console.error(`Invalid time format: ${timeStr}`);
        throw new Error(`Invalid time format: ${timeStr}`); // Throw an error on invalid format
    }

    let [_, hours, minutes, modifier] = timeComponents;
    hours = parseInt(hours) + (modifier === 'PM' && hours !== '12' ? 12 : 0);

    return currentTime.clone().hour(hours).minute(minutes).second(0).millisecond(0);
}


// Formats the time remaining until a given moment
// endMoment: Moment object representing the end time
// Returns: String representing formatted remaining time
function formatRemainingTime(endMoment) {
    const diff = moment.duration(endMoment.diff(moment()));
    const hours = Math.floor(diff.asHours());
    const minutes = diff.minutes();
    const seconds = diff.seconds();

    return `${hours > 0 ? `${hours}H ` : ''}${minutes}M & ${seconds}S`;
}

// Data structure representing school schedules
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

// Determines the current period based on a given schedule
// schedule: Array of schedule objects with start, end, and period properties
// Returns: Object representing the current period and remaining time or null if no current period
function getCurrentPeriod(schedule) {
    const now = moment();

    // Identify the period before lunch for both regular and early release schedules
    const periodBeforeLunchRegular = "Bulldog Time";
    const periodBeforeLunchEarlyRelease = "3rd Period";

    for (let i = 0; i < schedule.length; i++) {
        const { start, end, period } = schedule[i];
        const startMoment = parseTime(start);
        const endMoment = parseTime(end);

        if (now.isBetween(startMoment, endMoment)) {
            return { ...schedule[i], remainingTime: formatRemainingTime(endMoment) };
        }

        // Skip passing period logic before lunch for both regular and early release days
        if (period.trim() === periodBeforeLunchRegular || period.trim() === periodBeforeLunchEarlyRelease) {
            continue; // Skip to the next iteration, ignoring the passing period logic for the period before lunch
        }

        // Adjusted logic for passing period for all other periods
        if (i < schedule.length - 1) {
            const nextPeriodStart = parseTime(schedule[i + 1].start);
            if (now.isBetween(endMoment, nextPeriodStart)) {
                // For periods other than the one before lunch, treat it as a passing period
                return { period: 'Passing Period', remainingTime: formatRemainingTime(nextPeriodStart) };
            }
        }
    }
    return null;
}

// Updates the school schedule display on the webpage
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
        const periodElementMobile = document.querySelector('.periodMobile');
        const timeLeftElement = document.querySelector('.time');
        const bulldogTimeElement = document.querySelector('.bt')
        const dayOverElement = document.querySelector('.dayover')
        const dayType = document.querySelector('.day')
        const dayTypeMobile = document.querySelector('.dayMobile')
        const dayOverMobile = document.querySelector('.dayovermobile')

        // Get the parent 'li' elements
        const periodListItem = periodElement.parentNode;
        const timeLeftListItem = timeLeftElement.parentNode;
        const bulldogList = bulldogTimeElement.parentNode;
        const dayTypeList = dayType.parentNode;

        if (isWeekend) {
            schoolStartContentArea.textContent = 'Enjoy Your Weekend!';
            periodListItem.style.display = 'none';
            timeLeftListItem.style.display = 'none';
            dayOverElement.style.display = 'none'
        } else if (currentPeriod) {
            schoolStartContentArea.textContent = 'Make It A Good One!';
            periodListItem.style.display = 'list-item';
            timeLeftListItem.style.display = 'list-item';
            periodElement.textContent = currentPeriod.period;
            periodElementMobile.textContent = currentPeriod.period;
            timeLeftElement.textContent = currentPeriod.remainingTime;
            dayOverElement.style.display = 'none';
        } else {
            schoolStartContentArea.textContent = 'Your Day Is Over!';
            periodListItem.style.display = 'none';
            timeLeftListItem.style.display = 'none';
            periodElementMobile.style.display= ''
            dayOverElement.textContent = 'Have A Great Day!';
            dayOverMobile.textContent = 'Test'
        }
    } catch (error) {
        console.error('Error updating schedule:', error);
    }
}
// Refreshes the page after a specified interval
function refreshPage() {
    setTimeout(() => window.location.reload(), 1800000); // 30 minutes
}
// Event listener for page load
window.addEventListener('load', () => {
    updateSchedule();
    setInterval(updateSchedule, 1000);
    refreshPage();
});

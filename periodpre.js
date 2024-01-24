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
    for (let i = 0; i < schedule.length; i++) {
        const period = schedule[i];
        const start = parseTime(period.start);
        const end = parseTime(period.end);

        if (now >= start && now < end) {
            return { ...period, remainingTime: formatRemainingTime(end) };
        }

        if (i < schedule.length - 1) {
            const nextPeriodStart = parseTime(schedule[i + 1].start);
            const passingPeriodEnd = new Date(end.getTime() + 5 * 60000);
            if (now >= end && now < passingPeriodEnd) {
                return { period: 'Passing Period', remainingTime: formatRemainingTime(nextPeriodStart) };
            }
        }
    }
    return null;
}

// Fetch and update the schedule
var x = window.matchMedia("(max-device-width: 480px)")
async function updateSchedule() {
    try {
        const response = await fetch('schedule.json');
        const scheduleData = await response.json();

        const now = new Date();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        const isEarlyRelease = now.getDay() === 5;
        const schedule = isEarlyRelease ? scheduleData.earlyReleaseSchedule : scheduleData.regularSchedule;

        const currentPeriod = getCurrentPeriod(schedule);

        const schoolStartContentArea = document.querySelector('.start');
        const periodContentArea = document.querySelector('.period');
        const timeLeftContentArea = document.querySelector('.time');

        if (isWeekend) {
            schoolStartContentArea.innerHTML = 'Enjoy Your Weekend!';
            periodContentArea.innerHTML = 'Enjoy Your Weekend!';
            timeLeftContentArea.innerHTML = '';
        } else if (currentPeriod) {
            schoolStartContentArea.innerHTML = `School Remaining (${currentPeriod.remainingTime})`;
            periodContentArea.innerHTML = `${currentPeriod.period}`;
            timeLeftContentArea.innerHTML = `${currentPeriod.remainingTime}`;
        } else {
            schoolStartContentArea.innerHTML = 'School is Over';
            periodContentArea.innerHTML = 'Enjoy Your Day!';
            timeLeftContentArea.innerHTML = 'Enjoy Your Day!';
        }

        function deviceMobile(x) {
            if (x.matches) {
                periodContentArea.innerHTML = 'Day Over';
                timeLeftContentArea.innerHTML = 'Day Over';
            } else {
                timeLeftContentArea.innerHTML = 'Enjoy Your Day!';  
            }
          }
          deviceMobile(x);

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

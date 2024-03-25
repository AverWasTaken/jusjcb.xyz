async function updateDay() {
    try {
        const response = await fetch('../json/bt.json');
        const data = await response.json();

        // Use Moment.js for date formatting and calculations
        let today = moment();
        let targetDay = today;
        let isWeekend = false;

        // Check if today is weekend and adjust target day to Monday
        if (today.day() === 0) { // Sunday
            targetDay = today.add(1, 'days'); // Move to Monday
            isWeekend = true;
        } else if (today.day() === 6) { // Saturday
            targetDay = today.add(2, 'days'); // Move to Monday
            isWeekend = true;
        }

        const formattedTargetDay = targetDay.format('MM-D-YYYY');
        console.log("Target date for day type:", formattedTargetDay);

        const targetEntry = data.btschedule.find(entry => entry.date === formattedTargetDay);

        const daySpan = document.querySelector('.day');
        const daySpanMobile = document.querySelector('.dayMobile');
        const currentDayListItem = document.querySelector('.sdwknd'); // Select the 'Current Day' list item

        if (targetEntry) {
            let dayText;
            if (isWeekend) {
                // On weekends, change the 'Current Day' text and also provide the day type for Monday
                currentDayListItem.innerHTML = `It will be ${targetEntry.day === 'A' ? 'an' : 'a'} ${targetEntry.day} day on Monday.`;
                dayText = `${targetEntry.day} Day`;
            } else {
                // On weekdays, show the current day normally
                currentDayListItem.innerHTML = `Current Day - <span class="day">${targetEntry.day} Day</span>`;
                dayText = `${targetEntry.day} Day`;
            }

            if (daySpan) daySpan.innerHTML = `<span class="day">${dayText}</span>`;
            if (daySpanMobile) daySpanMobile.innerHTML = `<span class="dayMobile">${dayText}</span>`;
        } else if (isWeekend) {
            // If it's a weekend and no entry is found for the upcoming Monday, display a generic message
            currentDayListItem.innerHTML = "It's the weekend! <br> Information for the next school day will be updated soon.";
            if (daySpan) daySpan.textContent = "Information for the next school day will be updated soon.";
            if (daySpanMobile) daySpanMobile.textContent = "Information for the next school day will be updated soon.";
        }
    } catch (error) {
        console.error('Failed to load or process day data:', error);
    }
}

window.addEventListener('load', updateDay);

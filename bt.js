async function updateBulldogTime() {
    try {
        const response = await fetch('bt.json');
        const data = await response.json();

        // Use Moment.js to format the current date as D-M-Y
        const todayFormatted = moment().format('MM-D-YYYY');

        console.log("Today's date:", todayFormatted);

        const todaysEntry = data.btschedule.find(entry => entry.date === todayFormatted);

        const bulldogTimeElement = document.querySelector('.bt');
        if (todaysEntry) {
            bulldogTimeElement.textContent = todaysEntry.bulldogTime;
        } else {
            bulldogTimeElement.textContent = 'No Bulldog Time Today';
        }
    } catch (error) {
        console.error('Failed to load or process Bulldog Time data:', error);
    }
}

window.addEventListener('load', updateBulldogTime);

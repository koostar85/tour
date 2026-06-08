// Mini clock timezones for homepage
const miniTimezones = {
    'mini-ny': 'America/New_York',
    'mini-london': 'Europe/London',
    'mini-tokyo': 'Asia/Tokyo',
    'mini-sydney': 'Australia/Sydney'
};

// Function to format time
function formatTime(hours, minutes) {
    return [hours, minutes]
        .map(val => val.toString().padStart(2, '0'))
        .join(':');
}

// Function to get time in specific timezone (HH:MM format)
function getTimeInTimezone(timezone) {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: timezone
        });

        const parts = formatter.formatToParts(new Date());
        const timeObj = {};

        parts.forEach(part => {
            if (part.type !== 'literal') {
                timeObj[part.type] = part.value;
            }
        });

        return formatTime(timeObj.hour, timeObj.minute);
    } catch (error) {
        console.error(`Error getting time for timezone ${timezone}:`, error);
        return '--:--';
    }
}

// Function to update mini clocks
function updateMiniClocks() {
    for (const [clockId, timezone] of Object.entries(miniTimezones)) {
        const clockElement = document.getElementById(clockId);
        if (clockElement) {
            clockElement.textContent = getTimeInTimezone(timezone);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateMiniClocks();
    // Update every second
    setInterval(updateMiniClocks, 1000);
});
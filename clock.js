// Object containing all timezones and their corresponding clock IDs
const timezones = {
    'clock-ny': 'America/New_York',
    'clock-london': 'Europe/London',
    'clock-paris': 'Europe/Paris',
    'clock-tokyo': 'Asia/Tokyo',
    'clock-sydney': 'Australia/Sydney',
    'clock-dubai': 'Asia/Dubai',
    'clock-singapore': 'Asia/Singapore',
    'clock-hongkong': 'Asia/Hong_Kong',
    'clock-la': 'America/Los_Angeles',
    'clock-toronto': 'America/Toronto',
    'clock-saopaulo': 'America/Sao_Paulo',
    'clock-mumbai': 'Asia/Kolkata'
};

// Function to format time with leading zeros
function formatTime(hours, minutes, seconds) {
    return [hours, minutes, seconds]
        .map(val => val.toString().padStart(2, '0'))
        .join(':');
}

// Function to get current time in a specific timezone
function getTimeInTimezone(timezone) {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
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

        return formatTime(timeObj.hour, timeObj.minute, timeObj.second);
    } catch (error) {
        console.error(`Error getting time for timezone ${timezone}:`, error);
        return '--:--:--';
    }
}

// Function to get local timezone name
function getLocalTimezone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
        return 'UTC';
    }
}

// Function to update all clocks
function updateClocks() {
    // Update all timezone clocks
    for (const [clockId, timezone] of Object.entries(timezones)) {
        const clockElement = document.getElementById(clockId);
        if (clockElement) {
            clockElement.textContent = getTimeInTimezone(timezone);
        }
    }

    // Update local time
    const localTimeElement = document.getElementById('local-time');
    if (localTimeElement) {
        const now = new Date();
        localTimeElement.textContent = formatTime(
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
        );
    }

    // Update local timezone
    const localTimezoneElement = document.getElementById('local-timezone');
    if (localTimezoneElement) {
        localTimezoneElement.textContent = getLocalTimezone();
    }
}

// Initialize clocks when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update immediately
    updateClocks();

    // Update every second
    setInterval(updateClocks, 1000);
});

// Also update on visibility change (when tab comes to focus)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateClocks();
    }
});
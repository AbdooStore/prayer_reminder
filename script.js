document.addEventListener('DOMContentLoaded', function() {

    let currentCity = "الأسكندرية";
    let cityToAPI = {
        "الأسكندرية": { city: "Alexandria", country: "Egypt" },  
        "القاهرة": { city: "Cairo", country: "Egypt" },
        "الجيزة": { city: "Giza", country: "Egypt" }
    };
    
    // Get elements
    let citySelect = document.getElementById('cities');
    let cityTitle = document.querySelector('h1');
    let dateElement = document.getElementById('date');
    
    // Format date in Arabic
    function formatArabicDate(date) {
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ar-EG', options);
    }
    
function formatTime(time) {
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours);

    let period = hours >= 12 ? "مساءً" : "صباحًا";

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
}

function updatePrayerTimes(times) {
    let prayerTimes = {
        "الفجر": times.Fajr,
        "الشروق": times.Sunrise,
        "الظهر": times.Dhuhr,
        "العصر": times.Asr,
        "المغرب": times.Maghrib,
        "العشاء": times.Isha
    };
    
    let prayerElements = document.querySelectorAll('#prayer-name');

    for (let i = 0; i < prayerElements.length; i++) {
        let prayerName = prayerElements[i].textContent;

        if (prayerTimes[prayerName]) {
            prayerElements[i].nextElementSibling.textContent =
                formatTime(prayerTimes[prayerName]);
        }
    }
}

    
    // Fetch prayer times from API using async/await
    async function fetchPrayerTimes(cityName) {
            let cityInfo = cityToAPI[cityName];
            if (!cityInfo) return;
            
            let today = new Date();
            dateElement.textContent = formatArabicDate(today);
            
            let day = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();
            
            let response = await fetch(
                `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${cityInfo.city}&country=${cityInfo.country}&method=5`
            );
            
            let data = await response.json();
            
            updatePrayerTimes(data.data.timings);
           
       
    }

    // Handle city selection change
    function handleCityChange() {
        currentCity = this.value;
        cityTitle.textContent = currentCity;
        fetchPrayerTimes(currentCity);
    }
    
    citySelect.addEventListener('change', handleCityChange);
    
    // Initialize with default city
    fetchPrayerTimes(currentCity);
});

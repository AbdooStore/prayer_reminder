document.addEventListener('DOMContentLoaded', function () {

    let currentCity = "الأسكندرية";

    let cityToAPI = {
        "الأسكندرية": { lat: 31.2001, lon: 29.9187, method: 5 },
        "القاهرة": { lat: 30.0444, lon: 31.2357, method: 5 },
        "أسوان": { lat: 24.0889, lon: 32.8998, method: 5 },
        "الرياض": { lat: 24.7136, lon: 46.6753, method: 4 },
        "جدة": { lat: 21.4858, lon: 39.1925, method: 4 },
        "الخبر": { lat: 26.2172, lon: 50.1971, method: 4 }
    };

    let citySelect = document.getElementById('cities');
    let cityTitle = document.querySelector('h1');
    let dateElement = document.getElementById('date');

    function formatArabicDate(date) {
        return date.toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatTime(time) {
        let [h, m] = time.split(":");
        h = parseInt(h);

        let period = h >= 12 ? "مساءً" : "صباحًا";
        h = h % 12 || 12;

        return `${h}:${m} ${period}`;
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

        document.querySelectorAll('.prayer-box').forEach(box => {

            let name = box.querySelector('.prayer-name').textContent;
            let timeEl = box.querySelector('.prayer-time');

            if (prayerTimes[name]) {
                timeEl.textContent = formatTime(prayerTimes[name]);
            }
        });
    }

    async function fetchPrayerTimes(cityName) {

        let cityInfo = cityToAPI[cityName];
        if (!cityInfo) return;

        dateElement.textContent = formatArabicDate(new Date());

        let response = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${cityInfo.lat}&longitude=${cityInfo.lon}&method=${cityInfo.method}`
        );

        let data = await response.json();
        console.log(data);

        updatePrayerTimes(data.data.timings);
    }

    citySelect.addEventListener('change', function () {
        currentCity = this.value;
        cityTitle.textContent = currentCity;
        fetchPrayerTimes(currentCity);
    });

    fetchPrayerTimes(currentCity);

});

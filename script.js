document.addEventListener('DOMContentLoaded', function () {

    let currentCity = "الأسكندرية";

    let cityToAPI = {

        "الأسكندرية": {
            city: "Alexandria",
            country: "Egypt",
            method: 5
        },

        "القاهرة": {
            city: "Cairo",
            country: "Egypt",
            method: 5
        },

        "أسوان": {
            city: "Aswan",
            country: "Egypt",
            method: 5
        },

        "الرياض": {
            city: "Riyadh",
            country: "Saudi Arabia",
            method: 4
        },

        "جدة": {
            city: "Jeddah",
            country: "Saudi Arabia",
            method: 4
        },

        "الخبر": {
            city: "Khobar",
            country: "Saudi Arabia",
            method: 4
        }
    };

    // عناصر الصفحة
    let citySelect = document.getElementById('cities');
    let cityTitle = document.querySelector('h1');
    let dateElement = document.getElementById('date');

    // تنسيق التاريخ بالعربي
    function formatArabicDate(date) {

        let options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        return date.toLocaleDateString('ar-EG', options);
    }

    // تحويل الوقت من 24 ساعة إلى صباحًا / مساءً
    function formatTime(time) {

        let cleanTime = time.split(" ")[0];

        let [hours, minutes] = cleanTime.split(":");

        hours = parseInt(hours);

        let period = hours >= 12 ? "مساءً" : "صباحًا";

        hours = hours % 12;

        if (hours === 0) {
            hours = 12;
        }

        return `${hours}:${minutes} ${period}`;
    }

    // تحديث مواقيت الصلاة
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

    // جلب مواقيت الصلاة
    async function fetchPrayerTimes(cityName) {

        let cityInfo = cityToAPI[cityName];

        if (!cityInfo) return;

        let today = new Date();

        dateElement.textContent = formatArabicDate(today);

        try {

            let response = await fetch(
                `https://api.aladhan.com/v1/timingsByCity?city=${cityInfo.city}&country=${cityInfo.country}&method=${cityInfo.method}`
            );

            let data = await response.json();

            updatePrayerTimes(data.data.timings);

        } catch (error) {

            console.log("حدث خطأ:", error);
        }
    }

    // تغيير المدينة
    function handleCityChange() {

        currentCity = this.value;

        cityTitle.textContent = currentCity;

        fetchPrayerTimes(currentCity);
    }

    citySelect.addEventListener('change', handleCityChange);

    // تشغيل أول مرة
    fetchPrayerTimes(currentCity);

});

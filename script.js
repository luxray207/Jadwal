document.addEventListener("DOMContentLoaded", function() {
    updateTime();
    setInterval(updateTime, 1000);
    getUserLocation();
});

function updateTime() {
    const now = new Date();
    document.getElementById("time").textContent = now.toLocaleTimeString("id-ID");
    document.getElementById("date").textContent = now.toLocaleDateString("id-ID", { day: 'numeric', month: 'long' });
}

async function getUserLocation() {
    try {
        const ipResponse = await fetch("https://ip-api.com/json/");
        const ipData = await ipResponse.json();
        document.getElementById("city").textContent = ipData.city;
        getCityId(ipData.city);
    } catch (error) {
        console.error("Gagal mendapatkan lokasi:", error);
    }
}

async function getCityId(cityName) {
    try {
        const cityResponse = await fetch("https://api.banghasan.com/sholat/format/json/kota");
        const cityData = await cityResponse.json();
        const city = cityData.kota.find(k => k.nama.toLowerCase() === cityName.toLowerCase());

        if (city) {
            fetchJadwal(city.id);
        } else {
            alert("Kota tidak ditemukan dalam database.");
        }
    } catch (error) {
        console.error("Error mendapatkan ID kota:", error);
    }
}

async function fetchJadwal(cityId) {
    const today = new Date().toISOString().split('T')[0];
    const apiUrl = `https://api.banghasan.com/sholat/format/json/jadwal/kota/${cityId}/tanggal/${today}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.jadwal) {
            document.getElementById("imsak").textContent = data.jadwal.data.imsak;
            document.getElementById("sahur").textContent = data.jadwal.data.subuh;
            document.getElementById("buka").textContent = data.jadwal.data.maghrib;
            document.getElementById("tarawih").textContent = data.jadwal.data.isya;

            startCountdown(data.jadwal.data.maghrib);
        }
    } catch (error) {
        alert("Terjadi kesalahan dalam mengambil data.");
        console.error(error);
    }
}

function startCountdown(maghribTime) {
    const now = new Date();
    const [hour, minute] = maghribTime.split(":").map(Number);
    const bukaTime = new Date();
    bukaTime.setHours(hour, minute, 0);

    let interval = setInterval(() => {
        const diff = bukaTime - new Date();
        if (diff <= 0) {
            document.getElementById("countdown").textContent = "Sudah waktunya berbuka!";
            clearInterval(interval);
            return;
        }
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        document.getElementById("countdown").textContent = `${hours}j ${minutes}m ${seconds}d`;
    }, 1000);
}
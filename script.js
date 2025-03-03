// 1️⃣ Update Jam Real-time
function updateJam() {
    const now = new Date();
    const waktu = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    document.getElementById("jam").innerText = waktu;
}
setInterval(updateJam, 1000);
updateJam();

// 2️⃣ Ambil Lokasi dari IP
async function getLokasi() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const kota = data.city || "Tidak Diketahui";
        document.getElementById("lokasi").innerText = kota;
        getJadwalPuasa(kota);
    } catch (error) {
        console.error("Gagal mendapatkan lokasi:", error);
        document.getElementById("lokasi").innerText = "Error!";
    }
}

// 3️⃣ Ambil Jadwal Puasa
async function getJadwalPuasa(kota) {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia`);
        const data = await response.json();
        const jadwal = data.data.timings;

        document.getElementById("sahur").innerText = jadwal.Fajr; 
        document.getElementById("imsak").innerText = jadwal.Imsak;
        document.getElementById("berbuka").innerText = jadwal.Maghrib;
        document.getElementById("tarawih").innerText = jadwal.Isha;

        hitungWaktuBerbuka(jadwal.Maghrib);
    } catch (error) {
        console.error("Gagal mendapatkan jadwal:", error);
        document.getElementById("berbuka").innerText = "Error!";
    }
}

// 4️⃣ Hitung Mundur Waktu Berbuka
function hitungWaktuBerbuka(maghrib) {
    function updateHitungan() {
        const sekarang = new Date();
        const [jam, menit] = maghrib.split(":").map(Number);
        const waktuBerbuka = new Date();
        waktuBerbuka.setHours(jam, menit, 0);

        let sisaWaktu = (waktuBerbuka - sekarang) / 1000;
        if (sisaWaktu < 0) sisaWaktu += 86400;

        const jamSisa = Math.floor(sisaWaktu / 3600);
        const menitSisa = Math.floor((sisaWaktu % 3600) / 60);
        const detikSisa = Math.floor(sisaWaktu % 60);
        document.getElementById("hitungMundur").innerText = `${jamSisa}j ${menitSisa}m ${detikSisa}d`;
    }
    setInterval(updateHitungan, 1000);
    updateHitungan();
}

// Jalankan semua fungsi
getLokasi();
const countdownText = document.querySelector(".countdown-payment");

// 24 jam dari sekarang
const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);

function updateCountdown(){

    const now = new Date().getTime();

    const distance = endTime - now;

    // kalau waktu habis
    if(distance <= 0){

        clearInterval(timer);

        countdownText.textContent = "00:00:00";

        return;
    }

    // hitung jam menit detik
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60))
        / 1000
    );

    // format 2 digit
    const formatHours = String(hours).padStart(2, "0");
    const formatMinutes = String(minutes).padStart(2, "0");
    const formatSeconds = String(seconds).padStart(2, "0");

    countdownText.textContent =
        `${formatHours}:${formatMinutes}:${formatSeconds}`;
}

// update tiap 1 detik
const timer = setInterval(updateCountdown, 1000);

// pertama kali load
updateCountdown();

const instructionCard = document.querySelectorAll(".payment-method");

instructionCard.forEach((item) => {
    item.addEventListener("click", () => {
        const overlay = item.querySelector(".text-instruction");

        document.querySelectorAll(".text-instruction").forEach((el) => {
            if (el !== overlay) {
                el.style.display = "none";
            }
        });

        if (overlay.style.display === "block") {
            overlay.style.display = "none";
        } else {
            overlay.style.display = "block";
        }
    });
});

const payment = localStorage.getItem("payment_method");

function generateVA(prefix) {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    const va = prefix + randomNumber;
    return va.replace(/(\d{4})(?=\d)/g, "$1 ");
}

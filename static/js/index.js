const textAbout = document.querySelectorAll(".text-about");

textAbout.forEach((item) => {
    item.addEventListener("click", () => {

        const overlay = item.querySelector(".overlay-about");

        // tutup semua dulu
        document.querySelectorAll(".overlay-about").forEach((el) => {
            if (el !== overlay) {
                el.style.display = "none";
            }
        });

        // toggle yang diklik
        if (overlay.style.display === "block") {
            overlay.style.display = "none";
        } else {
            overlay.style.display = "block";
        }
    });
});
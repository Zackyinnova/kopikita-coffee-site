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

const ContentFooter = document.querySelectorAll(".content-footer");

ContentFooter.forEach((item) =>{
    item.addEventListener("click", ()=>{

        const overlayFooter = item.querySelector(".overlay-content-footer");

        document.querySelectorAll(".overlay-content-footer").forEach((el) =>{
            if(el !== overlayFooter){
                el.style.display = "none";
            }
        })

        if(overlayFooter.style.display === "block"){
            overlayFooter.style.display = "none";
        }else{
            overlayFooter.style.display = "block";
        }
    });
});

const overlayNav = document.getElementById("overlay-navbar");
const burgerMenu = document.getElementById("icon-burger-menu");

burgerMenu.addEventListener("click", () =>{
    overlayNav.style.display = "flex";
});

overlayNav.addEventListener("click", (e) =>{
    if(e.target === overlayNav){
        overlayNav.style.display = "none";
    }
});



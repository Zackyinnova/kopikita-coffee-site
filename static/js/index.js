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

//open overlay cart
const buttonCart = document.getElementById("button-cart");
const overlayCart = document.getElementById("overlay-cart");

buttonCart.addEventListener("click", () =>{
    overlayCart.style.display = "flex";
});

overlayCart.addEventListener("click", (e) => {
    if(e.target === overlayCart){
        overlayCart.style.display = "none";
    }
})

//update qty cart
const boxes = document.querySelectorAll(".box-qty");

boxes.forEach(box => {
    const plus = box.querySelector(".btn-plus");
    const minus = box.querySelector(".btn-min");
    const qtyText = box.querySelector(".qty-number");

    const container = box.closest(".product-cart-container");
    const priceEl = container.querySelector(".price-cart");

    const basePrice = parseInt(priceEl.dataset.price);

    function formatRupiah(angka) {
        return angka.toLocaleString("id-ID");
    }

    function updatePrice(qty) {
        const total = basePrice * qty;
        priceEl.textContent = "Rp." + formatRupiah(total);
    }

    plus.addEventListener("click", () => {
        let qty = parseInt(qtyText.textContent);
        qty++;
        qtyText.textContent = qty;

        updatePrice(qty);
    });

    minus.addEventListener("click", () => {
        let qty = parseInt(qtyText.textContent);

        if (qty > 1) {
            qty--;
            qtyText.textContent = qty;

            updatePrice(qty);
        }
    });
});



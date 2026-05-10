const buttonNavShop = document.querySelectorAll('.content-nav-shop');
const gridProduct = document.querySelectorAll('.grid-product');

buttonNavShop.forEach((btn) => {
    btn.addEventListener('click', () => {

        buttonNavShop.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');


        const target = btn.getAttribute('data-target');


        gridProduct.forEach(grid => grid.classList.remove('open'));

        const targetGrid = document.getElementById(target);
        if(targetGrid){
            targetGrid.classList.add('open');
        }

    });
});


const cards = document.querySelectorAll('.card-product-page');

cards.forEach(card => {
    const buttonColor = card.querySelectorAll(".main-color");
    const textColor = card.querySelectorAll(".text-taste");
    const imgProduct = card.querySelectorAll(".img-product");
    const selectedProductId = card.querySelector(".selected-product-id");

    buttonColor.forEach((btn, index) => {
        btn.addEventListener('click', () => {

            textColor.forEach(text => text.classList.remove('show'));
            if (textColor[index]) {
                textColor[index].classList.add('show');
            }

            imgProduct.forEach(img => img.classList.remove('show'));
            if (imgProduct[index]) {
                imgProduct[index].classList.add('show');
            }

            if (selectedProductId) {
                selectedProductId.value = btn.dataset.idProduct;
            }

            console.log("ID Product:", btn.dataset.idProduct);
        });
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

const buttonCart = document.getElementById("button-cart");
const overlayCart = document.getElementById("overlay-cart");
const iconCart = document.getElementById("icon-cart");

buttonCart.addEventListener("click", () =>{
    overlayCart.style.display = "flex";
});

iconCart.addEventListener("click", () => {
    overlayCart.style.display = "flex";
});

overlayCart.addEventListener("click", (e) => {
    if(e.target === overlayCart){
        overlayCart.style.display = "none";
    }
})

// update qty cart
const boxes = document.querySelectorAll(".box-qty");
const totalCartText = document.querySelector(".total-cart-price");

function formatRupiah(angka) {
    return angka.toLocaleString("id-ID");
}

function updateTotalCart() {
    let totalCart = 0;

    document.querySelectorAll(".product-cart-container").forEach(container => {
        const qtyText = container.querySelector(".qty-number");
        const priceEl = container.querySelector(".price-cart");

        const qty = parseInt(qtyText.textContent);
        const basePrice = parseInt(priceEl.dataset.price);

        totalCart += qty * basePrice;
    });

    totalCartText.textContent = "Rp." + formatRupiah(totalCart);
}

boxes.forEach(box => {
    const plus = box.querySelector(".btn-plus");
    const minus = box.querySelector(".btn-min");
    const qtyText = box.querySelector(".qty-number");

    const container = box.closest(".product-cart-container");
    const priceEl = container.querySelector(".price-cart");

    const basePrice = parseInt(priceEl.dataset.price);

    function updatePrice(qty) {
        const total = basePrice * qty;
        priceEl.textContent = "Rp." + formatRupiah(total);
    }

    plus.addEventListener("click", () => {
        let qty = parseInt(qtyText.textContent);
        qty++;

        qtyText.textContent = qty;
        updatePrice(qty);
        updateTotalCart();
    });

    minus.addEventListener("click", () => {
        let qty = parseInt(qtyText.textContent);

        if (qty > 1) {
            qty--;

            qtyText.textContent = qty;
            updatePrice(qty);
            updateTotalCart();
        }
    });
});












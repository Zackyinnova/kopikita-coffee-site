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

    buttonColor.forEach((btn, index) => {
        btn.addEventListener('click', () => {

            // reset text
            textColor.forEach(text => text.classList.remove('show'));
            textColor[index].classList.add('show');

            // reset image
            imgProduct.forEach(img => img.classList.remove('show'));
            imgProduct[index].classList.add('show');

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






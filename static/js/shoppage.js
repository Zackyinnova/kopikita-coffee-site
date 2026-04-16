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





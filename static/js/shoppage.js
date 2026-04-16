const buttonNavShop = document.querySelectorAll('.content-nav-shop');


buttonNavShop.forEach((btn, index) =>{
    btn.addEventListener('click', () =>{
        buttonNavShop.forEach( b => b.classList.remove('active'));

        btn.classList.add('active');
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





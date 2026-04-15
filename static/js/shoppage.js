const buttonNavShop = document.querySelectorAll('.content-nav-shop');


buttonNavShop.forEach((btn, index) =>{
    btn.addEventListener('click', () =>{
        buttonNavShop.forEach( b => b.classList.remove('active'));

        btn.classList.add('active');
    });
});


const buttonColor = document.querySelectorAll(".main-color");
const textColor = document.querySelectorAll(".text-taste");
const imgProduct = document.querySelectorAll(".img-product")

buttonColor.forEach((buttonColor, index) => {
    buttonColor.addEventListener('click', () =>{

        textColor.forEach (textColor => textColor.classList.remove('show'));

        textColor[index].classList.add('show');

        imgProduct.forEach(imgProduct => imgProduct.classList.remove('show'));
        imgProduct[index].classList.add('show');
    });
});



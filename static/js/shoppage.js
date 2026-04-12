const buttonNavShop = document.querySelectorAll('.content-nav-shop');


buttonNavShop.forEach((btn, index) =>{
    btn.addEventListener('click', () =>{
        buttonNavShop.forEach( b => b.classList.remove('active'));

        btn.classList.add('active');
    });
});



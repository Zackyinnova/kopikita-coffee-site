//count price all item
const priceAllItem = document.querySelector(".price-all-item");

const shippingSelect = document.querySelector("#select-shipping");
const shippingPrice = document.querySelector(".shipping-price");

const totalPrice = document.querySelector(".number-total-price");

function formatRupiah(angka){
    return angka.toLocaleString("id-ID");
}

function UpdatePriceItem(){
    let totalPriceItem = 0;

    document.querySelectorAll(".price-cart").forEach(priceItem => {

        const price = parseInt(priceItem.dataset.price);

        totalPriceItem += price;
    });

    priceAllItem.textContent = "Rp." + formatRupiah(totalPriceItem);

    updateGrangTotal(totalPriceItem);
}

function updateGrangTotal(subtotal){
    const shipping = parseInt(shippingSelect.value) || 0;

    shippingPrice.textContent = "Rp." + formatRupiah(shipping);

    const grandTotal = subtotal + shipping;

    totalPrice.textContent = "Rp." + formatRupiah(grandTotal);
}

shippingSelect.addEventListener("change", () => {

    // ambil subtotal dari text
    const subtotal = parseInt(
        priceAllItem.textContent
            .replace("Rp.", "")
            .replace(/\./g, "")
    );

    updateGrangTotal(subtotal);
});


UpdatePriceItem();
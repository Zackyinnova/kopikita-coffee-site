//count price all item
const priceAllItem = document.querySelector(".price-all-item");

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
}

UpdatePriceItem();
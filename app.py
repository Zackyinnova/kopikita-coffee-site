import mysql.connector
import re
from flask import session
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask import request
import random

app = Flask(__name__)

app.secret_key = 'rahasia123' 

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="db_kopikita"
)

#first page
@app.route('/')
def index():
    cart_items, cart_products, is_login, total_cart=total_cart = get_cart_data()

    return render_template(
        "index.html",
        cart_items=cart_items,
        cart_products=cart_products,
        is_login=is_login,
        total_cart=total_cart
    )

@app.route('/loginpage')
def signinpage():
    return render_template('AccountPage/LoginPage.html')

@app.route('/signuppage')
def signupPage():
    return render_template('AccountPage/CreateaccPage.html')

@app.route('/testpage')
def testpage():
    return render_template('testPage.html')

@app.route('/shoppage')
def shopPage():
    cart_items, cart_products, is_login, total_cart = get_cart_data()

    return render_template(
        "shopPage.html",
        cart_items=cart_items,
        cart_products=cart_products,
        is_login=is_login,
        total_cart=total_cart
    )

def get_cart_data():
    cart_items = []
    cart_products = []
    is_login = False
    total_cart = 0

    if "user_id" in session:
        is_login = True
        user_id = session["user_id"]
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                td.id,
                p.id_product,
                p.nama_product,
                p.variant,
                p.price,
                p.img,
                p.path_img,
                td.qty
            FROM tb_transaksi_detail td
            JOIN tb_transaksi t ON td.id_transaksi = t.id_transaksi
            JOIN tb_product p ON td.id_product = p.id_product
            WHERE t.user_id = %s
            AND t.status = %s
        """, (user_id, "add to cart"))

        cart_items = cursor.fetchall()
        cart_products = [item["id_product"] for item in cart_items]

        for item in cart_items:
            total_cart += item["price"] * item["qty"]

    return cart_items, cart_products, is_login, total_cart

@app.route('/addproduct')
def addproduct():
    return render_template('submit_product.html')

#form submit product
@app.route('/add-product', methods=['POST'])
def add_product():
    cursor = db.cursor(dictionary=True)

    nama_product = request.form['nama_product']
    variant = request.form['variant']
    price = int(request.form['price'].replace(".", ""))

    # cek apakah nama product sudah ada
    cursor.execute(
        "SELECT id_merek FROM tb_product WHERE nama_product = %s LIMIT 1",
        (nama_product,)
    )
    existing = cursor.fetchone()

    if existing:
        id_merek = existing['id_merek']
    else:
        id_merek = 1  # default merek, ganti sesuai id merek kamu

    file = request.files['img']
    filename = file.filename
    file.save('static/uploads/' + filename)

    cursor.execute(
        """
        INSERT INTO tb_product 
        (id_merek, nama_product, variant, price, img)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (id_merek, nama_product, variant, price, filename)
    )

    db.commit()
    cursor.close()

    return "Product berhasil ditambahkan"
    
#form submit create account dari page createaccpage.html
@app.route('/CreateAccount',methods=['POST'])
def SubmitSignup():
    cursor = db.cursor(dictionary=True)

    email = request.form['input_email']
    name = request.form['input_username']
    password = request.form['input_password']

    #for validation password
    if len (password) < 6 :
        return render_template('AccountPage/CreateaccPage.html',
                               error = "Password minimal 6 karakter")

    
    if not re.search("[a-zA-Z]", password):
        return render_template('AccountPage/CreateaccPage.html',
                               error="Password harus ada alfabet")
    
    if not re.search("[0-9]", password):
        return render_template('AccountPage/CreateaccPage.html',
                               error = "Password harus ada angka")

    cursor = db.cursor()

    #for cheking email
    cursor.execute("SELECT * FROM tb_users WHERE email=%s", (email,))
    existing = cursor.fetchone()

    if existing:
        return render_template('AccountPage/CreateaccPage.html',
                               error= "Email sudah digunakan")


    #for send data crate account to database
    cursor.execute(
        'INSERT INTO tb_users (email, name, password)'
        'VALUES (%s,%s,%s)',
        (email, name, password)
    )

    db.commit()
    cursor.close()
    return redirect(url_for('signinpage'))

def sensor_password(password):
    if len(password) <= 2:
        return "*" * len(password)
    return password[0] + "*" * (len(password) - 2) + password[-1]

#for validation account if alrd crate an account
@app.route('/validationAcc', methods=['POST'])
def validationAcc():
    cursor = db.cursor(dictionary=True)

    LoginEmail = request.form['login_email']
    LoginPassword = request.form['login_password']

    cursor.execute("SELECT * FROM tb_users WHERE email=%s AND password=%s",
                   (LoginEmail,LoginPassword),
    )

    user = cursor.fetchone()

    if user:
        session['user_id'] = user['id']
        session['name'] = user['name']
        session['email'] = user['email']
        session['password'] = sensor_password(user['password'])
        
        return redirect(url_for('index'))
    else:
        return render_template(
            'AccountPage/LoginPage.html',
            error = "email atau password salah"
        )
    
@app.route('/navAccount')
def navAccount():
    if 'user_id' in session:
        return render_template('AccountPage.html')  # sudah login
    else:
        return redirect(url_for('signinpage'))  # belum login
    

@app.route('/add-to-cart', methods=["POST"])
def addToCart():
    if "user_id" not in session:
        return redirect("/signinpage")

    user_id = session["user_id"]
    id_product = request.form.get("id_product")

    cursor = db.cursor(dictionary=True)

    # cek cart aktif
    cursor.execute("""
        SELECT id_transaksi
        FROM tb_transaksi
        WHERE user_id = %s AND status = %s
    """, (user_id, "add to cart"))

    transaksi = cursor.fetchone()

    if transaksi:
        id_transaksi = transaksi["id_transaksi"]
    else:
        cursor.execute("""
            INSERT INTO tb_transaksi (user_id, total_price, status)
            VALUES (%s, %s, %s)
        """, (user_id, 0, "add to cart"))

        db.commit()
        id_transaksi = cursor.lastrowid

    # cek apakah product sudah ada di cart detail
    cursor.execute("""
        SELECT id, qty
        FROM tb_transaksi_detail
        WHERE id_transaksi = %s
        AND id_product = %s
    """, (id_transaksi, id_product))

    existing_item = cursor.fetchone()

    if existing_item:
        # kalau sudah ada, tambah qty
        cursor.execute("""
            UPDATE tb_transaksi_detail
            SET qty = qty + 1
            WHERE id = %s
        """, (existing_item["id"],))
    else:
        # kalau belum ada, insert baru
        cursor.execute("""
            INSERT INTO tb_transaksi_detail
            (id_transaksi, id_product, qty)
            VALUES (%s, %s, %s)
        """, (id_transaksi, id_product, 1))

    # ambil harga product
    cursor.execute("""
        SELECT price
        FROM tb_product
        WHERE id_product = %s
    """, (id_product,))

    product = cursor.fetchone()

    if product:
        cursor.execute("""
            UPDATE tb_transaksi
            SET total_price = total_price + %s
            WHERE id_transaksi = %s
        """, (product["price"], id_transaksi))

    db.commit()

    return redirect("/shoppage")

@app.route("/delete-cart-item", methods=["POST"])
def deleteCartItem():
    if "user_id" not in session:
        return redirect("/signinpage")

    id_detail = request.form.get("id_detail")

    cursor = db.cursor()

    cursor.execute("""
        DELETE FROM tb_transaksi_detail
        WHERE id = %s
    """, (id_detail,))

    db.commit()

    return redirect("/shoppage")

@app.route("/CheckOutItem", methods=["POST"])
def CheckOutItem():
    if "user_id" not in session:
        return redirect("/signinpage")
    
    user_id = session["user_id"]
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT id_transaksi
        FROM tb_transaksi
        WHERE user_id = %s AND status = %s
        ORDER BY id_transaksi DESC
        LIMIT 1
    """, (user_id, "add to cart"))

    transaksi = cursor.fetchone()

    if not transaksi:
        return redirect("/shoppage")

    id_transaksi = transaksi["id_transaksi"]

    cursor.execute("""
        UPDATE tb_transaksi
        SET status = %s
        WHERE id_transaksi = %s
    """, ("memesan", id_transaksi))

    db.commit()

    return redirect(f"/FormCheckOut/{id_transaksi}")

@app.route("/update-cart-qty", methods=["POST"])
def updateCartQty():
    if "user_id" not in session:
        return {"success": False, "message": "Login dulu"}, 401

    data = request.get_json()

    id_detail = data.get("id_detail")
    qty = data.get("qty")

    if not id_detail or not qty:
        return {"success": False, "message": "Data tidak lengkap"}, 400

    cursor = db.cursor()

    cursor.execute("""
        UPDATE tb_transaksi_detail
        SET qty = %s
        WHERE id = %s
    """, (qty, id_detail))

    db.commit()

    return {"success": True}

@app.route("/FormCheckOut/<int:id_transaksi>")
def FormCheckOut(id_transaksi):
    if "user_id" not in session:
        return redirect("/signinpage")

    user_id = session["user_id"]
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            t.id_transaksi,
            t.total_price,
            t.status,
            td.id,
            td.qty,
            p.id_product,
            p.nama_product,
            p.variant,
            p.price,
            p.path_img
        FROM tb_transaksi t
        JOIN tb_transaksi_detail td 
            ON t.id_transaksi = td.id_transaksi
        JOIN tb_product p 
            ON td.id_product = p.id_product
        WHERE t.user_id = %s
        AND t.id_transaksi = %s
        AND t.status = %s
    """, (user_id, id_transaksi, "memesan"))

    checkout_items = cursor.fetchall()

    total_checkout = 0
    for item in checkout_items:
        total_checkout += item["price"] * item["qty"]

    return render_template(
        "formCheckOut.html",
        checkout_items=checkout_items,
        total_checkout=total_checkout
    )

def generate_va(payment_method):
    prefix_map = {
        "bca": "0147",
        "mandiri": "0088",
        "bni": "0099"
    }

    prefix = prefix_map.get(payment_method)

    if not prefix:
        return None

    random_number = random.randint(10000000, 99999999)

    va = prefix + str(random_number)

    return " ".join(
        [va[i:i+4] for i in range(0, len(va), 4)]
    )

@app.route("/placeorder", methods=["POST"])
def placeOrder():
    if "user_id" not in session:
        return redirect("/signinpage")

    user_id = session["user_id"]

    email_user = request.form.get("email_user")
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    address_user = request.form.get("address_user")
    number_user = request.form.get("number_user")
    shipping_price = request.form.get("shipping_price")
    payment_method = request.form.get("payment_method")

    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT id_transaksi, total_price
        FROM tb_transaksi
        WHERE user_id = %s
        AND status = %s
        ORDER BY id_transaksi DESC
        LIMIT 1
    """, (user_id, "memesan"))

    transaksi = cursor.fetchone()

    if not transaksi:
        return redirect("/shoppage")

    id_transaksi = transaksi["id_transaksi"]
    total_price = transaksi["total_price"]

    grand_total = int(total_price) + int(shipping_price)

    va_number = None

    if payment_method != "qris":
        va_number = generate_va(payment_method)

    cursor.execute("""
        UPDATE tb_transaksi
        SET 
            email_user = %s,
            first_name = %s,
            last_name = %s,
            address_user = %s,
            number_user = %s,
            shipping_price = %s,
            payment_method = %s,
            va_number = %s,
            grand_total = %s,
            status = %s
        WHERE id_transaksi = %s
        AND user_id = %s
    """, (
        email_user,
        first_name,
        last_name,
        address_user,
        number_user,
        shipping_price,
        payment_method,
        va_number,
        grand_total,
        "ordered",
        id_transaksi,
        user_id
    ))

    db.commit()

    return redirect("/paymentpage")

@app.route('/paymentpage')
def paymentpage():
    if "user_id" not in session:
        return redirect("/signinpage")

    user_id = session["user_id"]
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM tb_transaksi
        WHERE user_id = %s
        AND status = %s
        ORDER BY id_transaksi DESC
        LIMIT 1
    """, (user_id, "ordered"))

    transaksi = cursor.fetchone()

    if not transaksi:
        return redirect("/shoppage")

    payment_assets = {
        "qris": {
            "title": "Pembayaran Via QRIS",
            "img": "img/img-payment/qris-img.jpg",
            "type": "qris"
        },
        "bca": {
            "title": "Transfer Via Bank BCA",
            "img": "img/img-payment/bca-img.png",
            "type": "va"
        },
        "mandiri": {
            "title": "Transfer Via Bank Mandiri",
            "img": "img/img-payment/mandiri-img.png",
            "type": "va"
        },
        "bni": {
            "title": "Transfer Via Bank BNI",
            "img": "img/img-payment/bni-img.png",
            "type": "va"
        }
    }

    payment_info = payment_assets.get(transaksi["payment_method"])

    return render_template(
        "paymentPage.html",
        transaksi=transaksi,
        payment_info=payment_info
    )



@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))



if __name__ == "__main__":
    app.run(debug=True)
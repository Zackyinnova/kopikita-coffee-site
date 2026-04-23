import mysql.connector
import re
from flask import session
from flask import Flask, render_template, request, redirect, url_for, jsonify

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
    return render_template('index.html')

@app.route('/loginpage')
def signinpage():
    return render_template('AccountPage/LoginPage.html')

@app.route('/signuppage')
def signupPage():
    return render_template('AccountPage/CreateaccPage.html')

    


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



if __name__ == "__main__":
    app.run(debug=True)
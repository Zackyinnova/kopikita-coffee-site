import mysql.connector
from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="db_kopikita"
)

@app.route('/')
def index():
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

    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO tb_users (email, name, password)'
        'VALUES (%s,%s,%s)',
        (email, name, password)
    )

    db.commit()
    cursor.close()
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run(debug=True)
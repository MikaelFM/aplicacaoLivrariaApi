import json

import requests
from flask import Flask,render_template,request,make_response,redirect,session

import py.functions as functions
from run import app

@app.route("/")
@app.route("/", methods=['POST'])
def home():
    return functions.homepage()
@app.route("/login")
def get_livros():
    return render_template("login.html")

@app.route("/loginValidation", methods=['POST'])
def login():
    return functions.valida_login()
@app.route("/new")
def form():
    if session is None:
        return render_template("login.html")
    data = functions.get_form_data()
    return render_template("form-book.html", data=data)

@app.route("/delete", methods=['POST'])
def delete():
    id = request.form['id']
    return functions.delete_livros(id)
@app.route("/saveBook", methods=['POST'])
def saveBook():
    data = json.loads(request.form['newLivro'])
    if data['id'] != -1:
        print(functions.put_livros(data))
    else:
      print(functions.post_livros(data))
    return "OK"

@app.route("/editBook", methods=['POST'])
def editbook():
    livro = json.loads(request.form['livro'])
    livro['categoria'] = livro['categoria']['id']
    livro['editora'] = livro['editora']['id']
    data = functions.get_form_data()
    data['livro'] = livro
    return render_template("form-book.html",data=data)
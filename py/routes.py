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
    data = {
        "autores": functions.get_autores(),
        "editoras":functions.get_editoras(),
        "categorias":functions.get_categoria()
    }
    return render_template("form-book.html", data=data)

@app.route("/delete", methods=['POST'])
def delete():
    id = request.form['id']
    return functions.delete_livros(id)
@app.route("/saveBook", methods=['POST'])
def saveBook():
    json = request.form['newLivro']
    print(functions.post_livros(json))
    return "OK"

@app.route("/editBook", methods=['POST'])
def editbook():
    json = request.form['EditLivro']
    print(functions.post_livros(json))
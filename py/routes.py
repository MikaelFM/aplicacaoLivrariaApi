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
    return render_template("form-book.html")

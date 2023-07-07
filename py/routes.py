import requests
from flask import Flask,render_template,request

import py.functions
from run import app

@app.route("/login")
def login():
    try:
        user = request.form('user')
        password = request.form('password')
        data = {"username":f"{user}","password": f"{password}"}
        requisicao = requests.post(f"https://livraria-app.herokuapp.com/api/token/", json = data)
        return requisicao.json()
    except:
        return "Usuário e/ou senha incorretos"

@app.route("/")
@app.route("/", methods=['POST'])
def home():
    # essa funcao pode tanto vir de quando o usuario submete o formulario de login quanto quando o usuario digita a rota no navegador. É preciso
    # fazer um IF para ver se ta vindo da submissao ou do navegador e
    # fazer a seguinte validação: se está vindo da submissão do login, pegar o login e senha e enviar para a rota que pega o token. Se der tudo certo,
    # redirecionar para a tela de index. Se não, retorna alguma mensagem de erro.
    # Se o usuario  digitou na barra de pesquisa, ver se ele está logado (vendo os cookies). Se estiver logado, atualizar o token dele e mandar pra tela
    # de index. Se não estiver logado, redirecionar para a tela de Login.
    return render_template("index.html", data=[])

@app.route("/login")
def get_livros():
    return render_template("login.html")
    
@app.route("/new")
def form():
    return render_template("form-book.html")


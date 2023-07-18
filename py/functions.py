from flask import Flask,render_template,request,redirect,session,make_response, jsonify
import requests
import json


def valida_login():
    user = request.form['login']
    password = request.form['senha']
    success = get_token(user, password) is not None
    if not success:
        return "Usuário e/ou senha incorretos"
    return "OK"

def homepage():
    if request.method == "POST":
        user = request.form['login']
        password = request.form['senha']
        return setcookie(user, password)
    else:
        if getcookie()['usuario'] is None:
            return render_template("login.html")
        else:
            data = {
                'livros': get_livros()
            }
            return render_template("index.html", data=data)

def get_token(usuario = None, senha = None):
    try:
        cookie = getcookie()
        user = cookie['usuario'] if usuario is None else usuario
        password = cookie['password'] if senha is None else senha
        data = {"username":f"{user}","password": f"{password}"}
        requisicao = requests.post(f"https://livraria-app.herokuapp.com/api/token/", json=data)
        token = (requisicao.json())['access']
        return {"Authorization": f"Bearer {token}"}
    except:
        return None
def get_autores():
    requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/autores/", verify=False,headers=get_token())
    return requisicao.json()

def get_editoras():
    requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/editoras/",verify=False,headers=get_token())
    return requisicao.json()

def get_categoria():
   requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/categorias/",verify=False,headers=get_token())
   return requisicao.json()

def get_livros(username = None, password = None):
   requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/livros/",verify=False,headers=get_token(username, password))
   return requisicao.json()

def post_livros(j):
    requisicao = requests.post(f"https://livraria-app.herokuapp.com/api/livros/", json=j, headers=get_token())
    return requisicao.json()

def put_livros(j):
    id = j['id']
    j.pop('id')
    requisicao = requests.put(f"https://livraria-app.herokuapp.com/api/livros/{id}/", json =j ,headers=get_token())
    print(requisicao.json())
    return requisicao.json()

def delete_livros(id):
    requisicao = requests.delete(f"https://livraria-app.herokuapp.com/api/livros/{id}/",verify=False, headers= get_token())
    return json.dumps(requisicao.json())
def getcookie():
    return {
        'usuario' : request.cookies.get('usuario'),
        'password': request.cookies.get('password')
    }

def setcookie(username, password):
    data = {
        'livros': get_livros(username, password)
    }
    resp = make_response(render_template("index.html", data=data))
    resp.set_cookie('usuario', username)
    resp.set_cookie('password', password)
    return resp
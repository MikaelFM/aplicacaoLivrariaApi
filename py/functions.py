from flask import render_template, request, make_response, session
import requests
import json, copy

form_data = {}


def valida_login():
    session['username'] = request.form['username']
    session['password'] = request.form['password']
    success = get_token() is not None
    if not success:
        return "Usuário e/ou senha incorretos"
    return "OK"

def homepage():
    if request.method == "POST":
        session['username'] = request.form['username']
        session['password'] = request.form['password']
        set_form_data()
        if('status' in request.form):
            return setcookie()
        else:
            data = {
                'livros': get_livros()
            }
            return render_template("index.html", data=data)
    else:
        if getcookie()['username'] is None:
            return render_template("login.html")
        else:
            set_form_data()
            cookies = getcookie()
            session['username'] = cookies['username']
            session['password'] = cookies['password']
            data = {
                'livros': get_livros()
            }
            return render_template("index.html", data=data)

def get_token():
    try:
        data = {"username":f"{session['username']}","password": f"{session['password']}"}
        requisicao = requests.post(f"https://livraria-app.herokuapp.com/api/token/", json=data)
        token = (requisicao.json())['access']
        return {"Authorization": f"Bearer {token}"}
    except:
        return None

def set_form_data():
    token = get_token()
    global form_data
    form_data = {
        "autores": get_autores(token),
        "editoras": get_editoras(token),
        "categorias": get_categoria(token)
    }

def get_form_data():
    return copy.copy(form_data)

def get_autores(token):
    requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/autores/", verify=False,headers=token)
    return requisicao.json()

def get_editoras(token):
    requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/editoras/",verify=False,headers=token)
    return requisicao.json()

def get_categoria(token):
   requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/categorias/",verify=False,headers=token)
   return requisicao.json()

def get_livros():
   requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/livros/",verify=False,headers=get_token())
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
        'username': request.cookies.get('username'),
        'password': request.cookies.get('password')
    }

def setcookie():
    data = {
        'livros': get_livros()
    }
    resp = make_response(render_template("index.html", data=data))
    resp.set_cookie('username', session['username'])
    resp.set_cookie('password', session['password'])
    return resp
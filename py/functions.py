from flask import Flask,render_template,request,redirect,session
import requests

def login():
    try:
        user = request.args.get('user')
        password = request.args.get('password')
        data = {"username":f"{user}","password": f"{password}"}
        requisicao = requests.post(f"https://livraria-app.herokuapp.com/api/token/", json = data)
        return requisicao.json()
    except:
        return "Login não encontrado"
    
def verifica_sessao():
    if not session.get("user") and not session.get("password"):
        return redirect("/login")
    return render_template('index.html') 
  

def registra_usuario():
    if request.method == "POST":
        session["name"] = request.form.get("name")
        return redirect("/")
    return render_template("login.html")

def get_token():
    autorizacao = login()
    return {"Authorization": f"Bearer {autorizacao['access']}"}

def get_autores():
    requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/autores/", verify=False,headers=get_token())
    return requisicao.json()

def get_editoras():
    requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/editoras/",verify=False,headers=get_token())
    return requisicao.json()

def get_categoria():
   requisicao = requests.get(f"https://livraria-app.herokuapp.com/api/categorias/",verify=False,headers=get_token())
   return requisicao.json()

def post_livros(titulo,isbn,quantidade,preco,categoria,editora,autores):
    dados_livro = {
		{
        "titulo": titulo,
        "ISBN": isbn,
        "quantidade": quantidade,
        "preco": preco,
        "categoria": categoria,
        "editora": editora,
        "autores": [autores]
        }
    }
    requisicao = requests.post(f"https://livraria-app.herokuapp.com/api/livros/", json = dados_livro, headers= get_token())
    return requisicao.json()

def put_livros(titulo,isbn,quantidade,preco,categoria,editora,autores,id):
    dados_livro = {
        "titulo": titulo,
        "ISBN": isbn,
        "quantidade": quantidade,
        "preco": preco,
        "categoria": categoria,
        "editora": editora,
        "autores": autores
    }
    requisicao = requests.put(f"https://livraria-app.herokuapp.com/api/livros/{id}/", json = dados_livro ,headers= get_token())
    return requisicao.json()

def delete_livros(id):
    requisicao = requests.delete(f"https://livraria-app.herokuapp.com/api/livros/{id}/",verify=False, headers= get_token())
    return requisicao.json()

const App = new Vue({
    el: '#content',
    delimiters: ['[[', ']]'],
    data: {
        livros: [
            {
                "id": 7,
                "ISBN": "3",
                "titulo": "Diário de um Banana",
                "categoria": {
                    "id": 13,
                    "nome": "Ficcao Cientifica"
                },
                "preco": 44.8,
                "quantidade": 10,
                "autores": [
                    {
                        "id": 23,
                        "nome": "Mikael Fernandes Moreira"
                    },
                    {
                        "id": 24,
                        "nome": "Jeff Kinney"
                    }
                ],
                "editora": {
                    "id": 9,
                    "nome": "VrEditora"
                }
            },
            {
                "id": 8,
                "ISBN": "8",
                "titulo": "Aventuras em Alto Mar",
                "categoria": {
                    "id": 17,
                    "nome": "Aventura"
                },
                "preco": 29.99,
                "quantidade": 5,
                "autores": [
                    {
                        "id": 25,
                        "nome": "Ana Silva"
                    },
                    {
                        "id": 26,
                        "nome": "Pedro Santos"
                    }
                ],
                "editora": {
                    "id": 10,
                    "nome": "Livros Inc."
                }
            },
            {
                "id": 9,
                "ISBN": "5",
                "titulo": "O Mistério do Castelo",
                "categoria": {
                    "id": 14,
                    "nome": "Mistério"
                },
                "preco": 39.99,
                "quantidade": 8,
                "autores": [
                    {
                        "id": 27,
                        "nome": "Camila Rodrigues"
                    },
                    {
                        "id": 28,
                        "nome": "Felipe Almeida"
                    }
                ],
                "editora": {
                    "id": 11,
                    "nome": "Livros & Cia"
                }
            },
            {
                "id": 10,
                "ISBN": "1",
                "titulo": "O Segredo do Tesouro Perdido",
                "categoria": {
                    "id": 15,
                    "nome": "Ação"
                },
                "preco": 49.99,
                "quantidade": 3,
                "autores": [
                    {
                        "id": 29,
                        "nome": "Carlos Ribeiro"
                    },
                    {
                        "id": 30,
                        "nome": "Isabela Costa"
                    }
                ],
                "editora": {
                    "id": 12,
                    "nome": "Livros Fantásticos"
                }
            },
            {
                "id": 11,
                "ISBN": "6",
                "titulo": "As Crônicas do Reino",
                "categoria": {
                    "id": 16,
                    "nome": "Fantasia"
                },
                "preco": 34.99,
                "quantidade": 7,
                "autores": [
                    {
                        "id": 31,
                        "nome": "Eduardo Souza"
                    },
                    {
                        "id": 32,
                        "nome": "Juliana Lima"
                    }
                ],
                "editora": {
                    "id": 13,
                    "nome": "Editora Mágica"
                }
            },
            {
                "id": 12,
                "ISBN": "2",
                "titulo": "O Planeta Misterioso",
                "categoria": {
                    "id": 13,
                    "nome": "Ficcao Cientifica"
                },
                "preco": 19.99,
                "quantidade": 12,
                "autores": [
                    {
                        "id": 33,
                        "nome": "Marina Oliveira"
                    },
                    {
                        "id": 34,
                        "nome": "Rafael Santos"
                    }
                ],
                "editora": {
                    "id": 14,
                    "nome": "Livros Modernos"
                }
            }
        ],
        orderOptions: {
            'autores'     : 'Autor',
            'categoria' : 'Categoria',
            'editora'   : 'Editora',
            'ISBN'      : 'Isbn',
            'titulo'    : 'Título',
            'valor'     : 'Valor',
            'quantidade'  : 'Unidades'
        },
        orderBy: 'titulo',
        orderDirection: 'asc',
        searchString: '',
        indexItemSelected: null
    },
    computed:{
        livrosPaginados: function(){
            list = [];
            this.livros.forEach((livro) =>
                list.push({
                    'id': livro.id,
                    'ISBN': parseInt(livro.ISBN),
                    'titulo': livro.titulo,
                    'categoria': livro.categoria.nome,
                    'preco': this.valueToBR(livro.preco),
                    'valor': livro.preco,
                    'quantidade': livro.quantidade,
                    'autores': this.listAutores(livro.autores),
                    'editora': livro.editora.nome,
                }));
            return this.filter(list)
        }
    },
    methods: {
        changeDirection: function(){
            this.orderDirection = this.orderDirection == "asc" ? 'desc' : 'asc'
        },
        openOrder: function(){
            options = $('#select-options')
            if(options.css('display') == 'none'){
                options.show()
            } else {
                options.hide()
            }
        },
        selectOrder: function(el){
            this.orderBy = el.data('value');
            $('#select-order').click()
        },
        listAutores: function(autores) {
            var nomes = autores.map(function(autor) {
              return autor.nome;
            }).join(', ');
            return nomes;
        },
        valueToBR: function(valor){
            return String(valor.toFixed(2)).replace(".", ",")
        },
        stringNormalize: function(string){
            return String(string).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        },
        selectItem: function(index){
            this.indexItemSelected = this.indexItemSelected == index ? null : index
        },
        orderString: function (a, b){
            direction = this.orderDirection == 'asc' ? 1 : -1
            string1 = a[this.orderBy].toLowerCase()
            string2 = b[this.orderBy].toLowerCase()
            return string1.localeCompare(string2) * direction;
        },
        orderNumber: function (a, b) {
            direction = this.orderDirection == 'asc' ? 1 : -1
            return (a[this.orderBy] - b[this.orderBy]) * direction;
        },
        filter: function (array) {
            orderBy = this.orderBy;
            stringNormalize = this.stringNormalize

            result = array.filter(item => {
                for(var k in item){
                    pesquisando = stringNormalize(item[k]);
                    pesquisar = stringNormalize(this.searchString);
                    if(pesquisando.includes(pesquisar)){
                        return true;
                    }
                }
                return false;
            })
            if (result.length == 0){
                return result
            }

            result.sort(function(a, b) {
                val1 = a[orderBy]
                val2 = b[orderBy]

                if(typeof a[orderBy] == 'string'){
                   val1 = stringNormalize(val1)
                   val2 = stringNormalize(val2)
                }
                
                if(val1 == val2){
                    return 0;
                } else {
                    return val1 > val2 ? 1 : -1;
                }
            });

            if(this.orderDirection == 'desc'){
                return result.reverse()
            }
            
            return result
        }
    },
})
$('#select-options li').click(function(){
    App.selectOrder($(this))
})
var selectOrder = $('#select-order');
var bookList = $('#books-list');

$(document).on('click', function(event) {
    if (!selectOrder.is(event.target) && selectOrder.has(event.target).length === 0) {
        $('#select-options').hide()
    }
    if (!bookList.is(event.target) && bookList.has(event.target).length === 0) {
        App.indexItemSelected = null
    }
});
App = new Vue({
    el: '#content',
    delimiters: ['[[', ']]'],
    data: {
        livros: dados.livros,
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
        },
        deleteBook: function(id){
            this.livros = this.livros.filter(livro => livro.id !== id);
            $.post('/delete', {"id":id});
        },
        editBook : function(id){
            livro = this.livros.filter((livro) => livro.id == id)[0]
            console.log(livro)
            $.post('/editBook', {"livro":JSON.stringify(livro)}, function(response){
                document.open();
                document.write(response);
                document.close();
            });
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

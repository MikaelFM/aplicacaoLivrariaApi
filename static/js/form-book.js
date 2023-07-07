const App = new Vue({
    el: '#content',
    delimiters: ['[[', ']]'],
    data: {       
        livro: {
            'titulo': '',
            'isbn': '',
            'quantidade': '',
            'preco': '',
            'categoria': '',
            'editora': '',
            'autores': [],
        },
        categoriasDisponIveis: dados.categorias,
        editorasDisponiveis: dados.editoras,
        autoresDisponiveis: dados.autores,
        autores: [],
        searchAutores: '',
    },
    mounted() {
        if(typeof dados.livros != "undefined"){
            this.livro = dados.livro
        }
        this.defineStyles()
    },
    computed: {
        autoresOrdenados: function(){
            app = this;
            return this.autoresDisponiveis
                .sort((a, b) => app.order(a, b))
                .filter(item => this.stringNormalize(item.nome).includes(this.stringNormalize(this.searchAutores)));
        },
        categoriasOrdenadas: function(){
            return this.categoriasDisponIveis.sort((a, b) => app.order(a, b, 'descricao'))
        },
        editorasOrdenadas: function(){
            return this.editorasDisponiveis.sort((a, b) => app.order(a, b))
        }
    },
    methods: {
        defineStyles: function(){
            var altura_selecionados = $('.selecteds').height() + "px";
            var options = this.autoresDisponiveis.length < 2 ? $('.option').length : 2;
            var altura_opcoes = options * 6 + "vh"
            $('.options').css('max-height', `calc(${altura_selecionados} + ${altura_opcoes})`)
        },
        openSelectAutor: function (){
            $('#select-autor').addClass('open')
            $('.selecteds input').focus()
        },
        addAutor: function(id){
            let autor = this.autoresDisponiveis.find(el => el.id === id);
            let index = this.autoresDisponiveis.indexOf(autor);
  
            if (index !== -1) {
                this.autoresDisponiveis.splice(index, 1);
                this.autores.push(autor);
            }
            this.searchAutores = ''
            $('#select-autor input').focus()
        },
        stringNormalize: function(string){
            return String(string).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        },
        removeAutor: function(id){
            let autor = this.autores.find(el => el.id === id);
            let index = this.autores.indexOf(autor);
  
            if (index !== -1) {
                this.autores.splice(index, 1);
                this.autoresDisponiveis.push(autor);
            }

            $('#select-autor input').focus()
        },
        order: function(a, b, key = 'nome'){
            stringNormalize = this.stringNormalize
            val1 = stringNormalize(a[key])
            val2 = stringNormalize(b[key])                
            if(val1 == val2){
                return 0;
            } else {
                return val1 > val2 ? 1 : -1;
            }
        }
    },
    watch: {
        'searchAutores': function(){
            $('h1').hover()
            $('.options .option:first').addClass('')
            this.openSelectAutor()
        }
    }
})
$('#select-autor input').keydown(function(event) {
    if (event.which === 13) {
        $('.options .option:first').click();
    } else if (event.which === 8 && App.searchAutores === "" && App.autores.length > 0) {
        $('.icon:last').click();
    }
});

$(document).click(function(event) {
    if (!$('#select-autor').is(event.target) && $('#select-autor').has(event.target).length === 0) {
        $('#select-autor').removeClass('open');
    }
});
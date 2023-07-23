App = new Vue({
    el: '#content',
    delimiters: ['[[', ']]'],
    data: {       
        livro: typeof dados.livro != "undefined" ? dados.livro : {
            'titulo': '',
            'ISBN': '',
            'quantidade': '',
            'preco': '',
            'categoria': '',
            'editora': '',
            'autores': []
        },
        categoriasDisponiveis: dados.categorias,
        editorasDisponiveis: dados.editoras,
        autoresDisponiveis: dados.autores,
        autores: [],
        searchAutores: '',
    },
    mounted() {
        if(typeof dados.livro != "undefined"){
            this.livro = dados.livro
        }
        dados.livro.autores.forEach((autor) => this.addAutor(autor.id))
        this.defineStyles();
    },
    computed: {
        autoresOrdenados: function(){
            vue_app = this;
            return vue_app.autoresDisponiveis
                .sort((a, b) => vue_app.order(a, b))
                .filter(item => vue_app.stringNormalize(item.nome).includes(vue_app.stringNormalize(vue_app.searchAutores)));
        },
        categoriasOrdenadas: function(){
            vue_app = this;
            return this.categoriasDisponiveis.sort((a, b) => vue_app.order(a, b, 'descricao'))
        },
        editorasOrdenadas: function(){
            vue_app = this;
            return this.editorasDisponiveis.sort((a, b) => vue_app.order(a, b))
        },
    },
    methods: {
        defineStyles: function(){
            var altura_selecionados = $('.selecteds').height() + "px";
            var options = this.autoresDisponiveis.length < 2 ? $('.option').length : 2;
            var altura_opcoes = options * 6 + "vh"
            $('.options').css('max-height', `calc(${altura_selecionados} + ${altura_opcoes})`)
        },
        valida_form: function () {
            if (this.livro.titulo && this.livro.ISBN && this.livro.quantidade && this.livro.preco && this.livro.editora && this.livro.categoria && this.autores.length > 0 && this.livro.ISBN.length == 13 && this.livro.quantidade.length <= 7 && this.livro.preco.length <= 7){  
              return true;
            }
            if (!this.livro.titulo || !this.livro.ISBN || !this.livro.quantidade || !this.livro.preco || !this.livro.editora || !this.livro.categoria || this.autores.length == 0) {
              window.alert("Preencha todos os campos para prosseguir com a edição")
            }
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
        },
        submitHandler: function(){
            if(this.valida_form()){
                new_livro = this.livro;
                new_livro.autores = []
                this.autores.forEach((livro) => new_livro.autores.push(livro.id))
                new_livro.quantidade = parseInt(new_livro.quantidade)
                new_livro.preco = parseFloat(new_livro.preco)
                new_livro.id = typeof dados.livro != "undefined" ? dados.livro.id : -1
                $.post('/saveBook', {
                        'newLivro' : JSON.stringify(new_livro)
                    },
                    function(response){
                        if(response == "OK"){
                            window.location.href = "/index"
                        } else {
                            console.log(response)
                        }
                    }
                );  
            }else{
                if(this.livro.ISBN.length != 13){
                    window.alert("O ISBN deve conter 13 dígitos")
                }else{
                    if(this.livro.quantidade.length > 7){
                        window.alert("A quantidade máxima deve ser de 1.000.000 de unidades")
                    }else{
                       if(this.livro.preco.length > 7){
                            window.alert("O preço máximo deve ser de R$ 1.000.000")
                       } 
                    }
                }
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




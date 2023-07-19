const App = new Vue({
    el: '.form',
    delimiters: ['[[', ']]'],
    data: {
        form: {
            username: '',
            password: '',
            status: ''
        },
        erro: ''
    },
    methods: {
        submitHandler: function(){
            $.post("/loginValidation", this.form, function(response) {
              if(response != "OK"){
                App.erro = response;
              } else {
                $('form').submit()
              }
            });
        },

    }

})
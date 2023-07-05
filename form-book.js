var selectAutor = $('#select-autor')
console.log($('.option'))
var options = $('.option').length < 3 ? $('.option').length : 3;

var altura_selecionados = $('.selecteds').height() + "px";
altura_opcoes = options * 6 + "vh"
selectAutor.css('max-height', `calc(${altura_selecionados + (3 * 6 + "vh")})`);


selectAutor.click(function(){
    selectAutor.css('height', `calc(${altura_selecionados} + ${altura_opcoes})`).css('border-color', '#8ab4f8');
    $('.option').css('display', 'flex')
    $('.selecteds').css('border-bottom', '1px solid rgb(181, 181, 181)')
})
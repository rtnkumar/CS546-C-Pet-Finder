(function ($) {

    let image='/public/assets/www/media/logo.png'
    function init(){
        for(let i=0;i<5;i++){
            $('.pet-list').append('<div class="col bg-dark text-white">Roushan Raj</div>')
        }
        $('.pet-list .col').append('<div class="col bg-dark text-white"><img src='+image+'>'
        +'</div>'+'<div class="col bg-dark text-white">Mnit Jaipur</div>');

    }
    init();
  
  })(window.jQuery);
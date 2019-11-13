$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});


jQuery(document).ready(function($) {
   $(".clickable-row").click(function() {
       window.location = $(this).data("href");
   });
});
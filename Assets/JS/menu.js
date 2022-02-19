$(function(){
    $(".navbar-tools .sidebar-toggler").click(function(){
        $(this).toggleClass("open");
        
        // menu and content move
        $(".menu.container").toggleClass("move")
        $(".main-content").toggleClass("move")

        // side-bar menu opening and moving to left
        $(".sidebar-menu").toggleClass("open")
    });

    $('.scroll-back').hide();

    $(window).scroll(function () {
        if ($(this).scrollTop() == 0) {
            $('.scroll-back').hide(100);
        } else {
            $('.scroll-back').show(100);
        }
    });
});
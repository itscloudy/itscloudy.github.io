$(window).on("scroll", function (e) {
    //滚屏添页
    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    if (scrollPosition > scrollHeight - 100) {
        if (counter < 5)
            appendText();
    }
});

//获取光标所在元素
$(function(){
    $(".form").mouseup(function(e){
        var selected = document.activeElement;
        $('#element').text(selected.value);
    });
});
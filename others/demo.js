/* 动态修改after before 伪类 */
$("<style type='text/css' id='dynamic' />").appendTo("head");

$('.pop').click(function (e) {
    console.log(e)
    $("#dynamic").text(".pop:after{left:" + e.offsetX + "px;}");
});
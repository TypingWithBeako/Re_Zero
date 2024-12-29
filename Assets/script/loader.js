let loader;
$(window).on('load', function() {
    loader = setTimeout(function() {
        $(".skip").css("pointer-events", "none");
        $(".loader--wrapper").slideUp(1200);
        $(".loader").fadeOut(600);
        $(".header").fadeOut(0);
        $(".skip").fadeOut(600);
        $(".content__video").fadeOut(0);
        $(".content__navbar").fadeOut(0);
        $(".footer").fadeOut(0);
        setTimeout(function(){
            $(".header").fadeIn(1200)
        },1200)
        setTimeout(function(){
            $(".content__navbar").fadeIn(1000)
        },2400)
        setTimeout(function(){
            $(".content__video").fadeIn(1000)
        },3400)
        setTimeout(function(){
            $(".footer").fadeIn(1200)
            $(".loader--wrapper").remove()
        },4600)
    }, 2000);
});
function SkipLoading(){
    $(".loader--wrapper").slideUp(1200);
    $(".loader").fadeOut(600);
    $(".skip").fadeOut(600);
    $(window).off('load');
    clearTimeout(loader);
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
return array;
};
var images = [
    { src : 'Other_Files/angry beako v2.gif'},
    { src : 'Other_Files/spinning beako.gif'},
    { src : 'Other_Files/beako super surprised (gif).gif'},
    { src : 'Other_Files/Puck clapping.gif'},
    { src : 'Other_Files/fuck you leave me alone (gif).gif'},
    { src : 'Other_Files/angry beatrice gif.gif'},

];
setTimeout(function(){
    $(".skip").slideDown(500)
},1000)
shuffleArray(images)
var img, div;
var cont = $('.loader');
cont.children().remove();
img = $('<img />', { src : images[0].src, width: "auto", height: "160px" });
div = $('<div></div>', { class : 'loader' });
div.append(img);
cont.append(div);
/**
 * Created by minerva on 6/20/14.
 */
/*
var images = document.getElementsByTagName('img');
var srcList = [];


for(var i in images) {

    srcList.push('<a href="' + images[i].src + '"><img src="' + images[i].src + '">');
    alert(srcList);
}

console.log(images[0]);
console.log('"></a>');
*/
var images = document.getElementsByTagName('img');
var srcList = [];
for(var i = 0; i < images.length; i++) {
    srcList.push(images[i].src);
}
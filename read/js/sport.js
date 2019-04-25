var len = 580;
var winH = document.documentElement.clientHeight;
var winW = document.documentElement.clientWidth;

(function() {
	var word = '';
	var html = '';
	var sum = Math.ceil(text.length / len);

	for (var i = 0; i < sum; i++) {
		word = text.substring(i * len, len * (i + 1));
		html += `
            <div class="page swiper-slide" style='z-index:${len-i}'>
                <p>${word}</p>
            </div>`;
	}
	$('.viewport .swiper-wrapper').html(html);
	$('.viewport').append(
		`<div class="swiper-button-prev"></div>
    	<div class="swiper-button-next"></div>`
	);

})();
// var index = 0;
// var winW = $(window).width();
// document.addEventListener('touchstart', function(e) {

// 	var touch = e.touches[0];
// 	var x = touch.pageX;

// 	if(x>winW/2){			
// 		$('.viewport .page').eq(index).css({
// 			'transform':`translate3d(-110%,0,0)`,
// 		});
// 		if (index < $('.viewport .page').length - 2) {
// 			index++;
// 		}else{
// 			alert('已经在最后一页了');
// 		} 
// 	}else{
// 		if(index <= 0){
// 			index = 0;
// 			alert('第一页');
// 		}else{
// 			index--;
// 		}
// 		$('.viewport .page').eq(index).css({
// 			'transform':`translate3d(0,0,0)`,
// 		});
// 	}

// },false)

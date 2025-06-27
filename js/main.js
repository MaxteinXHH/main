$(function(){
	

$('.index_part1_news .post-09 li').each(function(){
if($(this).find('.news_titles .zxtb img').length>0){
$(this).addClass('newinfo')
}
})

	$(".focus11").sudyfocus({      
		p:11,      
		zWidth:324,      
		zHeight:190,  
		title:{        
			isAutoWidth: true,
			active:true      
		},  
		response: true,     
		speed:700, 
		pagination: false,  
		navigation: true,  
		isNavHover: false,  
		href:true,  
		effect: 'fade'    
	}); 	
	//slick左右轮播
	$('.post-1 .news_list .news_imgs').each(function(){		
		var path = $(this).find('.news_video video').attr('src');
		if (path == 0) {
			$(this).find('.news_video').hide();
		} else{
			$(this).find('img').hide()
		}
	})
	var vidAll = document.querySelectorAll(".post-1 .news .news_video video")
    $('.post-1 .news_list').on('afterChange', function (event, slick, currentSlide) {
        for (var i = 0; i < vidAll.length; i++) {
            vidAll[i].pause()
        }
        // 获取当前幻灯片的DOM元素  
        var currentSlideElement = $('.post-1  .slick-slide[data-slick-index="' + currentSlide + '"]');

        // 检查当前幻灯片是否包含视频元素（这里以HTML5 video为例）  
        var video = currentSlideElement.find('video');
        if (video[0].getAttribute("src")!="") {
$('.post-1 .news_list').slick('slickPause');
            // 如果有视频，你可以根据需要播放或暂停它  
            if (video[0].paused) {
                video[0].play();
            } else {
                video[0].pause();
            }
            // 如果你想在视频播放时做其他事情，可以在这里添加代码  
            // 例如，你可以添加事件监听器来检测视频播放的结束等  
        }else {
            $('.post-1 .news_list').slick('slickPlay');
            }

    });
    $(".post-1 .news .news_video").each(function (index, el) {
 
        var vid = vidAll[index]
        if ($(this).find("video").attr("src") == "") {
            $(this).hide();
            $(this).siblings(".news_imgs").show();
            $(this).siblings("button").hide();
        } else {
            $(this).show();
            $(this).siblings(".news_imgs").hide();
            $(this).siblings("button").show();
            $(this).siblings("button").on("click", function () {
                if ($(this).hasClass("sound-off")) {
                    vid.muted = false
                    $(this).removeClass("sound-off")
                    $(this).addClass("sound-on")
                } else {
                    vid.muted = true
                    $(this).removeClass("sound-on")
                    $(this).addClass("sound-off")
                }
            })
        }
    })
    $('.post-1 .news_list').slick({
        infinite: true,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
    });
$(".post-1 .news .news_video").each(function () {
  if ($(this).find("video").attr("src") != "") {
 $('.post-1 .news_list').slick('slickPause');
   }else {
            $('.post-1 .news_list').slick('slickPlay');
            }
   $(this).find("video").bind("ended", function () {
  console.log("播放结束");
	$('.post-1 .news_list').slick('slickPlay');
	$(".post-1 .news_list  .slick-next").click();
});
   })	
});



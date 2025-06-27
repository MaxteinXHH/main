$(function(){
	$(".search-submit").click(function(event) {
		$(this).removeAttr("name");
		/* Act on the event */
		event.preventDefault();
		var val = $.trim($(".search-title").val());
		if(val!==""){
			$(".wp-search").find("form").submit();
			
		}else{
			alert("请输入关键词");
		}
		return false;
	});
	
	/* 导航  */
 	$(".menu-item",".wp-menu").each(function(){
		$(this).mouseenter(function() {
			$(".menu-link",this).addClass("hover");
		});
		$(this).mouseleave(function(){
			$(".menu-link",this).removeClass("hover");
		});
	});

	
	
	/*复制下拉*/
        /* $(".navbox .wp_nav > .nav-item").each(function(index,val){
		$(this).find("a").removeAttr("title");
		var html = $(this).find(".sub-nav").html();
		$(".navlist").append("<div class='navlist-li navlist-li-"+index+"'></div>");
		$(".navlist").find(".navlist-li").eq(index).html(html);
		$(".navlist").children(".navlist-li").find("ul").remove();
	});
	$(".navlist").append("<div class='clear'></div>");
	
	$(".navbar .nav-item").click(function(){
	  $(".navlist").slideToggle("slow");
      return false;  
	}); */
	
	/*媒体链接*/
	$(".shares .share").each(function(){
		$(this).children("a").hover(function(){
			$(this).parent().find(".con").fadeIn();			
		},function(){
			$(this).parent().find(".con").fadeOut();
		});
	});
	
	$("body,html").click(function(){
			$(".searchbox").animate({"width":"45px"});
			$(".searchbtn").stop(true,true).fadeIn();
			//$(".navlist").slideUp();
				
	});
	
	$(".searchbtn").click(function(){
		$(this).stop(true,true).fadeOut();
		$(".searchbox").stop(true,true).animate({"width":"200px"});
		return false;
	});	
	$(".search-input").click(function(){
		return false;
	});
});
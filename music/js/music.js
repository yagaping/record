
var init = {

	//函数开始
	start : function(){

		// 换皮肤
		this.skin();

		// 刷新页面
		this.refresh();

		// 关闭播放器
		this.closeMusic();

		// 播放音乐控制
		this.player();

	},

	// 播放器宽
	mp3Width : $("#mp3").width(),

	// 播放器高
	mp3Height : $("#mp3").height(),
	
	// 播放器背景、皮肤
	mp3Bgcolor : $("#mp3").css("background-color"),
	
	// 可供选择的皮肤,后续可加
	bgcolor : ["red","orange","yellow","green","cyan","blue","purple","#eee"],

	// 换皮肤函数
	skin : function(e){
		$("#skin").on("click",function(e){
			if($(".colorbox").is(":visible")==true){
				$(".colorbox").remove();
			}else{
				var html='<div class="colorbox"><p><span>更换皮肤</span><a href="javascript:">x</a></p><ul>';
				for(var i=0;i<=init.bgcolor.length;i++)
				{
					if(i==init.bgcolor.length){
						html += '<li style="background-color:none"><a href="javascript:">恢复默认</a></li>';
					}else{
						html += '<li style="background-color:'+init.bgcolor[i]+'"></li>';
					}
				}
				html +='</ul></div>';
				$("#mp3").append(html);
				$(".colorbox").css({
					"left":"50%",
					"top":"50%",
					"margin-top":-$(".colorbox").height()/2 + "px",
					"margin-left":-$(".colorbox").width()/2 + "px" 
				});
				$(".colorbox ul li").on("click",function(){
					if($(".colorbox ul li").length == $(this).index()+1){
						$("#mp3").css("background-color",init.mp3Bgcolor);
					}else{
						var color = $(this).css("background-color");
						$("#mp3").css("background-color",color);
					}
				})
				$(".colorbox p").find("a").on("click",function(){
					$(this).parents(".colorbox").fadeOut().remove();
				})
			}
			
		})
	},

	// 刷新页面
	refresh : function(e){
		$("#refresh").on("click",function(event){
			window.location.reload();
		})
	},

	//关闭音乐窗口
	closeMusic : function(e){
		$(".span_close").on("click",function(){
			offMp3();
			// 关闭播放器，停止播放
			$('#jp_sound').jPlayer("stop");
		});
		$(".mp3_btn").find(".span_min").on("click",function(){
			offMp3();
		})
		$(".mp3small").on("click",function(){
			$("#mp3")[0].style.display="block";
			$("#mp3")[0].style.transform="scale(1,1)";
			$("#mp3")[0].style.left="50px";
			$("#mp3")[0].style.top="50px";
			$(this).fadeOut();
		})
		function offMp3(){
			var offsetTop = $("body").height()-$("#mp3").height();
			var offsetLeft = $("body").width()-$("#mp3").width();
			
			$("#mp3").stop().animate({
				left: offsetLeft+"px",
				top: offsetTop+"px"},
				function() {
				$("#mp3").css({
					"transition":"1s",
					"transform-origin":"right bottom",
					"transform":"scale(0,0)"
				})
				setTimeout(function(){
					$(".mp3small").fadeIn();
				},1000)

			}); 
		}
	},

	//播放音乐控制
	player : function(e){
		var index=0;
		var isplay=false;
		var musicname = [];
		var musicdic = [];
		var musictype = [];
		// getJSON
		$.getJSON("music.json",function(data){
			$.each(data.song,function(index, item) {
				musicname.push(item["name"]);
				musicdic.push(item["title"]);
				musictype.push(item["type"]);
			});
		})
		// 初始化播放器
		$("#jp_sound").jPlayer({
			ready:function(){
				$(this).jPlayer('setMedia',{mp3:"mp3/"+musicname[0]+".mp3"});
			},
			swfPath: "js",
			supplied: "mp3",
			seekBar:".bar",
			playBar:".bar_2",
			cssSelectorAncestor:"#mp3",//继承父容器中的子元素
			cssSelector:{//分别规定，相关播放调节标签，包括播放歌曲进度条，歌曲时间以及播放时间等
				seekBar:".bar",
				playBar:".bar_2",
				currentTime:".time_over",
				duration:".time_all",
				volumeBar:".volume_rod",
				volumeBarValue:".volume_rod_how",
				mute:".volume_end_start"
			},
			verticalVolume:true,
			// 音乐播放时，进度条同时移动
			timeupdate:function(){
				$(".point").css({
					left:$(".bar_2").width()-6+"px"
				})
			},
			// 调节音量时，音量条同时变动
			volumechange:function(){
				$(".volume_point").css({
					bottom:$(".volume_rod_how").height()+"px"
				})
			},
			// 加载音乐播放器时，重置音量条
			loadstart:function(){
				$(".volume_point").css({
					bottom:$(".volume_rod_how").height()+"px"
				})
			},
			// 自动播放下一首
			ended:function(){
				NextSong();
			}
		});

		// 暂停、播放
		$(".play_pause").click(function(event) {
			if(isplay == false){
				Play();
			}else{
				Stop();
			}
		});

		//播放上一曲
		$(".pervious").click(function(event) {
			PreSong();
		}); 

		// 播放下一曲
		$(".next").click(function(event) {
			NextSong();
		});


		// 播放
		function Play(){
			isplay = true;
			$(".mp3small").text("正在播放...");
			$("#jp_sound").jPlayer("play");
			$(".play_pause").find("span").removeClass("icon-play2").addClass('icon-pause');
			musicName();
		}
		
		// 暂停
		function Stop(){
			isplay = false;
			$(".mp3small").text("暂停！");
			$("#jp_sound").jPlayer("pause");
			$(".play_pause").find("span").removeClass("icon-pause").addClass('icon-play2');
		}
		
		// 上一首
		function PreSong(){
			index--;
			if(index<0){
				index = musicname.length - 1;
			}
			setMedia(index);
		}

		// 下一首
		function NextSong(){
			index++;
			if(index>=musicname.length - 1){
				index = 0;
			}
			setMedia(index);
		}

		// 设置setMedia
		function setMedia(num){
			$('#jp_sound').jPlayer("clearMedia");
			$("#jp_sound").jPlayer("setMedia",{mp3:"mp3/"+musicname[num]+".mp3"});
			Play();
			musicName();
		}

		// 音量设置
		$(".vol").find(".icon-volume-low").toggle(function(){
			var left = $(this).offset().left;
			var top = $(this).offset().top;
			$(".volume").css({
				left:left-81+"px",
				top:top-261+"px"
			}).fadeIn();
		},function(){
			$(".volume").fadeOut();
		})
		// 展示歌曲名
		function musicName(){
			// 歌曲名
			if(musictype[index]==""||musictype[index]==null)
			{
				$(".show_name").find(".name em").css("border","none").hide();
			}else{
				$(".show_name").find(".name em").css("border","1px solid #13bd78").show();
			}
			$(".show_name").find(".name span").html(musicdic[index]);
			$(".show_name").find(".name em").html(musictype[index]);
		}
	}
	
}

$(function(){
	//启动开始
	init.start();
	var str = "level";
})

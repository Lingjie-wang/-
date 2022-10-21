    //本部分代码适用于视频窗口大小固定的场合
    var video =document.getElementById("vd");
    //var videoWidth =600;
    var asideWidth =360;
    var minWidth =500;
    var maxWidth =1400;/*视频窗口的最小最大宽度*/
    var WaH;
    var isSmall=false;
    var smallWidth =300;
    var isWideScreen=false;
    var isTheater=false;
    var haveHour= false;//默认时长不超过一小时
    var ctid;//定时器id
    var progressWidth = 600;
    var volumeWidth =60;
    var curPos = 60;//音量条当前位置
    var halfslider = 6;
    var rflag = false;//区分单击和拖动
    //设置各元素大小
    function setSize(){
        var awidth;
        if(isWideScreen){
            awidth=0;
         }
         else{
            awidth=asideWidth;
         }
        var dw =60;//窗口两边的补偿值
        var width =document.body.clientWidth-awidth-dw;
        
        if(width<minWidth+dw){
            width=minWidth+dw;
        }else if(width>maxWidth+dw){
            width=maxWidth+dw;
        }
        var height=width/WaH;
        video.width=width;
        video.height=height;
        progressWidth=width;//计算进度位置时使用
        document.getElementById("playwindow").style.width=width+20+awidth+"px";
        document.getElementById("playbox").style.width=width+"px";
        document.getElementById("playbox").style.height=height+48+"px";
        document.getElementById("videobox").style.height=height+"px";
        document.getElementById("progress").style.width=width+"px";
        document.getElementById("maside").style.width=asideWidth+"px";
        document.getElementById("vplay").style.width=width+"px";
        document.getElementById("vplay").style.height=height+"px";
        
        }
        /*设置小窗口模式*/
        function setSmall(){
            if(isSmall) return;
            var height =smallWidth/WaH;
            isSmall=true;
            video.width=smallWidth;
            video.height=height;
            var videobox =document.getElementById("videobox");
            videobox.className="videobox vsmall";
            videobox.style.width=smallWidth+"px";
            videobox.style.height=height+"px";
            document.getElementById("vplay").style.width=smallWidth+"px";
            document.getElementById("vplay").style.height=height+"px";
        }
        //取消小窗口模式
        function exitSmall(){
            if(!isSmall) return;
            isSmall =false;
            document.getElementById("videobox").className="videobox";
            setSize();
        }
        /*停止*/
        function stoped(){
            pause();
            video.currentTime=0;
            curTime();
            setProgress();
        }
        //视频加载就绪事件
        video.oncanplay=function(){
            WaH = video.clientWidth/video.clientHeight;
            setSize();
            var dtime = video.duration;//时长
            haveHour = dtime>=3600;
            document.getElementById("dtime").innerHTML = makeTime(dtime);
            curTime();

            }
        window.addEventListener("resize",function(){
            if(!isSmall){
                setSize();
            }
            
        });
        window.addEventListener("scroll",function(){
            var playbox = document.getElementById("playbox");
            var height = parseInt(playbox.style.height)+playbox.offsetTop;
            var top = document.documentElement.scrollTop;
            if(top>height-50){
                setSmall();

            }else{
                exitSmall();
            }
        })
        //全屏播放
        document.getElementById("fullscreen").onclick=function(){
            if(video.requestFullscreen){
                video.requestFullscreen();
            }else if(video.webkitRequestFullScreen){
                video.webkitRequestFullScreen();
                
            }
            else if(video.mozRequestFullScreen){
                video.mozRequestFullScreen();
            }
        }
        //单击宽屏按钮
        document.getElementById("widescreen").onclick = function(){
            isWideScreen=!isWideScreen;
            if(isWideScreen){
                this.className="nowidescreen";
                this.title="取消宽屏";
                document.getElementById("maside").style.display="none";
            
            }
            else{
            this.className="widescreen";
            this.title="宽屏模式";
            document.getElementById("maside").style.display="block";
            }
            setSize();
        }
        //剧场模式
        document.getElementById("theatermode").onclick=function(){
            var fullback=document.getElementById("fullback");
            if(isTheater){
                this.title="剧场模式";
                fullback.style="";
                fullback.className="fullback";

            }else{
                this.title="退出剧场模式";
                fullback.style.width=document.body.clientWidth+"px";
                fullback.style.height=document.body.clientHeight+"px";
                fullback.className="fullback theater";
            }
            isTheater=!isTheater

        }
        function play(){
            document.getElementById("play").className="pause";
            document.getElementById("vplay").className="vpause"
            video.play();
            ctid = setInterval(function(){
                curTime();//更新时间
                setProgress();//更新进度条
            },1000);
        }
        function pause(){
            document.getElementById("play").className="play";
            document.getElementById("vplay").className="vplay";
            video.pause();
            clearInterval(ctid);
        }
        //单击播放/暂停
        document.getElementById("play").onclick=function(){
            if(video.paused){
                play();
            }else{
                pause();
            }
        }
        //单击屏幕上的播放/暂停
        document.getElementById("vplay").onclick=function(){
            if(video.paused){
                play();
            }else{
                pause();
            }
        }
        document.getElementById("stop").onclick=function(){
            stoped();
        }
        //播放结束
        video.onended=function(){
            stoped();
        }
        //把秒值转换为时间格式，时长是否超过一小时分别讨论
        function makeTime(time){
            time=Math.floor(time);
            var h =Math.floor(time/3600);
            var m =Math.floor((time-h*3600)/60);
            var s =time-h*3600-m*60;
            m=m<10?"0"+m:m;
            s=s<10?"0"+s:s;
            if(haveHour){
                h=h<10?"0"+h:h;
                return h+":"+m+":"+s;

            }
            return m+":"+s;
        }
        //设置播放时间
        function curTime(){
            document.getElementById("ctime").innerHTML=makeTime(video.currentTime);
        }
         function setProgress(){
            var cur = video.currentTime/video.duration*progressWidth;
            document.getElementById("now").style.width = cur +"px";
         }   
         //单击时修改进度
         document.getElementById("progress").onclick = function(e){
            if(video.currentTime<=0)return;
            var cur =e.offsetX/progressWidth;
            video.currentTime = cur*video.duration;
            document.getElementById("now").style.width = cur+"px";
         }
         var speedlist = document.getElementById("speed_list").getElementsByTagName("div");
         for(var i in speedlist){
            speedlist[i].onclick = function(){
                var v = this.getAttribute("value");
                document.getElementById("curspeed").innerHTML = "倍速&times;"+v;
                video.playbackRate = v;
            }
         }
         //静音/取消静音
         document.getElementById("mute").onclick = function(){
            var muted = video.muted;
            if(muted){
                this.className="mute";
                this.title = "静音"

            }
            else{
                this.className = "mute muted";
                this.title = "取消静音";
            }
            video.muted = !muted;
         }
         //调整音量条位置
         function setPos(pos){
            if(pos<0){
                pos=0;
            }else if(pos>volumeWidth){
                pos=volumeWidth;
            }
            document.getElementById("vnow").style.width=pos+"px";
            document.getElementById("slider").style.left=(pos-halfslider)+"px";
            curPos=pos;
            video.volume=curPos/volumeWidth;

         }
         //单击调节音量
         document.getElementById("volume").onclick = function(e){
            if(!rflag){
                setPos(e.offsetX);

            }
            rflag=false;
         }
         //拖动滑块调节音量(不精确)
         document.getElementById("slider").onmousedown = function(e){
            rflag = true;
            var x =e.clientX;
            document.onmousemove=function(ev){
                var mx =ev.clientX;
                var ls=mx-x+curPos;
                setPos(ls);
            };
            document.onmouseup=function(){
                document.onmousemove= null;
            }
         }
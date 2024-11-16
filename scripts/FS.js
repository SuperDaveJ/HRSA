// JavaScript Document
var win;
function QuitIt(){
	if (confirm("Are you sure you want to exit?") == true)
		window.close()
}


function NewWindow(mypage, myname, w, h, scrollsel,Ptext) {
	//alert(Ptext);
var theURL = "508popup.htm?term="+Ptext;	
var winl = (screen.width - w) / 2 //- 20;
var wint = (screen.height - h) / 2 //- 20;
var winprops = 'height='+h+',width='+w+',top=20, left=0,scrollbars='+scrollsel+',resizable'
//alert(win + ' and ' + win.closed)
	if (win != null && !win.closed) {
		win.close()
	}
	win = window.open(theURL, myname, winprops);

}

function closePopup() {
	if (win != null && !win.closed) {
		win.close()
	}
}

function getConfirmBox() {
var strTemp = "";
	strTemp += "<table width='358px' height='217px' > <tr><td> "
	strTemp +="<table width='100%' border='0'><tr> <td width='11%'>&nbsp;</td><td colspan='2'>&nbsp;</td>"
    strTemp +="<td width='10%'>&nbsp;</td></tr><tr> <td>&nbsp;</td><td colspan='2' style='font-family: Arial, Helvetica, sans-serif; font-size: 11pt; font-weight: bold; color: #0d4600;'>Do you wish to exit the course?</td><td>&nbsp;</td></tr><tr>" 
    strTemp +="<td height='50'>&nbsp;</td><td width='39%'>&nbsp;</td><td width='40%'>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td>"
    strTemp +="<td align='center'> <a href='javascript:exitCourse(true);' onMouseOver='MM_swapImage(&quot;YesBtn&quot;,&quot;&quot;,&quot;../SysImages/yes_2.jpg&quot;,1)' onMouseOut='MM_swapImgRestore()'><img src='../SysImages/yes_0.jpg' alt='Yes Button' name='YesBtn' width='75' height='32' border='0' id='YesBtn'></a></td>"
    strTemp +="<td align='center'> <a href='javascript:MM_showHideLayers(&quot;ExitConfirm&quot;,&quot;&quot;,&quot;hide&quot;);if (document.all[&quot;flaMovie&quot;] != null && flaPlay != null && flaPlay == true) 	MM_showHideLayers(&quot;flaMovie&quot;,&quot;&quot;,&quot;show&quot;);' onMouseOver='MM_swapImage(&quot;NoBtn&quot;,&quot;&quot;,&quot;../SysImages/no_2.jpg&quot;,1)' onMouseOut='MM_swapImgRestore()'><img src='../SysImages/no_0.jpg' alt='No Button' name='NoBtn' width='75' height='32' border='0' id='NoBtn'></a></td>"
    strTemp +="<td>&nbsp;</td></tr><tr> <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>"
    strTemp +="</table></tr></td></table>"
return strTemp;
}

function loadCSS(intVersion){
	var i, a, b;
	//title = "nrcCSS";
	b = document.getElementById("csscheck")
	b.style.fontSize=22

   for (i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if (b.offsetHeight < 22) a.disabled = true;
		if (intVersion==1) a.disabled = true;
   }
	//if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			//a.disabled = true;
		//if (a.getAttribute("title") == title  ) a.disabled = false;
		//}
}

function openAnotherWindow(pgURL) {
alert("in the funciton.")
	window.open(pgURL,"DetailInfo","width=600,height=480,resizable=yes,scrollbars=no,status=no, toolvar=no, menubar=no,location=no");
}
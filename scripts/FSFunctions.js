// JavaScript Document

var verNumber;
var intVersion;
var audioOn = 1;
var blnFirstTime = true;	
var PreExamDone;
var strObjStatus = "";
var nLesson = 4;	//Forest Service Module 1
arrLessonStatus = new Array(nLesson);
var strPagesViewed;
var blnLastPage = false;
var strCourseStatus = "";
var closing = true;

function PageQuery(q) {
	if(q.length > 1) this.q = q.substring(1, q.length);
	else this.q = null;
	this.keyValuePairs = new Array();
	if(q) {
		for(var i=0; i < this.q.split("&").length; i++) {
			this.keyValuePairs[i] = this.q.split("&")[i];
		}
	}

	this.getKeyValuePairs = function() { return this.keyValuePairs; }

	this.getValue = function(s) {
		for(var j=0; j < this.keyValuePairs.length; j++) {
			if(this.keyValuePairs[j].split("=")[0] == s)
				return this.keyValuePairs[j].split("=")[1];
		}
		return false;
	}

	this.getParameters = function() {
		var a = new Array(this.getLength());
		for(var j=0; j < this.keyValuePairs.length; j++) {
			a[j] = this.keyValuePairs[j].split("=")[0];
		}
		return a;
	}

	this.getLength = function() { return this.keyValuePairs.length; } 
}

function getQueryValue(key){
	var page = new PageQuery(window.location.search); 
	return unescape(page.getValue(key)); 
}

function getElementStyle(elemID, IEStyleProp, CSSStyleProp) {
    var elem = document.getElementById(elemID);
    if (elem.currentStyle) {
        return elem.currentStyle[IEStyleProp];
    } else if (window.getComputedStyle) {
        var compStyle = window.getComputedStyle(elem, "");
        return compStyle.getPropertyValue(CSSStyleProp);
    }
    return "";
}

function goBack(pgURL) {
	closing = false;
  	if (verNumber > 2)  {	//LMS versions
		var strTemp = getElementStyle('Next','visibility','visibility')
		if ( strTemp == "visible" ) {
			if ( blnLastPage ) {
				updateDatabase()
			} else {
				updateSuspendData()
			}
		}
  	}
	window.location = pgURL + "?ver=" + verNumber
}

function goNext(pgURL) {
	closing = false;
	if (verNumber > 2) {
		if ( blnLastPage ) {
			updateDatabase()
		} else {
			updateSuspendData()
		}
	}
	window.location = pgURL + "?ver=" + verNumber
}

function doJump(pgURL) {
	closing = false;
	verNumber = getQueryValue('ver')
	window.location = pgURL + "?ver=" + verNumber
}

function refresh() {
	closing = false;
	window.location.reload();
}

function initializePage() {
	closing = true;
	verNumber = getQueryValue('ver')
	if ( (verNumber == 1) || (verNumber == 3) ) {
		intVersion = 1
	} else {
		intVersion = 2
	}
	if (verNumber > 2) getSuspendData()
}

function initializeCourse() {
	loadPage();
	if (intLMS > 0) {
		if (typeof(startDate) == "undefined") startDate = new Date().getTime()
		setCookie("startTime", startDate);

		var strTemp = doLMSGetValue( "cmi.suspend_data" );
		if (strTemp == "" || typeof(strTemp) == "undefined") {
			blnFirstTime = true;
			strTemp = "0~0,0,0,0~~" + audioOn + "~";
			doLMSSetValue( "cmi.suspend_data", strTemp );
			doLMSCommit();
		} else {
			blnFirstTime = false;
			strCourseStatus = doLMSGetValue("cmi.core.lesson_status");
			getSuspendData();
		}
	}
}

function toMenu(blnCloseWin) {
	closing = false;
	if (verNumber > 2) {
		var strTemp = getElementStyle('Next','visibility','visibility')
		if ( strTemp != "hidden" ) {
			if ( blnLastPage ) {
				updateDatabase()
			} else {
				updateSuspendData()
			}
		}
	}
}

function exitCourse(ExitBtnClicked) {
	if (ExitBtnClicked) closing = false
	if (verNumber > 2) {
		startDate = getCookie("startTime");
		if (typeof(startDate) == "undefined") startDate = 0
		updateDatabase();
		unloadPage();
	}
	window.close();
}

function getPage() {
	arrTemp = new Array();
	arrTemp2 = new Array();
	arrTemp = window.location.href.split("/");
	arrTemp2 = arrTemp[arrTemp.length-1].split("?");
	var strTemp = arrTemp2[0];
	var intTemp = strTemp.indexOf(".htm");
	strTemp = strTemp.substring(0,intTemp);
	return strTemp.toLowerCase();
}

function getLesson() {
	var strTemp = getPage();
	return parseInt(strTemp.substr(1,1));
}

function getModule() {
	var strTemp = getPage();
	return parseInt(strTemp.substr(0,1));
}

function setLessonStatus(iLes, lesStatus) {
	arrLessonStatus[iLes-1] = lesStatus;
	updateSuspendData();
}

function isPageViewed(pageFile) {
	pageFile = pageFile.toLowerCase()
	var intTemp = pageFile.indexOf(".htm")
	if (intTemp != -1) pageFile = pageFile.substring(0,intTemp)
	var iLes = getLesson();
	if (iLes > 0) {
		if (arrLessonStatus[iLes-1] >= 2) return true
	}
	if (typeof(strPagesViewed) == "undefined") return false
	if (strPagesViewed.indexOf(pageFile) >= 0) return true
	else return false
}

function updateSuspendData() {
   	if ((strPagesViewed == "") || (typeof(strPagesViewed) == "undefined")) {
		strPagesViewed = ""
	}
	var iLes = getLesson();
	if ( (strPagesViewed.indexOf(getPage()) == -1) && (arrLessonStatus[iLes-1] < 2) ) {
		strPagesViewed = strPagesViewed + "," + getPage();
	}
	if (arrLessonStatus[iLes-1] < 2) arrLessonStatus[iLes-1] = 1
	var strTemp = arrLessonStatus.join();
	strTemp = PreExamDone + "~" + strTemp + "~" + strPagesViewed + "~" + audioOn + "~" + strObjStatus;
	doLMSSetValue("cmi.suspend_data", strTemp);
	doLMSCommit();
}

function getSuspendData() {
	var strTemp = doLMSGetValue( "cmi.suspend_data" );
	if ( (strTemp != "") && (typeof(strTemp) != "undefined") ) {
		arrTemp = new Array();
		arrTemp = strTemp.split("~");
		PreExamDone = arrTemp[0]
		var strTemp = arrTemp[1];
		for (i=0; i<nLesson; i++) {
			arrLessonStatus[i] = parseInt(strTemp.charAt(2*i));
		}
		strPagesViewed = arrTemp[2];
		strAudio = arrTemp[3]
		if ( (strAudio != "") && (typeof(strAudio) != "undefined") )
			audioOn = parseInt(strAudio)
		else
			audioOn = 0
		strObjStatus = arrTemp[4];
	}
}

function cleanSuspendData() {
	var re = /,,/g;
	var strTemp = strPagesViewed.toLowerCase();
	for (var i=0; i<nLesson; i++) {
		if (arrLessonStatus[i] >= 2) {
			//do clean up
			arrTemp = strTemp.split(",")
			for (var j=0; j<arrTemp.length; j++) {
				if ( parseInt(arrTemp[j].substr(1,1)) == (i+1) ) arrTemp[j] = ""
			}
			strTemp = arrTemp.join();
			while (strTemp.indexOf(",,") != -1) {
				str2 = strTemp.replace(re,",");
				strTemp = str2;
			}
		}
	}
	//after cleaned
	strPagesViewed = strTemp;
}

function updateDatabase() {
	var pageLocation = "";
	getSuspendData();
	var iLes = getLesson();
	if (blnLastPage) {
		if (arrLessonStatus[iLes-1] < 2) arrLessonStatus[iLes-1] = 2
		cleanSuspendData();
		var nCompleted = 0;
		var nPassed = 0;
		for (var i=0; i<nLesson; i++) {
			if (arrLessonStatus[i] == 2) nCompleted += 1
			if (arrLessonStatus[i] == 3) nPassed += 1
		}
		if (nPassed == nLesson)
			doLMSSetValue("cmi.core.lesson_status", "passed")
		else if (nCompleted == nLesson)
			//doLMSSetValue("cmi.core.lesson_status", "completed")
			doLMSSetValue("cmi.core.lesson_status", "passed")
		else
			doLMSSetValue("cmi.core.lesson_status", "incomplete")
	} else {
			pageLocation = "Lessons/" + getPage() + ".htm";
			if (arrLessonStatus[iLes-1] < 2) arrLessonStatus[iLes-1] = 1
	}
	doLMSSetValue("cmi.core.lesson_location", pageLocation);
	doLMSCommit();
	updateSuspendData();
}

function setCookie(name, value, expire){
	document.cookie = name + "=" + escape(value) + ((expire == null)?"":("; expires =" + expire.toGMTString()))
}

function getCookie(Name) {
	var Mysearch = Name + "=";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(Mysearch);
		if (offset != -1){
			offset += Mysearch.length;
			end = document.cookie.indexOf(";", offset);
			if (end == -1)
				end = document.cookie.length;
			return unescape(document.cookie.substring(offset, end));
		}
	}
}

function deleteCookie (name) { 
	var exp = new Date();  
	exp.setTime (exp.getTime() - 10);  
	var cookieValue = getCookie (name);  
	document.cookie = name + "=" + cookieValue + "; expires=" + exp.toGMTString();
}

var oGoto = window.createPopup();

function gotoPopup(){
	oGoto.document.body.innerHTML = oModuleMapHTML.innerHTML; 
	oGoto.show(-5, -233, 300, 240, ModuleMap);
}

function whereToGo(pageURL) {
	closing = false;
	verNumber = getQueryValue('ver')
	location.href = pageURL + "?ver=" + verNumber;
}

function Layers508() {
	MM_showHideLayers('AudioPlay','','hide'); 
	MM_showHideLayers('AudioStop','','hide');
	MM_showHideLayers('Options','','hide');
	MM_showHideLayers('popupOptions','','hide');
	MM_showHideLayers('ModuleMap','','hide');
	MM_showHideLayers('CCon_off','','show');
	MM_showHideLayers('508map','','show');
	MM_showHideLayers('SkipNav','','show');
	MM_showHideLayers('Prompt','','hide');

}

function transTerm(termNum) {
var intH = self.screenTop + 50
var intW = self.screenLeft + 120
var theURL = getPage()+"508pop.htm?popterm=" + termNum
window.open(theURL,"","left="+intW+",top="+intH+",width=539,height=354,resizable=no,scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}

var ActiveLayer = 0
function showOrHide(value,state) {
	if (state == 1) {
		if (document.layers){
			document.layers[value].visibility='show';
		}else{
			document.all[value].style.visibility='visible';		
		}
	}	
	
	if(state == 0){
		if (document.layers){
			document.layers[value].visibility='hide';
		}else{
			(document.all[value].style.visibility='hidden');	
		}
	}
}

var LP = 0
function scrollLayer(){
	if(LP == 0){
		flvFSL1('extrasButton',835,90,10,0,0);
		flvFSL1('extrasback',831,100,10,0,0);
		flvFSL1('extras',831,100,10,0,0);
		flvFSL1('extras_on',831,100,10,0,0);
		flvFSL1('extras_off',831,100,10,0,0);
		LP = 1;
	}else{
		flvFSL1('extrasButton',835,515,10,0,0);
		flvFSL1('extrasback',831,525,10,0,0);
		flvFSL1('extras',831,525,10,0,0);
		flvFSL1('extras_on',831,521,10,0,0);
		flvFSL1('extras_off',831,521,10,0,0);
		LP = 0;
	}	
}

function flvFSL1(){//v2.3
// Copyright 2002-2004, Marja Ribbers-de Vroed, FlevOOware (www.flevooware.nl/dreamweaver/)
var v1=arguments,v2=v1[0],v3=MM_findObj(v2),v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16,v17,v18,v19,v20=window,v21=navigator;if (v3){v4=parseInt(v1[1]);v5=parseInt(v1[2]);v6=parseInt(v1[3]);v7=(v1.length>4)?parseInt(v1[4]):0;v8=(v1.length>5)?parseInt(v1[5]):0;v9=10;v10=document.layers?v3:v3.style;if (v3.SL1!=null){clearTimeout(v3.SL1);}v11=isNaN(parseInt(v10.left))?v3.offsetLeft:parseInt(v10.left);v12=isNaN(parseInt(v10.top))?v3.offsetTop:parseInt(v10.top);if (v8!=0){if (v8==1){v4=v11-v4;v5=v12;}else if (v8==2){v4=v11+v4;v5=v12;}else if (v8==3){v5=v12-v5;v4=v11;}else {v5=v12+v5;v4=v11;}}v13=v4;v14=v5;if ((v11!=v4)||(v12!=v5)){if (v7>0){v9=v6;v15=v7;v16=v7,v17=Math.abs(v11-v4),v18=Math.abs(v12-v5);if (v17<v18){v16=(v17!=0)?((v18/v17)*v7):v7;}else {v15=(v18!=0)?((v17/v18)*v7):v7;}if (v15>=v17){v15=Math.min(Math.ceil(v15),v7);}if (v16>=v18){v16=Math.min(Math.ceil(v16),v7);}if ((v11<v4)&&(v11+v15<v4)){v4=v11+v15;}if ((v11>v4)&&(v11-v15>v4)){v4=v11-v15;}if ((v12<v5)&&(v12+v16<v5)){v5=v12+v16;}if ((v12>v5)&&(v12-v16>v5)){v5=v12-v16;}}else {v17=((v4-v11)/v6);v18=((v5-v12)/v6);v17=(v17>0)?Math.ceil(v17):Math.floor(v17);v4=v11+v17;v18=(v18>0)?Math.ceil(v18):Math.floor(v18);v5=v12+v18;}v19=(document.layers||window.opera)?"":"px";if (v17!=0){v10.left=v4+v19;}if (v18!=0){v10.top=v5+v19;}var v22="flvFSL1('"+v2+"',"+v13+","+v14+","+v6+","+v7+",0)";v3.SL1=setTimeout(v22,v9);}else {if (v20.onSlideEnd){onSlideEnd(v2);}}}}
//-->

function openGlossary(){
	window.open('../glossary.htm', 'HRSAglossary', 'width=850, height=600,resizable=yes');
}

function divRoll(d_on_off, d_id){
	if (d_on_off == 1) {
		if (document.layers){
			document.layers[d_id].visibility='show';
		}else{
			document.all[d_id].style.visibility='visible';		
		}
	}
	
	if(d_on_off == 0){
		if (document.layers){
			document.layers[d_id].visibility='hide';
		}else{
			(document.all[d_id].style.visibility='hidden');	
		}
	}		
}

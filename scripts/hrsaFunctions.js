//// JavaScript Document
//
var verNumber = 2; // 1: for LMS; 2: CD.
var intVersion;
var blnCCon = 0;
var blnFirstTime = true;	
var PreExamDone = 0;
var strObjStatus = "";
var lastPage;
var nModule = 9; //cdc 8 Modules, plus pretest/post test
arrMLessons = new Array(4,8,5,8,6,8,3,3,1) //lessons in each module
arrLessonStatus = new Array(nModule);
for (var i=0; i<nModule; i++) {
	arrLessonStatus[i] = new Array(arrMLessons[i]);
	for(var j=0; j<arrMLessons[i]; j++) {
		arrLessonStatus[i][j] = 0;
	}
}

var strPagesViewed;
var blnLastPage = false;
var strCourseStatus = "";
var closing = true;
//arrLetters = new Array("A","B","C","D","E");
// following are functions
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
//
function getQueryValue(key){
	var page = new PageQuery(window.location.search); 
	return unescape(page.getValue(key)); 
}
//
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
//
function goBack(pgURL) {
	closing = false;
	//if (verNumber != 2) {
		var strTemp = getElementStyle('Next','visibility','visibility')
		if ( strTemp == "visible" ) {
			if ( blnLastPage ) {
				updateDatabase()
			} else {
				updateSuspendData()
			}
		}
		window.location = pgURL //+ "?ver=" + verNumber
	//}	
}
//
function goNext(pgURL) {
	closing = false;
	//if (verNumber != 2) {
		if ( blnLastPage ) {
			if (getModule() == 0) {
				PreExamDone = 2;
			}
			updateDatabase()
		} else {
			updateSuspendData()
		}
		window.location = pgURL //+ "?ver=" + verNumber
	//}
}

function refresh() {
	closing = false;
	window.location.reload();
}
//
function initializePage() {
	closing = true;
	if (verNumber != 2) getSuspendData();
	//verNumber = getQueryValue('ver')

}

function toMenu(blnCloseWin) {
	closing = false;
	var iMod = getModule();
	//if (verNumber != 2) {
		if ( blnLastPage ) {
			if (getModule() == 0) {
				PreExamDone = 2;
			}
			updateDatabase()
		} else {
			updateSuspendData()
		}
	//}
	if (getPage().substr(0,1)!="m" && iMod!=0 ) {
		window.location = "../module"+iMod+".htm"
	} else if (iMod==0){
		window.location = "../mainmenu.htm"
	} else {
		window.location = "mainmenu.htm"
	}
}
//
function exitCourse(ExitBtnClicked) {
	if (ExitBtnClicked) closing = false
	if (verNumber != 2) {
		startDate = getCookie("startTime");
		if (typeof(startDate) == "undefined") startDate = 0
		if (getPage()!="mainmenu" && getModule()!=0) updateDatabase();
		unloadPage();
	}
	window.close();
}
//
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
//
function getLesson() {
	var strTemp = getPage();
	if (strTemp.substr(1,1)!="o") {
		return parseInt(strTemp.substr(1,1));
	} else {
		return 0;
	}
}
//
function getModule() {
	var strTemp = getPage();
	if (strTemp.substr(0,1)!="m") {
		return parseInt(strTemp.substr(0,1));
	} else {
		return parseInt(strTemp.substr(6,1));
	}
}
//
//function setLessonStatus(iLes, lesStatus) {
//	arrLessonStatus[iLes-1] = lesStatus;
//	updateSuspendData();
//}
//
//function isPageViewed(pageFile) {
//	pageFile = pageFile.toLowerCase()
//	var intTemp = pageFile.indexOf(".htm")
//	if (intTemp != -1) pageFile = pageFile.substring(0,intTemp)
//	var iLes = getLesson();
//	var iMod = getModule();
//	if (iLes > 0 && iMod >0) {
//		if (arrLessonStatus[iMod][iLes-1] >= 2) return true
//	}
//	if (typeof(strPagesViewed) == "undefined") return false
//	if (strPagesViewed.indexOf(pageFile) >= 0) return true
//	else return false
//}

//
function initializeCourse() {
	
	//setCookie('GuideAudio',0);
	if (verNumber != 2 ) {
		loadPage();
		if (typeof(startDate) == "undefined") startDate = new Date().getTime()
		setCookie("startTime", startDate);

		var strTemp = doLMSGetValue( "cmi.suspend_data" ); // get suspend data
		if (strTemp == "" || typeof(strTemp) == "undefined") { //first time/no data, set up the data
			blnFirstTime = true;
//set up course data
//"~" -- separator for module and course variables
//"," --separator for lessons in each module; 
//strTemp = pretest~M1L1,M1L2,M1L3,M1L4,M1L5~M2L1,M2L2,.......~M8L1,M8L2~post-test~last page reviewed~
			strTemp = "0~0,0,0,0~0,0,0,0,0,0,0,0~0,0,0,0,0~0,0,0,0,0,0,0,0~0,0,0,0,0,0~0,0,0,0,0,0,0,0~0,0,0~0,0,0~0~"; 
			doLMSSetValue( "cmi.suspend_data", strTemp );
			doLMSCommit();
		} else {
			blnFirstTime = false;
			strCourseStatus = doLMSGetValue("cmi.core.lesson_status");
			getSuspendData();
		}
	}
}
//	
function getSuspendData() {
	if (verNumber != 2 ) {
		var strTemp = doLMSGetValue( "cmi.suspend_data" );
		//var strTemp = "0~2,2,2,2~2,2,2,2,2,2,2,2~2,2,2,2,2,2,2~2,2,2,2,2,2,2,2~2,2,2,2,2~2,2,2,2,2,2,2,2~2,2,2~2,2~0~44010.htm"; 
		if ( (strTemp != "") && (typeof(strTemp) != "undefined") ) {
			arrTemp = new Array();
			arrTemp = strTemp.split("~");
		
			PreExamDone = arrTemp[0];
	
			for (i=0; i<nModule; i++) {
				for (j=0; j<arrMLessons[i]; j++) {
					arrLessonStatus[i][j] = parseInt(arrTemp[i+1].charAt(2*j));
				}
			}
		
			lastPage = arrTemp[nModule+1];
		}
	}
}
//update each page
function updateSuspendData() {
	if (verNumber != 2 ) {
		var iMod = getModule();
		var iLes = getLesson();
		lastPage = getPage()+".htm";
	
	
		if (iLes != 0 && arrLessonStatus[iMod-1][iLes-1] < 2 ) arrLessonStatus[iMod-1][iLes-1] = 1
		
		var strTemp = "";
		for (i=0; i<nModule; i++) {
			strTemp += arrLessonStatus[i].join() + "~";
		}
		strTemp = PreExamDone + "~" + strTemp + lastPage; //+ "~" + blnCCon + "~" + strObjStatus;
		doLMSSetValue("cmi.suspend_data", strTemp);
		doLMSCommit();
	}
}


function cleanSuspendData() {
//	var re = /,,/g;
//	var strTemp = lastPage.toLowerCase();
//	for (var i=1; i<=nModule; i++) {
//		for (j=0; j<arrMLessons[i]; j++) {
//			if (arrLessonStatus[i][j] >= 2) {
//				//do clean up
//				arrTemp = strTemp.split(",")
//				for (var k=0; k<arrTemp.length; k++) {
//					if ( parseInt(arrTemp[k].substr(1,1)) == (j+1) ) arrTemp[k] = ""
//				}
//				strTemp = arrTemp.join();
//				while (strTemp.indexOf(",,") != -1) {
//					str2 = strTemp.replace(re,",");
//					strTemp = str2;
//				}
//			}
//		}
//	}
//	//after cleaned
//	//strPagesViewed = strTemp;
//	lastPage = strTemp;
//	alert(lastPage);
}
//update lesson at the last page of each lesson
function updateDatabase() {
	if (verNumber != 2 ) {
		var pageLocation = "";
		getSuspendData();
		var iLes = getLesson();
		var iMod = getModule();
		lastPage = getPage()+".htm"
		var strCourseStatus = doLMSGetValue( "cmi.core.lesson_status" );
		if (blnLastPage && (strCourseStatus != "passed") ) {
			if (arrLessonStatus[iMod-1][iLes-1] < 2) arrLessonStatus[iMod-1][iLes-1] = 2
			//cleanSuspendData();
			
			var nMCompleted = 0;
			var nPassed = 0;
			for (var i=0; i<nModule; i++) {
				var nLCompleted = 0;
				for (var j=0; j<arrMLessons[i]; j++) {
					if (arrLessonStatus[i][j] == 2) nLCompleted += 1
					//if (arrLessonStatus[i][j] == 3) nPassed += 1
				}
				if (nLCompleted == arrMLessons[i]) nMCompleted += 1;
			}
			if (nMCompleted == nModule) {
				doLMSSetValue("cmi.core.lesson_status", "passed");
				doLMSSetValue("cmi.core.lesson_location", "mainmenu.htm");
	
			}else{
				doLMSSetValue("cmi.core.lesson_status", "incomplete");
				doLMSSetValue("cmi.core.lesson_location", "module"+iMod+".htm");
			}
		} else {
			if (arrLessonStatus[iMod-1][iLes-1] < 2) arrLessonStatus[iMod-1][iLes-1] = 1
			doLMSSetValue("cmi.core.lesson_status", "incomplete");
			pageLocation = "m"+iMod+"_lessons/" + getPage() + ".htm";
			doLMSSetValue("cmi.core.lesson_location", pageLocation);			
		}
		doLMSCommit();
		updateSuspendData();
	}
}
//
function setCookie(name, value, expire){
	document.cookie = name + "=" + escape(value) + ((expire == null)?"":("; expires =" + expire.toGMTString()))
}
//
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
//
function deleteCookie (name) { 
	var exp = new Date();  
	exp.setTime (exp.getTime() - 10);  
	var cookieValue = getCookie (name);  
	document.cookie = name + "=" + cookieValue + "; expires=" + exp.toGMTString();
}
//
//this fuction is for page popup
function transTerm(termNum) {
var intH = self.screenTop + 50
var intW = self.screenLeft + 120
var theURL = getPage()+"pop.htm?popterm=" + termNum
window.open(theURL,"","left="+intW+",top="+intH+",width=539,height=354,resizable=no,scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
}

function showFeedback(feedbackItem) {
	var intH = self.screenTop + 50
	var intW = self.screenLeft + 120
	var theURL = "../508Drill_feedback.htm?popterm=" + feedbackItem
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

function scrollLayer(LP){
	if(LP == 1){
		flvFSL1('extrasButton',783,100,10,0,0);
		flvFSL1('extrasback',783,100,10,0,0);
		flvFSL1('extras',791,100,10,0,0);
		flvFSL1('extras_on',782,100,10,0,0);
		flvFSL1('extras_off',782,100,10,0,0);
	}else{
		flvFSL1('extrasButton',783,524,10,0,0);
		flvFSL1('extrasback',783,524,10,0,0);
		flvFSL1('extras',791,524,10,0,0);
		flvFSL1('extras_on',782,524,10,0,0);
		flvFSL1('extras_off',782,524,10,0,0);
	}	
}

function flvFSL1(){//v2.3
// Copyright 2002-2004, Marja Ribbers-de Vroed, FlevOOware (www.flevooware.nl/dreamweaver/)
var v1=arguments,v2=v1[0],v3=MM_findObj(v2),v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16,v17,v18,v19,v20=window,v21=navigator;if (v3){v4=parseInt(v1[1]);v5=parseInt(v1[2]);v6=parseInt(v1[3]);v7=(v1.length>4)?parseInt(v1[4]):0;v8=(v1.length>5)?parseInt(v1[5]):0;v9=10;v10=document.layers?v3:v3.style;if (v3.SL1!=null){clearTimeout(v3.SL1);}v11=isNaN(parseInt(v10.left))?v3.offsetLeft:parseInt(v10.left);v12=isNaN(parseInt(v10.top))?v3.offsetTop:parseInt(v10.top);if (v8!=0){if (v8==1){v4=v11-v4;v5=v12;}else if (v8==2){v4=v11+v4;v5=v12;}else if (v8==3){v5=v12-v5;v4=v11;}else {v5=v12+v5;v4=v11;}}v13=v4;v14=v5;if ((v11!=v4)||(v12!=v5)){if (v7>0){v9=v6;v15=v7;v16=v7,v17=Math.abs(v11-v4),v18=Math.abs(v12-v5);if (v17<v18){v16=(v17!=0)?((v18/v17)*v7):v7;}else {v15=(v18!=0)?((v17/v18)*v7):v7;}if (v15>=v17){v15=Math.min(Math.ceil(v15),v7);}if (v16>=v18){v16=Math.min(Math.ceil(v16),v7);}if ((v11<v4)&&(v11+v15<v4)){v4=v11+v15;}if ((v11>v4)&&(v11-v15>v4)){v4=v11-v15;}if ((v12<v5)&&(v12+v16<v5)){v5=v12+v16;}if ((v12>v5)&&(v12-v16>v5)){v5=v12-v16;}}else {v17=((v4-v11)/v6);v18=((v5-v12)/v6);v17=(v17>0)?Math.ceil(v17):Math.floor(v17);v4=v11+v17;v18=(v18>0)?Math.ceil(v18):Math.floor(v18);v5=v12+v18;}v19=(document.layers||window.opera)?"":"px";if (v17!=0){v10.left=v4+v19;}if (v18!=0){v10.top=v5+v19;}var v22="flvFSL1('"+v2+"',"+v13+","+v14+","+v6+","+v7+",0)";v3.SL1=setTimeout(v22,v9);}else {if (v20.onSlideEnd){onSlideEnd(v2);}}}}
//-->

function openGlossary(){
	window.open('../glossary.htm', 'HRSAglossary', 'width=850, height=600,resizable=yes,scrollbars=yes');
}

function openHelp(){
	window.open('help.htm', 'HRSAhelp', 'width=1010, height=700,resizable=yes,scrollbars=yes');
}

function openHelpModules(){
	window.open('../help.htm', 'HRSAhelp', 'width=1010, height=700,resizable=yes,scrollbars=yes');
}

function openAccessibility(){
	window.open('../accessibility.htm', 'HRSAaccessibility', 'width=400, height=250,resizable=yes');
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

// following functions cotnrol opening and closing of popUp information layers.
var popId = 0;

function closePop(){
	showOrHide('popBack',0);
	showOrHide('PopUp'+ popId,0)
	showOrHide('close_on',0)
	showOrHide('close_off',0)
}

function showPop(id){
	if(popId != 0){closePop();} // this ensures that only one pop layer shows at a time
	popId = id;
	showOrHide('popBack',1);
	showOrHide('PopUp'+id,1)
	showOrHide('close_off',1)
	popcheck(id);
}

function showPop3(id,v){
	if(popId != 0){closePop();} // this ensures that only one pop layer shows at a time
	popId = id;
	showOrHide('popBack',1);
	showOrHide('PopUp'+id,1)
	showOrHide('close_off',1)
	if(v != 1){popcheck3(id);}
}

function easterEgg(id){
	showOrHide('popBack',1);
	showOrHide('PopUp'+id,1)
	showOrHide('close_off',1)
}

function closeEasterEgg(id){
	showOrHide('popBack',0);
	showOrHide('PopUp'+id,0)
	showOrHide('close_on',0)
	showOrHide('close_off',0)
}

// checks popUps to see if all are viewed.  If yes activates Next arrow.  Note: if more than 3 popups add additional if statements.
function popcheck(popN){
	eval('check' + popN + ' = true')
	if(check1 == false){return false}
	if(check2 == false){return false}
	if(check3 == false){return false}
	showOrHide('Next',1);
}

function popcheck3(popN){
	eval('check' + popN + ' = true')
	if(check1 == false){return false}
	if(check2 == false){return false}
	if(check3 == false){return false}	
	if(check4 == false){return false}
	if(check5 == false){return false}
	if(check6 == false){return false}	
	if(check7 == false){return false}
	showOrHide('Next',1);
}

// initPage() function initializes the next back button states.

function initPage(){
	if(back_nav == 1){
		showOrHide('Back',1)
	}
	if(next_nav == 1){
		showOrHide('Next',1)
	}	
}
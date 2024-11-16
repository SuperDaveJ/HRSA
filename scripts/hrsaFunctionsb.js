//// JavaScript Document
//
var verNumber = 2;
//var intVersion;
var blnCCon = 0;
var blnFirstTime = true;	
var PreExamDone;
var strObjStatus = "";
var nModule = 9; //cdc Module 8 plus pretest and post test
arrMLessons = new Array(4,8,7,8,5,8,3,2,1)
arrLessonStatus = new Array(nModule);
for (var i=0; i<nModule; i++) {
	arrLessonStatus[i] = new Array(arrMLessons[i]);
	for(var j=0; j<arrMLessons[i]; j++) {
		arrLessonStatus[i][j] = 0;
	}
}
//
var strPagesViewed;
var blnLastPage = false;
var strCourseStatus = "";
var closing = true;
//arrLetters = new Array("A","B","C","D","E");
//
//function PageQuery(q) {
//	if(q.length > 1) this.q = q.substring(1, q.length);
//	else this.q = null;
//	this.keyValuePairs = new Array();
//	if(q) {
//		for(var i=0; i < this.q.split("&").length; i++) {
//			this.keyValuePairs[i] = this.q.split("&")[i];
//		}
//	}
//
//	this.getKeyValuePairs = function() { return this.keyValuePairs; }
//
//	this.getValue = function(s) {
//		for(var j=0; j < this.keyValuePairs.length; j++) {
//			if(this.keyValuePairs[j].split("=")[0] == s)
//				return this.keyValuePairs[j].split("=")[1];
//		}
//		return false;
//	}
//
//	this.getParameters = function() {
//		var a = new Array(this.getLength());
//		for(var j=0; j < this.keyValuePairs.length; j++) {
//			a[j] = this.keyValuePairs[j].split("=")[0];
//		}
//		return a;
//	}
//
//	this.getLength = function() { return this.keyValuePairs.length; } 
//}
//
//function getQueryValue(key){
//	var page = new PageQuery(window.location.search); 
//	return unescape(page.getValue(key)); 
//}
//
//function getElementStyle(elemID, IEStyleProp, CSSStyleProp) {
//    var elem = document.getElementById(elemID);
//    if (elem.currentStyle) {
//        return elem.currentStyle[IEStyleProp];
//    } else if (window.getComputedStyle) {
//        var compStyle = window.getComputedStyle(elem, "");
//        return compStyle.getPropertyValue(CSSStyleProp);
//    }
//    return "";
//}
//
function goBack(pgURL) {
	closing = false;
		//var strTemp = getElementStyle('Next','visibility','visibility')
//		if ( strTemp == "visible" ) {
//			if ( blnLastPage ) {
//				updateDatabase()
//			} else {
//				updateSuspendData()
//			}
//		}
	window.location = pgURL //+ "?ver=" + verNumber
}
//
function goNext(pgURL) {
	closing = false;
	//	if ( blnLastPage ) {
//			updateDatabase()
//		} else {
//			updateSuspendData()
//		}
	window.location = pgURL //+ "?ver=" + verNumber
}
//
////function doJump(pgURL) {
////	closing = false;
////	verNumber = getQueryValue('ver')
////	window.location = pgURL + "?ver=" + verNumber
////}
//
function refresh() {
	closing = false;
	window.location.reload();
}
//
function initializePage() {
	closing = true;
	getSuspendData();
	//verNumber = getQueryValue('ver')

}
//
function initializeCourse() {
	//loadPage();
	//setCookie('GuideAudio',0);
	if (verNumber != 2 ) {
		if (intLMS > 0) {
			if (typeof(startDate) == "undefined") startDate = new Date().getTime()
			setCookie("startTime", startDate);
	
			var strTemp = doLMSGetValue( "cmi.suspend_data" );
			if (strTemp == "" || typeof(strTemp) == "undefined") {
				blnFirstTime = true;
				//set up course data
				//"~" -- separator for module and other course variables
				//"," --separator for lessons in each module; 
				//strTemp "pretest~M1L1,M1L2,M1L3,M1L4,M1L5~M2L1,M2L2,.......~M8L1,M8L2~post-test~last page reviewed
				strTemp = "0~0,0,0,0~0,0,0,0,0,0,0,0~0,0,0,0,0,0,0~0,0,0,0,0,0,0,0~0,0,0,0,0~0,0,0,0,0,0,0,0~0,0,0~0,0~0~"; 
				//strTemp = "0~0,0,0,0,0~~" + blnCCon + "~";
				doLMSSetValue( "cmi.suspend_data", strTemp );
				doLMSCommit();
			} else {
				blnFirstTime = false;
				strCourseStatus = doLMSGetValue("cmi.core.lesson_status");
				getSuspendData();
			}
		}
	}
}
//
//function toMenu(blnCloseWin) {
//	closing = false;
//	//if (verNumber > 2) {
//		var strTemp = getElementStyle('Next','visibility','visibility')
//		if ( strTemp != "hidden" ) {
//			if ( blnLastPage ) {
//				updateDatabase()
//			} else {
//				updateSuspendData()
//			}
//		}
//	//}
//}
//
function exitCourse(ExitBtnClicked) {
	if (ExitBtnClicked) closing = false
		startDate = getCookie("startTime");
		if (typeof(startDate) == "undefined") startDate = 0
		updateDatabase();
		unloadPage();
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
	//lesson 2 and 3 are switched after course development is completed but the file name are not changed.
	var strTemp = getPage();
	var intTemp = parseInt(strTemp.substr(1,1));
	if (intTemp == 2) return 3
	else if (intTemp == 3) return 2
	else return intTemp
	//return parseInt(strTemp.substr(1,1));
}
//
function getModule() {
	var strTemp = getPage();
	return parseInt(strTemp.substr(0,1));
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
//function updateSuspendData() {
////   	if ((strPagesViewed == "") || (typeof(strPagesViewed) == "undefined")) {
////		strPagesViewed = ""
////	}
////	var iMod = getModule();
////	var iLes = getLesson();
////	if ( (strPagesViewed.indexOf(getPage()) == -1) && (arrLessonStatus[iMod][iLes-1]<2 ) { //(arrLessonStatus[iLes-1] < 2) ) {
////		strPagesViewed = strPagesViewed + "," + getPage();
////	}
////	if (arrLessonStatus[iMod][iLes-1] < 2) arrLessonStatus[iMod][iLes-1] = 1
////	var strTemp;
////	for (i=0; i<nModule; i++) {
////		strTemp += arrLessonStatus[i].join() + "~";
////	}
////	strTemp = PreExamDone + "~" + strTemp + strPagesViewed + strObjStatus; //+ "~" + blnCCon + "~" + strObjStatus;
////	doLMSSetValue("cmi.suspend_data", strTemp);
////	doLMSCommit();
//}
//
function getSuspendData() {
	//var strTemp = doLMSGetValue( "cmi.suspend_data" );
	var strTemp = "0~0,0,0,0~0,0,0,0,0,0,0,0~0,0,0,0,0,0,0~0,0,0,0,0,0,0,0~0,0,0,0,0~0,0,0,0,0,0,0,0~0,0,0~0,0~2~44010.htm"; 
	if ( (strTemp != "") && (typeof(strTemp) != "undefined") ) {
		arrTemp = new Array();
		arrTemp = strTemp.split("~");
	}
		PreExamDone = arrTemp[0];

	for (i=0; i<nModule; i++) {
		for (j=0; j<arrMLessons[i]; j++) {
			arrLessonStatus[i][j] = parseInt(arrTemp[i+1].charAt(2*j));
		}
	}

	strPagesViewed = arrTemp[nModule+1];
	strObjStatus = arrTemp[nModule];
	//alert(strObjStatus);
		
}
//
function cleanSuspendData() {
	var re = /,,/g;
	var strTemp = strPagesViewed.toLowerCase();
	for (var i=1; i<=nModule; i++) {
		for (j=0; j<arrMLessons[i]; j++) {
			if (arrLessonStatus[i][j] >= 2) {
				//do clean up
				arrTemp = strTemp.split(",")
				for (var k=0; k<arrTemp.length; k++) {
					if ( parseInt(arrTemp[k].substr(1,1)) == (j+1) ) arrTemp[k] = ""
				}
				strTemp = arrTemp.join();
				while (strTemp.indexOf(",,") != -1) {
					str2 = strTemp.replace(re,",");
					strTemp = str2;
				}
			}
		}
	}
	//after cleaned
	strPagesViewed = strTemp;
}
//
//function updateDatabase() {
//	var pageLocation = "";
//	getSuspendData();
//	var iLes = getLesson();
//	var iMod = getModule();
//	var strCourseStatus = doLMSGetValue( "cmi.core.lesson_status" );
//	if (blnLastPage && (strCourseStatus != "passed") ) {
//		if (arrLessonStatus[iMod-1][iLes-1] < 2) arrLessonStatus[iMod-1][iLes-1] = 2
//		cleanSuspendData();
//		var nLCompleted = 0;
//		var nMCompleted = 0;
//		var nPassed = 0;
//		for (var i=0; i<nModule; i++) {
//			for (var j=0; j<arrMLessons[i]; j++) {
//				if (arrLessonStatus[i][j] == 2) nLCompleted += 1
//				//if (arrLessonStatus[i][j] == 3) nPassed += 1
//			}
//			if (nLCompleted == arrMLessons[i]) nMCompleted += 1;
//		}
//		if (nMCompleted == nModule) {
//			doLMSSetValue("cmi.core.lesson_status", "passed")
//		//for (var i=0; i<nLesson; i++) {
////			if (arrLessonStatus[i] == 2) nCompleted += 1
////			if (arrLessonStatus[i] == 3) nPassed += 1
////		}
////		if (nPassed == nLesson)
////			doLMSSetValue("cmi.core.lesson_status", "passed")
////		else if (nCompleted == nLesson)
////			//USDA - FS AgLearn LMS does not accept "completed" status
////			//doLMSSetValue("cmi.core.lesson_status", "completed")
////			doLMSSetValue("cmi.core.lesson_status", "passed")
//		else
//			doLMSSetValue("cmi.core.lesson_status", "incomplete")
//	} else {
//			pageLocation = "m"+iMod+"_lessons/" + getPage() + ".htm";
//			if (arrLessonStatus[iMod-1][iLes-1] < 2) arrLessonStatus[iMod-1][iLes-1] = 1
//	}
//	if (blnLastPage) pageLocation = "module"+iMod+".htm"
//	doLMSSetValue("cmi.core.lesson_location", pageLocation);
//	doLMSCommit();
//	updateSuspendData();
//}
//
//function setCookie(name, value, expire){
//	document.cookie = name + "=" + escape(value) + ((expire == null)?"":("; expires =" + expire.toGMTString()))
//}
//
//function getCookie(Name) {
//	var Mysearch = Name + "=";
//	if (document.cookie.length > 0) {
//		offset = document.cookie.indexOf(Mysearch);
//		if (offset != -1){
//			offset += Mysearch.length;
//			end = document.cookie.indexOf(";", offset);
//			if (end == -1)
//				end = document.cookie.length;
//			return unescape(document.cookie.substring(offset, end));
//		}
//	}
//}
//
//function deleteCookie (name) { 
//	var exp = new Date();  
//	exp.setTime (exp.getTime() - 10);  
//	var cookieValue = getCookie (name);  
//	document.cookie = name + "=" + cookieValue + "; expires=" + exp.toGMTString();
//}
//
//var oGoto = window.createPopup();
//function gotoPopup()
//{
//    oGoto.document.body.innerHTML = oModuleMapHTML.innerHTML; 
//	oGoto.show(-5, -133, 300, 140, ModuleMap);
//}
//
//function whereToGo(pageURL) {
//	closing = false;
//	verNumber = getQueryValue('ver')
//	location.href = pageURL + "?ver=" + verNumber;
//}
//
//function transTerm(termNum) {
//var intH = self.screenTop + 50
//var intW = self.screenLeft + 120
//var theURL = getPage()+"pop.htm?popterm=" + termNum
//window.open(theURL,"","left="+intW+",top="+intH+",width=539,height=354,resizable=no,scrollbars=yes, status=no, toolbar=no, menubar=no, location=no")
//}
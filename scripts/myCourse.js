// JavaScript Document
//=========== This is for NRC Incidant Response Course ============================
//----------- Following function are added to handle objective status -------------
//----------- Febuary, 2006                                           -------------

// tracking Objective status -- a string contains all objectives passed
var strObjStatus
// number of objectives for each lesson
arrLessonObjectives = new Array(2,1,8,1);
// total number of objectives.  It should the total of the number in the line above
nObjs = 2;	

function getObjectiveStatus(objID)
{	// objID = objective ID
	getSuspendData();
	if (strObjStatus.indexOf(objID) != -1) return true
	else return false
}

function setObjectiveStatus(objID)
{	//this function is called from preassessment and self-check questions
	// objID = objective ID
	getSuspendData();
	if ( typeof(strObjStatus) != "undefined" )
		if (strObjStatus.indexOf(","+objID) == -1) strObjStatus = strObjStatus + "," + objID
	updateSuspendData();
}

//----------- MyCourse popup functions ----------------------
//External stylesheet will not work.  That's why it's included here.
//Initialize some popup menu variables.
var intBoxWidth = 300;
var intBoxHeight = 80;	// This will change based on how many items there are.
var intXOffset = -50;
var intYOffset = -80;	// Y offset is normally the same as the box height
var strOverflowY = "hidden"		//can be auto, scroll, hidden, visible.  auto does not work well.
var strCourseTitle = "NRC Incident Response Overview course"		//used in 508 and normal menu layers.
var strCompletedText = "You have completed this module."
/*
var strCourseRoot
strCourseRoot = window.location.href.substring(0, window.location.href.lastIndexOf("/"))
strCourseRoot = strCourseRoot.substring(0, strCourseRoot.lastIndexOf("/")+1)
alert("strCourseRoot = " + strCourseRoot)
*/

// *********** Use a 2-D array to hold objective information ************
// 0 - first index is objective ID
// 1 - second index is the topic title of the that objective
// 2 - third index is the URL to the first page of that objective
// 3 - fourth index is the status for that objective. 0 = not passed, 1 = passed.
arrObjs = new Array(nObjs);
for (var i=0; i<nObjs; i++)
	arrObjs[i] = new Array(4);
//initialize objective IDs, Titles, and URLs to the first page of each objective
//the following are here for examples
//objective 01
arrObjs[0][0] = "111"	
arrObjs[0][1] = "Lesson 1 - Objective 1"	
arrObjs[0][2] = "../Lesson1/11040.htm"
arrObjs[0][3] = 0	
//objective 21
arrObjs[1][0] = "112"	
arrObjs[1][1] = "Lesson 1 - Objective 2"	
arrObjs[1][2] = "../Lesson1/11060.htm"
arrObjs[1][3] = 0
/*
//objective 03
arrObjs[2][0] = "113"	
arrObjs[2][1] = "Lesson 1 - Topic 3"	
arrObjs[2][2] = "../Lesson1/11080.htm"	
arrObjs[2][3] = 1
//objective 04
arrObjs[3][0] = "121"	
arrObjs[3][1] = "Lesson 2 - Topic 1"	
arrObjs[3][2] = "../Lesson2/12040.htm"	
arrObjs[3][3] = 1
//objective 05
arrObjs[4][0] = "122"	
arrObjs[4][1] = "Lesson 2 - Topic 2"	
arrObjs[4][2] = "../Lesson2/12070.htm"	
arrObjs[4][3] = 1
*/

function getNumOfObjFailed()
{
	//determine how many objectives are failed
	var nObjFailed = 0;
	for (var i=0; i<nObjs; i++) {
		if (getObjectiveStatus(arrObjs[i][0])) {
			arrObjs[i][3] = 1
		} else {
			arrObjs[i][3] = 0
			nObjFailed += 1
		}
	}
	return nObjFailed;
}

function createMy508Course()
{
	if (intVersion == 1) {
		//508 version only
		var nObjFailed = 0;
		var strHTML = "";
		nObjFailed = getNumOfObjFailed();
		strHTML = "<p>" + strCourseTitle + "</p>"
		if (nObjFailed > 0) {
			strHTML = strHTML + "<ol>"
				for (var i=0; i<nObjs; i++) {
					if (arrObjs[i][3] != 1)
						strHTML = strHTML + "<li><a href='" + arrObjs[i][2] + "' onClick='javascript:closing=false'>" + arrObjs[i][1] + "</a></li>"
				}
			strHTML = strHTML + "</ol>"
		} else {
			strHTML = strHTML + strCompletedText
		}
		document.getElementById('item1508').innerHTML = strHTML;
	}
}

var oGoto = window.createPopup();
function gotoPopup()
{
	var nObjFailed = 0; 	//used to determine the popup box size
	nObjFailed = getNumOfObjFailed();
	//set the height of the popup menu based on how many items there are
	switch (nObjFailed) {
		case 0:
			intBoxHeight = 40;
			intYOffset = -40;
			break;
		case 1:
			intBoxHeight = 60;
			intYOffset = -60;
			break;
		case 2:
			intBoxHeight = 80;
			intYOffset = -80;
			break;
		case 3:
			intBoxHeight = 100;
			intYOffset = -100;
			break;
		case 4:
			intBoxHeight = 120;
			intYOffset = -120;
			break;
		case 5:
			intBoxHeight = 140;
			intYOffset = -140;
			break;
		default :
			intBoxHeight = 140;
			intYOffset = -140;
			strOverflowY = "scroll"		//set vertical scroll
	}
	var strHTML = ""
	var strMouseOver = "this.style.color='#FFFFFF', this.style.background='#744857'";
	var strMouseOut = "this.style.color='#744857', this.style.background='#FFFFFF'";
	var strLinkStyle = 'color:#744857; font-family:arial; font-size:11px; height:20px; background:#FFFFFF; border-left:2px solid #480015; border-top:1px solid #480015; border-right:2px solid #480015; border-bottom:none; padding:2px; padding-left:10px; cursor:hand;';

	var styBox = "<div style='position:absolute; top:0; left:0; overflow-y:" + strOverflowY + "; overflow-x:hidden; width:" + intBoxWidth + "; height:" + intBoxHeight + "; scrollbar-base-color:#DDDDDD; border-bottom:2px solid #480015; SCROLLBAR-HIGHLIGHT-COLOR: #EEEEEE; SCROLLBAR-ARROW-COLOR: black;'>"
	var styTitle = "<div style='color:#000000; font-family:arial; font-size:11px; height:20px; background:#FFFFFF; border-left:2px solid #480015; border-top:2px solid #480015; border-right:2px solid #480015; border-bottom:none; padding:2px; padding-left:10px; cursor:default;'>"
	var styInstruction = "<div style='color:#000000; font-family:arial; font-size:11px; height:20px; background:#FFFFFF; border-left:2px solid #480015; border-top:none #480015; border-right:2px solid #480015; border-bottom:none; padding:2px; padding-left:10px; cursor:default;'>"
	var styLinkedItem = "<div onMouseOver=\"" + strMouseOver + "\" onMouseOut=\"" + strMouseOut + "\" style=\"" + strLinkStyle + "\">"
	strHTML = strHTML + styBox + styTitle + "<span><b>" + strCourseTitle + "</b></span> </div>"
	if (nObjFailed > 0)
		strHTML = strHTML + styInstruction + "<span>Click a page to navigate to it.</span> </div>"
	else
		strHTML = strHTML + styInstruction + "<span>" + strCompletedText + "</span> </div>"
	for (var i=0; i<nObjs; i++) {
		if (arrObjs[i][3] != 1) {
			strHTML = strHTML + styLinkedItem + "<span onClick='javascript:parent.whereToGo(\"" + arrObjs[i][2] + "\")'>" + arrObjs[i][1] + "</span></div>"
		}
	}
	strHTML = strHTML + "</div>"
	//oModuleMapHTML.innerHTML = strHTML
	oGoto.document.body.innerHTML = strHTML
    //oGoto.document.body.innerHTML = oModuleMapHTML.innerHTML; 
	//the dimensions need to match that of scroll box layer
	//the position is relative to ModuleMap object
	oGoto.show(intXOffset, intYOffset, intBoxWidth, intBoxHeight, mnuMyCourse);
}

function whereToGo(pageURL) {
	//Changed for this course. User can go anywhere on the menu.
	//if (isPageViewed(pageURL)) {
		closing = false;
		if (document.all["Next"].style.visibility == "visible") {
			// only if all popup pages have been viewed
			updateSuspendData();
		}
		location.href = pageURL;
	//} else {
	//	alert("You can only select a previously viewed screen.")
	//}	
}
//=========================================================================================

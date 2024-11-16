// JavaScript Document

var ActiveLayer = 0
function showOrHideNB(value,state) {
	if (state == 1) {
		//alert('script called to show ' + value);
		if (document.layers){
			document.layers[value].visibility='show';
		}else{
			document.all[value].style.visibility='visible';		
		}
	}	
	
	if(state == 0){
		//alert('script called to hide ' + value);
		if (document.layers){
			document.layers[value].visibility='hide';
		}else{
			(document.all[value].style.visibility='hidden');	
		}
	}
}


// initPage() function initializes the next back button states.
function initPage(){
	if(back_nav == 1){
		showOrHideNB('Back2',1)
	}
	if(next_nav == 1){
		showOrHideNB('Next2',1)
	}	
}
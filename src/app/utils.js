/*globals define:false, window:false */
define("app/utils",[

],

function(){

	function getBoardId() {
		var urlparam = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
		return (urlparam)? urlparam : "";
	}

    return {

        getBoardId: getBoardId
        
    };
    
});
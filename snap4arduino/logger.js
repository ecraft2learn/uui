console.log(ide);

function increaseCounter() {

     var counter = 0;

     return function() {

         return counter++;

     };  

};

setInterval(function() {

	for (var key in window.localStorage)
   		window.localStorage.setItem(key, null);

	if (! window.counterIncrease)
   		window.counterIncrease = increaseCounter(); 
	
	var sessionId = window.sessionStorage.getItem('pilotsite');
        var users = window.sessionStorage.getItem('username');

	var fileName = users + '_' + sessionId + '_' + window.counterIncrease();

	var currentTab = ide.currentTab;
	var currentCategory = ide.currentCategory;
	var lastTime = new Date().getTime();

	ide.rawSaveProject(fileName);

	var code = window.localStorage.getItem('-snap-project-' + fileName);

	var http = new XMLHttpRequest();
	var url = 'https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/put_programming_vectors_pilot_1.php';
	var params = "script=" + encodeURIComponent(code) +
		'&currentTab=' + currentTab + '&currentCategory=' + currentCategory +
		'&sessionId=' + sessionId +
		'&users=' + users;

	http.open("POST", url, true);

	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {
    
    		console.log(http.responseText);
    
	};

	http.send(params);

}, 60 * 10000);

setInterval(function() {

        if (! window.counterIncrease)
                window.counterIncrease = increaseCounter(); 
            
        var sessionId = window.sessionStorage.getItem('pilotsite');
        var users = window.sessionStorage.getItem('username');

        var fileName = users + '_save_' + sessionId + '_' + window.counterIncrease();

        ide.rawSaveProject(fileName);

        var code = window.localStorage.getItem('-snap-project-' + fileName);

        var http = new XMLHttpRequest();
        var url = 'https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/put_s4a_scripts_pilot_2.php';

	var params = 'users=' + users + '&sessionId=' + sessionId + '&data=' + encodeURIComponent(code);

        http.open("POST", url, true);

        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function() {
                    
                console.log(http.responseText);
            
        };  

        http.send(params);

}, 60 * 2003);

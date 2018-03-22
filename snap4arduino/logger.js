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
	var url = 'http://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/put_programming_vectors_pilot_1.php';
	var params = "script=" + encodeURIComponent(code) +
		'&currentTab=' + currentTab + '&currentCategory=' + currentCategory +
		'&sessionId=' + sessionId +
		'&users=' + users;

	console.log(params);

	http.open("POST", url, true);

	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {
    
    		console.log(http.responseText);
    
	};

	http.send(params);

}, 60 * 1000);

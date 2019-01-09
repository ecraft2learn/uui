/*$(function () {
    $('a[href="#search"]').on('click', function(event) {
        event.preventDefault();
        $('#search').addClass('open');
        $('#search > form > input[type="search"]').focus();
    });
   /* 
    $('#search, #search button.close').on('click', function(event) {
        if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
            $(this).removeClass('open');
        }
    });
    */
//});*/


var ApiCall = function() {

	var getQueryParam = function(param) {
    
    	var found;
    
    	window.location.search.substr(1).split("&").forEach(function(item) {
        
        	if (param ==  item.split("=")[0]) {
            
            	found = item.split("=")[1];
        
        	}
        	
    	});
    
    	return found;
	};

	this.url = 'https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/put_search_vectors_pilot_2.php';
	this.method = 'POST';
	
	this.sessionId = window.sessionStorage.getItem('pilotsite');
	this.users = window.sessionStorage.getItem('username');

	this.data = {
	
		users: this.users,
		term: '',
		searchResultLength: 0
	
	};
	
};

ApiCall.prototype.post = function() {

	var self = this;
	
	$.ajax({
        url: self.url,
        type: self.method,
        data: 'sessionId=' + self.sessionId + '&users=' + self.users + '&data=' + encodeURIComponent(JSON.stringify(self.data)),
        success: (data) => {
        
        	
        
        },
        error: (error) => {
        
        	console.log(error);
        
        }
    });

};

ApiCall.prototype.setData = function(key, data) {

	this.data[key] = data;

};

$(document).on('keypress', '#search-input', function(e){
	if(e.keyCode == 13) {
		searchData(e);
	}
});

function searchData(event) {
	event.preventDefault();
	if (event.type === 'keyup' &&
	  	event.keyCode !== 27)
		return;
                 
        $('#videos').html('');
        $('#pictures').html('');

        var val = $('#search-input').val();

	if (val.trim() === '')
		return;

	let canSearch = true;
       
	$.ajax({

		async: false,
		url: 'profane.json',
		dataType: 'json',
		success: (data) => {

			let lowerCase = val.toLowerCase();
	
			if (data[lowerCase]) {

				alert('Cannot use such a profane search term.');
				canSearch = false;	

			}

		}

	});

	if (! canSearch)
		return;        

 
        function getRequest(searchTerm) {
                                
        	var url = 'https://www.googleapis.com/youtube/v3/search';
                var params = {
                	part: 'snippet',
                        key: 'AIzaSyCw8QUF2M9UHS-3VgFCLV9QmeEMf6H1gOY',
                        q: searchTerm,
			type: 'video',
			videoCategoryId: 27,
			safeSearch: 'strict' 
                };
  
                $.getJSON(url, params, (searchTerm) => {
                                                        
                	for (var i = 0; i < searchTerm.items.length; i++) {

                        	var videoId = searchTerm.items[i].id.videoId;

                                $('#videos').append('<div id=\'video-' + i + '\'></div>');

                                var player = new YT.Player('video-' + i, {

                                	height: '390',
                                        width: '640',
                                        videoId: videoId

                                });

                        }

			var request = new ApiCall();
			request.setData('term', val);
			request.setData('searchResultLength', searchTerm.items.length);
			request.post();                                       
        
                });

        }
                                        
        //getRequest(val);

	$.ajax({

		type: 'GET',
		url: 'https://en.wikipedia.org/w/api.php',
		data: 'origin=*&action=query&format=json&list=search&srsearch=' + val,
		success: (data) => {

			var html = '';

			for (let i = 0; i < data.query.search.length; i++) {

				let snippet = data.query.search[i].snippet;
				let pageId = data.query.search[i].pageid;

				html += '<div class=\'well\' style=\'float: left;\'>' + snippet + '... <a href=\'https://en.wikipedia.org/?curid=' + pageId + '\' target=\'_blank\'>Link</a></div>';
			}

			html += '<br>';

			$('#wiki').html(html);

		},
		error: (error) => {


		}

	});

        $.ajax({

        	'url': 'https://api.flickr.com/services/rest/',
                'method': 'GET',
                'data': 'method=flickr.photos.search&format=json&api_key=953e7b18fcc1b07d2eceec8e051ecde1&safe_search=1&sort=relevance&tags=education,arduino&text=' + encodeURIComponent(val),
                'success': function(data) { eval(data); },
                'error': function(error) { eval(error.responseText) }
                                                        
       	});

	function jsonFlickrApi(rsp) {
        
		 var request = new ApiCall();
                        request.setData('term', val);
                        request.setData('searchResultLength', rsp.photos.photo.length);           
                        request.post();

		var s = "";

        	for (var i = 0; i < rsp.photos.photo.length; i++) {

                	var photo = rsp.photos.photo[i];
                	var thuUrl = "http://farm" + photo.farm + ".static.flickr.com/" +
                        	photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
                	var url = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
                	s +=  '<a href="' + thuUrl + '">' + '<img alt="'+ photo.title +
                        	'"src="' + thuUrl + '"/>' + '</a>';


        	}

        	$('#pictures').html(s);

		document.getElementById('pictures').onclick = function(event) {

			event = event || window.event;
    			var target = event.target || event.srcElement,
        		    link = target.src ? target.parentNode : target,
        		    options = { index: link, event: event },
        		    links = this.getElementsByTagName('a');
    			    blueimp.Gallery(links, options);

		};

	}

	$('#search').removeClass('open');
}

/*$('#search').on('click keyup', (event) => {
	event.preventDefault();
	console.log('a');
	if (event.type === 'keyup' &&
	  	event.keyCode !== 27)
		return;
                 
        $('#videos').html('');
        $('#pictures').html('');

        var val = $('#search-input').val();

	if (val.trim() === '')
		return;
                                        
        function getRequest(searchTerm) {
                                
        	var url = 'https://www.googleapis.com/youtube/v3/search';
                var params = {
                	part: 'snippet',
                        key: 'AIzaSyCw8QUF2M9UHS-3VgFCLV9QmeEMf6H1gOY',
                        q: searchTerm,
			type: 'video',
			videoCategoryId: 27,
			safeSearch: 'strict' 
                };
  
                $.getJSON(url, params, (searchTerm) => {
                                                        
                	for (var i = 0; i < searchTerm.items.length; i++) {

                        	var videoId = searchTerm.items[i].id.videoId;

                                $('#videos').append('<div id=\'video-' + i + '\'></div>');

                                var player = new YT.Player('video-' + i, {

                                	height: '390',
                                        width: '640',
                                        videoId: videoId

                                });

                        }

			var request = new ApiCall();
			request.setData('term', val);
			request.setData('searchResultLength', searchTerm.items.length);
			request.post();                                       
        
                });

        }
                                        
        getRequest(val);

	$.ajax({

		type: 'GET',
		url: 'https://en.wikipedia.org/w/api.php',
		data: 'origin=*&action=query&format=json&list=search&srsearch=' + val,
		success: (data) => {

			var html = '';

			for (let i = 0; i < data.query.search.length; i++) {

				let snippet = data.query.search[i].snippet;
				let pageId = data.query.search[i].pageid;

				html += '<div class=\'well\' style=\'width: 200px; float: left;\'>' + snippet + '... <a href=\'https://en.wikipedia.org/?curid=' + pageId + '\' target=\'_blank\'>Link</a></div>';
			}

			html += '<br>';

			$('#wiki').html(html);

		},
		error: (error) => {


		}

	});

        $.ajax({

        	'url': 'https://api.flickr.com/services/rest/',
                'method': 'GET',
                'data': 'method=flickr.photos.search&format=json&api_key=953e7b18fcc1b07d2eceec8e051ecde1&safe_search=1&sort=relevance&tags=education,arduino&text=' + encodeURIComponent(val),
                'success': function(data) { eval(data); },
                'error': function(error) { eval(error.responseText) }
                                                        
       	});

	function jsonFlickrApi(rsp) {
        
		 var request = new ApiCall();
                        request.setData('term', val);
                        request.setData('searchResultLength', rsp.photos.photo.length);           
                        request.post();

		var s = "";

        	for (var i = 0; i < rsp.photos.photo.length; i++) {

                	var photo = rsp.photos.photo[i];
                	var thuUrl = "http://farm" + photo.farm + ".static.flickr.com/" +
                        	photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
                	var url = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
                	s +=  '<a href="' + thuUrl + '">' + '<img alt="'+ photo.title +
                        	'"src="' + thuUrl + '"/>' + '</a>';


        	}

        	$('#pictures').html(s);

		document.getElementById('pictures').onclick = function(event) {

			event = event || window.event;
    			var target = event.target || event.srcElement,
        		    link = target.src ? target.parentNode : target,
        		    options = { index: link, event: event },
        		    links = this.getElementsByTagName('a');
    			    blueimp.Gallery(links, options);

		};

	}

	$('#search').removeClass('open');

});*/

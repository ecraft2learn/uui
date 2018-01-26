$(function () {
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
});

$('#search').on('click keyup', (event) => {

	event.preventDefault();

	if (event.type === 'keyup' &&
	  	event.keyCode !== 27)
		return;
                 
        $('#videos').html('');
        $('#pictures').html('');

        var val = $('#search-input').val();
                                        
        function getRequest(searchTerm) {
                                
        	var url = 'https://www.googleapis.com/youtube/v3/search';
                var params = {
                	part: 'snippet',
                        key: 'AIzaSyCw8QUF2M9UHS-3VgFCLV9QmeEMf6H1gOY',
                        q: searchTerm
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
        
                });

        }
                                        
        getRequest(val);

        $.ajax({

        	'url': 'https://api.flickr.com/services/rest/',
                'method': 'GET',
                'data': 'method=flickr.photos.search&format=json&api_key=953e7b18fcc1b07d2eceec8e051ecde1&safe_search=1&sort=relevance&text=' + encodeURIComponent(val),
                'success': function(data) { eval(data); },
                'error': function(error) { eval(error.responseText) }
                                                        
       	});

	function jsonFlickrApi(rsp) {
        
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

});

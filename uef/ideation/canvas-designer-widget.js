function CanvasDesigner() {
    var designer = this;
    designer.iframe = null;

    var tools = {
        line: true,
        arrow: true,
        pencil: true,
        dragSingle: true,
        dragMultiple: true,
        eraser: true,
        rectangle: true,
        arc: true,
        bezier: true,
        quadratic: true,
        text: true,
        image: true,
        marker: true
    };

    var selectedIcon = 'pencil';

    function syncData(data) {
        if (!designer.iframe) return;

        designer.postMessage({
            canvasDesignerSyncData: data
        });
    }

    var syncDataListener = function(data) {};
    var dataURLListener = function(dataURL) {};
    var captureStreamCallback = function() {};
	var getPointsCallback = function() {};

    function onMessage(event) {
        if (!event.data || event.data.uid !== designer.uid) return;

        if(!!event.data.sdp) {
            webrtcHandler.createAnswer(event.data, function(response) {
                if(response.sdp) {
                    designer.postMessage(response);
                    return;
                }

                captureStreamCallback(response.stream);
            });
            return;
        }

        if (!!event.data.canvasDesignerSyncData) {
            designer.pointsLength = event.data.canvasDesignerSyncData.points.length;
            syncDataListener(event.data.canvasDesignerSyncData);
            return;
        }

        if (!!event.data.dataURL) {
            dataURLListener(event.data.dataURL);
            return;
        }
		
		if(!!event.data.points) {
			getPointsCallback(event.data.points);
			return;
		}
    }

    function getRandomString() {
        if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
            var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (var i = 0, l = a.length; i < l; i++) {
                token += a[i].toString(36);
            }
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
        }
    }

    designer.uid = getRandomString();

    designer.appendTo = function(parentNode) {
        designer.iframe = document.createElement('iframe');
        designer.iframe.src = designer.widgetHtmlURL + '?widgetJsURL=' + designer.widgetJsURL + '&tools=' + JSON.stringify(tools) + '&selectedIcon=' + selectedIcon;
        designer.iframe.style.width = '100%';
        designer.iframe.style.height = '100%';
        designer.iframe.style.border = 0;
	designer.iframe.id = 'designer-iframe';

        window.removeEventListener('message', onMessage);
        window.addEventListener('message', onMessage, false);

        parentNode.appendChild(designer.iframe);
    };

    designer.destroy = function() {
        if (designer.iframe) {
            designer.iframe.parentNode.removeChild(designer.iframe);
            designer.iframe = null;
        }
        window.removeEventListener('message', onMessage);
    };

    designer.addSyncListener = function(callback) {
        syncDataListener = callback;
    };

    designer.syncData = syncData;

    designer.setTools = function(_tools) {
        tools = _tools;
    };

    designer.setSelected = function(icon) {
        if (typeof tools[icon] !== 'undefined') {
            selectedIcon = icon;
        }
    };

    designer.toDataURL = function(format, callback) {
        dataURLListener = callback;

        if (!designer.iframe) return;
        designer.postMessage({
            genDataURL: true,
            format: format
        });
    };

    designer.sync = function() {
        if (!designer.iframe) return;
        designer.postMessage({
            syncPoints: true
        });
    };

    designer.pointsLength = 0;

    designer.undo = function(index) {
        if (!designer.iframe) return;

        designer.postMessage({
            undo: true,
            index: index || designer.pointsLength - 1 || -1
        });
    };

    designer.postMessage = function(message) {
        if (!designer.iframe) return;

        message.uid = designer.uid;
        designer.iframe.contentWindow.postMessage(message, '*');
    };

    designer.captureStream = function(callback) {
        if (!designer.iframe) return;

        captureStreamCallback = callback;
        designer.postMessage({
            captureStream: true
        });
    };
	
	designer.getPoints = function(callback) {
		if (!designer.iframe) return;
		
		getPointsCallback = callback;
		designer.postMessage({
			getPoints: true
		});
	};
	
	designer.setPoints = function(points) {
		if (!designer.iframe) return;
		
		designer.postMessage({
			setPoints: true,
			points: points
		});	
	};

    designer.widgetHtmlURL = 'widget.html';
    designer.widgetJsURL = 'widget.min.js';
}

;(function () {
  /* global $ */

  // Constants
  var defaultPortNumber = 1884

  // MQTT
  var mqttClient = null
  var editor = null
  var sketch = 'blinky'
  var server = 'raspberrypi.local:1884'

  function getParameterByName (name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    var results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

  function main () {
    $(function () {
      // Create editor
      editor = window.CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        matchBrackets: true,
        gutters: ['error-markers', 'CodeMirror-linenumbers'],
        mode: 'text/x-csrc'
      })
      editor.setSize('100%', 500)

      // Disable buttons from start
      disableButtons(true)

      // Sketch name to fetch
      sketch = getParameterByName('sketch')
      if (sketch === null) {
        sketch = 'blinky'
      }
      server = getParameterByName('server')
      if (server === null) {
        server = 'raspberrypi.local:1884'
      }
      setServer(server)

      // Verify and Upload buttons
      $('#verify').mouseup(function () { this.blur(); verify(false) })
      $('#upload').mouseup(function () { this.blur(); verify(true) })
      editor.setOption('extraKeys', {
        F5: function (cm) { verify(false) },
        F6: function (cm) { verify(true) }
      })

      // Server changed
      $('#server').change(function () { connect() })

      // Call device ready directly (this app can work without Cordova).
      onDeviceReady()
    })
  }

  function disableButtons (disable) {
    $('#verify').prop('disabled', disable)
    $('#upload').prop('disabled', disable)
  }

  function onDeviceReady () {
    connect()
  }

  function connect () {
    disconnectMQTT()
    connectMQTT()
    // showAlert('info', '', 'Connecting to MQTT ...', true)
  }

  // We need a unique client id when connecting to MQTT
  function guid () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }

  function connectMQTT () {
    var clientID = guid()
    var portNumber = defaultPortNumber
    var serverAndPort = getServer().split(':')
    if (serverAndPort.length === 2) {
      portNumber = parseInt(serverAndPort[1])
    }
    mqttClient = new window.Paho.MQTT.Client(serverAndPort[0], portNumber, clientID)
    mqttClient.onConnectionLost = onConnectionLost
    mqttClient.onMessageArrived = onMessageArrived
    var options =
      {
        userName: 'test',
        password: 'test',
        useSSL: false,
        reconnect: true,
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure
      }
    mqttClient.connect(options)
  }

  function getSource () {
    return editor.getValue()
  }

  function setSource (src) {
    return editor.setValue(src)
  }

  function getServer () {
    return $('#server').val()
  }

  function setServer (val) {
    return $('#server').val(val)
  }

  function cursorWait () {
    $('body').css('cursor', 'progress')
  }

  function cursorDefault () {
    $('body').css('cursor', 'default')
  }

  function verify (upload) {
    cursorWait()
    disableButtons(true)
    clearAlerts()
    if (upload) {
      showAlert('info', 'Compiling and uploading ...', '', false)
    } else {
      showAlert('info', 'Compiling ...', '', false)
    }

    // Select command
    var command = 'verify'
    if (upload) {
      command = 'upload'
    }

    // Generate an id for the response we want to get
    var responseId = guid()

    // Subscribe in advance for that response
    subscribe('response/' + command + '/' + responseId)

    // Construct a job to run
    var job = {
      'sketch': sketch + '.ino',
      'src': window.btoa(getSource())
    }

    // Save sketch
    publish('sketch/' + sketch, job, true)

    // Submit job
    publish(command + '/' + responseId, job)
  }

  function handleResponse (topic, payload) {
    var jobId = payload.id
    subscribe('result/' + jobId)
    unsubscribe(topic)
  }

  function handleSketch (topic, payload) {
    if (payload.sketch === (sketch + '.ino')) {
      var newSource = window.atob(payload.src)
      if (getSource() !== newSource) {
        setSource(newSource)
      }
    }
  }

  function handleResult (topic, payload) {
    var type = payload.type
    var command = payload.command
    unsubscribe(topic)
    if (type === 'success') {
      console.log('Exit code: ' + payload.exitCode)
      console.log('Stdout: ' + payload.stdout)
      console.log('Stderr: ' + payload.stderr)
      console.log('Errors: ' + JSON.stringify(payload.errors))
      clearAlerts()
      if (payload.exitCode === 0) {
        if (command === 'verify') {
          showAlert('success', 'Success!', 'No compilation errors')
        } else {
          showAlert('success', 'Success!', 'No compilation errors and upload was performed correctly')
        }
      } else {
        if (command === 'verify') {
          showAlert('danger', 'Failed!', 'Compilation errors detected: ' + payload.errors.length)
        } else {
          showAlert('danger', 'Failed!', 'Compilation errors detected: ' + payload.errors.length + '. Upload not performed')
        }
      }
      updateMarkers(editor, payload.errors)
    } else {
      showAlert('danger', 'Failed!', 'Job failed: ' + payload.message)
    }
    cursorDefault()
    disableButtons(false)
  }

  function onMessageArrived (message) {
    var payload = JSON.parse(message.payloadString)
    console.log('Topic: ' + message.topic + ' payload: ' + message.payloadString)
    handleMessage(message.topic, payload)
  }

  function onConnectSuccess (context) {
    disableButtons(false)
    showAlert('info', '', 'Connected', true)
    subscribeToSketch()
  }

  function onConnectFailure (error) {
    console.log('Failed to connect: ' + JSON.stringify(error))
    showAlert('danger', 'Connect failed!', 'Reconnecting ...', true)
  }

  function onConnectionLost (responseObject) {
    console.log('Connection lost: ' + responseObject.errorMessage)
    disableButtons(true)
    showAlert('warning', 'Connection was lost!', 'Reconnecting ...', true)
  }

  function publish (topic, payload, retained) {
    var message = new window.Paho.MQTT.Message(JSON.stringify(payload))
    message.destinationName = topic
    message.retained = !!retained
    mqttClient.send(message)
  }

  function subscribe (topic) {
    mqttClient.subscribe(topic)
    console.log('Subscribed: ' + topic)
  }

  function subscribeToSketch () {
    subscribe('sketch/' + sketch)
  }

  function unsubscribe (topic) {
    mqttClient.unsubscribe(topic)
    console.log('Unsubscribed: ' + topic)
  }

  function disconnectMQTT () {
    if (mqttClient && mqttClient.isConnected()) {
      mqttClient.disconnect()
    }
    mqttClient = null
  }

  function clearAlerts () {
    // Remove all visible alerts
    $('#alerts').empty()
  }

  function showAlert (type, title, message, fading) {
    // Clone template HTML. Type can be: 'success', 'info', 'warning', 'danger'
    var template = $('.alert-template')
    var el = template.clone()
    el.removeClass('alert-template')
    el.removeClass('hide')
    el.addClass('alert-' + type)
    // Set message, append to DOM, hook up as alert and show
    el.find('#alert-message').append('<strong>' + title + '</strong> ' + message)
    $('#alerts').append(el)
    el.alert()
    el.show()
    if (fading) {
      setTimeout(function () {
        el.alert('close')
      }, 2000)
    }
  }

  function handleMessage (topic, payload) {
    try {
      if (topic.startsWith('response/')) {
        return handleResponse(topic, payload)
      } else if (topic.startsWith('result/')) {
        return handleResult(topic, payload)
      } else if (topic.startsWith('sketch/')) {
        return handleSketch(topic, payload)
      }
      console.log('Unknown topic: ' + topic)
    } catch (error) {
      console.log('Error handling payload: ' + error)
    }
  }

  /*
   * Error marking code, the following code is copied and adapted from the lint.js
   * addon in CodeMirror, licensed MIT.
   */
  var GUTTER_ID = 'error-markers'
  var textMarkers = []

  function showTooltip (e, content) {
    var tt = document.createElement('div')
    tt.className = 'error-tooltip'
    tt.appendChild(content.cloneNode(true))
    document.body.appendChild(tt)
    function position (e) {
      if (!tt.parentNode) {
        return window.CodeMirror.off(document, 'mousemove', position)
      }
      tt.style.top = Math.max(0, e.clientY - tt.offsetHeight - 5) + 'px'
      tt.style.left = (e.clientX + 5) + 'px'
    }
    window.CodeMirror.on(document, 'mousemove', position)
    position(e)
    if (tt.style.opacity != null) {
      tt.style.opacity = 1
    }
    return tt
  }

  function rm (elt) {
    if (elt.parentNode) elt.parentNode.removeChild(elt)
  }

  function hideTooltip (tt) {
    if (!tt.parentNode) return
    if (tt.style.opacity == null) rm(tt)
    tt.style.opacity = 0
    setTimeout(function () { rm(tt) }, 600)
  }

  function showTooltipFor (e, content, node) {
    var tooltip = showTooltip(e, content)
    function hide () {
      window.CodeMirror.off(node, 'mouseout', hide)
      if (tooltip) { hideTooltip(tooltip); tooltip = null }
    }
    var poll = setInterval(function () {
      if (tooltip) {
        for (var n = node; ; n = n.parentNode) {
          if (n && n.nodeType === 11) {
            n = n.host
          }
          if (n === document.body) return
          if (!n) {
            hide()
            break
          }
        }
      }
      if (!tooltip) return clearInterval(poll)
    }, 400)
    window.CodeMirror.on(node, 'mouseout', hide)
  }

  function clearMarks (cm) {
    cm.clearGutter(GUTTER_ID)
    for (var i = 0; i < textMarkers.length; ++i) {
      textMarkers[i].clear()
    }
    textMarkers.length = 0
  }

  function makeMarker (labels, severity, multiple) {
    var marker = document.createElement('div')
    var inner = marker
    marker.className = 'error-marker-' + severity
    if (multiple) {
      inner = marker.appendChild(document.createElement('div'))
      inner.className = 'error-marker-multiple'
    }
    window.CodeMirror.on(inner, 'mouseover', function (e) {
      showTooltipFor(e, labels, inner)
    })
    return marker
  }

  function groupByLine (errors) {
    var lines = []
    var previousLine = null
    var line = null
    for (var i = 0; i < errors.length; ++i) {
      var ann = errors[i]
      if (previousLine === ann.line) {
        line.push(ann)
      } else {
        line = []
        line.push(ann)
        lines.push(line)
      }
      previousLine = ann.line
    }
    return lines
  }

  function annotationTooltip (ann) {
    var tip = document.createElement('div')
    tip.className = 'error-message-error'
    if (typeof ann.messageHTML !== 'undefined') {
      tip.innerHTML = ann.messageHTML
    } else {
      tip.appendChild(document.createTextNode(ann.message))
    }
    return tip
  }

  function updateMarkers (cm, errors) {
    // Enable mouseover?
    window.CodeMirror.on(cm.getWrapperElement(), 'mouseover', onMouseOver)

    clearMarks(cm)
    var annotations = groupByLine(errors)

    for (var line = 0; line < annotations.length; ++line) {
      var anns = annotations[line]
      if (!anns) continue

      var tipLabel = document.createDocumentFragment()
      var lineNo = null
      // Loop over all on this line number
      for (var i = 0; i < anns.length; ++i) {
        var ann = anns[i]
        lineNo = parseInt(ann.line) - 1
        tipLabel.appendChild(annotationTooltip(ann))
        textMarkers.push(cm.markText({line: lineNo, ch: 1}, {line: lineNo, ch: 3}, {
          className: 'error-mark-error',
          __annotation: ann
        }))
      }

      cm.setGutterMarker(lineNo, GUTTER_ID, makeMarker(tipLabel, 'error', anns.length > 1))
    }
  }

  function popupTooltips (annotations, e) {
    var target = e.target || e.srcElement
    var tooltip = document.createDocumentFragment()
    for (var i = 0; i < annotations.length; i++) {
      var ann = annotations[i]
      tooltip.appendChild(annotationTooltip(ann))
    }
    showTooltipFor(e, tooltip, target)
  }

  function onMouseOver (e) {
    var target = e.target || e.srcElement
    if (!/\berror-mark-/.test(target.className)) return
    var box = target.getBoundingClientRect()
    var x = (box.left + box.right) / 2
    var y = (box.top + box.bottom) / 2
    var spans = editor.findMarksAt(editor.coordsChar({left: x, top: y}, 'client'))

    var annotations = []
    for (var i = 0; i < spans.length; ++i) {
      var ann = spans[i].__annotation
      if (ann) annotations.push(ann)
    }
    if (annotations.length) popupTooltips(annotations, e)
  }

  // Call main function to initialise app.
  main()
})()

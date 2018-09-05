
/**
 * Creates the specified form elements, specifies settings for the inputs
 *
 *
 * In general any one input element needs the following keys in the object: label, input. And optionally inputSettings, if the input type needs it.
 *
 *  The following table shows the input types and if they take any further settings.
 *
 *      | Input type    | inputSettings                 |
 *      | ------------- | ----------------------------- |
 *      | select        | value, text, selected, hidden |
 *      | rating        | value, label                  |
 *      | textfield     |                               |
 *      | button        | buttonLabel, callback         |
 *      | label         | value                         |
 */




/**
 * Resets the feedback fields
 */
function clearForm(formId) {
    document.getElementById(formId).reset();
}



/**
 * Inits the creation
 * @param configuration : Object
 */
function initCreation(configuration,formId,parentDivId) {

    var feedbackElements = m_parseOptions(configuration,formId);
    document.getElementById(parentDivId).appendChild(feedbackElements);
}


/**
 * Creates the inputs and wraps them in a div.
 * @param configuration : Object
 */
function m_parseOptions(configuration,formId) {
    var el;
    el = document.createElement("div");
    el.classList.add("feedback-template");

    var form = document.createElement("form");
    form.id = formId;

    for (var i = 0; i < configuration.inputs.length; i++) {
        var wrapper = m_createComponent();
        var input = m_createInput(configuration.inputs[i]);


        if (configuration.inputs[i].label != null) {
            var label = m_createTitle(input.id, configuration.inputs[i].label);
            wrapper.appendChild(label);
        }

        wrapper.appendChild(input);
        form.appendChild(wrapper);
        el.appendChild(form);
    }
    return el;
}


/**
 * Creates and returns a component wrapper div
 */
function m_createComponent() {
    var el = document.createElement("div");
    el.classList.add("feedback-component");
    return el;
}


/**
 *
 * @param id : String - Id of element this is title/label for
 * @param title : String - The text of the label
 */
function m_createTitle(id, title) {
    var el = m_createLabel(id);
    // var el = document.createElement("label");
    el.classList.add("feedback-component-title");
    // el.htmlFor = id;
    el.textContent = title;
    return el;
}


/**
 * Creates and returns a label element
 * @param forId : String - Id of element the label is for
 */
function m_createLabel(forId) {
    var el = document.createElement("label");
    el.htmlFor = forId;
    return el;
}


/**
 * Creates and returns specified input type
 * @param configuration : Object - The input object configuration
 */
function m_createInput(configuration) {
    var val = null;
    switch(configuration.input) {
        case "select":
            val = m_createSelect(configuration);
            break;

        case "rating":
            val = m_createRatings(configuration);
            break;

        case "textfield":
            val = m_createTextfield(configuration);
            break;

        case "button":
            val = m_createButton(configuration);
            break;
    }
    return val;
}


/**
 * Creates and returns a select menu
 * @param options : Object - The input object configuration
 */
function m_createSelect(options) {
    var el;
    el = document.createElement("select");
    el.id = "sentence-select";

    for (var i = 0; i < options.inputSettings.length; i++) {
        el.appendChild(m_createSelectOptions(options.inputSettings[i]));
    }

    return el;
}


/**
 * Creates and returns option element / select menu item
 * @param options : Object - InputSettings
 */
function m_createSelectOptions(options) {
    var el;
    el = document.createElement("option");
    el.value = options.value;
    el.textContent = options.text;

    if (options.selected) {
        el.setAttribute("selected", "selected");
        el.setAttribute("disabled", "true");
    }
    if (options.hidden) {
        el.setAttribute("hidden", "true");
    }

    return el;
}


/**
 * creates and returns textfield
 * @param options : Object - The input object configuration
 */
function m_createTextfield(options) {
    var el;
    el = document.createElement("textarea");
    el.id = options.id;
    return el;
}


/**
 * Creates and returns a ratings element
 * @param options : Object - The input object configuration
 */
function m_createRatings(options) {
    var el;
    el = document.createElement("div");
    el.id = "feedback-ratings";

    for (var i = 0; i < options.inputSettings.length; i++) {
        el.appendChild(m_createRadioButton(options.inputSettings[i], i))
    }

    return el;
}


/**
 * Creates and returns a radiobutton wrapped in a label element
 * @param options : Object - InputSettings
 * @param i : int - enumerates the inputs
 */
function m_createRadioButton(options, i) {
    var el;
    el = document.createElement("input");
    el.type = "radio";
    el.name = "rating";
    el.id = "rating" + (i + 1).toString();
    el.value = options.value;
    var label = m_createRadioButtonLabel(el.id, options.label);
    label.appendChild(el);

    return label;

}


/**
 * Creates and returns label for radiobutton
 * @param id : String - The id of the input element the label is for
 * @param label : String - The text for the label
 */
function m_createRadioButtonLabel(id, label) {
    var el = m_createLabel(id);
    el.textContent = label;
    return el;
}


/**
 * Creates and returns the send feedback button
 * @param options : The input object configuration
 */
function m_createButton(options) {
    var el;
    el = document.createElement("button");
    el.id = options.inputSettings[0].btnId;
    el.textContent = options.inputSettings[0].buttonLabel;
    el.addEventListener("click", options.inputSettings[0].callback);
    return el;
}




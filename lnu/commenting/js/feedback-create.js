/**
 * This file creates the elements for the feedback window
 * It contains:
 *  - 
 * - select
 * - rating
 * - textfield
 * - button
 */


/**
 * This function initializes the feedback functionality.
 *
 *
 * createComponent():HTMLDivElement
 *   createTitle():HTMLLabelElement
 *   createInput(type):HTMLInputElement
 *   createSelect():HTMLSelectElement
 *   createRatings():HTMLDivElement
 *   createButton():HTMLButtonElement
 *   createResult():HTMLSpanElement
 */


 /**
  * Creates the specified feedback elements
  *  
  */
function createFeedback() {
    // Select menu
    var selectMenu = {
        label: "Feedback:",
        input: "select",
        inputSettings: [
            {
                value: 1,
                text: "Feedback sentence"
            },
            {
                value: 2,
                text: "Feedback sentence"
            },
            {
                value: 3,
                text: "Feedback sentence"
            },
            {
                value: 4,
                text: "Feedback sentence"
            }
        ]
    };

    // Ratings
    var ratings = {
        label: "Rating:",
        input: "rating",
        inputSettings: [
            {
                value: 1,
                label: "1"
            },
            {
                value: 2,
                label: "2"
            },
            {
                value: 3,
                label: "3"
            },
            {
                value: 4,
                label: "4"
            },
            {
                value: 5,
                label: "5"
            }
        ]
    };

    // Send button
    var sendButton = {
        label: null,
        input: "button",
        inputSettings: [
            {
                callback: onSend
            }
        ]
    };

    var settings = {
        inputs: [selectMenu, ratings, sendButton]
    };

    initCreation(settings);
}


/**
 * 
 * @param configuration : Object
 */
function initCreation(configuration) {
    console.dir(configuration);

    var feedbackElements = parseOptions(configuration);
    document.getElementById("uui-feedback").appendChild(feedbackElements);
}


/**
 * 
 * @param configuration : Object
 */
function parseOptions(configuration) {
    var el;
        el = document.createElement("div");
        el.classList.add("feedback-template");

    for (var i = 0; i < configuration.inputs; i++) {
        var wrapper = createComponent();
        var input = createInput(configuration.inputs[i]);
        var label = createTitle(configuration.inputs[i]);

            // wrapper.appendChild(createLabels(configuration.inputs[i]));
            // wrapper.appendChild(createInput(configuration.inputs[i]));
        el.appendChild(wrapper);
    }
    return el;
}


/**
 * 
 */
function createComponent() {
    var el = document.createElement("div");
        el.classList.add("feedback-component");
    return el;
}


/**
 * 
 * @param id : string
 * @param title : string
 */
function createTitle(id, title) {
    var el = document.createElement("label");
        el.classList.add("feedback-component-title");
        el.htmlFor = id;

    return el;
}


/**
 * - select
 * - rating
 * - textfield
 * - button
 * - result
 * @TODO: make this more dynamic / less hard coded.
 */
function createInput(configuration) {
    var val = null;
    switch(configuration.input) {
        case "select": 
            val = createSelect(configuration);
        break;

        case "rating":
            val = createRatings(configuration);
        break;

        case "textfield":
            val = createTextfield(configuration);
        break;

        case "button":
            val = createButton(configuration);
        break;
    }
    return val;
}


/**
 * 
 * @param {*} options 
 */
function createSelect(options) {
    var el;
    el = document.createElement("select");

    for (var i = 0; i < options.inputSettings.length; i++) {
        el.appendChild(createSelectOptions(options.inputSettings[i]));
    } 

    return el;
}


/**
 * 
 * @param options : Object
 */
function createSelectOptions(options) {
    var el;
        el = document.createElement("option");
        el.value = options.value;
        el.text = options.text;

    return el;
}


/**
 * 
 */
function createTextfield(options) {
    // @TODO
}


/**
 * 
 */
function createRatings(options) {
    var el, wrapper;
        el = document.createElement("");
}


/**
 * 
 */
function createButton(options) {

}


/**
 * 
 */
function createResult(options) {

}


/**
 * 
 */
function onSend() {

}
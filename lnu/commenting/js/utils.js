
/**
 * This function shows notification
 * @param isSuccess- boolean parameter: true or false
 * @param message - message to display
 */
function showNotification(isSuccess, message){

    var notify = Metro.notify;

    if(isSuccess){

        notify.create(message, null, {});
    }
    else{
        notify.create(message, null, {
            cls: "alert"
        });
    }
}
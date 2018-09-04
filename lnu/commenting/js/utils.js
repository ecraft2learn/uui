
/**
 * This function shows notification
 * @param isSuccess- boolean parameter: true or false
 * @param message - message to display
 */
function showNotification(isSuccess, message){
    console.log(Metro);
    if(isSuccess){
        Metro.toast.create(message, null, null, "success");

    }
    else{
        Metro.toast.create(message, null, null, "alert");
    }
}
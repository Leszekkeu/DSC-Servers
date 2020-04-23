$(function(){
    $("#login-btn-show").click(function(){
        $("#login").fadeOut();
        $("#login-cnt").delay(360).slideDown();
    })
    $("#logout").click(function(){
        firebase.auth().signOut().then(function() {
            location = "https://leszekk.eu/dsc/verify.html";
        })
    })
    $("#back-verify-btn").click(function(){
        location = "https://leszekk.eu/dsc/";
    })
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            if(phoneNumber){
                $("#login").hide();
                $("#code-cnt").hide();
                $("#add-cnt").fadeIn();
                $("#logout").fadeIn();
            }else{
                firebase.auth().signOut();
            }

        }
    });
    document.getElementById('sign-in-form').addEventListener('submit', onSignInSubmit);
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    //reset captcha
    function resetRecaptcha() {
        return window.recaptchaVerifier.render().then(function(widgetId) {
          grecaptcha.reset(widgetId);
        });
    }
    //on submit phone
    function onSignInSubmit(e){
        e.preventDefault();
        var phoneNumber = document.getElementById("phone-inpt").value;
        if(phoneNumber){
            var appVerifier = window.recaptchaVerifier;
            firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function(confirmationResult) {
                window.confirmationResult = confirmationResult;
                resetRecaptcha();
                // SMS sent.
                $("#login-cnt").fadeOut();
                $("#code-cnt").delay(360).slideDown();
            }).catch(function(error) {
                // SMS not sent
                console.error(error);
                $("#send-err").text(error);
                resetRecaptcha();
            });
        }
    }
})
$('#code-btn').click(function(){
    var code = document.getElementById("code-inpt").value;
    if (code) {
        confirmationResult.confirm(code).then(function () {
            //logged
            
        }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            $("#code-err").text("Code invalid!");
        });
    }
})
$("#add-btn").click(function(){
    var name = document.getElementById("name-inpt").value;
    if(name){
        var database = db.collection("invites").doc(name);
        database.update({
            verified: true
        })
        .then(function() {
            firebase.auth().signOut().then(function() {
                location = "https://dsc-servers.web.app/" + name;
            })
        })
        .catch(function(error) {
            $("#add-err").text("Error: Not Found!");
        });
    }
})
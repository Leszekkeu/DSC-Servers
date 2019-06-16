var invitedb;
var verified;
$(function(){
    const params = new URLSearchParams(window.location.search);
    const idparam = params.get('id');
    if(idparam){
        $("#login").hide();
        $("#general").show();
        $("#opacity").show();
        check();
    }
    $("#join-btn").click(function(){
        $("#join-btn").addClass("hide");
        $("#join-btn").fadeOut();
        $("#gc").delay(500).slideDown();
    })
    $("#login-btn-show").click(function(){
        $("#login").fadeOut();
        $("#login-cnt").delay(360).slideDown();
    })
    $("#register-btn-show").click(function(){
        $("#login").fadeOut();
        $("#register-cnt").delay(360).slideDown();
    })
    $("#reset").click(function(){
        $("#login").fadeOut();
        $("#reset-cnt").delay(360).slideDown();
    })
    //ok-btn
    $("#ok-btn").click(function(){
        location = location;
    })
    //check-btn verify
    $("#check-verify").click(function(){
        location = location;
    })
    //back login
    $("#back-login").click(function(){
        $('#login-cnt').slideUp();
        $("#login").delay(360).fadeIn();
        resetlogin();
    })
    //back register
    $("#back-register").click(function(){
        $('#register-cnt').slideUp();
        $("#login").delay(360).fadeIn();
        resetregister();
    })
    //back reset
    $("#back-reset").click(function(){
        $('#reset-cnt').slideUp();
        $("#login").delay(360).fadeIn();
        resetreset();
    })
    //show add
    $("#show-add").click(function(){
        $("#add-info").fadeOut();
        $("#add-inpts").delay(360).slideDown();
    })
    //reset password
    $("#reset-btn").click(function(){
        var resetinpt = document.getElementById("reset-inpt").value;
        auth.sendPasswordResetEmail(resetinpt).then(function() {
            document.getElementById("reset-err").innerHTML = "";
            resetreset();
            $("#reset-inpts").fadeOut();
            $("#reset-sent").delay(360).slideDown();
        }).catch(function(error) {
            document.getElementById("reset-err").innerHTML = "Error!";
        });
    })
    //verify email
    $("#send-verify").click(function(){
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
            $("#send-verify").fadeOut();
        }).catch(function(error) {
            document.getElementById("verify-err").innerHTML = "Error!";
        });
    })
    //add
    $("#add-btn").click(function(){
        var invite = document.getElementById("invite-inpt").value;
        var name = document.getElementById("name-invite-inpt").value;
        var url = document.getElementById("url-invite-inpt").value;
        if(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-zA-Z0-9]/.test(invite)){
            if(name && url){
                db.collection("invites").doc(url).set({
                    name: name,
                    invite: invite,
                    url: url
                })
                .then(function() {
                    console.log("Document successfully written!");
                    document.getElementById("add-err").innerHTML = "";
                    document.getElementById("ays").innerHTML = "Added!";
                    document.getElementById("generated-invite").innerHTML = "https://dsc-servers.web.app/" + url;
                    $("#add-inpts").slideUp();
                    $("#add-ok").delay(360).fadeIn();
                })
                .catch(function(error) {
                    document.getElementById("add-err").innerHTML = "This name is busy!";
                }); 
            }else{
                document.getElementById("add-err").innerHTML = "Error!";
            }

        }else{
            document.getElementById("add-err").innerHTML = "The link is not valid!";
        }

    })
})
var verifyCallback = function(response) {
    return new Promise(function(resolve, reject) {
        var data;
        if(response){
            data = {
                "key" : response,
                "success" : true,
            }
            if(data.success){
                location.replace(namedb);
            }
        } 
    })
}
//reset login
function resetlogin(){
    document.getElementById("email-inpt").value = "";
    document.getElementById("password-inpt").value = "";
}
//reset register
function resetregister(){
    document.getElementById("email-register").value = "";
    document.getElementById("password-register").value = "";
    document.getElementById("password2-register").value = "";
}
//reset add
function resetadd(){
    document.getElementById("invite-inpt").value = "";
    document.getElementById("name-invite-inpt").value = "";
    document.getElementById("url-invite-inpt").value = "";
}
//reset reset pass
function resetreset(){
    document.getElementById("reset-inpt").value = "";
}
// auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        const params2 = new URLSearchParams(window.location.search);
        const idparam2 = params2.get('id');
        if(!idparam2){
            verified = user.emailVerified;
            if(verified === true){
                $("#verify").hide();
                $("#show-add").show();
            }
            resetlogin()
            $("#login").hide();
            $("#login-cnt").hide();
            $("#register-cnt").hide();
            $("#logged-cnt").fadeIn();
        }   
    }
});
// register
$("#register-btn").click(function(){
    // get user info
    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;
    const password2 = document.getElementById("password2-register").value;
    if(password === password2){
        // sign up the user
        auth.createUserWithEmailAndPassword(email, password).catch(function(error) {      
            var errorMessageReg = error.message;
            document.getElementById("register-err").innerHTML = errorMessageReg;  
        }).then(() => {
            resetregister();
        });
    }
    else{
        document.getElementById("register-err").innerHTML = "Passwords are not identical!";
    }

})
//login
$("#login-btn").click(function(){
    // get user info
    const emaillogin = document.getElementById("email-inpt").value;
    const passwordlogin = document.getElementById("password-inpt").value;

    // login the user in
    auth.signInWithEmailAndPassword(emaillogin, passwordlogin).catch(function(error) {
        var errorMessage = error.message;
        document.getElementById("login-err").innerHTML = errorMessage;
    });
})
//logout
$("#logout").click(function(){
    auth.signOut();
    document.getElementById("add-err").innerHTML = "";
    resetadd();
    $("#logged-cnt").hide();
    $("#login").fadeIn();
})
function check(){
    const params3 = new URLSearchParams(window.location.search);
    const idparam3 = params3.get('id');

    var docRef = db.collection("invites").doc(idparam3);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            var data = doc.data();
            invitedb = data["invite"];
            var namedb = data["name"];
            document.getElementById("server-name").innerHTML = namedb;

            $("#opacity").fadeOut();
            $("#server-info").fadeIn();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            document.getElementById("info-err").innerHTML = "Server not found!";
            $("#opacity").fadeOut();
            $("#server-err").fadeIn();
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        $("#opacity").fadeOut();
        $("#server-err").fadeIn();
    });

}
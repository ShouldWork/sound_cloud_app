(function(){
    angular.module('musicapp')
        .service('loginService',loginService);

    function loginService($q,$firebaseArray,$firebaseAuth,$firebaseObject,$log,$window,$ionicPopup,$timeout){

        var ls = this;
        var log = $log;
        ls.signIn 	   = signIn;
        ls.signOut	   = signOut;
        ls.getTime	   = getTime;
        ls.authDataCheck = authDataCheck;
        ls.getUserSettings = getUserSettings;
        ls.loginWithEmail = loginWithEmail;
        ls.showAlert = showAlert; 
        // ls.newUserPopUp = newUserPopUp; 
        ls.updateUserDisplayName = updateUserDisplayName;

         function showAlert(title,msg) {
           var alertPopup = $ionicPopup.alert({
             title: title,
             template: msg
           });

           alertPopup.then(function(res) {
             // console.log('Thank you for not eating my delicious ice cream cone');
           });
         };

        function authDataCheck(){
            var deferred = $q.defer();
            firebase.auth().onAuthStateChanged(function(user){
                if (user){
                    deferred.resolve(user)
                }else{
                    log.error("failed")
                }
            })
            return deferred.promise;
        }
        function updateUserDisplayName(name){
            var deferred = $q.defer();
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: name
            }).then(function(){
                ls.currentUser.displayName = name;
                console.log("Update successful for " + ls.currentUser.displayName);
                deferred.resolve('successful');
            },function(error){
                console.log("error occurred: " + error.message);
                deferred.resolve('error')
            })
            return deferred.promise;
        }

        function signIn(provider){
            var deferred = $q.defer(); 
            var auth = $firebaseAuth();
            auth.$signInWithPopup(provider)
                .then(loginSuccessProvider).then(function(data){
                    ls.isLoggedIn = true; 
                    deferred.resolve(data)
                })
                .catch(loginError);
            return deferred.promise; 
        }


        function signOut(msg){
            console.log(ls.currentUser);
            user = ls.currentUser.displayName || ls.currentUser.email; 
            firebase.auth().signOut().then(function(){
                console.log(msg + " " + user);
                ls.showAlert(user + " has been logged out","You have successfully logged out, thanks us checking it out!")
            },function(error){
                console.log("An error happened " + error);
            });
        };

        function loginWithEmail(email,password) {
            // console.log(email + " and " + password)
            var deferred = $q.defer(); 
            var auth = $firebaseAuth();
            auth.$createUserWithEmailAndPassword(email,password).catch(function(error){
                if (error.code === "auth/email-already-in-use"){
                    auth.$signInWithEmailAndPassword(email,password).then(function(data){
                    console.log(data);
                    ls.currentUser = {
                        displayName: data.displayName,
                        email: data.email,
                        photoURL: null,
                        lastLogin: getTime(),
                        active: true,
                        uid: data.uid
                    }
                    deferred.resolve(data)
                    }).catch(loginError)
                    .then(function(data){
                        deferred.resolve(data);
                    })
                } else {
                    console.log("Something else!" . error);
                    deferred.resolve(error);
                };

            });
            return deferred.promise;
        }

        // function loginWithEmail(email,password){
        //     var deferred = $q.defer(); 
        //     var auth = $firebaseAuth(); 
        //     auth.$signInWithEmailAndPassword(email,password).then(function(data){
        //         console.log(data);
        //         ls.currentUser = {
        //             displayName: data.displayName,
        //             email: data.email,
        //             photoURL: null,
        //             lastLogin: getTime(),
        //             active: true,
        //             uid: data.uid
        //         }
        //         deferred.resolve(data)
        //     }).catch(function(error){
        //         console.log(error.code + ":---" + error.message)
        //         if (error.code === 'auth/user-not-found'){
        //             console.log("creating new user");
        //             auth.$createUserWithEmailAndPassword(email,password).then(loginSuccessEmail).catch(loginError);
        //         } else {
        //             deferred.resolve(error);  
        //         }
        //     });
        //     return deferred.promise; 
        // }
        
        function loginSuccessProvider(firebaseUser){
            var deferred = $q.defer();
            var userData = {};
            var user = firebaseUser.user;
            var proData = user.providerData[0];
            var ref = firebase.database().ref('users/').child(user.uid);
            ref.once('value').then(function(snapshot){
                if (!snapshot.exists()){
                    console.log("Creating new user " + proData.displayName); 
                    var newUser = $firebaseObject(ref);
                    newUser.$loaded().then(function(){
                        userData = {
                                displayName: proData.displayName,
                                email: user.email,
                                photoURL: proData.photoURL,
                                lastLogin: getTime(),
                                active: true,
                                uid: user.uid
                            };
                        user.displayName = proData.displayName; 
                        ref.set(userData);
                        ls.currentUser = {
                            name: proData.displayName,
                            email: user.email,
                            photoURL: proData.photoURL,
                            uid: user.uid
                        }
                        deferred.resolve(userData)
                    }); 
                } else {
                    var updateUser = $firebaseObject(ref);
                    updateUser.$loaded().then(function(){
                        ref.set({
                            active: true,
                            lastLogin: getTime(),
                        })
                    })
                    ls.currentUser = {
                        name: proData.displayName,
                        email: user.email,
                        photoURL: proData.photoURL,
                        uid: user.uid
                    };
                    console.log("Updating user " + proData.displayName);
                    deferred.resolve(proData);
                }
            });
            return deferred.promise; 
        }

        function loginSuccessEmail(firebaseUser){
            console.log(firebaseUser);
            var user = firebaseUser; 
            var ref = firebase.database().ref('users/').child(user.uid)
            ref.once('value').then(function(snapshot){
                if(!snapshot.exist()){
                    newUserPopUp().then(function(data){
                        console.log(data);
                    }) 
                }
            })
            // if(firebaseUser.user === undefined){
            //     var user = firebaseUser;   
            // } else {
            //     var user = firebaseUser.user;
            // }
            // var deferred = $q.defer();
            // var currentTime = getTime();
            // var	userProfile = user.uid;
            // var  ref = firebase.database().ref('users/' + userProfile);
            // setCurrentUser();
            // ls.user = $firebaseObject(ref);
            // log.info(ls.user);
            // ls.user.$loaded().then(function(){
            //     ref.set({
            //         displayName: user.displayName || ls.newUserPopUp(),
            //         email: user.email,
            //         photoURL: user.photoURL,
            //         lastLogin: getTime(),
            //         active: true,
            //         uid: user.uid
            //     }).then(function(){
            //     })
            // })
            // ls.getUserSettings()
            // deferred.resolve(user);
            // return deferred.promise;
        }

        function loginError(error) {
            ls.showAlert("Login failed!",error.message);
            // log.error("Authentication failed:", error);
        }

        // function isLoggedIn(){
        //     firebase.auth().onAuthStateChanged(function(user){
        //         if (user){
        //             setCurrentUser();
        //             return ls.isLoggedIn = true;
        //         }else{
        //             return ls.isLoggedIn = false;
        //         }
        //     });
        // }

        function getTime(){

            var date = new Date();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            var year = date.getFullYear();

            month = (month < 10 ? "0" : "") + month;
            day = (day < 10 ? "0" : "") + day;
            hour = (hour < 10 ? "0" : "") + hour;
            min = (min < 10 ? "0" : "") + min;
            sec = (sec < 10 ? "0" : "") + sec;

            dateObject = month + "/" + day + "/" + year + " " + hour + ":" + min + ":" + sec;
            return dateObject
        }

        function getUserSettings(){
            var deferred = $q.defer();
            ls.authDataCheck().then(function(user){
                var settingRef = firebase.database().ref().child('user_information/').child(user.uid);
                var objectSetting = $firebaseObject(settingRef);
                objectSetting.$loaded().then(function(){
                    var settings = objectSetting;
                    if (settings.enable_friends === undefined){
                        settingRef.set({
                                enable_friends: true,
                                show_suggest: true,
                                embed_player: true
                            })
                            .then(function(){
                                ls.settings = {
                                    enableFriends: true,
                                    showSuggest: true,
                                    embedPlayer: true
                                };
                                deferred.resolve(ls.settings)
                            })
                    } else {
                        ls.settings = objectSetting;
                        deferred.resolve(ls.settings)
                    }
                })
            });
            return deferred.promise;
        }

    }
}());

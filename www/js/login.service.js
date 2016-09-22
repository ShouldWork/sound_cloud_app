(function(){
    angular.module('musicapp')
        .service('loginService',loginService);


        function loginService($q,$firebaseArray,$firebaseAuth,$firebaseObject){
        	var ls = this;
        	ls.signIn 	   = signIn;
        	ls.signOut	   = signOut;
        	ls.getTime	   = getTime;
        	// ls.signOut();
        	ls.isLoggedIn  = isLoggedIn();
        	ls.currentUser = setCurrentUser();
            ls.authDataCheck = authDataCheck();

            console.log(getTime());

            function authDataCheck(){
                firebase.auth().onAuthStateChanged(function(user){
                    if (user){
                        console.log("user is " + user.displayName)
                    }else{
                        console.log("failed")
                    }
                })
            }

        	function setCurrentUser(){
                var user = firebase.auth().currentUser,
                    name , email, photoURL, uid;
                if (user !== null){
                    ls.currentUser = {
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        uid: user.uid,
                        today: getTime()
                    };
                    ls.isLoggedIn = true;
                    // console.log(ls.currentUser) 
                } else{
                    ls.currentUser = undefined;
                    ls.isLoggedIn = false; 
                }
        	}

        	function signIn(provider){
	            var auth = $firebaseAuth();
	            return auth.$signInWithPopup(provider)
	            	.then(loginSuccess).then(function(){
	            		ls.isLoggedIn = isLoggedIn();
	            	})
	            	.catch(loginError);
        	}

        	function signOut(msg){
                var auth = $firebaseAuth();
        		var user = firebase.auth().currentUser;
                var ref = firebase.database().ref('users/' + user.uid);
                self.user = $firebaseObject(ref);
                self.user.$loaded().then(function(){
                    ref.update({
                        logoutTime: getTime(),
                        active: false
                    })
                }).then(function(){
        		   auth.$signOut();
            	   ls.currentUser = undefined;
            	   ls.isLoggedIn = isLoggedIn();
                }, function(error){
                    console.log("An error occurred: " + error)
                })
        	}

        	function loginSuccess(firebaseUser){
        		var deferred = $q.defer();
        		var	currentTime = getTime();
        		var	user = firebaseUser.user;
        		var	userProfile = user.uid;
                var  ref = firebase.database().ref('users/' + userProfile);

                setCurrentUser();
                self.user = $firebaseObject(ref);
                console.log(self.user);
                self.user.$loaded().then(function(){
                    ref.set({
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        lastLogin: getTime(),
                        active: true
                    }).then(function(){
                        console.log("User updated!",1500)
                    })
                })
        		deferred.resolve();
        		return deferred.promise;
        	}

        	function loginError(error) {
            	console.log("Authentication failed:", error);
        	}

        	function isLoggedIn(){
                firebase.auth().onAuthStateChanged(function(user){
                    if (user){
                        setCurrentUser();
                        return ls.isLoggedIn = true;
                    }else{
                        return ls.isLoggedIn = false; 
                    }
                });
        	}

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
        }
}());
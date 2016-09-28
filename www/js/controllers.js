angular.module('musicapp.controllers', [])


.controller('ArtistCtrl', function($http,MusicService,$log,loginService,$scope) {
  var vm = this;
  var showing = false; 
  vm.getTracks = getTracks; 
  vm.searchTrack = searchTrack; 
  vm.isEnter = isEnter;
  vm.embedSong = embedSong;
  vm.streamSong = streamSong;
  vm.streamPause = streamPause; 
  vm.initCloud = MusicService.soundCloud.scInit();
  vm.mySC = MusicService.soundCloud;
  vm.user = loginService.currentUser.uid;
  vm.getUserSettings = getUserSettings;


  $scope.$on('$ionicView.enter',function(e){
    getUserSettings(); 
  });


  function getUserSettings(){
    var id = vm.user; 
    var ref = firebase.database().ref().child('user_information/');
    ref.child(id).once('value',function(snapshot){
      var data = snapshot.val();
      vm.showingWidget = data.embed_player;
    })
  } 

 function embedSong(song){
  console.log("Embed song")
     var container = document.getElementById('soundCloudWidget');
     $log.info(container);
     vm.showingWidget = true; 
     event.stopPropagation();
     vm.mySC.embedSong(song,container);
 }


 function streamSong(song){

  event.stopPropagation();
  vm.mySC.scInit();
  vm.mySC.streamSong(song);
  vm.isStreaming = true; 
 }

 function streamPause(song){
  vm.mySC.streamPause(song);
  vm.isStreaming = false; 
 }

  function isEnter(key){
    return MusicService.isEnter(key)
  }

  function searchTrack(query,key){
   if (isEnter(key)){
      vm.mySC.scInit();
      vm.mySC.searchTrack(query).then(function(tracks){
        vm.searchResults = tracks; 
      });
    }
  }
 
  function getTracks(){
      vm.mySC.scInit();
      vm.mySC.getTracks().then(function(tracks){
      vm.searchResults = tracks;
    });
  }
  getUserSettings();
   getTracks();
})

.controller('callbackCtrl',function($timeout,MusicService){
  vm = this; 
  vm.close = MusicService.close;
  vm.MusicService = MusicService; 
})

.controller('landingCtrl', function (loginService,$q,MusicService,$http,$scope, $firebaseAuth, $state, $log, $firebaseObject) {
  vm = this;
  vm.showLogin = false;
  vm.loginWithEmail = loginWithEmail;
  vm.showEmailLogin = showEmailLogin;
  vm.logout = logout;
  vm.isEnter = isEnter; 
  vm.signInProvider = signInProvider;


      function signInProvider(){
          loginService.signIn('google').then(function(data){
          $state.go('tab.artist');
        })
      }


      function isEnter(key){
        return MusicService.isEnter(key)
      }

      function showEmailLogin() {
        vm.showLogin = !vm.showLogin;
      }


        function loginWithEmail(key) {
            $log(key + " " + isEnter(key));
            if (isEnter(key)){
                var auth = $firebaseAuth();
                auth.$createUserWithEmailAndPassword(vm.email, vm.password)
                    .then(function () {
                        auth.$signInWithEmailAndPassword(vm.email, vm.password)
                            .then(loginSuccess)
                            .catch(loginError);
                    }, function (error) {
                        if (error.code === "auth/email-already-in-use") {
                            auth.$signInWithEmailAndPassword(vm.email, vm.password)
                                .then(loginSuccess)
                                .catch(loginError);
                        } else {
                            $log.error(error);
                        }
                    })
                    .catch(loginError);
            }
        }

    function logout() {
        var auth = $firebaseAuth();
        $log.log(vm.displayName + " logged out");
        auth.$signOut();
        vm.displayName = undefined;
    }
    })

    .controller('SongsCtrl', function($scope, bandsintown,$log,MusicService) {
      var song = this; 
      song.getResults = getResults;
      song.isEnter = isEnter; 

      function isEnter(key){
        return MusicService.isEnter(key)
      }
      function getResults(query,key){
        if(isEnter(key)){
          $log.info("Getting results");
          bandsintown.getBand(query).then(function(response){
             song.resultsBand = response; 
             $log.info(song.resultsBand)
          })
        }
      }

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        /*$scope.songs = songs.all();
         $scope.remove = function(songs) {
         Songs.remove(songs);
         };*/
    })

    /*.controller('SongsDetailCtrl', function($scope, $stateParams, Songs) {
     $scope.Songs = Songs.get($stateParams.songsId);
     })*/

    .controller('AccountCtrl', function($scope,loginService,$firebaseArray,$firebaseObject,$log,$state) {
      var vm = this;
      vm.getUserSettings = getUserSettings;
      vm.toggleSetting   = toggleSetting;
      vm.user            = loginService.currentUser;
      vm.signout         = signOut; 

      function signOut(){
        msg = "Signing out";
        loginService.signOut(msg);
        $state.go('landing');
      }
    
      function toggleSetting(id,setting,set){
        var user = vm.user; 
        var ref = firebase.database().ref().child('user_information/');
        console.log(user.uid)
        ref.child(id).once("value",function(snapshot){
          var data = snapshot.val();
          ref.child(id).child(setting).set(set);
        })
        console.log(vm.settings)
      }
    
      $scope.$on('$ionicView.enter',function(e){
        getUserSettings(); 
      });


      function getUserSettings(){
        var ref = firebase.database().ref().child('user_information/').child(loginService.currentUser.uid);
         vm.settings = $firebaseObject(ref);
      }
});


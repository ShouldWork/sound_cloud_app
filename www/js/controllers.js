angular.module('starter.controllers', [])

.controller('ArtistCtrl', function($http,MusicService) {
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
  vm.embededPlayer = false; 
  vm.isStreaming = false; 

 function embedSong(song){
     var container = document.getElementById('soundCloudWidget');
     vm.embededPlayer = true; 
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
   getTracks();
})

.controller('callbackCtrl',function($timeout,MusicService){
  vm = this; 
  vm.close = MusicService.close;
  vm.MusicService = MusicService; 
})

.controller('landingCtrl', function ($q,MusicService,$http,$scope, $firebaseAuth, $state, $log, $firebaseObject) {
  vm = this;
  vm.login = login;
  vm.showLogin = false;
  vm.loginWithEmail = loginWithEmail;
  vm.showEmailLogin = showEmailLogin;
  vm.logout = logout;
  vm.setupSoundCloud = MusicService.setupSoundCloud;
  vm.getTracks = MusicService.getTracks;
  vm.isEnter = isEnter; 
  // vm.showResults = showResults; 

  function isEnter(key){
    return MusicService.isEnter(key)
  }
 
  function login(provider) {
    console.log("I'm in login");
    var auth = $firebaseAuth();

    auth.$signInWithPopup(provider)
        .then(loginSuccess)
        .catch(loginError);
  }

  function showEmailLogin() {
    vm.showLogin = !vm.showLogin;
  }

  function loginWithEmail(key) {
    console.log(key + " " + isEnter(key))
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

  function loginSuccess(firebaseUser) {
    $log.log(firebaseUser);
    vm.displayName = firebaseUser.user ? firebaseUser.user.displayName : firebaseUser.email;
    vm.showLogin = false;
    vm.password = undefined;





    vm.providerUser = firebaseUser.user;
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(vm.providerUser.uid);
    vm.user = $firebaseObject(profileRef);
    $log.log(vm.user);
    $log.log(profileRef);
    vm.user.$loaded().then(function () {
      if (!vm.user.displayName) {
        $log.log("creating user...");
        profileRef.set({
          displayName: vm.providerUser.displayName,
          email: vm.providerUser.email,
          photoURL: vm.providerUser.photoURL
        }).then(function () {
          $log.log("user created.");
          $state.go('tab.artist');
        }, function () {
          $log.log("user could not be created.");
        });
      } else {
        $log.log('user already created!');
        $state.go('tab.artist');
      }
    });
  }

  function loginError(error) {
    vm.loginError = error; 
    $log.log("Authentication failed:", error);
  }

  function logout() {
    var auth = $firebaseAuth();
    $log.log(vm.displayName + " logged out");
    auth.$signOut();
    vm.displayName = undefined;
  }
})

.controller('SongsCtrl', function($scope, Songs) {
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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

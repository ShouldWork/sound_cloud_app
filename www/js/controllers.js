angular.module('musicapp.controllers', [])

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

.controller('landingCtrl', function (loginService,$q,MusicService,$http,$scope, $firebaseAuth, $state, $log, $firebaseObject) {
  vm = this;
  vm.showLogin = false;
  vm.loginWithEmail = loginWithEmail;
  vm.showEmailLogin = showEmailLogin;
  vm.logout = logout;
  vm.isEnter = isEnter; 
  vm.signInProvider = signInProvider;


  function signInProvider(){
    console.log("signing in")
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

.controller('AccountCtrl', function(loginService,$firebaseArray,$firebaseObject) {
  var vm = this;
  this.defaultSettings = {
    enableFriends: true,
    showSuggest: true,
    embedPlayer: true,
    streamPlayer: false
  };
  vm.getUserSettings = getUserSettings(); 
  // vm.settings = loginService.settings; 

  function getUserSettings(){
    loginService.getUserSettings().then(function(settings){
      vm.settings = settings; 
    });
  }
});


        // var dbSetting = $firebaseArray(settingRef);
        // console.log(dbSetting);
        // dbSetting.$loaded().then(function(){
        //   settingRef.set({
        //     enable_friends: true,
        //     show_suggest: true,
        //     embed_player: true,
        //     stream_player: false
        //   })
        // })
        // .then(function(settingRef){
        //   console.log(dbSetting[0])
        // });
    
        // When adding new infromation $add is good. For setting initial information ref.set is used
        // dbSetting.$add({
        //   enableFriends: true,
        //   showSuggest: true,
        //   embedPlayer: true,
        //   streamPlayer: false
        // })

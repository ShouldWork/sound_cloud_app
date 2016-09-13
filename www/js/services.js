angular.module('starter')

    .service('MusicService', MusicService);

function MusicService($firebaseArray) {
  var self = this;

  var ref = firebase.database().ref().child("users");

  self.users = $firebaseArray(ref);
};


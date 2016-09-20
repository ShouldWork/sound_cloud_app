angular.module('starter').service('MusicService',MusicService);

function MusicService($firebaseArray,$http,$q){
  var service = this;
  var clientid = 'b23455855ab96a4556cbd0a98397ae8c'
  service.getTracks = getTracks;
  service.getUser   = getUser;
  service.close 	  = close;
  service.setupSoundCloud = setupSoundCloud;
  service.searchTrack = searchTrack; 
  service.isEnter = isEnter; 
  service.playSong = playSong;

  function playSong(song){
  	
  	SC.initialize({
  		client_id: clientid
  	});
  	SC.stream('/tracks/' + song).then(function(player){
    	player.play();
  	});
  }


  function isEnter(key){
    if (key !== undefined){
     return (key.which == 13) ? true : false
    } else {
      return true;
    }
  }




  function searchTrack(query){
  	var deferred = $q.defer();
  	SC.initialize({
  		client_id: clientid
  	});
  	SC.get('/tracks',{
  		limit: 10,
  		linked_partioning: 1,
  		q:query
  		// title: query

  	})
  	.then(function(tracks){
  		deferred.resolve(tracks);
  	});
  	return deferred.promise;
  }

  function setupSoundCloud(){
    SC.initialize({
      client_id: 'a8899b413fa9931c7bf9b07305acf27f',
      redirect_uri: 'http://localhost:8100/#/callback'
    });

    SC.connect(function(response){
      sc.get("/me",function(response){
        var data={};
        console.log(response)
      })
    }).then(function(){
      return SC.get('/me');
    }).then(function(me){
      alert('Hello, ' + me.username);
    });
  }

  function getTracks() {
    var deferred = $q.defer();
    SC.initialize({
      client_id: clientid
    });
    var page_size = 20;
    SC.get('/tracks', {
      limit: page_size, linked_partitioning: 1
    }).then(function(tracks) {
      deferred.resolve(tracks.collection);
    });
    return deferred.promise;
  };

  function getUser(userID){
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: 'http://api.soundcloud.com/users/' + userID + '.json?client_id=' + clientid
    }).then(function(response){
      deferred.resolve(response.data);
    });
    return deferred.promise;
  }

  function close(){
    console.log("Started")
    window.setTimeout(window.opener.SC.connectCallback, 1);
  }


}






// angular.module('starter')

//     .service('MusicService', MusicService);

// function MusicService($firebaseArray) {
//   var self = this;

//   var ref = firebase.database().ref().child("users");

//   self.users = $firebaseArray(ref);

//   self.setupSoundCloud = setupSoundCloud; 


//   function setupSoundCloud(){
//   	SC.initialize({
//   		client_id: 'a8899b413fa9931c7bf9b07305acf27f',
//   		redirect_uri: 'http://localhost:8100/#/callback'
//   	});

//   	SC.connect(function(response){
//   		sc.get("/me",function(response){
//   			var data={};
//   			console.log(response)
//   		})
//   	}).then(function(){
//   		return SC.get('/me');
//   	}).then(function(me){
//   		alert('Hello, ' + me.username);
//   	});
//   }

//     function soundCloudData(track){
//     var clientid = 'b23455855ab96a4556cbd0a98397ae8c'
//     $http({
//       method: 'GET',
//       url: 'http://api.soundcloud.com/tracks/'+track+'.json?client_id='+clientid
//     }).
//     success(function (data){
//       console.log(data)
//       vm.band = data.user.username; 
//       vm.bandUrl = data.user.permalink_url;
//       vm.title = data.title;
//       vm.trackUrl - data.permalink_url;
//       vm.albumArt = data.artwork_url.replace("large","t500x500")
//       vm.wave = data.waveform_url;
//       vm.stream = data.stream_url + '?client_id=' + clientid;
//     })
//   }


// };




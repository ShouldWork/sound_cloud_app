angular.module('starter').service('MusicService',MusicService);

function MusicService($firebaseArray,$http,$q){
	var service = this; 
	var clientid = 'b23455855ab96a4556cbd0a98397ae8c'
	// service.getTracks = getTracks; 
	service.getUser   = getUser; 
	service.close 	  = close;
  service.setupSoundCloud = setupSoundCloud; 
  service.searchTrack = searchTrack; 
  service.isEnter = isEnter; 
  // service.isStreaming = false; 
  // service.playSong = playSong;

  service.soundCloud = {
    scInit: function(){
      return SC.initialize({
                client_id: clientid
              })
    },
     getTracks:  function(){
        var deferred =  $q.defer(),
            limit_results = 20;
        SC.get('/tracks', {
          limit: limit_results, linked_partitioning: 1
        }).then(function(tracks) {
          deferred.resolve(tracks.collection);
        });
          return deferred.promise 
    },
    embedSong: function(song,container){
        SC.oEmbed('http://api.soundcloud.com/tracks/' + song,{
           element: container,
           auto_play: true,
           maxheight: 166,
           callback: function(){
            console.log("From the call back in the embedSong")
           },
           color: '#ff3a00',
        });
    },
    streamSong: function(song){
      SC.stream('tracks/' + song).then(function(player){
        service.player = player;
        player.play();
        console.log(player)
        console.log(player._isPlaying)
      });
    },
    streamPause: function(){
        var player = service.player; 
        // player._isPlaying contains true or false for whether it's playing or not.
        // player.controller._status will show the current state of the song either paused or playing. 
        // stream info contains information about the current track
        // ie bitrate,duration,extension,issuedAt,protocol,and the url for the playing track
        player.pause();
        console.log(player._isPlaying)
    }   
  };

  function connectSoundCloud(){
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

  function isEnter(key){
    if (key !== undefined){
     return (key.which == 13) ? true : false;
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
      // bpm:120
      // title: "stressed out"

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


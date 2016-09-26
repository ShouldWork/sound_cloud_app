
(function(){
    angular.module('musicapp')
        .service('bandsintown',bandsintown);

    function bandsintown($http,$log){
    	// Simple GET request example:
	$http({
	  method: 'GET',
	  url: 'http://api.bandsintown.com/artists/Skrillex.json?app_id=musicapp_matc'
	}).then(function successCallback(response) {
		$log.info(response);
	  }, function errorCallback(response) {
	  	$log.error(response);
	  });
	}
}());

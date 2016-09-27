
(function(){
    angular.module('musicapp')
        .service('bandsintown',bandsintown);

    function bandsintown($http,$log,$q){
    	// Simple GET request example:
    var band = this; 
    band.getBand = getBand; 
    // band.resultsBand =[{
				// 	  "name": "Damian Marley",
				// 	  "image_url": "http://www.bandsintown.com/DamianMarley/photo/medium.jpg",
				// 	  "thumb_url": "http://www.bandsintown.com/DamianMarley/photo/small.jpg",
				// 	  "facebook_tour_dates_url": "http://bnds.in/jrHVeT",
				// 	  "mbid": "cbfb9bcd-c5a0-4d7c-865f-2c641c171e1c",
				// 	  "upcoming_events_count": 7,
				// 	  "tracker_count": 245345
				// 	}];
	// band.resultsVenue =[{
	// 				  "id": 4189861,
	// 				  "title": "Nas @ UB Stadium in Buffalo, NY",
	// 				  "datetime": "2011-04-29T19:00:00",
	// 				  "formatted_datetime": "Friday, April 29, 2011 at 7:00pm",
	// 				  "formatted_location": "Buffalo, NY",
	// 				  "ticket_url": "http://www.bandsintown.com/event/4189861/buy_tickets?artist=Nas",
	// 				  "ticket_type": "Tickets",
	// 				  "ticket_status": "available",
	// 				  "on_sale_datetime": "2011-03-08T10:00:00",
	// 				  "facebook_rsvp_url": "http://www.bandsintown.com/event/4189861?artist=Nas",
	// 				  "description": "2011 Block Party: featuring Kid Cudi, Damian Marley, Nas & Spec. Guest",
	// 				  "artists": [{
	// 							    "name": "Nas",
	// 							    "mbid": "cfbc0924-0035-4d6c-8197-f024653af823",
	// 							    "image_url": "http://www.bandsintown.com/Nas/photo/medium.jpg",
	// 							    "thumb_url": "http://www.bandsintown.com/Nas/photo/small.jpg",
	// 							    "facebook_tour_dates_url": "http://bnds.in/e5CP5L",
	// 							    "tracker_count": "367714"
	// 				  }],
	// 				  "venue": {
	// 				    "name": "UB Stadium",
	// 				    "place": "UB Stadium",
	// 				    "city": "Buffalo", 
	// 				    "region": "NY", 
	// 				    "country": "United States",
	// 				    "latitude": 43.0004710,
	// 				    "longitude" : -78.7802170
	// 				  }
	// 				}];
	    
	    function getBand(query){
	    	var deferred = $q.defer(); 
	    	var url = 'http://api.bandsintown.com/artists/' + query + '/events.json?api_version=2.0&app_id=musicapp_matc'


			$http({
			  method: 'GET',
			  dataType: 'jsonp',
			  url: url
			})
			.then(function successCallback(response) {
				deferred.resolve(response.data); 
			  }, function errorCallback(response) {
			  	deferred.resolve(response.statusText); 
			});
	    	return deferred.promise;
	    }

	}
}());

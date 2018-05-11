var app = angular.module('weddingApp', []);

app.filter('trustedHTML',
   function($sce) {
      return $sce.trustAsHtml;
   }
);

app.controller('bodyController', function($scope, $http) {

	//
	// init
	//

    $scope.scratch = {
        activeTab: 'infoTab', 
    };

	$http.get('data.json').then(
	    function(payload) {
     		$scope.tabs = payload.data.tabs;
        },
        function(errorPayload) {
            console.error("Could not load application data!" + errorPayload);
        }
	);


	//
	// methods
	//

    $scope.setActiveTab = function(tabId) {
        $scope.scratch.activeTab = tabId;
    };

	$scope.showHide = function(e) {
		var element = document.getElementById(e);
		if (element.classList.contains('hidden')) {
			element.classList.remove('hidden')
			element.classList.add('visible');
		} else {
			element.classList.add('hidden');
			element.classList.remove('visible')
		};
	};

	$scope.range = function(r) {
		return Array.apply(null, Array(r)).map(function (_, i) {return i;});
	};
});


app.controller('formController', function($scope, $http) {

	//
	// init
	//

	$scope.scratch = {
		currentSheet: 0,
		sheets: document.getElementsByClassName("rsvp_form_sheet")
	};

	$scope.rsvpForm = {
		adultsCount: 0,
		childrenCount: 0,
		attendeeList: []
	};


	// methods
	$scope.showSheet = function(n) {
		for (var i = 0; i < $scope.scratch.sheets.length; i++) {
		    if (i === n) {
				$scope.scratch.sheets[i].classList.add('visible');
				$scope.scratch.sheets[i].classList.remove('hidden');
			} else {
				$scope.scratch.sheets[i].classList.remove('visible');
				$scope.scratch.sheets[i].classList.add('hidden');
			};
		};
		$scope.scratch.currentSheet = n;
	};

});

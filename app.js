var app = angular.module('weddingApp', ['ngAnimate']);

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
	// app methods
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


	//
	// misc. helpers / general-use methods
	//

	$scope.range = function(r) {
		return Array.apply(null, Array(r)).map(function (_, i) {return i;});
	};

});


app.controller('formController', function($scope, $http) {
	// this is the RSVP form. it's a multi-step form whose steps are
	// determined by the 'rsvp_form_sheet' divs in html/RSVPtab.html


	//
	// init
	//

	$scope.scratch = {
		currentSheet: 0,
		sheets: document.getElementsByClassName("rsvp_form_sheet"),
		submitDisabled: false
	};


	$scope.guestList = [];


	// app methods
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

	$scope.addGuest = function() {
		var guestId = $scope.guestList.length;
		var newGuest = {
			id: guestId,
			name: null,
			type: 'adult',
			meal: 'chicken',
		};
		$scope.guestList.push(newGuest);
	};

	$scope.rmGuest = function(guestIndex) {
		$scope.guestList.splice(guestIndex,1);
	};

	$scope.validateRSVP = function() {
		// misc. user-proofing on the form
		$scope.scratch.submitDisabled = false;
        for (var i = 0; i < $scope.guestList.length; i++) {
			var guest = $scope.guestList[i];
			if (guest.type === 'under 12' && guest.meal === 'vegetarian') {
				guest.meal = null;
			};
			if (guest.meal === null) {$scope.scratch.submitDisabled = true};
			if (guest.name === null) {$scope.scratch.submitDisabled = true};
			if (guest.name === '') {$scope.scratch.submitDisabled = true};
        };		
	};

	$scope.submitSheet = function() {
		var postObj = {}
		postObj['meta'] = {
			'confirmation_email': $scope.scratch.confirmationEmail,
			'user_agent': navigator.userAgent
		};
		postObj['guests'] = $scope.guestList;

	    $http.post('/mail.py', postObj).then(
    	    function(payload) {
	            //console.info(payload.data);
				$scope.setActiveTab('infoTab');
				$scope.showHide('rsvpSuccessModal');
				for (var i = 0; i < $scope.tabs.length; i++) {
		            if ($scope.tabs[i]['id'] === 'RSVPtab') {
						$scope.tabs.splice(i,1);
					}
				}; 
        	},
    	    function(errorPayload) {
	            console.error("Could not submit guest list!" + errorPayload);
        	}
    	);

	};

});

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



});

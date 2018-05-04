var app = angular.module('weddingApp', []);

app.filter('trustedHTML',
   function($sce) {
      return $sce.trustAsHtml;
   }
);

app.controller('bodyController', function($scope) {

    $scope.scratch = {
        activeTab: 'infoTab', 
    };

    $scope.setActiveTab = function(tabId) {
        $scope.scratch.activeTab = tabId;
    };


    $scope.tabs = [
        {   'id': 'infoTab',
            'title': 'Information',
            'subtitle': 'Schedule',
            'body': 'Coming Soon!',
        },
        {
            'id': 'venuesTab',
            'title': 'Venues',
            'body': '<h3>Directions</h3><h3>Info</h3><h3>Maps</h3>',
        },
        {
            'id': 'hotelsTab',
            'title': 'Hotels',
            'body': 'Coming Soon!'
        },
        {
            'id': 'registryTab',
            'title': 'Registry',
            'body': 'Registry on <a href="https://www.amazon.com/wedding/charlotte-barnes-tim-oconnell-chicago-august-2018/registry/1CBVGHB6NKRIP">Amazon</a>',
        },
    ];

});

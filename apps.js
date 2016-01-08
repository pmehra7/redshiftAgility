var app = angular.module('redshift-agility-app', []);

app.controller("clusterDetails",['$scope', '$http', function($scope, $http, $httpProvider){ 
    
    $scope.regions = [
        { id: 'us-east-1', name: 'US East (N. Virginia)'},
        { id: 'us-west-2', name: 'US West (Oregon)'},
        { id: 'eu-west-1', name: 'EU (Ireland)'},
        { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)'},
        { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)'},
        { id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)'},
        { id: 'eu-central-1', name: 'EU (Frankfurt)'}];
    
    // We will keep VA (represent!) as default  
    $scope.select = {};
    $scope.select.selectedItem = { id: 'us-east-1', name: 'US East (N. Virginia)'};
    
    // Constructs URL to get Amazon pricing 
    $scope.$watch('selectedItem', function(newValue, oldValue) { 
        $scope.priceURL = 'https://pricing.' + newValue + '.amazonaws.com/offers/v1.0/aws/AmazonRedshift/current/index.json';
        /**$http.get($scope.priceURL)
            .success(function(result){
                $scope.pricingDetails = result;
            });
        console.log($scope.priceURL)**/ 
    }); 
    
    $scope.select.cluster = {};
    
    $scope.machines = [
        { id: 1, name: 'dc1.large', cpu: "7", memory: "15GB per node", storage: "160GB SSD", io: "moderate", price:0.25, opt:"s", max:"32"},
        { id: 2, name: 'dc1.8xlarge', cpu: "104", memory: "244GB per node", storage: "2.56TB SSD", io: "very high", price:4.8, opt:"d", max:"100"},
        { id: 3, name: 'ds2.xlarge', cpu: "13", memory: "31GB per node", storage: "2TB HDD", io: "moderate", price:0.85, opt:"s", max:"32"},
        { id: 4, name: 'ds2.8xlarge', cpu: "119", memory: "244GB per node", storage: "16TB HDD", io: "very high", price:6.8, opt:"d", max:"100"},
        { id: 5, name: 'ds1.xlarge', cpu: "4.4", memory: "15GB per node", storage: "2TB HDD", io: "moderate", price:1.25, opt:"s", max:"32"},
        { id: 6, name: 'ds1.8xlarge', cpu: "35", memory: "120GB per node", storage: "16TB HDD", io: "very high", price:10, opt:"d", max:"100"}];
    
    
    $scope.select.selectedNode = { id: 1, name: 'dc1.large', cpu: "7", memory: "15GB per node", storage: "160GB SSD", io: "moderate", price:0.25, opt:"s", max:"32" };
    
    // Constructs Regex Dynamically for use with ng-angular && 
    $scope.$watch('select.selectedNode', function(newValue, oldValue) { 
        $scope.maxNodeVal = newValue.max;
        $scope.nodePatternCheck = "/^[2-" + newValue.max + "]+$/"; 
    });
    
    $scope.mouseSwitch = false; 
    
    $scope.IsVisible = false;
    $scope.ShowHide = function () {
        //If DIV is visible it will be hidden and vice versa.
        $scope.IsVisible = $scope.IsVisible ? false : true;
    };

    $scope.dualSingleNode = [
        { id: 1, name: 'Single Node'},
        { id: 2, name: 'Multiple Node'}];
    
    $scope.dualNode = [
        { id: 2, name: 'Multiple Node'}];
    
    $scope.select.selectedType = { id: 2, name: 'Multiple Node'}; 

    $scope.select.selectedNodeCount = 2; 
    // Revert node count back to one if Single Node Type is chosen
    $scope.$watch('select.selectedType', function(newValue, oldValue) { 
        if ($scope.select.selectedType.id == 1) {
            $scope.select.selectedNodeCount = 1; 
        }
        if ($scope.select.selectedType.id == 2) {
            $scope.select.selectedNodeCount = 2; 
        }
    });
    
    $scope.encryption = [
        { id: 1, name: 'None'},
        { id: 2, name: 'KMS'},
        { id: 3, name: 'HSM'}];
    
    $scope.select.selectedEncryption = { id: 1, name: 'None'};
    
    $scope.pubAccessible = [
        { id: 1, name: 'Yes'},
        { id: 2, name: 'No'}];
    
    $scope.select.selectedPubAccessible = { id: 1, name: 'Yes'};
    
    $scope.finalResults= [];
    
    // Store form results in a list. Clear all data after every submit
    $scope.submit = function() {
        if ($scope.select) {
          $scope.finalResults= [];
          $scope.finalResults.push(this.select);
          // Make Data nice
          $scope.pretty = angular.toJson($scope.finalResults);
        }
        var headers = {
            'Access-Control-Allow-Origin' : '*',
            //'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
            'Access-Control-Allow-Methods' : 'POST, GET, PUT',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };        
        //$http.post('http://localhost:8887/form', $scope.finalResults)
        $http({
            withCredentials: false,
            method: 'POST',
            url: 'http://localhost:8007', 
            headers: {'Content-Type': 'Access-Control-Allow-Origin: *'},
            data: $scope.pretty
        });
    };
    
    $scope.filterValue = function($event){
        if(isNaN(String.fromCharCode($event.keyCode))){
            $event.preventDefault();
        }
    };
    
}])
.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers.common = 'Content-Type: application/json';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])
.directive('wjValidationError', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctl) {
      scope.$watch(attrs['wjValidationError'], function (errorMsg) {
        elm[0].setCustomValidity(errorMsg);
        ctl.$setValidity('wjValidationError', errorMsg ? false : true);
      });
    }
  };
});

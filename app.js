(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
     list: '=fndItems',
    //  badRemove: '=',
     onRemove: '&'
    }
  //  controller: FoundItemsDirectiveController,
  //  controllerAs: 'list',
  //  bindToController: true
  };

  return ddo;
}


function FoundItemsDirectiveController() {

}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService ) {

  var narrowList = this;

    var found=[];
    narrowList.errorMessage = "";

    narrowList.found = function (searchTerm) {
     var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

     promise.then(function (response) {

     var allItems = response.data.menu_items;
     var foundIndexes = [];

     found=[];
     //find the indexes of found items
     var y =0;
         for (var i = 0; i < allItems.length; i++) {
            var desc = allItems[i].description;
            //if description matches the search item
            if (desc.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                foundIndexes[y]  =i;
                y++;
              }
        }
        //filter out found items only.
        for (var z = 0; z < foundIndexes.length; z++) {
              var n = foundIndexes[z];
              //console.log("found " + allItems[n].description);
              found[z] = allItems[n];
        }

          narrowList.categories =found;

          if (z==0 || searchTerm === "")
          {
            narrowList.errorMessage = "Nothing found!!";
            narrowList.categories  ="";
          }
         else
          {
            narrowList.errorMessage = "";
          }

     })

     .catch(function (error) {
       console.log(error);
     })
   };//found function


   narrowList.removeItem = function (itemIndex) {
     console.log("removing item" + itemIndex);

       found.splice(itemIndex, 1);
  };

}


MenuSearchService.$inject = ['$q','$http', 'ApiBasePath'];
function MenuSearchService($q,$http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
  return $http.get(ApiBasePath + "/menu_items.json").then(function(foundItemsF) {

    return foundItemsF;
  });

    service.removeItem = function (itemIndex) {
      console.log("removing sitem" + itemIndex);
      items.splice(itemIndex, 1);
    };



}

/*
  service.getMatchedMenuItems = function (searchTerm) {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });
    return response;

  };//get matched menu items
*/


}//MenuSearchService






})();

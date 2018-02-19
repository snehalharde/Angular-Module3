(function() {
    'use strict'

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItems)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    function FoundItems() {
        var ddo = {
            templateUrl: 'Menulist.html',
            scope: {
                found: '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: 'menu',
            bindToController: true
        }

        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var menu = this;
        menu.itemInput = "";
        menu.searchMenuItems = function() {
            var promise1 =
                MenuSearchService.getMatchedMenuItems(menu.itemInput);
            promise1.then(function(result) {
                    menu.found = result;
                    console.log("result = " + result)
                })
                .catch(function(error) {
                    console.log(error);
                });
        };



        menu.removeItem = function(itemIndex) {
            return MenuSearchService.removeItem(itemIndex);
        }
    }


    MenuSearchService.$inject = ['$http', 'ApiBasePath'];

    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        var found = [];

        service.getMatchedMenuItems = function(searchTerm) {
            //reach out to server using $http to retrieve list of all menu items
            var response = $http({
                    method: 'GET',
                    url: ApiBasePath + '/menu_items.json',
                })
                .then(function(response) {

                    for (var i = 0; i < response.data.menu_items.length; i++) {

                        if (response.data.menu_items[i].description.toLowerCase().indexOf(searchTerm) !== -1) {
                            found.push(response.data.menu_items[i]);
                        }

                    }

                    return found;
                })
                .catch(function(error) {
                    return error;
                });
            return response;
        }
        
        service.removeItem = function(itemIndex) {
            found.splice(itemIndex, 1);
            return found;
        };

    }


})();
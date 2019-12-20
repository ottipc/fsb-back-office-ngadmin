
// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
var myApp = angular.module('myApp', ['ng-admin']);

//AUTH
myApp.config(function (RestangularProvider) {
    console.log("Set Token");
    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyNywiZW1haWwiOiJqaGFuaWhhc2hlbWlAZ21haWwuY29tIiwiaWF0IjoxNDkwNDU1MTU4fQ.5SkXcqORLxFGU-hlak3GLW6rkybOECX5dJz4LlGoZmM';
    RestangularProvider.setDefaultHeaders({'Authorization': 'Bearer ' + token});
});


myApp.config(function (RestangularProvider) {
    console.log("get all Sports");
    //RestangularProvider.fetchAll('sports');
});




myApp.directive('uploader', ['$http', '$q', 'notification', '$state', function ($http, $q, notification, $state) {
    return {
        restrict: 'E',
        scope: {
            prefix: '&',
            suffix: '&'
        },
        link: function ($scope) {
            $scope.uploaded = false;
            $scope.onFileSelect = function ($files) {
                if (!$files || !$files.length) return;
                console.log("Setting file : " + $files[0]);
                $scope.file = $files[0];
            };
            $scope.upload = function () {
                if (!$scope.file) return;
                notification.log("upload Picture");

                var pattern = /^#\/[a-zA-Z0-9\-_]+\/(edit|show)\/([0-9a-fA-F]+)$/;
                var data = location.hash.match(pattern);
                console.log("Data : " + data);

                if (!data) return alert("Unable to detect the entry ID");

                var id = data[2];
                //var URL = $scope.prefix() + id + $scope.suffix();
                URL = "https://findsomebuddy.de/api/v2/venues/"+id+"/photos";
                notification.log("URL : " + URL);
                var fd = new FormData();
                notification.log("Appending File : " + $scope.file);

                fd.append('file', $scope.file);
                var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAyNywiZW1haWwiOiJqaGFuaWhhc2hlbWlAZ21haWwuY29tIiwiaWF0IjoxNDkwNDU1MTU4fQ.5SkXcqORLxFGU-hlak3GLW6rkybOECX5dJz4LlGoZmM';
                return $http.post(URL, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined, 'Authorization': 'Bearer ' + token}
                })
                    .then(function (res) {
                        $scope.file = null;
                        $state.reload();
                        notification.log(res.data.error);
                        notification.log(res.data.error || "Image uploaded", { addnCls: 'humane-flatty-success' });
                    })
                    .catch(function (res) {
                        notification.log(res.data.error);
                        notification.log(res.data.error || "Could not upload", { addnCls: 'humane-flatty-error' });
                    });
            };
        },
        template: `<div class="row">
				<style>
					.uploader {
						color: #333;
						background-color: #f7f7f7;
						display: inline-block;
						margin-bottom: 0;
						font-weight: 400;
						text-align: center;
						vertical-align: middle;
						touch-action: manipulation;
						background-image: none;
						cursor: pointer;
						border: 1px dashed #ccc;
						white-space: nowrap;
						padding: 24px 48px;
						font-size: 14px;
						line-height: 1.42857;
						border-radius: 4px;
						-webkit-user-select: none;
						-moz-user-select: none;
						-ms-user-select: none;
						user-select: none;
					}
					.uploader.bg-success {
						background-color: #dff0d8;
					}
					.uploader.bg-danger {
						background-color: #f2dede;
					}
				</style>
				<div class="col-md-4" ng-hide="file">
					<div class="uploader"
						ngf-drop
						ngf-select
						ngf-drag-over-class="{pattern: 'image/*', accept:'bg-success', reject:'bg-danger', delay:50}"
						ngf-pattern="image/*"
						ngf-max-total-size="'1MB'"
						ngf-change="onFileSelect($files)"
						ngf-multiple="false">Select an image or drop it here</div>
				</div>
				<div class="col-md-4" ng-show="file">
					<button type="button" class="btn btn-success btn-lg" ng-click="upload()">
						<span class="glyphicon glyphicon-upload"></span> Upload the image
					</button>
				</div>
		</div>`
    };
}]);





myApp.directive('addsports', ['$http', '$q', 'notification', '$state', function ($http, $q, notification, $state) {
    return {
        restrict: 'E',
        scope: {post: '&'},
        send: function (scope) {

            var id = data[1];
            notification.log("ficken");
        },
        template: '<a class="btn btn-default" ng-click="send()">Add sport to venue</a>'
    };
}]);




myApp.config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {

        if(operation == 'put') {
            delete params.photos;
        }

        if (operation == 'getList' && what == 'entityName') {
            params.offset = (params._page - 1) * params._perPage;
            params.limit = params._perPage;
            delete params._page;
            delete params._perPage;
        }
        return { params: params };
    });
}]);
// // declare a function to run when the module bootstraps (during the 'config' phase)

//myApp.directive('approveReview', require('./js/approveReview'));



myApp.config(['NgAdminConfigurationProvider', function (nga) {
//     // create an admin application
    var admin = nga.application('FSB ADMIN FOETZCHEN 5').baseApiUrl('https://findsomebuddy.de/api/v2/');
    var sport = nga.entity('sports');
    var sportae = nga.entity('sports');
    function sendPostController(nga) {

        nga.entity('sports').forEach(myFunction);

        function myFunction(item, index) {
            alert("Bumsen");
        }
    };
  //  sendPostController();


// ******************** VENUES *******************************************
    var venue = nga.entity('venues');
    venue.creationView().fields([
        nga.field('name'),
        nga.field('contact'),
        nga.field('user_id'),
        nga.field('comment'),
        nga.field('place_id'),
        nga.field('lat'),
        nga.field('lng'),
        nga.field('coordinates'),
        nga.field('address'),
        nga.field('type', 'choice').choices([
            {value: null, label: 'not yet decided'},
            {value: 'private', label: 'private'},
            {value: 'public', label: 'public'}
        ]),
        nga.field('location_type'),
        nga.field('floor_coverings'),
        nga.field('showers'),
        nga.field('cleanless'),
        nga.field('published'),
        nga.field('created_at'),
        nga.field('updated_at'),
        nga.field('distance'),
        nga.field('widgeturl'),
        nga.field('website_url')
    ]);

    venue.editionView().fields([
        nga.field('id'),
        nga.field('name'),
        nga.field('contact'),
        nga.field('user_id'),
        nga.field('comment'),
        nga.field('place_id'),
        nga.field('lat'),
        nga.field('lng'),
        nga.field('coordinates'),
        nga.field('address'),
        nga.field('type', 'choice').choices([
            {value: null, label: 'not yet decided'},
            {value: 'private', label: 'private'},
            {value: 'public', label: 'public'}
        ]),
        nga.field('location_type'),
        nga.field('floor_coverings'),
        nga.field('showers'),
        nga.field('cleanless'),
        nga.field('published'),
        nga.field('created_at'),
        nga.field('updated_at'),
        nga.field('distance'),
        nga.field('widgeturl'),
        nga.field('website_url'),

        nga.field('upload', 'template')
            .label('Upload image')
            .template(`<uploader prefix="'/api/v2/photos/'" suffix="'/file'"/>`),

        //nga.field('photos', 'template')
        //    .template((entry) => `<img src="${entry.values.photos[0].path}" /><div>${entry.values.photos}</div>`)
        //nga.field('photos', 'template')
        //    .template((entry) => `<tr ng-repeat="entry in entry.values.photos track by entry.identifierValue"><span>ahi</span>
        //.`),
        //nga.field('photos', 'template').template('<img src="{{entry.values.photos[0].path}}" height="42" width="42"/><span>{{photos}}</span>'),
        //    ']);'),
        //nga.field('photos'),

        nga.field('photos', 'template').template('<span ng-repeat="(key, value) in entry.values.photos"> ' +
            '' +
            '<a href="{{value.path}}"><img src="{{value.path}}" height="42" width="42"alt="" title=""/></a>' +
            '' +
            '</span>'),

        /*nga.field('sports', 'template').template('<span ng-repeat="(key, value) in entry.values.sports"> ' +
            '' +
            '<ul><li height="42" width="42"alt="" title=""</li>{{value.name}}</ul>' +
            '' +
            '</span>'),*/
        nga.field('sports', 'embedded_list')
            .targetEntity(nga.entity('sports'))
            .targetFields([
                nga.field('id'),
                nga.field('name')
            ]).sortField('name')



        /*nga.field('sports', 'referenced_list') // Define a 1-N relationship with the (embedded) comment entity
            .targetEntity(nga.entity('sports'))
            .targetReferenceField('id')
            .targetFields([ // which comment fields to display in the datagrid / form
                nga.field('id')
            ])
            .sortField('id')
            .sortDir('DESC')
            .listActions(['edit']),*/

        /*nga.field('', 'template').label('Add Sport').template('<span><ma-create-button default-values="search" entity-name="sports" size="sm" label="Create Sport"></ma-create-button></span>'),
        nga.field('photos').editable(false)*/
    ]);

//venue.editionView().fields(venue.creationView().fields());
    venue.editionView().actions(['show', 'list', 'delete', 'create', 'export']);
    // By default, it is:
    //venue.editionView().actions(['filter', 'create', 'export']);


    venue.listView().perPage(30).fields([
        nga.field('id').isDetailLink(true),
        nga.field('name'),
        nga.field('contact'),
        nga.field('user_id'),
        nga.field('comment'),
        nga.field('place_id'),
        nga.field('lat'),
        nga.field('lng'),
        nga.field('coordinates'),
        nga.field('address'),
        nga.field('type'),
        nga.field('location_type'),
        nga.field('floor_coverings'),
        nga.field('showers'),
        nga.field('cleanless'),
        nga.field('published'),
        nga.field('created_at'),
        nga.field('updated_at'),
        nga.field('distance'),
        nga.field('widgeturl'),
        nga.field('website_url')
    ]);

    venue.showView().fields([
        nga.field('showers'),
        nga.field('cleanless'),
        nga.field('published'),
        nga.field('created_at'),
        nga.field('updated_at')
    ]);
    admin.addEntity(venue);


    // ******************** SPORT *******************************************
    sport.listView().fields([
        nga.field('id').isDetailLink(true),
        nga.field('name'),
        nga.field('type'),
        nga.field('maxPlayer'),
        nga.field('minPlayer'),
    ]);

    sport.showView().fields([
        nga.field('id'),
        nga.field('name'),
        nga.field('type'),
        nga.field('maxPlayer'),
        nga.field('minPlayer'),
    ]);


    sport.creationView().fields([
        nga.field('id'),
        nga.field('name'),
        nga.field('type'),
        nga.field('maxPlayer'),
        nga.field('minPlayer'),
    ]);

    sport.editionView().fields([
        nga.field('id'),
        nga.field('name'),
        nga.field('type'),
        nga.field('maxPlayer'),
        nga.field('minPlayer'),
    ]);


    admin.addEntity(sport);

    // ******************** UserGAMES *******************************************
    var game = nga.entity('games');
    game.creationView().fields([
        nga.field('user_id'),
        nga.field('title'),
        nga.field('timeFrom'),
        nga.field('timeTo'),
        nga.field('duration'),
        nga.field('place_id'),
        nga.field('level'),
        nga.field('maxLevel'),
        nga.field('minLevel'),
        nga.field('repitation'),
        nga.field('location_name'),
        nga.field('sport_id'),
        nga.field('location'),
        nga.field('lang'),
        nga.field('lat'),
        nga.field('status'),
        nga.field('description'),
        nga.field('totalPlayerCount'),
        nga.field('minPlayerCount'),
        nga.field('maxPlayerCount'),
        nga.field('created_at')
    ]);

    game.editionView().fields([
        nga.field('user_id'),
        nga.field('title'),
        nga.field('timeFrom'),
        nga.field('timeTo'),
        nga.field('duration'),
        nga.field('place_id'),
        nga.field('level'),
        nga.field('maxLevel'),
        nga.field('minLevel'),
        nga.field('repitation'),
        nga.field('location_name'),
        nga.field('sport_id'),
        nga.field('location'),
        nga.field('lang'),
        nga.field('lat'),
        nga.field('status'),
        nga.field('description'),
        nga.field('totalPlayerCount'),
        nga.field('minPlayerCount'),
        nga.field('maxPlayerCount'),
        nga.field('created_at')
    ]);
    game.listView().perPage(10).fields([
        nga.field('user_id'),
        nga.field('title'),
        nga.field('timeFrom'),
        nga.field('timeTo'),
        nga.field('duration'),
        nga.field('place_id'),
        nga.field('level'),
        nga.field('maxLevel'),
        nga.field('minLevel'),
        nga.field('repitation'),
        nga.field('location_name'),
        nga.field('sport_id'),
        nga.field('location'),
        nga.field('lang'),
        nga.field('lat'),
        nga.field('status'),
        nga.field('description'),
        nga.field('totalPlayerCount'),
        nga.field('minPlayerCount'),
        nga.field('maxPlayerCount'),
        nga.field('created_at')
    ]);

    admin.addEntity(game);

    nga.configure(admin);
}]);

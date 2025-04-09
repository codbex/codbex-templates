angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-templates/gen/codbex-templates/api/Templates/DocumentTemplateService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, EntityService) => {
		const Dialogs = new DialogHub();
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'DocumentTemplate Details',
			create: 'Create DocumentTemplate',
			update: 'Update DocumentTemplate'
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-templates-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'Templates' && e.view === 'DocumentTemplate' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: action.label,
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-templates.Templates.DocumentTemplate.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsType = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-templates.Templates.DocumentTemplate.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = data.entity;
				$scope.optionsType = data.optionsType;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-templates.Templates.DocumentTemplate.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsType = data.optionsType;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-templates.Templates.DocumentTemplate.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = data.entity;
				$scope.optionsType = data.optionsType;
				$scope.action = 'update';
			});
		}});

		$scope.serviceType = '/services/ts/codbex-number-generator/gen/codbex-number-generator/api/Settings/NumberService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-templates.Templates.DocumentTemplate.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-templates.Templates.DocumentTemplate.clearDetails' , data: response.data });
				Dialogs.showAlert({
					title: 'DocumentTemplate',
					message: 'DocumentTemplate successfully created',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'DocumentTemplate',
					message: `Unable to create DocumentTemplate: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-templates.Templates.DocumentTemplate.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-templates.Templates.DocumentTemplate.clearDetails', data: response.data });
				Dialogs.showAlert({
					title: 'DocumentTemplate',
					message: 'DocumentTemplate successfully updated',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'DocumentTemplate',
					message: `Unable to create DocumentTemplate: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-templates.Templates.DocumentTemplate.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: 'Description',
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createType = () => {
			Dialogs.showWindow({
				id: 'Number-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshType = () => {
			$scope.optionsType = [];
			$http.get('/services/ts/codbex-number-generator/gen/codbex-number-generator/api/Settings/NumberService.ts').then((response) => {
				$scope.optionsType = response.data.map(e => ({
					value: e.Id,
					text: e.Type
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Type',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};

		//----------------Dropdowns-----------------//	
	});
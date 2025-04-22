angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-templates/gen/codbex-templates/api/Settings/DocumentTemplateService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, EntityService) => {
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

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsType = params.optionsType;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-templates.Settings.DocumentTemplate.entityCreated', data: response.data });
				Dialogs.showAlert({
					title: 'DocumentTemplate',
					message: 'DocumentTemplate successfully created',
					type: AlertTypes.Success
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = `Unable to create DocumentTemplate: '${message}'`;
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-templates.Settings.DocumentTemplate.entityUpdated', data: response.data });
				Dialogs.showAlert({
					title: 'DocumentTemplate',
					message: 'DocumentTemplate successfully updated',
					type: AlertTypes.Success
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = `Unable to update DocumentTemplate: '${message}'`;
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceType = '/services/ts/codbex-number-generator/gen/codbex-number-generator/api/Settings/NumberService.ts';
		
		$scope.optionsType = [];
		
		$http.get('/services/ts/codbex-number-generator/gen/codbex-number-generator/api/Settings/NumberService.ts').then((response) => {
			$scope.optionsType = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Type
				}
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Type',
				message: `Unable to load data: '${message}'`,
				type: AlertTypes.Error
			});
		});

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: 'Description',
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'DocumentTemplate-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});
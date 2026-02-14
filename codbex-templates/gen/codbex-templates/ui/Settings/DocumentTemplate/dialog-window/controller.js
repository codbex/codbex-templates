angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-templates/gen/codbex-templates/api/Settings/DocumentTemplateController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'DocumentTemplate successfully created';
		let propertySuccessfullyUpdated = 'DocumentTemplate successfully updated';

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

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-templates:codbex-templates-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-templates:codbex-templates-model.defaults.formHeadSelect', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-templates:codbex-templates-model.defaults.formHeadCreate', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-templates:codbex-templates-model.defaults.formHeadUpdate', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-templates:codbex-templates-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-templates:codbex-templates-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)' });
		});

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
				Notifications.show({
					title: LocaleService.t('codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-templates:codbex-templates-model.messages.error.unableToCreate', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)', message: message });
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
				Notifications.show({
					title: LocaleService.t('codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-templates:codbex-templates-model.messages.error.unableToUpdate', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceType = '/services/ts/codbex-number-generator/gen/codbex-number-generator/api/Settings/NumberController.ts';
		
		$scope.optionsType = [];
		
		$http.get('/services/ts/codbex-number-generator/gen/codbex-number-generator/api/Settings/NumberController.ts').then((response) => {
			$scope.optionsType = response.data.map(e => ({
				value: e.Id,
				text: e.Type
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Type',
				message: LocaleService.t('codbex-templates:codbex-templates-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
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
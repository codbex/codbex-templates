angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-templates/gen/codbex-templates/api/Settings/DocumentTemplateController.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete DocumentTemplate? This action cannot be undone.',
			deleteTitle: 'Delete DocumentTemplate?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-templates:codbex-templates-model.defaults.yes');
			translated.no = LocaleService.t('codbex-templates:codbex-templates-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-templates:codbex-templates-model.defaults.deleteTitle', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)' });
			translated.deleteConfirm = LocaleService.t('codbex-templates:codbex-templates-model.messages.deleteConfirm', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)' });
		});

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataLimit = 20;

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-templates-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'Settings' && e.view === 'DocumentTemplate' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'Settings' && e.view === 'DocumentTemplate' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-templates.Settings.DocumentTemplate.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-templates.Settings.DocumentTemplate.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-templates.Settings.DocumentTemplate.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			$scope.dataPage = pageNumber;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				let request;
				if (filter) {
					if (!filter.$filter) {
						filter.$filter = {};
					}
					filter.$filter.offset = offset;
					filter.$filter.limit = limit;
					request = EntityService.search(filter);
				} else {
					request = EntityService.list(offset, limit);
				}
				request.then((response) => {
					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE'),
						message: LocaleService.t('codbex-templates:codbex-templates-model.messages.error.unableToLF', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE'),
					message: LocaleService.t('codbex-templates:codbex-templates-model.messages.error.unableToCount', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.showWindow({
				id: 'DocumentTemplate-details',
				params: {
					action: 'select',
					entity: entity,
					optionsType: $scope.optionsType,
				},
				closeButton: true,
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'DocumentTemplate-filter',
				params: {
					entity: $scope.filterEntity,
					optionsType: $scope.optionsType,
				},
				closeButton: true,
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'DocumentTemplate-details',
				params: {
					action: 'create',
					entity: {},
					optionsType: $scope.optionsType,
				},
				closeButton: false,
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'DocumentTemplate-details',
				params: {
					action: 'update',
					entity: entity,
					optionsType: $scope.optionsType,
				},
				closeButton: false,
			});
		};

		$scope.deleteEntity = (entity) => {
			let id = entity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}]
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then((response) => {
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-templates.Settings.DocumentTemplate.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE'),
							message: LocaleService.t('codbex-templates:codbex-templates-model.messages.error.unableToDelete', { name: '$t(codbex-templates:codbex-templates-model.t.DOCUMENTTEMPLATE)', message: message }),
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
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

		$scope.optionsTypeValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsType.length; i++) {
				if ($scope.optionsType[i].value === optionKey) {
					return $scope.optionsType[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	});
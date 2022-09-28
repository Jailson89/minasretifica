// Include app dependency on ngMaterial
var Clientes = angular.module('Clientes', ['ngMaterial', 'ngMessages']);
			
Clientes.controller("ClientesController", ['$scope','$http', '$mdDialog', function($scope, $http, $mdDialog) {
    var vm = $scope;
    vm.status = false;
    vm.controller = this;
    vm.customFullscreen = false;

    vm.buscarClientes = function(){

        $http.get('http://localhost/oficina/clientes', {}).then(function(resposta){

            vm.clientes = resposta.data;

        }, function(erro){

            alert(erro);

        });

    }
    

    vm.buscarClientes();

    vm.inserirCliente = function (cliente){
        $http({
            url: 'http://localhost/oficina/clientes/',
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            isArray: false,
            data: cliente
        })
        .then(function(response) {
                console.log('Cliente salvo');
        }, 
        function(response) { // optional
            console.log('Erro ao salvar Cliente');
        });

    };
   
    vm.atualizarCliente = function (){

        alert('Editando cliente');

    };

        
    vm.deletar = function(id) {
        var idCliente = id;
        var confirm = $mdDialog.confirm()
        .title('Tem certeza que deseja excluir o cliente?')
        .textContent('Todas as informações relacionadas serão perdidas.')
        .ariaLabel('Deletar')
        .targetEvent(id)
        .ok('Sim')
        .cancel('Cancelar');

        $mdDialog.show(confirm).then(function () {
            $http({
                url: 'http://localhost/oficina/clientes/',
                method: "DELETE",
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin':'http://localhost/minasretifica/clientes/',
                    'Access-Control-Allow-Methods':'DELETE',
                    'Access-Control-Allow-Headers':'X-Requested-With,Content-Type',
                    'Authorization':'Bearer AADDFFKKKLLLL'
                },
                isArray: false,
                data: id
            })
            .then(function(response) {
                    console.log('Cliente salvo');
            }, 
            function(response) { // optional
                console.log('Erro ao salvar Cliente');
            }); 
        })
    };

    function DialogController($scope, $mdDialog) {
        
        $scope.cliente ={nome:'Jailson Alves Correia', telefone:'27981720628', cpf:'05835409702', endereco: 'Rua Juscelino Kubitscheck Oliveira'};

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.salvar = function (cliente) {

            vm.inserirCliente(cliente);
            $mdDialog.hide();

        };
        $scope.maskTelefone = function(v) {

            if( v != undefined)
            {
                let r = v.replace(/\D/g, "");
                r = r.replace(/^0/, "");

                if (r.length > 10) {
                    r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
                } else if (r.length > 7) {
                    r = r.replace(/^(\d\d)(\d{5})(\d{0,4}).*/, "($1) $2-$3");
                } else if (r.length > 2) {
                    r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
                } else if (v.trim() !== "") {
                    r = r.replace(/^(\d*)/, "($1");
                }
                $scope.cliente.telefone=r;
            }
        }
    }

    vm.showAdvanced = function (ev) {
        $mdDialog.show({
            
            templateUrl: 'dialog.html',
            controller: DialogController,
            
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application to prevent interaction outside of dialog
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: vm.customFullscreen

        }).then(function (answer) {
                vm.status = 'You said the information was "' + answer + '".';
            }, function () {
                vm.status = 'You cancelled the dialog.';
        });
    };
}]);
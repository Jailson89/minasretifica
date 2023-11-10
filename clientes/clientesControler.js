// Include app dependency on ngMaterial
var Clientes = angular.module('Clientes', ['ngMaterial', 'ngMessages']);
			
Clientes.controller("ClientesController", ['$scope','$http', '$mdDialog', '$mdToast', '$log', function($scope, $http, $mdDialog, $mdToast, $log) {
    var vm = $scope;
    vm.status = false;
    vm.controller = this;
    vm.customFullscreen = false;
    vm.clientes = [];
    
    vm.showSimpleToast = function(mensagem) {
        $mdToast.show(
            $mdToast.simple()
            .textContent(mensagem)
            .position('top right')
            .hideDelay(4000)
        );
    };

    vm.limparListaClientes = function (){
        console.log('limpar inicio', vm.clientes);
        
        while(vm.clientes.length > 0)
        vm.clientes.pop()
        vm.clientes = [];
    //vm.clientes.splice(0, quantidade);
        console.log('limpar fim', vm.clientes);

    };

    vm.buscarClientes = function(){

        $http.get('http://localhost/oficina/clientes', {}).then(function(resposta){
           
            vm.limparListaClientes();
            angular.forEach(resposta.data, function(value) {
                vm.clientes.push(value);
            });

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
                'Content-Type': 'application/json; charset=UTF-8'
            },
            isArray: false,
            data: cliente
        }).then(function(response){
            vm.showSimpleToast('Cliente salvo com sucesso!');
            vm.buscarClientes();
            $mdDialog.hide();
			window.location.reload();
        }, 
        function(response) { // optional
            $mdDialog.hide();
        });

    };
   
    vm.atualizarCliente = function (){
        alert('Editando cliente');
    };

    vm.deletar = function(id) {
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
                vm.showSimpleToast('Cliente excluído sucesso!');
                vm.buscarClientes();
            }, 
            function(response) { // optional
                console.log(response);
                vm.showSimpleToast('Erro ao excluir cliente!');
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
            vm.salvando = true;
            vm.inserirCliente(cliente);

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
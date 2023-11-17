var Pecas = angular.module('Pecas',['ngMaterial','ngMessages']);

Pecas.controller("PecasController",['$scope', '$http', '$mdDialog', '$mdToast', '$log', function($scope,$http, $mdDialog, $mdToast, $log){
    var vm = $scope;
    vm.status = false;
    vm.controller = this;
    vm.customFullscreen = false;
    vm.pecas = [];
    
    vm.showSimpleToast = function(mensagem) {
        $mdToast.show(
            $mdToast.simple()
            .textContent(mensagem)
            .position('top right')
            .hideDelay(4000)
        );
    };

    vm.limparListaPecas = function (){
        console.log('limpar inicio', vm.pecas);
        
        while(vm.pecas.length > 0)
        vm.pecas.pop()
        vm.pecas = [];
    //vm.clientes.splice(0, quantidade);
        console.log('limpar fim', vm.pecas);

    };

    vm.buscarPecas = function(){

        $http.get('http://localhost/oficina/pecas', {}).then(function(resposta){
           
            vm.limparListaPecas();
            angular.forEach(resposta.data, function(value) {
                vm.pecas.push(value);
            });

        }, function(erro){

            alert(erro);

        });

    }
    
    vm.buscarPecas();

    vm.inserirPeca = function (peca){
       
        $http({
            url: 'http://localhost/oficina/pecas/',
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            isArray: false,
            data: peca
        }).then(function(response){
            vm.showSimpleToast('Peça salvo com sucesso!');
            vm.buscarPecas();
            $mdDialog.hide();
			window.location.reload();
        }, 
        function(response) { // optional
            $mdDialog.hide();
        });

    };
   
    vm.atualizarPeca = function (){
        alert('Editando peça');
    };

    vm.deletar = function(id) {
        var confirm = $mdDialog.confirm()
        .title('Tem certeza que deseja excluir a peça?')
        .textContent('Todas as informações relacionadas serão perdidas.')
        .ariaLabel('Deletar')
        .targetEvent(id)
        .ok('Sim')
        .cancel('Cancelar');

        $mdDialog.show(confirm).then(function () {
            $http({
                url: 'http://localhost/oficina/pecas/',
                method: "DELETE",
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin':'http://localhost/minasretifica/pecas/',
                    'Access-Control-Allow-Methods':'DELETE',
                    'Access-Control-Allow-Headers':'X-Requested-With,Content-Type',
                    'Authorization':'Bearer AADDFFKKKLLLL'
                },
                isArray: false,
                data: id
            })
            .then(function(response) {
                vm.showSimpleToast('Peça excluída sucesso!');
                vm.buscarPecas();
            }, 
            function(response) { // optional
                console.log(response);
                vm.showSimpleToast('Erro ao excluir peça!');
            }); 
        })
    };

    function DialogController($scope, $mdDialog) {
        
        $scope.peca ={nome:'Parafuso do motor', descricao:'Conjunto de parafusos de fixação do cabeçote', valor:'142,00'};

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.salvar = function (peca) {
            vm.salvando = true;
            vm.inserirPeca(peca);

        };
        //$scope.maskTelefone = function(v) {//!! Mascara não necessário no cadastro de peças !!
        //    if( v != undefined)
        //    {
        //        let r = v.replace(/\D/g, "");
        //        r = r.replace(/^0/, "");
        //        if (r.length > 10) {
        //            r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
        //        } else if (r.length > 7) {
        //            r = r.replace(/^(\d\d)(\d{5})(\d{0,4}).*/, "($1) $2-$3");
        //        } else if (r.length > 2) {
        //            r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
        //        } else if (v.trim() !== "") {
        //            r = r.replace(/^(\d*)/, "($1");
        //        }
        //        $scope.cliente.telefone=r;
        //    }
        //}
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
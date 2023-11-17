var Servicos = angular.module('Servicos',['ngMaterial','ngMessages']);

Servicos.controller("ServicosController",['$scope', '$http', '$mdDialog', '$mdToast', '$log', function($scope,$http, $mdDialog, $mdToast, $log){
    var vm = $scope;
    vm.status = false;
    vm.controller = this;
    vm.customFullscreen = false;
    vm.servicos = [];
    
    vm.showSimpleToast = function(mensagem) {
        $mdToast.show(
            $mdToast.simple()
            .textContent(mensagem)
            .position('top right')
            .hideDelay(4000)
        );
    };

    vm.limparListaServicos = function (){
        console.log('limpar inicio', vm.servicos);
        
        while(vm.servicos.length > 0)
        vm.servicos.pop()
        vm.servicos = [];
    //vm.clientes.splice(0, quantidade);
        console.log('limpar fim', vm.servicos);

    };

    vm.buscarServicos = function(){

        $http.get('http://localhost/oficina/servicos', {}).then(function(resposta){
           
            vm.limparListaServicos();
            angular.forEach(resposta.data, function(value) {
                vm.servicos.push(value);
            });

        }, function(erro){

            alert(erro);

        });

    }
    
    vm.buscarServicos();

    vm.inserirServico = function (servico){
       
        $http({
            url: 'http://localhost/oficina/servicos/',
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            isArray: false,
            data: servico
        }).then(function(response){
            vm.showSimpleToast('Serviço salvo com sucesso!');
            vm.buscarServicos();
            $mdDialog.hide();
			window.location.reload();
        }, 
        function(response) { // optional
            $mdDialog.hide();
        });

    };
   
    vm.atualizarServico = function (){
        alert('Editando serviço');
    };

    vm.deletar = function(id) {
        var confirm = $mdDialog.confirm()
        .title('Tem certeza que deseja excluir o serviço?')
        .textContent('Todas as informações relacionadas serão perdidas.')
        .ariaLabel('Deletar')
        .targetEvent(id)
        .ok('Sim')
        .cancel('Cancelar');

        $mdDialog.show(confirm).then(function () {
            $http({
                url: 'http://localhost/oficina/servicos/',
                method: "DELETE",
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin':'http://localhost/minasretifica/servicos/',
                    'Access-Control-Allow-Methods':'DELETE',
                    'Access-Control-Allow-Headers':'X-Requested-With,Content-Type',
                    'Authorization':'Bearer AADDFFKKKLLLL'
                },
                isArray: false,
                data: id
            })
            .then(function(response) {
                vm.showSimpleToast('Serviço excluído sucesso!');
                vm.buscarServiços();
            }, 
            function(response) { // optional
                console.log(response);
                vm.showSimpleToast('Erro ao excluir servico!');
            }); 
        })
    };

    function DialogController($scope, $mdDialog) {
        
        $scope.peca ={nome:'Retifica', descricao:'Retifica do cabeçote', valor:'400,00'};

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.salvar = function (servico) {
            vm.salvando = true;
            vm.inserirServico(servico);

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
}])    
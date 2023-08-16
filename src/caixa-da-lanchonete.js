class CaixaDaLanchonete {

    metodoDePagamento;
    itens;
    
    //construtor
    constructor(metodoDePagamentoLanchonete, itensLanchonete) {
        this.metodoDePagamento = metodoDePagamentoLanchonete;
        this.itens = itensLanchonete;
    } 

    //metodos  
    calcularValorDaCompra(metodoDePagamento, itens) {
        let resultadoCompra = '';
        const listaProdutos = this.cadastrarListaItens();     
        const listaItens = itens;
        let codigo = '';
        let quantidade = 0;
        let totalPedido = 0;
        
        try {
            if (this.validarMetodoDePagamento(metodoDePagamento)) {
                if (listaItens.length > 0) {
                    for (let i = 0; i < listaItens.length; i++) {
                        //busca codigo e quantidade
                        codigo = listaItens[i].substring(listaItens[i].indexOf(','), 0);
                        quantidade = Number(listaItens[i].substring((listaItens[i].indexOf(',') + 1), listaItens[i].length));
                        //valida codigo e quantidade
                        if (!this.validarCodigoItem(codigo, listaProdutos)) {
                            resultadoCompra = "Item inválido!";
                            totalPedido = 0;
                            break;
                        } else if (quantidade === 0) {
                            resultadoCompra = "Quantidade inválida!";
                            totalPedido = 0;
                            break;
                        } else if (!this.validarItemExtra(codigo, listaItens)) {
                            resultadoCompra = "Item extra não pode ser pedido sem o principal";
                            totalPedido = 0;
                            break;
                        } else {
                            //totaliza pedido
                            totalPedido = totalPedido + this.validarTotalPedido(codigo, quantidade, listaProdutos);                           
                        }
                    }
                    //aplica regra de desconto e taxa
                    if (totalPedido != 0) {
                        if (metodoDePagamento === 'dinheiro') {
                            let totalPedidoDescontoTaxa = 0;
                            totalPedidoDescontoTaxa = totalPedido - (totalPedido * 0.05)
                            resultadoCompra = this.formatarParaReal(totalPedidoDescontoTaxa);
                        } else if (metodoDePagamento === 'credito') {
                            let totalPedidoDescontoTaxa = 0;
                            totalPedidoDescontoTaxa = totalPedido + (totalPedido * 0.03)
                            resultadoCompra = this.formatarParaReal(totalPedidoDescontoTaxa);
                        } else {
                            resultadoCompra = this.formatarParaReal(totalPedido);
                        }            
                    }
                } else {
                    resultadoCompra = "Não há itens no carrinho de compra!";
                }
            } else {
                resultadoCompra = "Forma de pagamento inválida!";
            }
            //retorna resultado compra
            return resultadoCompra;
        } catch (error) {
            resultadoCompra = "Erro na aplicação, operação inválida!";
            return resultadoCompra;
        }            
    }

    validarCodigoItem(codigo, listaProdutos) {
        let retorno = false;

        for (let i = 0; i < listaProdutos.length; i++) {
            if (listaProdutos[i][0] === codigo) {
                retorno = true;
                break;
            }
        }
        return retorno;
    }

    validarItemExtra(codigoExtra, listaProdutosPedido) {
        let retorno = true;
        let codigo = '';

        if (codigoExtra === 'chantily' || codigoExtra === 'queijo') {
            retorno = false;
            for (let i = 0; i < listaProdutosPedido.length; i++) {
                if (listaProdutosPedido[i].includes(',')) {
                    codigo = listaProdutosPedido[i].substring(listaProdutosPedido[i].indexOf(','), 0);
                    if (codigoExtra === 'chantily' && codigo === 'cafe') {
                        retorno = true;
                        break;
                    } else if (codigoExtra === 'queijo' && codigo === 'sanduiche') {
                        retorno = true;
                        break;
                    }
                }
            }
        }
        return retorno;
    }

    validarTotalPedido(codigo, quantidade, listaProdutos) {
        let retorno = 0;

        for (let i = 0; i < listaProdutos.length; i++) {
            if (listaProdutos[i][0] === codigo) {
                retorno = Number(listaProdutos[i][2]) * quantidade;
                break;
            }
        }
        return retorno;        
    }

    cadastrarListaItens() {
        const listaItens = [];
    
        listaItens.push(['cafe','Café', 3]);
        listaItens.push(['chantily','Chantily (extra do Café)', 1.50]);
        listaItens.push(['suco','Suco Natural',6.20]);
        listaItens.push(['sanduiche', 'Sanduíche', 6.50]);
        listaItens.push(['queijo', 'Queijo (extra do Sanduíche)', 2]);
        listaItens.push(['salgado','Salgado',7.25]);
        listaItens.push(['combo1','1 Suco e 1 Sanduíche', 9.50]);
        listaItens.push(['combo2', '1 Café e 1 Sanduíche', 7.50]);
        
        return listaItens;
    }

    validarMetodoDePagamento(metodoDePagamento) {
        let retorno = false;
        const listaPagamento = [];

        listaPagamento.push('debito');
        listaPagamento.push('credito');
        listaPagamento.push('dinheiro');

        for (let i = 0; i < listaPagamento.length; i++) {
            if (listaPagamento[i] === metodoDePagamento) {
                retorno = true;
                break;
            }
        }
        return retorno;

    }

    formatarParaReal(numero) {
        var numero = numero.toFixed(2).split('.');
        numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }    
 
}

export { CaixaDaLanchonete };

const caixaDaLanchonete = new CaixaDaLanchonete();
const resultadoCaixaDaLanchonete = caixaDaLanchonete.calcularValorDaCompra('credito', ['cafe,1', 'sanduiche,1', 'queijo,1']);
console.log(resultadoCaixaDaLanchonete);

import React from "react";

import './style.css';
import './table.css';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serverOk: false,
            sexos: null,
            tipoPessoas: null,
            usuarios: null,
            codigo: "",
            auxCodigo: "",
            nome: "",
            sexo: 0,
            tipoPessoa: 0
        };

        this.codigoChange = this.codigoChange.bind(this);
        this.nomeChange = this.nomeChange.bind(this);
        this.sexoChange = this.sexoChange.bind(this);
        this.tipoPessoaChange = this.tipoPessoaChange.bind(this);
        this.novoCancelar = this.novoCancelar.bind(this);
        this.deletar = this.deletar.bind(this);
        this.salvar = this.salvar.bind(this);
        this.validar = this.validar.bind(this);
        this.listOnChange = this.listOnChange.bind(this);
    }


    novoCancelar() {
        this.setState({ codigo: "" });
        this.setState({ nome: "" });
        this.setState({ sexo: 0 });
        this.setState({ tipoPessoa: 0 });
        document.querySelectorAll('.listItem').forEach(n => n.classList.remove('activeRow'));
    }
    update() {
        if (!this.validar())
            return;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                codigo: this.state.codigo,
                nome: this.state.nome,
                sexoId: parseInt(this.state.sexo),
                tipoPessoaId: parseInt(this.state.tipoPessoa)
            })
        };

        fetch(process.env.REACT_APP_HOST + "usuario/?codigo=" + this.state.auxCodigo, requestOptions)
            .then(response => response.json())
            .then(
                (result) => {
                    console.log(result);
                    if (result.errors) {
                        var erro = ""
                        for (let i = 0; i < result.errors.length; i = i + 1) {
                            erro += result.errors[i] + "\n";
                        }
                        window.alert(erro);
                        return;
                    }
                    this.loadUsuarios();
                },
                (error) => {
                    window.error(error);
                }
            );
    }
    salvar() {
        if (this.validarSelecao()) {
            this.update();
            return;
        }
        if (!this.validar())
            return;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                codigo: this.state.codigo,
                nome: this.state.nome,
                sexoId: parseInt(this.state.sexo),
                tipoPessoaId: parseInt(this.state.tipoPessoa)
            })
        };

        fetch(process.env.REACT_APP_HOST + "usuario", requestOptions)
            .then(response => response.json())
            .then(
                (result) => {
                    console.log(result);
                    if (result.errors) {
                        var erro = ""
                        for (let i = 0; i < result.errors.length; i = i + 1) {
                            erro += result.errors[i] + "\n";
                        }
                        window.alert(erro);
                        return;
                    }
                    this.loadUsuarios();
                },
                (error) => {
                    window.error(error);
                }
            );
    }
    deletar() {
        if (!this.validarSelecao()) {
            window.alert("Para deletar selecione um usuario!")
            return;
        }
        document.querySelectorAll('.listItem').forEach(n => n.classList.remove('activeRow'));
        const requestOptions = {
            method: 'DELETE'
        };

        fetch(process.env.REACT_APP_HOST + "usuario/?codigo=" + this.state.codigo, requestOptions)
            .then(response => response.json())
            .then(
                (result) => {
                    console.log(result);
                    if (result.errors) {
                        var erro = ""
                        for (let i = 0; i < result.errors.length; i = i + 1) {
                            erro += result.errors[i] + "\n";
                        }
                        window.alert(erro);
                        return;
                    }
                    this.loadUsuarios();
                },
                (error) => {
                    window.error(error);
                }
            );
    }
    codigoChange(event) {
        this.setState({ codigo: event.target.value });
    }
    nomeChange(event) {
        this.setState({ nome: event.target.value });
    }
    sexoChange(event) {
        this.setState({ sexo: event.target.value });
    }
    tipoPessoaChange(event) {
        console.log(event.target.value);
        this.setState({ tipoPessoa: event.target.value });
    }
    listOnChange(event) {
        var codigo = event.target.getAttribute('data-item');
        var elm = document.getElementById(codigo + "row");
        document.querySelectorAll('.listItem').forEach(n => n.classList.remove('activeRow'));
        elm.classList.add("activeRow");

        const found = this.state.usuarios.find(element => element.codigo.toString() === codigo.toString());

        this.setState({ auxCodigo: found.codigo });
        this.setState({ codigo: found.codigo });
        this.setState({ nome: found.nome });
        this.setState({ sexo: found.sexoId });
        this.setState({ tipoPessoa: found.tipoPessoaId });
    }
    componentDidMount() {
        this.loadServer();
        document.title = "FrontEnd Teste"
    }
    validar() {
        console.log(this.state.tipoPessoaId);
        var error = "";
        if (!this.state.codigo)
            error += "Código: preencha este campo\n"
        if (!this.state.nome)
            error += "Nome: preencha este campo\n"
        if (!this.state.sexo)
            error += "Sexo: escolha uma opção\n"
        if (!this.state.tipoPessoa)
            error += "Tipo de Pessoa: escolha uma opção\n"

        if (error !== "") {
            window.alert(error);
            return false;
        }
        return true
    }

    validarSelecao() {
        var activeRow = document.querySelectorAll('.activeRow');
        if (activeRow.length > 0) {
            return true
        }

        return false;
    }

    loadSexos() {
        fetch(process.env.REACT_APP_HOST + "sexo")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        sexos: result
                    });
                    console.log(this.state.sexos);
                },
                (error) => {
                    console.error(error);
                }
            );
    }

    loadTipoPessoas() {
        fetch(process.env.REACT_APP_HOST + "tipopessoa")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        tipoPessoas: result
                    });
                    console.log(this.state.tipoPessoas);
                },
                (error) => {
                    console.error(error);
                }
            );
    }

    loadUsuarios() {
        fetch(process.env.REACT_APP_HOST + "usuario")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        usuarios: result
                    });
                    console.log(this.state.usuarios);
                },
                (error) => {
                    console.error(error);
                }
            );
    }
    loadServer() {
        fetch(process.env.REACT_APP_HOST)
            .then(res => res)
            .then(
                (result) => {
                    this.setState({
                        serverOk: true
                    });
                    console.log(result);
                    this.loadSexos();
                    this.loadTipoPessoas();
                    this.loadUsuarios();
                },
                (error) => {
                    this.setState({
                        serverOk: false
                    });
                }
            );
    }
    getListValue(id, list) {
        const found = list.find(element => element.id.toString() === id.toString());
        return found.valor;
    }


    render() {
        if (!this.state.serverOk) {
            return (
                <div className="container">
                    <h1 className="title" > Sistema </h1>
                    <span>Erro ao conectar-se com o servidor.</span>
                </div>
            );
        } else {
            if (this.state.tipoPessoas == null && this.state.sexos == null && this.state.usuarios) {
                return (
                    <div className="container">
                        <h1 className="title" > Sistema </h1>
                        <span>Carregando...</span>
                    </div>
                );
            }
            else {
                return (
                    <div className="container">
                        <h1 className="title" > Sistema </h1>
                        <div className="form" >
                            <div className="left-side" >
                                <div className="field-container" >
                                    <label htmlFor="codigo" > Código </label>
                                    <input type="number" id="codigo" className="field" value={this.state.codigo} onChange={this.codigoChange} />
                                </div>
                                <div className="field-container" >
                                    <label htmlFor="nome" > Nome </label>
                                    <input id="nome" className="field" value={this.state.nome} onChange={this.nomeChange} />
                                </div>
                                <div className="field-container" >
                                    <label htmlFor="sexo" > Sexo </label>
                                    <select id="sexo" value={this.state.sexo} onChange={this.sexoChange}
                                        className="field" >
                                        <option defaultValue="0" hidden></option>
                                        {
                                            this.state.sexos != null ? this.state.sexos.map((item, i) => {
                                                return <option key={item.id} value={item.id}>{item.valor}</option>;
                                            }) : ""
                                        }
                                    </select >
                                </div>
                                <div className="buttons" >
                                    <button onClick={this.novoCancelar} > Novo / Cancelar </button>
                                    <button onClick={this.salvar} > Salvar </button>
                                    <button onClick={this.deletar} > Deletar </button>
                                </div >
                            </div>
                            <div className="right-side" >
                                <div className="field-container-right" >
                                    <div className="subTitle" > Pessoa: </div>
                                    {
                                        this.state.tipoPessoas != null ? this.state.tipoPessoas.map((item, i) => {
                                            // return <option key={item.id} value={item.id}>{item.valor}</option>;
                                            return <div
                                                key={item.id} >
                                                <input type="radio"
                                                    name="tipoPessoa"
                                                    id={item.id}
                                                    value={item.id}
                                                    checked={this.state.tipoPessoa.toString() === item.id.toString()}
                                                    onChange={this.tipoPessoaChange}
                                                />
                                                <label htmlFor="teste" > {item.valor} </label>
                                            </div >
                                        }) : ""
                                    }
                                </div >
                            </div >
                        </div >
                        <div className="table">
                            <div className="subTitle pdTop align"> Tabela de Usuarios: </div>
                            <table className="styled-table">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nome</th>
                                        <th>Sexo</th>
                                        <th>Pessoa</th>
                                    </tr>
                                </thead>
                                <tbody id="tablebody">
                                    {this.state.usuarios != null ? this.state.usuarios.map((item, i) => {
                                        return <tr
                                            onClick={this.listOnChange}
                                            key={item.codigo}
                                            data-item={item.codigo}
                                            id={item.codigo + "row"}
                                            className="listItem" >
                                            <td data-item={item.codigo} >{item.codigo}</td>
                                            <td data-item={item.codigo} >{item.nome}</td>
                                            <td data-item={item.codigo} >{this.getListValue(item.sexoId, this.state.sexos)}</td>
                                            <td data-item={item.codigo} >{this.getListValue(item.tipoPessoaId, this.state.tipoPessoas)}</td>
                                        </tr>
                                    }) : null
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div >
                );
            }

        }
    }
}
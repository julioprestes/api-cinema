import UsuarioSessao from "../models/UsuarioSessaoModel.js";
import Sessao from "../models/SessaoModel.js";
import Filme from "../models/FilmeModel.js";

const get = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await UsuarioSessao.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Dados Encontrados',
                data: response,
            });
        }
        
        const response = await UsuarioSessao.findOne({
            where: {
                id: id
            }
        });

        if (!response) {
            return res.status(404).send('Não Achou')
        };

        return res.status(200).send({
            message: 'Dados Encontrados',
            data: response,
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

// get para buscar todos os lugares livres de uma sessao

const getLivres = async (req, res) => {
    try {
        const id = req.params.id? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            return res.status(400).send({ 
                message: 'id invalido',
            });
        };

        const response = await Sessao.findOne({
            where: {
                id: id
            }
        }); 
        
        if (!response) {
            return res.status(404).send('Não Achou')
        }

        const lugares = response.getDataValue("lugares");

        const livres = lugares.filter(l => l.alocado === false);

        return res.status(200).send({
            message: "lugares encontrados:",
            data: livres
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

//* Listar todas as sessoes compradas do usuario X, filme horario e sala

const getUsuario = async (req, res) => {
    try {
        const id = req.params.idUsuario? req.params.idUsuario.toString().replace(/\D/g, '') : null;

        if (!id) {
            return res.status(400).send({ 
                message: 'id do usuario invalido',
            });
        };

        const sessoes = await UsuarioSessao.findAll({
            where: { idUsuario: id },
            include: [
                {
                    model: Sessao,
                    as: 'sessao', 
                    attributes: ['id', 'dataInicio', 'dataFim', 'idSala'],
                    include: [
                        {
                            model: Filme,
                            as: 'filme',
                            attributes: ['nome'],
                        }
                    ]
                }
            ]
        });

        if (!sessoes.length) {
            return res.status(404).send({ message: 'usuario nao tem sessao' });
        }

        return res.status(200).send({
            message: `sessões compradas pelo usuario ${id}`,
            data: sessoes
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


const create = async (corpo) => {
    try {
        const {
            idSessao,
            idUsuario,
            valorAtual
        } = corpo

        const response = await UsuarioSessao.create({
            idSessao,
            idUsuario,
            valorAtual
        });

        return response;
    } catch (error) {
        throw new Error(error.message)
    }
}

const update = async (corpo, id) => {
    try {
        const response = await UsuarioSessao.findOne({
            where: {
                id
            }
        });

        if (!response) {
            throw new Error('Não achou');
        }

        Object.keys(corpo).forEach((item) => response[item] = corpo[item]);
        await response.save();

        return response;
    } catch (error) {
        throw new Error(error.message)
    }
}

const persist = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await create(req.body)
            return res.status(201).send({
                message: 'Criado com sucesso!',
                data: response
            });
        }

        const response = await update(req.body, id);
            return res.status(201).send({
                message: 'Atualizado com sucesso!',
                data: response
            });
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

const destroy = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
        if (!id) {
            res.status(400).send('informa ai paezon')
        }

        const response = await UsuarioSessao.findOne({
            where: {
                id
            }
        });

        if (!response) {
            return res.status(404).send('nao achou')
        }

        await response.destroy();

        return res.status(200).send({
            message: 'registro excluido',
            data: response
        })

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

// post  para criar uma compra

const compra = async (req, res) => {
    try {
        const {
            idSessao,
            idUsuario,
            codigoLugar,
            valorAtual
        } = req.body; 
        
        const sessao = await Sessao.findOne({ where: { id: idSessao } });

        if (!sessao) {
            return res.status(404).send({ message: 'nao achou a sessao' });
        }

        const lugares = sessao.getDataValue("lugares");
        const aux = lugares.findIndex(l => l.lugar === codigoLugar);

        if (aux === -1) {
            return res.status(404).send({ message: 'Lugar não encontrado' });
        }

        if (lugares[aux].alocado) {
            return res.status(400).send({ message: 'lugar ocupado' });
        }

        lugares[aux].alocado = true;
        lugares[aux].idUsuario = idUsuario;
        if (lugares[aux] && 'cancelado' in lugares[aux]) {
            delete lugares[aux].cancelado;
        }

        // Atualiza sessao
        await Sessao.update(
            { lugares },
            { where: { id: idSessao } }
        );

        // Cria o registro
        await UsuarioSessao.create({
            idSessao,
            idUsuario,
            valorAtual,
        });


        return res.status(201).send({
            message: 'Compra realizada com sucesso!',
            data: {
                dataHora: sessao.dataHora,
                lugar: lugares[aux]
            }
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

//* cancelar uma compra da sessao (NAO EXCLUIR)

const cancela = async (req, res) => {
    try {
        const {
            idSessao,
            codigoLugar,
        } = req.body; 
        
        const sessao = await Sessao.findOne({ where: { id: idSessao } });

        if (!sessao) {
            return res.status(404).send({ message: 'nao achou a sessao' });
        }

        const lugares = sessao.getDataValue("lugares");
        const aux = lugares.findIndex(l => l.lugar === codigoLugar);

        if (aux === -1) {
            return res.status(404).send({ message: 'Lugar não encontrado' });
        }

        if (!lugares[aux].alocado) {
                return res.status(404).send({ message: 'Lugar esta livre' });
            }
        
        if (lugares[aux].alocado) {
            lugares[aux].alocado = false;
            lugares[aux].cancelado = 'cancelado';
        }
        
        // Atualiza sessao
        await Sessao.update(
            { lugares },
            { where: { id: idSessao } }
        );

        // Exclui o registro
        await UsuarioSessao.destroy({
            idSessao,
        });

        return res.status(201).send({
            message: 'Cancelamento realizado com sucesso!',
            data: {
                dataHora: sessao.dataHora,
                lugar: lugares[aux]
            }
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};


export default {
    get,
    persist,
    destroy,
    getLivres,
    getUsuario,
    compra,
    cancela
}
import Sessao from "../models/SessaoModel.js";
import PadraoLugares from "../models/PadraoModel.js";
import Sala from "../models/SalaModel.js";

const get = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await Sessao.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Dados Encontrados',
                data: response,
            });
        }

        
        const response = await Sessao.findOne({
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
// pegar o id da sala, e buscar o padrao de lugares da sala. Pegar o JSON e criar
// a sessao de lugares
const create = async (corpo) => {
    try {
        const {
            idFilme,
            idSala,
            dataInicio,
            dataFim,
            preco
        } = corpo
        
        const sala = await Sala.findOne({
            where: { id: idSala },
            include: {
                model: PadraoLugares,
                as: 'padrao',
                attributes: ['lugares']
            }
        });

        if (!sala) {
            throw new Error('sala nao encontrada')
        }

        const lugares = sala.padrao ? sala.padrao.lugares : [];

        if (!lugares) {
            throw new Error('lugares nao encontrados')
        }

        const response = await Sessao.create({
            idFilme,
            idSala,
            lugares,
            dataInicio,
            dataFim,
            preco
        });

        return response;
    } catch (error) {
        throw new Error(error.message)
    }
}

const update = async (corpo, id) => {
    try {
        const response = await Sessao.findOne({
            where: {
                id
            }
        });


        if (!response) {
            throw new Error('Não achou');
        }

        Object.keys(corpo).forEach(async (item) => {
            response[item] = corpo[item]
            if ((item === 'idSala') && corpo.idSala !== response.idSala) {
                const sala = await Sala.findOne({
                    where: { id: corpo.idSala },
                    include: {
                        model: PadraoLugares,
                        as: 'padrao',
                        attributes: ['lugares']
                    }
                });
                if (!sala) {
                    throw new Error('sala nao encontrada')
                };

                const lugares = sala.padrao ? sala.padrao.lugares : [];
                
                if (!lugares) {
                    throw new Error('lugares nao encontrados')
                }
            }
        });
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

        const response = await Sessao.findOne({
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


export default {
    get,
    persist,
    destroy
}
import Sessao from "../models/SessaoModel.js";
import PadraoLugares from "../models/PadraoModel.js";
import Sala from "../models/SalaModel.js";
import { sequelize } from "../config/postgres.js";

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

const getRelatorio = async (req, res) => {
    try {
        const idSessao = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        const registros = await sequelize.query(`
                select
                    count(*) as contagem,
                    sum(valor_atual) as soma
                from usuarios_sessoes
                where id_sessao = ${idSessao}
            `).then((a) => a[0][0]);

        console.log(registros);
        

        
        if (!registros.contagem) {
            return res.status(404).send({ message: 'nenhuma venda na sessao' });
        }


        return res.status(200).send({
            idSessao,
            soma: registros.soma,
            totalAssentos: registros.contagem,
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

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

        const keys = Object.keys(corpo);

        for (let i = 0; i < keys.length; i++) {
            const item = keys[i];
            if (item === 'idSala' && corpo.idSala !== response.idSala) {
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

                response.lugares = lugares;
            }
        };
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
    getRelatorio,
    persist,
    destroy
}
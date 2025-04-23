import UsuarioSessao from "../models/UsuarioSessaoModel.js";
import Sessao from "../models/SessaoModel.js";

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
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

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


// post na usuario_sessoes para criar uma compra
// 	*informar o codigo do lugar
// 		* caso o lugar na sessao esdcolhida for vago adicionar ao objeto(lugar) mais uma chave chamada idUsuario com o id do usuario que fez a compra e criar a usuario_sessoes
// 		* caso lugar ocupado, devolver um erro e nao mudar nada no banco
// 	* retornar sucesso ou erro, caso sucesso ja com a data e hora da sessao


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



export default {
    get,
    persist,
    destroy,
    getLivres,
    compra
}
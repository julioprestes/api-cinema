import Usuario from "../models/UsuarioModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Cargo from "../models/CargoModel.js";
import sendMail from "../utils/email.js";

const get = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await Usuario.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Dados Encontrados',
                data: response,
            });
        }

        
        const response = await Usuario.findOne({
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

const create = async (req, res) => {
    try {
        const {
            nome,
            email,
            password,
            cpf,
            idCargo,
            estudante
        } = req.body

        console.log(req.body); 
        const verificaEmail = await Usuario.findOne({
            where: {
                email
            }
        })

        if (verificaEmail) {
            return res.status(400).send({
                message: 'Já existe usuario com este email'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        

        const response = await Usuario.create({
            nome,
            email,
            passwordHash,
            cpf,
            idCargo,
            estudante
        });

        return res.status(201).send({
            message: 'Criado com sucesso!',
            data: response
        });
    } catch (error) {
        throw new Error(error.message)
    }
}

const login = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        const user = await Usuario.findOne({
            where: {
                email,
            }
        });

        if (!user){
            return res.status(400).send ({
                message: 'Usuario ou senha incorretos'
            });
        }

        const comparacaoSenha = await bcrypt.compare(password, user.passwordHash)

        if(comparacaoSenha) {
            const token = jwt.sign({ idUsuario: user.id, nome: user.nome, email: user.email, idCargo: user.idCargo }, process.env.TOKEN_KEY, { expiresIn: '8h'});
            return res.status(200).send({
                message: 'Sucesso no Login',
                response: token
            })
        } else {
            return res.status(400).send ({
                message: 'Usuario ou senha incorretos'
            });
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const recuperarSenha = async (req, res) => {
    try {
        const { 
            email
        } = req.body;
    
        const user = await Usuario.findOne({
            where: {
                email,
            }
        });
        if (!user){
            return res.status(400).send ({
                message: 'Usuario ou senha incorretos'
            });
        };

        const gerarCodigo = () => Math.random().toString(36).slice(2);
        const codigo = gerarCodigo();
        const expiracao = new Date(Date.now() + 30 * 60 * 1000);
    
        user.codigoSenha = codigo;
        user.codigoSenhaExpiracao = expiracao;

        await user.save();

        console.log("enviando email");

        await sendMail(user.email, user.nome, codigo, 'Recuperar senha');

        return res.status(200).send({
            message: 'codigo enviado',
        })
    
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const getDataByToken = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        if(!token) {
            throw new Error('Não achou token');
        }

        const user = jwt.verify(token, process.env.TOKEN_KEY);

        if(!user) {
            throw new Error('Token inválido');
        }

        const usuario = await Usuario.findOne({
            where: {
                id: user.idUsuario
            },
            attributes: [],
            include: [
                {
                    model: Cargo,
                    as: 'cargo', 
                    attributes: ['id', 'descricao'],
                }
            ]
        });
        
        if (!usuario) {
            return res.status(404).send({
                message: 'Usuário não encontrado'
            });
        };

        return res.status(200).send({
            response: user,
            data: usuario
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const update = async (corpo, id) => {
    try {
        const response = await Usuario.findOne({
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
};

const persist = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await create(req, res)
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
};

const destroy = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
        if (!id) {
            res.status(400).send('informa ai paezon')
        }

        const response = await Usuario.findOne({
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
};

export default {
    get,
    persist,
    destroy,
    login,
    getDataByToken,
    recuperarSenha
}
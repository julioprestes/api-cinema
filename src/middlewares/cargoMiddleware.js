import jwt from 'jsonwebtoken';
import Cargo from "../models/CargoModel.js";
import Usuario from "../models/UsuarioModel.js";

export default async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        const user = jwt.verify(token, process.env.TOKEN_KEY);

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
        }

        console.log(usuario.cargo);

        if (usuario.cargo.id !== 1) {
            return res.status(403).send({
                message: 'Cargo do usuário incorreto'
            });
        }

        console.log('Usuario e cargo OK');
        next();

    } catch (error) {
        return res.status(500).send({
            error: error.message
        });
    }
};

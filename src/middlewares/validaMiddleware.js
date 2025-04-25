import jwt from 'jsonwebtoken';


export default async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if(!token) {
            throw new Error('Não achou token');
        }
        
        const user = jwt.verify(token, process.env.TOKEN_KEY);
        
        if(!user) {
            throw new Error('Token inválido');
        }

        next();

    } catch (error) {
        return res.status(500).send({
            error: error.message
        })
    }
};


//fazer um middleware que verifique que o usuario está logado
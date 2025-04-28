import Filme from "../models/FilmeModel.js";
import uploadFile from "../utils/uploadFile.js";
import path from 'path';
import fs from 'fs';

const get = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await Filme.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Dados Encontrados',
                data: response,
            });
        }

        
        const response = await Filme.findOne({
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

const create = async (corpo) => {
    try {
        const {
            nome,
            descricao,
            autor,
            duracao,
            files
        } = corpo


        const response = await Filme.create({
            nome,
            descricao,
            autor,
            duracao,
        });

        if (!files || !files.arquivo) {
            console.log('Nenhum arquivo foi enviado');
            return response;
        }

        const arquivo = files.arquivo;
        const extensao = path.extname(arquivo.name).toLowerCase();
        const tipos = ['.png', '.jpg', '.jpeg', '.webp'];

        if (!tipos.includes(extensao)) {
            console.log('Arquivo não é uma imagem');
            return response;
        }

        const upload = await uploadFile(arquivo, { id: response.id, tipo: 'imagem', tabela: 'filme' });

        console.log('Resultado do upload:', upload);

        if (upload.type === 'success') {
            await response.update({ linkImagem: upload.message });
        } else {
            console.log('Erro no upload:', upload.message);
        }
        
        return response;
    } catch (error) {
        throw new Error(error.message)
    }
}

// if (files && files.arquivo) {
//     const arquivo = files.arquivo;
//     const extensao = path.extname(arquivo.name).toLowerCase();
//     const tiposPermitidos = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];





const update = async (corpo, id) => {
    try {
        const response = await Filme.findOne({
            where: {
                id
            }
        });

        if (!response) {
            throw new Error('Não achou');
        }

        Object.keys(corpo).forEach((item) => {
            if (item !== 'files') {
                response[item] = corpo[item];
            }
        });
        
        const arquivo = corpo.files.arquivo;
        const extensao = path.extname(arquivo.name).toLowerCase();
        const tipos = ['.png', '.jpg', '.jpeg', '.webp'];

        if (!tipos.includes(extensao)) {
            console.log('arquivo não é uma imagem');
        } else {
            if (response.linkImagem) {
                try {
                    fs.unlinkSync(path.resolve('caminho até a pasta', response.linkImagem));
                } catch (err) {
                    console.log('erro ao excluir', err.message);
                }
            }

            const upload = await uploadFile(arquivo, { id: response.id, tipo: 'imagem', tabela: 'filme' });

            if (upload.type === 'success') {
                response.linkImagem = upload.message;
            } else {
                console.log('Erro no upload:', upload.message);
            }
        }
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

        const response = await Filme.findOne({
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


// const createFilme = async (req, res) => {
//     try {
//         const dados = req.body;
//         const arquivo = req.files?.arquivo;

//         if (!arquivo) {
//             return res.status(400).send({ message: 'Arquivo não enviado.' });
//         }

//         const extensao = path.extname(arquivo.name).toLowerCase();
//         const extensoesPermitidas = ['.jpg', '.jpeg', '.png', '.gif'];

//         if (!extensoesPermitidas.includes(extensao)) {
//             console.log('Arquivo invalido');
//             return res.status(400).send({ 
//                 message: 'Tipo de arquivo invalido.' 
//             });
//         }

//         // Cria o filme sem a imagem
//         const filme = await create(dados);

//         // Faz upload da imagem
//         const upload = await uploadFile(arquivo, { id: filme.id, tipo: 'imagem', tabela: 'filmes' });

//         if (upload.type === 'erro') {
//             return res.status(500).send({ message: upload.message });
//         }

//         // Agora atualiza o filme no banco com o caminho da imagem
//         await filme.update({
//             imagemLink: upload.message.replace(/\\/g, '/')
//         });

//         return res.status(201).send({
//             message: 'Filme criado com sucesso!',
//             data: filme
//         });

//     } catch (error) {
//         return res.status(500).send({ message: error.message });
//     }
// };



export default {
    get,
    persist,
    destroy
}
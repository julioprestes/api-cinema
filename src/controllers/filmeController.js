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

        console.log('FILES:', files);   
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
            await response.update({ imagemLink: upload.message });
        } else {
            console.log('Erro no upload:', upload.message);
        }
        
        return response;
    } catch (error) {
        throw new Error(error.message)
    }
}

const update = async (corpo, arquivos, id) => {
    try {
        const response = await Filme.findOne({ 
            where: {
                 id 
            }
        });

        if (!response) {
            throw new Error('Não achou');
        }

        Object.keys(corpo).forEach((item) => response[item] = corpo[item]);

        const arquivo = arquivos?.arquivo;
        if (arquivo) {
            const extensao = path.extname(arquivo.name).toLowerCase();
            const tipos = ['.png', '.jpg', '.jpeg', '.webp'];

            if (!tipos.includes(extensao)) {
                console.log('Tipo de imagem inválido');
            } else {
                if (response.imagemLink) {
                    const caminhoImagem = path.resolve(response.imagemLink);
                    fs.unlink(caminhoImagem, (err) => {
                        if (err) {
                            console.log('erro ao deletar arquivo');
                            return
                        }
                        console.log('arquivo deletado com sucesso');
                    });
                }

                const upload = await uploadFile(arquivo, { id: response.id, tipo: 'imagem', tabela: 'filme' });

                console.log('Resultado do upload:', upload);

                if (upload.type === 'success') {
                    await response.update({ imagemLink: upload.message });
                } else {
                    console.log('Erro no upload:', upload.message);
                }
            }
        }
        await response.save();
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

const persist = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await create({
                ...req.body,
                files: req.files
            });
            return res.status(201).send({
                message: 'Criado com sucesso!',
                data: response
            });
        }

        const response = await update(req.body, req.files, id);
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
            return res.status(400).send('informa ai paezon');
        }

        const response = await Filme.findOne({
            where: { id }
        });

        if (!response) {
            return res.status(404).send('nao achou');
        }

        // Faz uma cópia dos dados antes de destruir
        const filmeExcluido = { ...response.dataValues };

        // Só tenta deletar a imagem se existir imagemLink
        if (response.imagemLink) {
            const caminhoImagem = path.resolve(response.imagemLink);
            try {
                await fs.promises.unlink(caminhoImagem);
                console.log('arquivo deletado com sucesso');
            } catch (err) {
                console.log('erro ao deletar arquivo:', err.message);
            }
        }

        await response.destroy();

        return res.status(200).send({
            message: 'registro excluido',
            data: filmeExcluido
        });

    } catch (error) {
        console.error('Erro ao excluir filme:', error);
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
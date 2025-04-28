import nodemailer from 'nodemailer'

async function sendMail(to, name, body, subject) {
    const smtp = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: 'juliocmp@unochapeco.edu.br',
            pass: 'fzyw tyju ivdw mkws',
        }
    });

    console.log("email enviado");
    await smtp.sendMail({
        to,
        subject,
        html: body,
    });

}

export default sendMail

//criar uma chave de acesso global do google

//fazer um recuperar minha senha (receber um email com um codigo temporario)
// criar coluna no banco para codigo temoprario (na tabela usuario), depois envio de email para o email
//  do usuario (utilizando a funcao (usando import)) rota para receber codigo, rota para atualizar senha
// token com expirein(30m) || ou criar coluna no banco (timestamp) que qauando craido o codigo pegue a hora atual 
// + tempo de expiração 

//CRIAR UMA COLUNA DO BANCO PARA CODIO TEMPORARIO, ENVIO EMAIL PARA O EMAIL DO  USUARIO UTILIZANDO A FUNCAO, ROTA PARA RECEBER CODIGO,
//  ROTA PARA ATUALIZAR SENHA -> TOKEN EXPIREIN 30M || CRIAR COLUNA NO BANCO PREFERENCIALMENTE TIMESTAMP QUE QUANDO CRIADO O CODIGO PEGUE A HORA ATUAL + TEMPO DE EXPIRAÇÃO
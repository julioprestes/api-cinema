import usuarioSessaoController from "../controllers/usuarioSessaoController.js";

export default (app) => {
    app.get('/usuarioSessao', usuarioSessaoController.get);
    app.get('/usuarioSessao/:id', usuarioSessaoController.get);
    app.post('/usuarioSessao', usuarioSessaoController.persist);
    app.patch('/usuarioSessao/:id', usuarioSessaoController.persist);
    app.delete('/usuarioSessao/:id', usuarioSessaoController.destroy);
    app.get('/usuarioSessao/livres/:id', usuarioSessaoController.getLivres);
    app.post('/usuarioSessao/compra/', usuarioSessaoController.compra);
}
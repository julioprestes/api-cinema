import padraoController from "../controllers/padraoController.js";

export default (app) => {
    app.get('/padrao', padraoController.get);
    app.get('/padrao/:id', padraoController.get);
    app.post('/padrao', padraoController.persist);
    app.patch('/padrao/:id', padraoController.persist);
    app.delete('/padrao/:id', padraoController.destroy);
}
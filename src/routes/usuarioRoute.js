import usuarioController from "../controllers/usuarioController.js";
import cargoMiddleware from "../middlewares/cargoMiddleware.js";
import validaMiddleware from "../middlewares/validaMiddleware.js";

export default (app) => {
    app.get('/usuario/info-by-token',validaMiddleware, cargoMiddleware, usuarioController.getDataByToken);
    app.get('/usuario', validaMiddleware, usuarioController.get);
    app.get('/usuario/:id',validaMiddleware, usuarioController.get);
    app.post('/usuario', usuarioController.persist);
    app.patch('/usuario/:id',validaMiddleware, usuarioController.persist);
    app.delete('/usuario/:id',validaMiddleware, usuarioController.destroy);
    app.post('/usuario/login', usuarioController.login);
    app.post('/usuario/recuperar-senha', usuarioController.recuperarSenha);
    app.post('/usuario/redefinir-senha', usuarioController.redefinirSenha);
}
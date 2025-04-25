import usuarioController from "../controllers/usuarioController.js";
import cargoMiddleware from "../middlewares/cargoMiddleware.js";
import validaMiddleware from "../middlewares/validaMiddleware.js";

export default (app) => {
    app.get('/usuario/info-by-token',validaMiddleware, cargoMiddleware, usuarioController.getDataByToken);
    app.get('/usuario', usuarioController.get);
    app.get('/usuario/:id', usuarioController.get);
    app.post('/usuario', usuarioController.persist);
    app.patch('/usuario/:id', usuarioController.persist);
    app.delete('/usuario/:id', usuarioController.destroy);
    app.post('/usuario/login', validaMiddleware, cargoMiddleware,usuarioController.login);
    
}
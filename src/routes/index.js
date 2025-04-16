import filmeRoute from "./filmeRoute.js";
import cargoRoute from "./cargoRoute.js";
import padraoRoute from "./padraoRoute.js";
import parametroRoute from "./parametroRoute.js";
import salaRoute from "./salaRoute.js";
import sessaoRoute from "./sessaoRoute.js";
import usuarioRoute from "./usuarioRoute.js";
import usuarioSessaoRoute from "./usuarioSessaoRoute.js";

function Routes(app) {
    cargoRoute(app);
    filmeRoute(app);
    padraoRoute(app);
    parametroRoute(app);
    salaRoute(app);
    sessaoRoute(app);
    usuarioRoute(app);
    usuarioSessaoRoute(app);
}

export default Routes;
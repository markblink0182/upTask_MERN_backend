import express from 'express';
const router = express.Router();
import { registrar, 
        autenticar, 
        confirmar,
        olvidePassword,
        comprobarToken,
        nuevoPassword,
        perfil} from '../controllers/usuarioController.js';

import checkAuth from '../middleware/checkAuth.js';

//Creacion, autenticacion y confirmacion de usuarios
router.post('/', registrar)//Crear nuevo usuario

router.post('/login', autenticar);

router.get('/confirmar/:token', confirmar) //Confirmar usuario

router.post('/olvide-password',olvidePassword)
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

/*Middleware*/
router.get('/perfil', checkAuth, perfil);

export default router;
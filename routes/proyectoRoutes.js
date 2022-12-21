import express from 'express';
const router = express.Router();
import checkAuth from '../middleware/checkAuth.js';
import { 
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
} from '../controllers/proyectoController.js';

router.route('/')
.get(checkAuth, obtenerProyectos)
.post(checkAuth,nuevoProyecto);

router.route('/:id')
.get(checkAuth,obtenerProyecto)
.put(checkAuth,editarProyecto)
.delete(checkAuth,eliminarProyecto);

/* router.get('/tareas/:id', checkAuth, obtenerTareas);//url seria {{API_URL}}/proyectos/tareas/id */
router.post('/colaboradores', checkAuth, buscarColaborador);
router.post('/colaboradores/:id', checkAuth, agregarColaborador);
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador);

buscarColaborador


export default router;

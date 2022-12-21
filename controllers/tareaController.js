import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tareas.js";

const agregarTarea = async (req, res)=>{
    const {proyecto} = req.body;
    const existeProyecto = await Proyecto.findById(proyecto);
    if(!existeProyecto){
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message})
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('No tienes el poder');
        return res.status(404).json({msg: error.message})
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body);
        existeProyecto.tareas.push(tareaAlmacenada._id);
        await existeProyecto.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }

}

const obtenerTarea = async(req, res)=>{
    const aid = req.params.id;
    const tarea = await Tarea.findById(aid).populate('proyecto');

    if(!tarea){
        const error = new Error('El proyecto no existe.');
        return res.status(404).json({msg: error.message});
    }

      if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Sin autorización para realizar esta acción');
        return res.status(403).json({msg: error.message})
    }

    res.json(tarea);  
}

const actualizarTarea = async(req, res)=>{
    const aid = req.params.id;
    const tarea = await Tarea.findById(aid).populate('proyecto');

    if(!tarea){
        const error = new Error('El proyecto no existe.');
        return res.status(404).json({msg: error.message});
    }

      if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Sin autorización para realizar esta acción');
        return res.status(403).json({msg: error.message})
    }

    //Actualizar los campos
    tarea.nombre       = req.body.nombre || tarea.nombre;
    tarea.descripcion  = req.body.descripcion || tarea.descripcion;
    tarea.prioridad    = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        return res.status(404).json({msg: error.message})
    }
}

const eliminarTarea = async(req, res)=>{
    const { id } = req.params;
    const tarea = await Tarea.findById(id).populate('proyecto');

    if(!tarea){
        const error = new Error('El proyecto no existe.');
        return res.status(404).json({msg: error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Sin autorización para realizar esta acción');
        return res.status(403).json({msg: error.message})
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto);
        proyecto.tareas.pull(tarea._id);
        await Promise.allSettled([await proyecto.save()], [await tarea.deleteOne()]);
        res.json({msg:`Tarea eliminada correctamente.`})
    } catch (error) {
        return res.status(404).json({msg: error.message});
        
    }
}

const cambiarEstado = async(req, res)=>{
    const { id } = req.params;
    const tarea = await Tarea.findById(id).populate('proyecto');

    if(!tarea){
        const error = new Error('El proyecto no existe.');
        return res.status(404).json({msg: error.message});
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() 
        && !tarea.proyecto.colaboradores.some(colaborador=>colaborador._id.toString() === req.usuario._id.toString())){
        const error = new Error('Accion no válida');
        return res.status(404).json({msg: error.message})
    }

    tarea.estado = !tarea.estado;
    tarea.completado = req.usuario._id;
    await tarea.save();

    /*513. Mostrar un mensaje de quien completo una tarea */
    const tareaAlmacenada = await Tarea.findById(id)
    .populate('proyecto')
    .populate('completado');
    res.json(tareaAlmacenada);
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}
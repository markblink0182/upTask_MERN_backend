import Proyecto from "../models/Proyecto.js";
import Tareas from "../models/Tareas.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async(req, res)=>{
    const proyectos = await Proyecto.find({
        $or:[
            { colaboradores: {$in: req.usuario} },
            { creador: {$in: req.usuario} }
        ]
    })
    .select("-tareas");
    res.json(proyectos)
}

const nuevoProyecto = async(req, res)=>{
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try {
        const nuevoProyecto = await proyecto.save();
        res.json(nuevoProyecto)
    } catch (error) {
        console.log(error)
    }
}

const obtenerProyecto = async(req, res)=>{
    console.log(req.params)
    const { id } = req.params;
    
    const proyecto = await Proyecto.findById(id).
        populate({path:'tareas', populate:{path:'completado', select:'nombre'}}).
        populate('colaboradores', 'nombre email');

   
    if(!proyecto){
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString() 
        && !proyecto.colaboradores.some(colaborador=>colaborador._id.toString() === req.usuario._id.toString())){
        const error = new Error('Accion no válida');
        return res.status(404).json({msg: error.message})
    }

    //obtener las tareas
    //const tareas = Tarea.find().where("proyecto").equals(proyecto._id);
    res.json(proyecto);
}

const editarProyecto = async(req, res)=>{
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id)
   
    if(!proyecto){
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    try {
        const proyectoActualizado = await proyecto.save();
        res.json(proyectoActualizado)
    } catch (error) {
        console.log(error)
    }
    
}

const eliminarProyecto = async(req, res)=>{
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id)
   
    if(!proyecto){
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({msg: error.message})
    }

    try {
        await proyecto.deleteOne();
        res.json({msg:`Proyecto ${id} eliminado para siempre `})
    } catch (error) {
        console.log(error)
        
    }
}
const buscarColaborador = async(req, res)=>{
    const { email } = req.body;
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt');

    if(!usuario){
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    res.json(usuario);
}
const agregarColaborador = async(req, res)=>{
    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto){
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ msg: error.message })
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Este proyecto no te pertenece');
        return res.status(404).json({msg: error.message})
    }

    const { email } = req.body;
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt');

    if(!usuario){
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
    }
    //El colaborador no es el admin del proyecto
    if(proyecto.creador.toString() === usuario._id.toString()){
        const error = new Error('El creador no puede ser colaborador.');
        return res.status(404).json({ msg: error.message });
    }

    //revisar que el usuario no este Ya agregado al proyecto
    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error('El usuario ya fue agregado anteriormente');
        return res.status(404).json({ msg: error.message });
    }
    
    /*Se puede agregar al proyecto */
    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    res.json({msg: 'Colaborador agregado exitosamente.'})
}

const eliminarColaborador = async(req, res)=>{
    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto){
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ msg: error.message })
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Este proyecto no te pertenece');
        return res.status(404).json({msg: error.message})
    }
  
    /*Se puede eliminar al proyecto */
    proyecto.colaboradores.pull(req.body.id);
    await proyecto.save();
    res.json({msg: 'Colaborador eliminado exitosamente.'})
}

/* const obtenerTareas = async(req, res)=>{
    const id  = req.params.id;
    const existeProyecto = await Proyecto.findById(id);
    
    if(!existeProyecto){
        const error = new Error('El proyecto no existe.');
        return res.status(404).json({msg: error.message});
    }

    const tareas = await Tareas.find().where('proyecto').equals(id)
    if(tareas.length > 0){
        res.json(tareas)
    }else{
        const error = new Error('El proyecto no tiene tareas asociadas.');
        return res.status(404).json({msg: error.message});
    }
} */

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
}
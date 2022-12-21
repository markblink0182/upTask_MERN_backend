import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js';

const app = express();
app.use(express.json()) //Poder leer los datos de un request en JSON
dotenv.config();
conectarDB(); //Conectar DB Mongo

/* cors*/
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error('Error de cors.'))
        }
    }
}
app.use(cors(corsOptions));
/* cors*/

//Verbos HTTP
app.use('/api/usuarios', usuarioRoutes);//Rutas de usuarios
app.use('/api/proyectos', proyectoRoutes)//Rutas de proyectos
app.use('/api/tareas', tareaRoutes);


const PORT = process.env.PORT || 4000;
const servidor = app.listen(PORT,()=>{
    console.log(`Server running at PORT ${PORT}`)
});

/* Socket IO */
import { Server } from 'socket.io';
const io = new Server(servidor, {
    pingTimeout: 60000,
    cors:{
        origin: process.env.FRONTEND_URL
    }
});

io.on('connection',(socket)=>{
    socket.on('abrir proyecto', (proyecto)=>{
        socket.join(proyecto);
    })

    /* Definir los eventos */
    socket.on('nueva tarea', (tarea)=>{
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea agregada', tarea);
    });

    socket.on('eliminar tarea', (tarea)=>{
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea eliminada', tarea)
    });

    socket.on('actualizar tarea',(tarea)=>{
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('tarea actualizada', tarea);
    });

    socket.on('cambiar estado', (tarea)=>{
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('nuevo estado', tarea);
    })

})

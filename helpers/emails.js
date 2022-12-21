import nodemailer from 'nodemailer';

export const emailRegistro = async (datos)=>{
    const {email, nombre, token } = datos;

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const info = await transport.sendMail({
        from: '"Uptask - Administrador de proyectos" <cuentas@uptask.com>',
        to: email,
        subject: 'Uptask - Confirma tu cuenta',
        text: 'Comprueba tu cuenta en upTask',
        html: `<p>Hola ${nombre}, comprueba tu cuenta en upTask</p>
            <p>
            Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
            </p>
            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
      })
}

export const emailOlvidePassword = async (datos)=>{
    const {email, nombre, token } = datos;
    //TODO: Mover hacia variables de entorno.
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const info = await transport.sendMail({
        from: '"Uptask - Administrador de proyectos" <cuentas@uptask.com>',
        to: email,
        subject: 'Uptask - Reestablece tu password.',
        text: 'Reestablece tu password',
        html: `<p>Hola ${nombre}, has solicitado reestablecer tu password.</p>
            <p>
            Sigue el siguiente enlace para generar tu nuevo passowrd:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablece tu password</a>
            </p>
            <p>Si no solicitaste este email, puedes ignorar este mensaje.</p>
        `
      })
}
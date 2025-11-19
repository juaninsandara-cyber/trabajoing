// controllers/notificacionController.js 
const nodemailer = require('nodemailer');
const Ingreso = require('../models/ingreso');
const User = require('../models/user');
const Membresia = require('../models/membresia');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class NotificacionController {
    async verificarYNotificarOcupacion(req, res) {
    try {
        console.log('🔍 Verificando ocupación...');
        res.json({
            mensaje: 'Función en desarrollo - Prueba usar /prueba-correo',
            status: 'ok'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno' });
    }
}

async getEstadoParqueadero(req, res) {
    try {
        console.log('📊 Obteniendo estado...');
        res.json({
            mensaje: 'Función en desarrollo - Prueba usar /prueba-correo', 
            status: 'ok'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno' });
    }
}
    
    async pruebaEnvioCorreo(req, res) {
        try {
            console.log(' Iniciando prueba de envío de correo...');
            
            // Usa las columnas 
            const usuariosConMembresia = await Membresia.findAll({
                where: { estado: 'activa' },
                include: [{
                    model: User,
                    attributes: ['id', 'username', 'email'] // ← username y email
                }]
            });

            console.log(` Usuarios con membresía encontrados: ${usuariosConMembresia.length}`);

            if (usuariosConMembresia.length === 0) {
                return res.json({
                    mensaje: 'No hay usuarios con membresía activa para enviar prueba',
                    usuarios_encontrados: 0
                });
            }

            const resultados = [];
            const asunto = " PRUEBA - Sistema de Notificaciones Parqueadero";

            for (const membresiaItem of usuariosConMembresia) {
                try {
                    const usuarioData = membresiaItem.User;
                    
                    // Usa las columnas 
                    const email = usuarioData.email;
                    const nombre = usuarioData.username;
                    
                    console.log(` Enviando prueba a: ${email} (${nombre})`);
                    
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: asunto,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px;">
                                <h2 style="color: #007bff;"> Prueba de Notificación</h2>
                                <p>Hola <strong>${nombre}</strong>,</p>
                                <p>Esta es una <strong>prueba del sistema de notificaciones</strong> del parqueadero.</p>
                                <p>Cuando el parqueadero esté por llenarse (80%+ de ocupación), recibirás una alerta automática.</p>
                                <p><strong>Tu membresía:</strong> ${membresiaItem.tipo}</p>
                                <br>
                                <p style="color: #28a745; font-weight: bold;">Si recibes este correo, el sistema está funcionando correctamente.</p>
                            </div>
                        `
                    };

                    await transporter.sendMail(mailOptions);
                    
                    resultados.push({ 
                        exito: true, 
                        email: email,
                        nombre: nombre
                    });
                    
                    console.log(` Correo enviado a: ${email}`);
                    
                } catch (error) {
                    resultados.push({ 
                        exito: false, 
                        email: usuarioData.email, 
                        error: error.message
                    });
                    console.error(` Error con ${usuarioData.email}:`, error.message);
                }
                
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            const exitosos = resultados.filter(r => r.exito).length;
            const fallidos = resultados.filter(r => !r.exito).length;

            console.log(`Resultado: ${exitosos} exitosos, ${fallidos} fallidos`);

            res.json({
                mensaje: 'Prueba completada',
                total_usuarios: usuariosConMembresia.length,
                correos_enviados: exitosos,
                correos_fallidos: fallidos,
                detalles: resultados
            });

        } catch (error) {
            console.error(' Error en pruebaEnvioCorreo:', error);
            res.status(500).json({
                error: 'Error en prueba de envío de correos',
                detalle: error.message
            });
        }
    }

}

module.exports = new NotificacionController();
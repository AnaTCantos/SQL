const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});


// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Obtener todos los cursos
app.get('/api/cursos', (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Obtener todos los centros
app.get('/api/centros', (req, res) => {
    db.query('SELECT * FROM centros', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Obtener todos los alumnos
app.get('/api/alumnos', (req, res) => {
    db.query('SELECT alumnos.*, cursos.nombre as curso_nombre FROM alumnos JOIN cursos ON alumnos.curso_id = cursos.id', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Eliminar un alumno
app.delete('/api/alumnos/:id', (req, res) => {
    const alumnoId = req.params.id;
    db.query('DELETE FROM alumnos WHERE id = ?', [alumnoId], (err, results) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

// Obtener datos para la gráfica
app.get('/api/grafica', (req, res) => {
    db.query(`SELECT cursos.nombre, 
                     COUNT(alumnos.id) AS total, 
                     IFNULL(SUM(alumnos.aprobado), 0) AS aprobados 
              FROM cursos 
              LEFT JOIN alumnos ON cursos.id = alumnos.curso_id 
              GROUP BY cursos.id`, 
    (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


// Obtener un curso por ID
app.get('/api/cursos/:id', (req, res) => {
    const cursoId = req.params.id;
    db.query('SELECT * FROM cursos WHERE id = ?', [cursoId], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Actualizar un curso
app.put('/api/cursos/:id', (req, res) => {
    const cursoId = req.params.id;
    const { nombre, fecha_importacion, nivel, descripcion, lugar } = req.body;
    db.query('UPDATE cursos SET nombre = ?, fecha_importacion = ?, nivel = ?, descripcion = ?, lugar = ? WHERE id = ?', [nombre, fecha_importacion, nivel, descripcion, lugar, cursoId], (err, results) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

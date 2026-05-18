CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'usuario' -- 'admin', 'tecnico' o 'usuario'
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(20) CHECK (prioridad IN ('Baja', 'Media', 'Alta')),
    estado VARCHAR(20) DEFAULT 'Abierto',
    usuario_id INTEGER REFERENCES usuarios(id),
    tecnico_id INTEGER REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, email, password, rol) 
VALUES ('Administrador', 'admin1@tickets.com', '123456', 'admin');

SELECT * FROM usuarios;
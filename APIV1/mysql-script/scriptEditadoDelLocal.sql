
CREATE TABLE Roles (
ID_rol INT AUTO_INCREMENT,
descripcion VARCHAR(100) NOT NULL UNIQUE,
CONSTRAINT PK_ID_rol PRIMARY KEY (ID_rol)
);

CREATE TABLE Categorias (
ID_categoria INT AUTO_INCREMENT,
descripcion VARCHAR(100) UNIQUE NOT NULL,
estado_categoria CHAR(1) DEFAULT 'A',
imagen VARCHAR(100),
CONSTRAINT PK_Categoria PRIMARY KEY (ID_categoria)
);
CREATE TABLE Tipo_productos (
ID_tipo_producto INT AUTO_INCREMENT,
descripcion VARCHAR(50) UNIQUE NOT NULL,
CONSTRAINT PK_ID_tipo_productos PRIMARY KEY (ID_tipo_producto)
);
CREATE TABLE Tipo_insumos (
ID_tipo_insumo INT AUTO_INCREMENT,
descripcion VARCHAR(30) NOT NULL,
CONSTRAINT PK_ID_Tipo_insumo PRIMARY KEY (ID_tipo_insumo)
);
CREATE TABLE Estado_pedidos (
ID_estado_pedido INT AUTO_INCREMENT,
descripcion VARCHAR(100),
CONSTRAINT PK_estado_pedido PRIMARY KEY (ID_estado_pedido)
);

CREATE TABLE Productos (
ID_producto INT AUTO_INCREMENT,
descripcion VARCHAR(100) NOT NULL,
precio_neto FLOAT NOT NULL,
estado_producto VARCHAR(20) DEFAULT 'Disponible',
ID_tipo_productos INT,
ID_categoria INT,
imagen VARCHAR(100),
CONSTRAINT PK_producto PRIMARY KEY (ID_producto),
CONSTRAINT FK_categoria_producto FOREIGN KEY (ID_categoria) REFERENCES
Categorias (ID_categoria),
CONSTRAINT FK_tipo FOREIGN KEY (ID_tipo_productos) REFERENCES
Tipo_productos(ID_tipo_producto),
CONSTRAINT UC_producto UNIQUE (ID_tipo_productos, descripcion)
);
CREATE TABLE Usuarios (
ID_usuario INT AUTO_INCREMENT,
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(10) NOT NULL,
telefono VARCHAR(10) NOT NULL UNIQUE,
ID_rol INT,
estado CHAR(1) DEFAULT 'A',
CONSTRAINT PK_usuario PRIMARY KEY (ID_usuario),
CONSTRAINT FK_Rol_usuarios FOREIGN KEY (ID_rol) REFERENCES Roles(ID_rol)
);

CREATE TABLE Permisos (
ID_permiso INT AUTO_INCREMENT,
contrasena VARCHAR(100),
descripcion VARCHAR(100) NOT NULL UNIQUE,
CONSTRAINT PK_permiso PRIMARY KEY (ID_permiso)
);

CREATE TABLE Permiso_roles (
ID_rol_permiso INT AUTO_INCREMENT,
ID_rol INT NOT NULL,
ID_permiso INT NOT NULL,
CONSTRAINT PK_ID_rol_permiso PRIMARY KEY (ID_rol_permiso),
CONSTRAINT FK_rol FOREIGN KEY (ID_rol) REFERENCES Roles(ID_rol),
CONSTRAINT FK_permiso FOREIGN KEY (ID_permiso) REFERENCES
Permisos(ID_permiso)
);

CREATE TABLE Clientes (
ID_cliente INT AUTO_INCREMENT,
documento VARCHAR(10) DEFAULT '123456789',
nombre VARCHAR(100) NOT NULL,
apellidos VARCHAR(100),
direccion VARCHAR(100) NOT NULL,
correo_electronico VARCHAR(100) NOT NULL DEFAULT 'sincorreo@gmail.com',
estado_cliente CHAR(1) DEFAULT 'A',
ID_usuario INT DEFAULT '0',
CONSTRAINT PK_cliente PRIMARY KEY (id_cliente),
CONSTRAINT FK_usuarios_clientes FOREIGN KEY (ID_usuario) REFERENCES
Usuarios (ID_usuario),
CONSTRAINT UC_documento_nombre UNIQUE (documento, nombre)
);
CREATE TABLE Pedidos (
ID_pedido INT AUTO_INCREMENT,
fecha DATETIME,
precio_total FLOAT NOT NULL,
ID_cliente INT,
ID_estado_pedido INT,
CONSTRAINT PK_pedido PRIMARY KEY (ID_pedido),
CONSTRAINT FK_pedido_cliente FOREIGN KEY (ID_cliente) REFERENCES
Clientes(ID_cliente),
CONSTRAINT FK_pedido_estado FOREIGN KEY (ID_estado_pedido) REFERENCES
Estado_pedidos(ID_estado_pedido)
);
CREATE TABLE Pedidos_Productos (
ID_pedido_producto INT AUTO_INCREMENT,
ID_pedido INT,
ID_producto INT,
cantidad INT NOT NULL,
precio_neto FLOAT NOT NULL,
precio_total FLOAT NOT NULL,
CONSTRAINT PK_pedido_producto PRIMARY KEY (ID_pedido_producto),
CONSTRAINT FK_ID_pedido FOREIGN KEY (ID_pedido) REFERENCES
Pedidos(ID_pedido),
CONSTRAINT FK_ID_producto FOREIGN KEY (ID_producto) REFERENCES
Productos(ID_producto),
CONSTRAINT UC_pedido_producto UNIQUE (ID_pedido_producto, precio_total)
);
CREATE TABLE Clientes_pedidos (
ID_cliente_pedido INT AUTO_INCREMENT,
ID_cliente INT,
ID_pedido INT,
CONSTRAINT PK_ID_cliente_pedido PRIMARY KEY (ID_cliente_pedido),
CONSTRAINT FK_cliente FOREIGN KEY (ID_cliente) REFERENCES
Clientes(ID_cliente),
CONSTRAINT FK_pedido FOREIGN KEY (ID_pedido) REFERENCES
Pedidos(ID_pedido)
);
CREATE TABLE Insumos (
ID_insumo INT AUTO_INCREMENT,
ID_tipo_insumo INT NOT NULL,
descripcion_insumo VARCHAR(50) NOT NULL,
estado_insumo CHAR(1) DEFAULT 'D' NOT NULL,
precio FLOAT,
CONSTRAINT PK_ID_insumo PRIMARY KEY (ID_insumo),
CONSTRAINT FK_tipo_insumo FOREIGN KEY (ID_tipo_insumo) REFERENCES
Tipo_insumos(ID_tipo_insumo)
);
CREATE TABLE Porciones (
ID_porcion INT AUTO_INCREMENT,
medida VARCHAR(50) NOT NULL,
ID_producto INT NOT NULL,
numero_porcion INT NOT NULL,
CONSTRAINT PK_ID_porcion PRIMARY KEY (ID_porcion),
CONSTRAINT FK_ID_producto_porciones FOREIGN KEY (ID_producto) REFERENCES
Productos(ID_producto)
);
CREATE TABLE Stock_insumos (
ID_stock_insumo INT AUTO_INCREMENT,
stock_min INT NOT NULL,
stock_max INT NOT NULL,
stock_actual INT,
ID_porcion INT,
medida VARCHAR(30),
unidad INT,
sabor_helado VARCHAR(50),
CONSTRAINT PK_ID_stock_insumo PRIMARY KEY (ID_stock_insumo),
CONSTRAINT FK_ID_porcion FOREIGN KEY (ID_porcion) REFERENCES
Porciones(ID_porcion)
);
CREATE TABLE Configuraciones (
ID_configuracion INT AUTO_INCREMENT,
ID_insumo INT,
descripcion VARCHAR(100),
CONSTRAINT PK_ID_configuracion PRIMARY KEY (ID_configuracion),
CONSTRAINT FK_ID_insumo_configuracion FOREIGN KEY (ID_insumo) REFERENCES
Insumos(ID_insumo)
);
CREATE TABLE Pedidos_configuraciones (
ID_pedido_configuracion INT AUTO_INCREMENT,
ID_pedido INT,
ID_configuracion INT,
cantidad INT,
subtotal FLOAT,
CONSTRAINT PK_ID_pedido_configuracion PRIMARY KEY (ID_pedido_configuracion),
CONSTRAINT FK_ID_pedido_detalle FOREIGN KEY (ID_pedido) REFERENCES
Pedidos(ID_pedido),
CONSTRAINT FK_ID_configuracion_detalle FOREIGN KEY (ID_configuracion)
REFERENCES Configuraciones(ID_configuracion)
);api_finalapi_final


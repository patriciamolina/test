-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost:3333
-- Tiempo de generación: 20-12-2014 a las 21:44:13
-- Versión del servidor: 5.5.24-log
-- Versión de PHP: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `infogeo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `audio`
--

DROP TABLE IF EXISTS `audio`;
CREATE TABLE IF NOT EXISTS `audio` (
  `idAudio` int(11) NOT NULL AUTO_INCREMENT,
  `idDestino` int(11) NOT NULL,
  `ruta` varchar(80) NOT NULL,
  PRIMARY KEY (`idAudio`),
  KEY `fk_audio_destino1_idx` (`idDestino`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `audiovideo_tiene_lenguaje`
--

DROP TABLE IF EXISTS `audiovideo_tiene_lenguaje`;
CREATE TABLE IF NOT EXISTS `audiovideo_tiene_lenguaje` (
  `idAudio` int(11) NOT NULL,
  `idLenguaje` int(11) NOT NULL,
  `idVideo` int(11) NOT NULL,
  PRIMARY KEY (`idAudio`,`idLenguaje`,`idVideo`),
  KEY `fk_Audio_has_Lenguaje_Lenguaje1_idx` (`idLenguaje`),
  KEY `fk_Audio_has_Lenguaje_Audio1_idx` (`idAudio`),
  KEY `fk_Audio_has_Lenguaje_Video1_idx` (`idVideo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `audio_tiene_texto`
--

DROP TABLE IF EXISTS `audio_tiene_texto`;
CREATE TABLE IF NOT EXISTS `audio_tiene_texto` (
  `idAudio` int(11) NOT NULL,
  `idTexto` int(11) NOT NULL,
  `idTipoTexto` int(11) NOT NULL,
  PRIMARY KEY (`idAudio`,`idTexto`,`idTipoTexto`),
  KEY `fk_Audio_has_Texto_Texto1_idx` (`idTexto`),
  KEY `fk_Audio_has_Texto_Audio1_idx` (`idAudio`),
  KEY `fk_Audio_tiene_Texto_TipoTexto1_idx` (`idTipoTexto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

DROP TABLE IF EXISTS `categoria`;
CREATE TABLE IF NOT EXISTS `categoria` (
  `idCategoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(450) NOT NULL,
  `nombreicono` varchar(450) NOT NULL,
  `iconox` int(11) NOT NULL,
  `iconoy` int(11) NOT NULL,
  `color` varchar(45) NOT NULL,
  PRIMARY KEY (`idCategoria`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`idCategoria`, `nombre`, `nombreicono`, `iconox`, `iconoy`, `color`) VALUES
(1, 'atractivos turísticos', 'atractivos', 182, 34, '0x3E7493');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_tiene_texto`
--

DROP TABLE IF EXISTS `categoria_tiene_texto`;
CREATE TABLE IF NOT EXISTS `categoria_tiene_texto` (
  `idCategoria` int(11) NOT NULL,
  `idTexto` int(11) NOT NULL,
  `idTipoTexto` int(11) NOT NULL,
  PRIMARY KEY (`idCategoria`,`idTexto`,`idTipoTexto`),
  KEY `fk_Categoria_has_Texto_Texto2_idx` (`idTexto`),
  KEY `fk_Categoria_has_Texto_Categoria2_idx` (`idCategoria`),
  KEY `fk_Categoria_tiene_Texto_TipoTexto1_idx` (`idTipoTexto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `categoria_tiene_texto`
--

INSERT INTO `categoria_tiene_texto` (`idCategoria`, `idTexto`, `idTipoTexto`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

DROP TABLE IF EXISTS `cliente`;
CREATE TABLE IF NOT EXISTS `cliente` (
  `idCliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombreCliente` varchar(120) NOT NULL,
  `estadoSuscripcion` varchar(45) NOT NULL,
  `fechaInicioSuscripcion` date NOT NULL,
  `fechaFinSuscripcion` date NOT NULL,
  PRIMARY KEY (`idCliente`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`idCliente`, `nombreCliente`, `estadoSuscripcion`, `fechaInicioSuscripcion`, `fechaFinSuscripcion`) VALUES
(0, 'DATACTIL', '1', '2014-12-23', '3000-12-31'),
(1, 'SERNATUR', '1', '2014-12-23', '3000-12-31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codigoqr`
--

DROP TABLE IF EXISTS `codigoqr`;
CREATE TABLE IF NOT EXISTS `codigoqr` (
  `idCodigoQR` int(11) NOT NULL AUTO_INCREMENT,
  `idDestino` int(11) NOT NULL,
  `ruta` varchar(80) NOT NULL,
  PRIMARY KEY (`idCodigoQR`),
  KEY `fk_codigoqr_destino1_idx` (`idDestino`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codigoqr_tiene_texto`
--

DROP TABLE IF EXISTS `codigoqr_tiene_texto`;
CREATE TABLE IF NOT EXISTS `codigoqr_tiene_texto` (
  `idTexto` int(11) NOT NULL,
  `idCodigoQR` int(11) NOT NULL,
  `idTipoTexto` int(11) NOT NULL,
  PRIMARY KEY (`idTexto`,`idCodigoQR`,`idTipoTexto`),
  KEY `fk_Texto_has_CodigoQR_CodigoQR1_idx` (`idCodigoQR`),
  KEY `fk_Texto_has_CodigoQR_Texto1_idx` (`idTexto`),
  KEY `fk_CodigoQR_tiene_Texto_TipoTexto1_idx` (`idTipoTexto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destino`
--

DROP TABLE IF EXISTS `destino`;
CREATE TABLE IF NOT EXISTS `destino` (
  `idDestino` int(11) NOT NULL AUTO_INCREMENT,
  `idEstadoDestino` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `rutabiblioteca` varchar(500) NOT NULL,
  `iconox` int(11) NOT NULL,
  `nombreicono` varchar(450) NOT NULL,
  `iconoy` int(11) NOT NULL,
  `color` varchar(8) NOT NULL DEFAULT '0xAAAAAA',
  `tienePanel` tinyint(1) NOT NULL DEFAULT '0',
  `nombre` varchar(150) NOT NULL,
  `tipoGeometria` varchar(500) NOT NULL,
  `geom` geometry DEFAULT NULL,
  `geometria` text NOT NULL,
  PRIMARY KEY (`idDestino`),
  KEY `fk_Destino_Cliente1_idx` (`idCliente`),
  KEY `fk_Destino_EstadoDestino1_idx` (`idEstadoDestino`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1205 ;

--
-- Disparadores `destino`
--
DROP TRIGGER IF EXISTS `destino_BINS`;
DELIMITER //
CREATE TRIGGER `destino_BINS` BEFORE INSERT ON `destino`
 FOR EACH ROW begin
  SET new.geom = GeomFromText(new.geometria);
End
//
DELIMITER ;
DROP TRIGGER IF EXISTS `destino_BUPD`;
DELIMITER //
CREATE TRIGGER `destino_BUPD` BEFORE UPDATE ON `destino`
 FOR EACH ROW begin
  SET new.geom = GeomFromText(new.geometria);
End
//
DELIMITER ;

--
-- Volcado de datos para la tabla `destino`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destino_tiene_puntohijo`
--

DROP TABLE IF EXISTS `destino_tiene_puntohijo`;
CREATE TABLE IF NOT EXISTS `destino_tiene_puntohijo` (
  `idDestinoPadre` int(11) NOT NULL,
  `idDestinoHijo` int(11) NOT NULL,
  `coordenadas` varchar(500) NOT NULL,
  PRIMARY KEY (`idDestinoPadre`,`idDestinoHijo`),
  KEY `fk_Destino_has_Destino_Destino2_idx` (`idDestinoHijo`),
  KEY `fk_Destino_has_Destino_Destino1_idx` (`idDestinoPadre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destino_tiene_texto`
--

DROP TABLE IF EXISTS `destino_tiene_texto`;
CREATE TABLE IF NOT EXISTS `destino_tiene_texto` (
  `idDestino` int(11) NOT NULL,
  `idTexto` int(11) NOT NULL,
  `idTipoTexto` int(11) NOT NULL,
  PRIMARY KEY (`idDestino`,`idTexto`,`idTipoTexto`),
  KEY `fk_Destino_tiene_Texto_Destino1_idx` (`idDestino`),
  KEY `fk_Destino_tiene_Texto_Texto1_idx` (`idTexto`),
  KEY `fk_Destino_tiene_Texto_TipoTexto1_idx` (`idTipoTexto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `destino_tiene_texto`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadodestino`
--

DROP TABLE IF EXISTS `estadodestino`;
CREATE TABLE IF NOT EXISTS `estadodestino` (
  `idEstadoDestino` int(11) NOT NULL,
  `nombreEstado` varchar(45) NOT NULL,
  PRIMARY KEY (`idEstadoDestino`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `estadodestino`
--

INSERT INTO `estadodestino` (`idEstadoDestino`, `nombreEstado`) VALUES
(1, 'ACEPTADO'),
(2, 'MODERADO'),
(3, 'ELIMINADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen`
--

DROP TABLE IF EXISTS `imagen`;
CREATE TABLE IF NOT EXISTS `imagen` (
  `idImagenes` int(11) NOT NULL AUTO_INCREMENT,
  `ruta` varchar(80) NOT NULL,
  `idDestino` int(11) NOT NULL,
  PRIMARY KEY (`idImagenes`),
  KEY `fk_imagen_destino1_idx` (`idDestino`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=282 ;

--
-- Volcado de datos para la tabla `imagen`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen_tiene_texto`
--

DROP TABLE IF EXISTS `imagen_tiene_texto`;
CREATE TABLE IF NOT EXISTS `imagen_tiene_texto` (
  `idTexto` int(11) NOT NULL,
  `idImagenes` int(11) NOT NULL,
  `idTipoTexto` int(11) NOT NULL,
  PRIMARY KEY (`idTexto`,`idImagenes`,`idTipoTexto`),
  KEY `fk_Texto_has_Imagen_Imagen1_idx` (`idImagenes`),
  KEY `fk_Texto_has_Imagen_Texto1_idx` (`idTexto`),
  KEY `fk_Imagen_tiene_Texto_TipoTexto1_idx` (`idTipoTexto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lenguaje`
--

DROP TABLE IF EXISTS `lenguaje`;
CREATE TABLE IF NOT EXISTS `lenguaje` (
  `idLenguaje` int(11) NOT NULL AUTO_INCREMENT,
  `nombreLenguaje` varchar(45) NOT NULL,
  PRIMARY KEY (`idLenguaje`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `lenguaje`
--

INSERT INTO `lenguaje` (`idLenguaje`, `nombreLenguaje`) VALUES
(1, 'ESPAÑOL'),
(2, 'INGLES');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategoria`
--

DROP TABLE IF EXISTS `subcategoria`;
CREATE TABLE IF NOT EXISTS `subcategoria` (
  `idSubCategoria` int(11) NOT NULL AUTO_INCREMENT,
  `idCategoria` int(11) NOT NULL,
  `nombre` varchar(450) NOT NULL,
  `nombreicono` varchar(450) NOT NULL,
  `iconox` int(11) NOT NULL,
  `iconoy` int(11) NOT NULL,
  `color` varchar(8) NOT NULL DEFAULT '0xAAAAAA',
  PRIMARY KEY (`idSubCategoria`),
  KEY `fk_SubCategoria_Categoria1_idx` (`idCategoria`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=78 ;

--
-- Volcado de datos para la tabla `subcategoria`
--

INSERT INTO `subcategoria` (`idSubCategoria`, `idCategoria`, `nombre`, `nombreicono`, `iconox`, `iconoy`, `color`) VALUES
(1, 1, 'área silvestre protegida o reserva de flora y fauna', 'reserva', 0, 0, '0xD22E2E'),
(2, 1, 'arquitectura popular espontánea', 'arquitectura', 26, 0, '0xBB455F'),
(3, 1, 'artesanía o arte', 'artesania', 52, 0, '0xC1CF67'),
(4, 1, 'artístico', 'artistico', 78, 0, '0x448262'),
(5, 1, 'caída de agua', 'caidadeagua', 104, 0, '0x8FC9F8'),
(6, 1, 'camino pintoresco', 'caminopintoresco', 130, 0, '0xE36453'),
(7, 1, 'centro científico', 'centrocientifico', 156, 0, '0x00C4F7'),
(8, 1, 'costa', 'costa', 182, 0, '0x005374'),
(9, 1, 'deportivo', 'deporte', 208, 0, '0xE36453'),
(10, 1, 'evento misceláneo', 'evento', 234, 0, '0x27C1B9'),
(11, 1, 'feria o mercado', 'feria', 260, 0, '0xE1BA3E'),
(12, 1, 'grupo étnico', 'grupoetnico', 286, 0, '0xFF8964'),
(13, 1, 'gruta o caverna', 'gruta', 312, 0, '0xE47272'),
(14, 1, 'lago, laguna o humedal', 'lago', 338, 0, '0x4389FF'),
(15, 1, 'lugar de observación de flora y fauna', 'observacion', 364, 0, '0x778F9B'),
(16, 1, 'lugar histórico', 'historia', 390, 0, '0x445963'),
(17, 1, 'lugar interés geológico o paleontológico', 'geologia', 416, 0, '0xA0877E'),
(18, 1, 'manifestación religiosa o creencia popular', 'religion', 442, 0, '0x81B0FF'),
(19, 1, 'montaña', 'montaña', 468, 0, '0x8C6D62'),
(20, 1, 'museo', 'museo', 494, 0, '0xBCBCBC'),
(21, 1, 'música y/o danzas', 'musica', 520, 0, '0xB967C7'),
(22, 1, 'obra de arte o técnica', 'obradearte', 546, 0, '0x976DB5'),
(23, 1, 'parque de recreación', 'parque', 0, 34, '0x65BA69'),
(24, 1, 'planicie', 'planicie', 26, 34, '0x9BCB64'),
(25, 1, 'río o estero', 'rio', 52, 34, '0x28B5F5'),
(26, 1, 'ruina o lugar arqueológico', 'ruina', 78, 34, '0xBBA9A3'),
(27, 1, 'termas', 'terma', 104, 34, '0x7FD7FF');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategoria_tiene_destino`
--

DROP TABLE IF EXISTS `subcategoria_tiene_destino`;
CREATE TABLE IF NOT EXISTS `subcategoria_tiene_destino` (
  `idDestino` int(11) NOT NULL,
  `idSubCategoria` int(11) NOT NULL,
  PRIMARY KEY (`idDestino`,`idSubCategoria`),
  KEY `fk_SubCategoria_tiene_Destino_Destino1_idx` (`idDestino`),
  KEY `fk_SubCategoria_tiene_Destino_SubCategoria1_idx` (`idSubCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `subcategoria_tiene_destino`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategoria_tiene_texto`
--

DROP TABLE IF EXISTS `subcategoria_tiene_texto`;
CREATE TABLE IF NOT EXISTS `subcategoria_tiene_texto` (
  `idSubCategoria` int(11) NOT NULL,
  `idTexto` int(11) NOT NULL,
  `idTipoTexto` int(11) NOT NULL,
  PRIMARY KEY (`idSubCategoria`,`idTexto`,`idTipoTexto`),
  KEY `fk_Categoria_has_Texto_Texto1_idx` (`idTexto`),
  KEY `fk_Categoria_has_Texto_Categoria1_idx` (`idSubCategoria`),
  KEY `fk_SubCategoria_tiene_Texto_TipoTexto1_idx` (`idTipoTexto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `subcategoria_tiene_texto`
--

INSERT INTO `subcategoria_tiene_texto` (`idSubCategoria`, `idTexto`, `idTipoTexto`) VALUES
(1, 2, 1),
(2, 3, 1),
(3, 4, 1),
(4, 5, 1),
(5, 6, 1),
(6, 7, 1),
(7, 8, 1),
(8, 9, 1),
(9, 10, 1),
(10, 11, 1),
(11, 12, 1),
(12, 13, 1),
(13, 14, 1),
(14, 15, 1),
(15, 16, 1),
(16, 17, 1),
(17, 18, 1),
(18, 19, 1),
(19, 20, 1),
(20, 21, 1),
(21, 22, 1),
(22, 23, 1),
(23, 24, 1),
(24, 25, 1),
(25, 26, 1),
(26, 27, 1),
(27, 28, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `texto`
--

DROP TABLE IF EXISTS `texto`;
CREATE TABLE IF NOT EXISTS `texto` (
  `idTexto` int(11) NOT NULL AUTO_INCREMENT,
  `idLenguaje` int(11) NOT NULL,
  `texto` text NOT NULL,
  PRIMARY KEY (`idTexto`),
  KEY `fk_Texto_Lenguaje1_idx` (`idLenguaje`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4663 ;

--
-- Volcado de datos para la tabla `texto`
--

INSERT INTO `texto` (`idTexto`, `idLenguaje`, `texto`) VALUES
(1, 1, 'atractivos turísticos'),
(2, 1, 'área silvestre protegida o reserva de flora y fauna'),
(3, 1, 'arquitectura popular espontánea'),
(4, 1, 'artesanía o arte'),
(5, 1, 'artístico'),
(6, 1, 'caída de agua'),
(7, 1, 'camino pintoresco'),
(8, 1, 'centro científico'),
(9, 1, 'costa'),
(10, 1, 'deportivo'),
(11, 1, 'evento misceláneo'),
(12, 1, 'feria o mercado'),
(13, 1, 'grupo étnico'),
(14, 1, 'gruta o caverna'),
(15, 1, 'lago, laguna o humedal'),
(16, 1, 'lugar de observación de flora y fauna'),
(17, 1, 'lugar histórico'),
(18, 1, 'lugar interés geológico o paleontológico'),
(19, 1, 'manifestación religiosa o creencia popular'),
(20, 1, 'montaña'),
(21, 1, 'museo'),
(22, 1, 'música y/o danzas'),
(23, 1, 'obra de arte o técnica'),
(24, 1, 'parque de recreación'),
(25, 1, 'planicie'),
(26, 1, 'río o estero'),
(27, 1, 'ruina o lugar arqueológico'),
(28, 1, 'termas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipotexto`
--

DROP TABLE IF EXISTS `tipotexto`;
CREATE TABLE IF NOT EXISTS `tipotexto` (
  `idTipoTexto` int(11) NOT NULL AUTO_INCREMENT,
  `nombreTipoTexto` varchar(45) NOT NULL,
  PRIMARY KEY (`idTipoTexto`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Volcado de datos para la tabla `tipotexto`
--

INSERT INTO `tipotexto` (`idTipoTexto`, `nombreTipoTexto`) VALUES
(1, 'TITULO'),
(2, 'TELEFONO'),
(3, 'DESCRIPCION'),
(4, 'DIRECCION'),
(5, 'LOCALIDAD'),
(6, 'CORREO'),
(7, 'REGION'),
(8, 'PROVINCIA'),
(9, 'COMUNA'),
(10, 'LOCALIDADES CERCANAS'),
(11, 'NUMERO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `video`
--

DROP TABLE IF EXISTS `video`;
CREATE TABLE IF NOT EXISTS `video` (
  `idVideo` int(11) NOT NULL AUTO_INCREMENT,
  `idDestino` int(11) NOT NULL,
  `ruta` varchar(80) NOT NULL,
  PRIMARY KEY (`idVideo`),
  KEY `fk_video_destino1_idx` (`idDestino`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `video_tiene_texto`
--

DROP TABLE IF EXISTS `video_tiene_texto`;
CREATE TABLE IF NOT EXISTS `video_tiene_texto` (
  `idVideo` int(11) NOT NULL,
  `idTexto` int(11) NOT NULL,
  `idTipoTexto` int(11) NOT NULL,
  PRIMARY KEY (`idVideo`,`idTexto`,`idTipoTexto`),
  KEY `fk_Video_has_Texto_Texto1_idx` (`idTexto`),
  KEY `fk_Video_has_Texto_Video1_idx` (`idVideo`),
  KEY `fk_Video_tiene_Texto_TipoTexto1_idx` (`idTipoTexto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `audio`
--
ALTER TABLE `audio`
  ADD CONSTRAINT `fk_audio_destino1` FOREIGN KEY (`idDestino`) REFERENCES `destino` (`idDestino`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `audiovideo_tiene_lenguaje`
--
ALTER TABLE `audiovideo_tiene_lenguaje`
  ADD CONSTRAINT `fk_Audio_has_Lenguaje_Audio1` FOREIGN KEY (`idAudio`) REFERENCES `audio` (`idAudio`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Audio_has_Lenguaje_Lenguaje1` FOREIGN KEY (`idLenguaje`) REFERENCES `lenguaje` (`idLenguaje`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Audio_has_Lenguaje_Video1` FOREIGN KEY (`idVideo`) REFERENCES `video` (`idVideo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `audio_tiene_texto`
--
ALTER TABLE `audio_tiene_texto`
  ADD CONSTRAINT `fk_Audio_has_Texto_Audio1` FOREIGN KEY (`idAudio`) REFERENCES `audio` (`idAudio`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Audio_has_Texto_Texto1` FOREIGN KEY (`idTexto`) REFERENCES `texto` (`idTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Audio_tiene_Texto_TipoTexto1` FOREIGN KEY (`idTipoTexto`) REFERENCES `tipotexto` (`idTipoTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `categoria_tiene_texto`
--
ALTER TABLE `categoria_tiene_texto`
  ADD CONSTRAINT `fk_Categoria_has_Texto_Categoria2` FOREIGN KEY (`idCategoria`) REFERENCES `categoria` (`idCategoria`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Categoria_has_Texto_Texto2` FOREIGN KEY (`idTexto`) REFERENCES `texto` (`idTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Categoria_tiene_Texto_TipoTexto1` FOREIGN KEY (`idTipoTexto`) REFERENCES `tipotexto` (`idTipoTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `codigoqr`
--
ALTER TABLE `codigoqr`
  ADD CONSTRAINT `fk_codigoqr_destino1` FOREIGN KEY (`idDestino`) REFERENCES `destino` (`idDestino`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `codigoqr_tiene_texto`
--
ALTER TABLE `codigoqr_tiene_texto`
  ADD CONSTRAINT `fk_CodigoQR_tiene_Texto_TipoTexto1` FOREIGN KEY (`idTipoTexto`) REFERENCES `tipotexto` (`idTipoTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Texto_has_CodigoQR_CodigoQR1` FOREIGN KEY (`idCodigoQR`) REFERENCES `codigoqr` (`idCodigoQR`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Texto_has_CodigoQR_Texto1` FOREIGN KEY (`idTexto`) REFERENCES `texto` (`idTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `destino`
--
ALTER TABLE `destino`
  ADD CONSTRAINT `fk_Destino_Cliente1` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Destino_EstadoDestino1` FOREIGN KEY (`idEstadoDestino`) REFERENCES `estadodestino` (`idEstadoDestino`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `destino_tiene_puntohijo`
--
ALTER TABLE `destino_tiene_puntohijo`
  ADD CONSTRAINT `fk_Destino_has_Destino_Destino1` FOREIGN KEY (`idDestinoPadre`) REFERENCES `destino` (`idDestino`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Destino_has_Destino_Destino2` FOREIGN KEY (`idDestinoHijo`) REFERENCES `destino` (`idDestino`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `destino_tiene_texto`
--
ALTER TABLE `destino_tiene_texto`
  ADD CONSTRAINT `fk_Destino_tiene_Texto_Destino1` FOREIGN KEY (`idDestino`) REFERENCES `destino` (`idDestino`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Destino_tiene_Texto_Texto1` FOREIGN KEY (`idTexto`) REFERENCES `texto` (`idTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Destino_tiene_Texto_TipoTexto1` FOREIGN KEY (`idTipoTexto`) REFERENCES `tipotexto` (`idTipoTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD CONSTRAINT `fk_imagen_destino1` FOREIGN KEY (`idDestino`) REFERENCES `destino` (`idDestino`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `imagen_tiene_texto`
--
ALTER TABLE `imagen_tiene_texto`
  ADD CONSTRAINT `fk_Imagen_tiene_Texto_TipoTexto1` FOREIGN KEY (`idTipoTexto`) REFERENCES `tipotexto` (`idTipoTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Texto_has_Imagen_Imagen1` FOREIGN KEY (`idImagenes`) REFERENCES `imagen` (`idImagenes`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Texto_has_Imagen_Texto1` FOREIGN KEY (`idTexto`) REFERENCES `texto` (`idTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD CONSTRAINT `fk_SubCategoria_Categoria1` FOREIGN KEY (`idCategoria`) REFERENCES `categoria` (`idCategoria`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `subcategoria_tiene_destino`
--
ALTER TABLE `subcategoria_tiene_destino`
  ADD CONSTRAINT `fk_SubCategoria_tiene_Destino_Destino1` FOREIGN KEY (`idDestino`) REFERENCES `destino` (`idDestino`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_SubCategoria_tiene_Destino_SubCategoria1` FOREIGN KEY (`idSubCategoria`) REFERENCES `subcategoria` (`idSubCategoria`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `subcategoria_tiene_texto`
--
ALTER TABLE `subcategoria_tiene_texto`
  ADD CONSTRAINT `fk_Categoria_has_Texto_Categoria1` FOREIGN KEY (`idSubCategoria`) REFERENCES `subcategoria` (`idSubCategoria`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Categoria_has_Texto_Texto1` FOREIGN KEY (`idTexto`) REFERENCES `texto` (`idTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_SubCategoria_tiene_Texto_TipoTexto1` FOREIGN KEY (`idTipoTexto`) REFERENCES `tipotexto` (`idTipoTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `texto`
--
ALTER TABLE `texto`
  ADD CONSTRAINT `fk_Texto_Lenguaje1` FOREIGN KEY (`idLenguaje`) REFERENCES `lenguaje` (`idLenguaje`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `video`
--
ALTER TABLE `video`
  ADD CONSTRAINT `fk_video_destino1` FOREIGN KEY (`idDestino`) REFERENCES `destino` (`idDestino`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `video_tiene_texto`
--
ALTER TABLE `video_tiene_texto`
  ADD CONSTRAINT `fk_Video_has_Texto_Texto1` FOREIGN KEY (`idTexto`) REFERENCES `texto` (`idTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Video_has_Texto_Video1` FOREIGN KEY (`idVideo`) REFERENCES `video` (`idVideo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Video_tiene_Texto_TipoTexto1` FOREIGN KEY (`idTipoTexto`) REFERENCES `tipotexto` (`idTipoTexto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost:3333
-- Tiempo de generación: 17-12-2014 a las 22:11:21
-- Versión del servidor: 5.5.24-log
-- Versión de PHP: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `infosesion`
--

use infosesion;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `application`
--

DROP TABLE IF EXISTS `application`;
CREATE TABLE IF NOT EXISTS `application` (
  `id` varchar(255) NOT NULL,
  `realm` varchar(512) DEFAULT NULL,
  `name` varchar(512) DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  `icon` varchar(512) DEFAULT NULL,
  `owner` varchar(512) DEFAULT NULL,
  `collaborators` varchar(4096) DEFAULT NULL,
  `email` varchar(512) DEFAULT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `url` varchar(512) DEFAULT NULL,
  `callbackUrls` varchar(4096) DEFAULT NULL,
  `permissions` varchar(4096) DEFAULT NULL,
  `clientKey` varchar(512) DEFAULT NULL,
  `javaScriptKey` varchar(512) DEFAULT NULL,
  `restApiKey` varchar(512) DEFAULT NULL,
  `windowsKey` varchar(512) DEFAULT NULL,
  `masterKey` varchar(512) DEFAULT NULL,
  `pushSettings` varchar(4096) DEFAULT NULL,
  `authenticationEnabled` tinyint(1) DEFAULT NULL,
  `anonymousAllowed` tinyint(1) DEFAULT NULL,
  `authenticationSchemes` varchar(4096) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `application`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `credentials` text,
  `challenges` text,
  `email` varchar(512) DEFAULT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  `status` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `lastUpdated` datetime DEFAULT NULL,
  `idcliente` int(11) NOT NULL,
  `nombres` varchar(150) CHARACTER SET utf8 NOT NULL,
  `apellidos` varchar(150) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Volcado de datos para la tabla `customer`
--

INSERT INTO `customer` (`id`, `realm`, `username`, `password`, `credentials`, `challenges`, `email`, `emailVerified`, `verificationToken`, `status`, `created`, `lastUpdated`, `idcliente`, `nombres`, `apellidos`) VALUES
(1, NULL, 'sernaturadmin', '$2a$10$4oLm9TIaVGcQR5EkXixph.9bot9dmRHUPvo3tLEpt9Dc3CY9vX8UO', NULL, NULL, 'foo@bar.com', NULL, NULL, NULL, NULL, NULL, 1, 'Administrador', 'Sernatur');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Role`
--

DROP TABLE IF EXISTS `Role`;
CREATE TABLE IF NOT EXISTS `Role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) DEFAULT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Volcado de datos para la tabla `Role`
--

INSERT INTO `Role` (`id`, `name`, `description`, `created`, `modified`) VALUES
(1, 'ADMIN', 'El rol de Administrador permite a un usuario hacer cualquier acción (Crear, Leer, Editar, Borrar) y ademas gestionar Usuarios dentro de la API (excepto los de tipo Admin).', '2014-11-27 20:41:12', '2014-11-27 20:41:12'),
(2, 'ESCRITOR', 'El rol de ESCRITOR permite a un usuario crear, actualizar y eliminar registros dentro de la API.', '2014-11-27 20:42:58', '2014-11-27 20:42:58'),
(3, 'LECTOR', 'El rol de LECTOR permite a un usuario leer registros dentro de la API.', '2014-11-27 20:42:58', '2014-11-27 20:42:58'),
(4, 'SUPERADMIN', 'El rol de Super Administrador permite a un usuario hacer cualquier acción (Crear, Leer, Editar, Borrar) y ademas gestionar Usuarios dentro de la API (incluyendo los de tipo admin).', '2014-11-27 20:42:58', '2014-11-27 20:42:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rolemapping`
--

DROP TABLE IF EXISTS `rolemapping`;
CREATE TABLE IF NOT EXISTS `rolemapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Volcado de datos para la tabla `rolemapping`
--

INSERT INTO `rolemapping` (`id`, `principalType`, `principalId`, `roleId`) VALUES
(1, 'USER', '1', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

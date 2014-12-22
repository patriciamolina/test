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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acl`
--

DROP TABLE IF EXISTS `acl`;
CREATE TABLE IF NOT EXISTS `acl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

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

INSERT INTO `application` (`id`, `realm`, `name`, `description`, `icon`, `owner`, `collaborators`, `email`, `emailVerified`, `url`, `callbackUrls`, `permissions`, `clientKey`, `javaScriptKey`, `restApiKey`, `windowsKey`, `masterKey`, `pushSettings`, `authenticationEnabled`, `anonymousAllowed`, `authenticationSchemes`, `status`, `created`, `modified`) VALUES
('123', NULL, 'demo-app', NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, NULL, 'b0b6342b011c8f803cce4e78bcfbdd04af26e437', 'eb5c66d52aeecc2d98fe41f7480e6f091dbe2aca', 'secret', 'd72a36866ca82a729a4fa6a1eab5c41eb17a5b3d', 'dddd36e8a9ffa276f057f0df1cdfb82ed9fcc47c', NULL, 1, 1, NULL, 'sandbox', '2014-11-28 20:09:15', '2014-11-28 20:09:15');

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
(1, NULL, 'bob', '$2a$10$4oLm9TIaVGcQR5EkXixph.9bot9dmRHUPvo3tLEpt9Dc3CY9vX8UO', NULL, NULL, 'foo@bar.com', NULL, NULL, NULL, NULL, NULL, 1, 'bob', 'bobs'),
(2, NULL, 'felipe', '$2a$10$c6.4O4966Id3qvyi81Wrr.UHzKnUhRDnN140lsiTTPPejWzhkMgfS', NULL, NULL, 'foo@bar.com', NULL, NULL, NULL, NULL, NULL, 2, 'felipe', 'aguayo'),
(3, NULL, 'datactil', '$2a$10$ShyXoSSqZwkHB7dPjwXuo.hcwMoC3/oeiMuBh5KilazplWd7M8HaC', NULL, NULL, 'datactil@datactil.com', NULL, NULL, NULL, NULL, NULL, 0, 'datactil', 'datactil'),
(7, NULL, 'adc', '$2a$10$SKevZixEh.LEBKl/PYtl2OHkxm8CO5C2VpfnhwW3O1qvdJV6wv3Cm', NULL, NULL, 'adc@adc.cl', NULL, NULL, '1', NULL, NULL, 1, '11', 'adc'),
(8, NULL, 'user', '$2a$10$V1/QJnj/a/nUgPFEiNCIx.ih3K5kycCDBHj/.8admSL6bFfdWT9IO', NULL, NULL, 'user@user.cl', NULL, NULL, '1', NULL, NULL, 1, 'user', 'user'),
(9, NULL, 'mmm', '$2a$10$lFx5w2BlbUviN0ygCUIGR.Ysixkc0PuK1s.R72FJemkzRo72V2S7O', NULL, NULL, 'mmm@mmm.cl', NULL, NULL, '1', NULL, NULL, 1, 'mmm', 'mmm'),
(10, NULL, 'rrr', '$2a$10$F1pBNK9hty82owmHbYnTfOW4hw9zA3ZrrBhGpelSMeNHiOQ9P3FGy', NULL, NULL, 'rrr@rrr.cl', NULL, NULL, '0', NULL, NULL, 1, 'rrr', 'rrr'),
(11, NULL, 'nuevo', '$2a$10$0pPG2aUHLzR/DLWjs1em9eynmR1h8oN/xt2BU0n1QPCYqun.TQpie', NULL, NULL, 'nuevo@nuevo.cl', NULL, NULL, '1', NULL, NULL, 1, 'nuevo', 'nuevo');

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
(1, 'USER', '2', 3),
(2, 'USER', '1', 1),
(3, 'USER', '3', 4),
(4, 'USER', '2', 2),
(5, 'USER', '4', 1),
(6, 'USER', '5', 1),
(7, 'USER', '6', 1),
(8, 'USER', '7', 1),
(9, 'USER', '8', 1),
(10, 'USER', '9', 2),
(11, 'USER', '10', 1),
(12, 'USER', '11', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

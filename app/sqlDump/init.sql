-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Erstellungszeit: 04. Mai 2021 um 19:49
-- Server-Version: 5.7.29
-- PHP-Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `pagequalitymonitor`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `url` varchar(255) CHARACTER SET utf32 NOT NULL,
  `pagename` varchar(255) CHARACTER SET utf32 NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `lastReportDate` datetime DEFAULT NULL,
  `forceReport` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `pages`
--

INSERT INTO `pages` (`id`, `url`, `pagename`, `parentId`, `lastReportDate`, `forceReport`) VALUES
(1, 'https://www.unitb.de/', 'Unitb', NULL, '2021-05-04 19:39:00', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `page_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `html_path` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `json_path` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `score_performance` decimal(10,0) DEFAULT NULL,
  `score_accessibility` decimal(10,0) DEFAULT NULL,
  `score_best_practices` decimal(10,0) DEFAULT NULL,
  `score_seo` decimal(10,0) DEFAULT NULL,
  `score_pwa` decimal(10,0) DEFAULT NULL,
  `lcp_display_value` varchar(10) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `fid_display_value` varchar(10) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `cls_display_value` varchar(10) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `lcp_score` decimal(10,0) DEFAULT NULL,
  `fid_score` decimal(10,0) DEFAULT NULL,
  `cls_score` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todos`
--

CREATE TABLE `todos` (
  `id` int(11) NOT NULL,
  `title` text CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `default_priority` int(11) NOT NULL,
  `description` text CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `category` varchar(100) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `code` text CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `todos`
--

INSERT INTO `todos` (`id`, `title`, `default_priority`, `description`, `category`, `code`) VALUES
(1, 'Doctype', 1, 'The Doctype is HTML5 and is at the top of all your HTML pages.', 'meta_tag', '<!doctype html> <!-- HTML5 -->');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `todos`
--
ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `todos`
--
ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

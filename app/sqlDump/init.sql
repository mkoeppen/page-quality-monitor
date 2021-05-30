-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Erstellungszeit: 30. Mai 2021 um 15:14
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
  `score_performance` decimal(10,2) DEFAULT NULL,
  `score_accessibility` decimal(10,2) DEFAULT NULL,
  `score_best_practices` decimal(10,2) DEFAULT NULL,
  `score_seo` decimal(10,2) DEFAULT NULL,
  `score_pwa` decimal(10,2) DEFAULT NULL,
  `lcp_display_value` varchar(10) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `fid_display_value` varchar(10) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `cls_display_value` varchar(10) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `lcp_score` decimal(10,2) DEFAULT NULL,
  `fid_score` decimal(10,2) DEFAULT NULL,
  `cls_score` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `settings`
--

CREATE TABLE `settings` (
  `name` varchar(100) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `settings`
--

INSERT INTO `settings` (`name`, `value`) VALUES
('migration_version', '1');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tasks_page_relation`
--

CREATE TABLE `tasks_page_relation` (
  `page_id` int(11) NOT NULL,
  `task_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `checked` tinyint(1) NOT NULL DEFAULT '0',
  `priority` varchar(10) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


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
-- Indizes für die Tabelle `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`name`);

--
-- Indizes für die Tabelle `tasks_page_relation`
--
ALTER TABLE `tasks_page_relation`
  ADD UNIQUE KEY `unique_index` (`page_id`,`task_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT für Tabelle `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

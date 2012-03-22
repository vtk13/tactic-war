-- MySQL dump 10.13  Distrib 5.1.61, for pc-linux-gnu (i686)
--
-- Host: localhost    Database: tactic-wars
-- ------------------------------------------------------
-- Server version	5.1.61-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tw_battles`
--

DROP TABLE IF EXISTS `tw_battles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_battles` (
  `battle_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `publish1_id` int(10) unsigned NOT NULL,
  `publish2_id` int(10) unsigned NOT NULL,
  `battle_replay` text,
  PRIMARY KEY (`battle_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_battles`
--

LOCK TABLES `tw_battles` WRITE;
/*!40000 ALTER TABLE `tw_battles` DISABLE KEYS */;
/*!40000 ALTER TABLE `tw_battles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tw_championships`
--

DROP TABLE IF EXISTS `tw_championships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_championships` (
  `championship_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `championship_caption` varchar(255) NOT NULL,
  `championship_description` text,
  PRIMARY KEY (`championship_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_championships`
--

LOCK TABLES `tw_championships` WRITE;
/*!40000 ALTER TABLE `tw_championships` DISABLE KEYS */;
/*!40000 ALTER TABLE `tw_championships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tw_cohorts`
--

DROP TABLE IF EXISTS `tw_cohorts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_cohorts` (
  `cohort_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `cohort_name` varchar(100) NOT NULL,
  `cohort_rate` decimal(6,2) NOT NULL DEFAULT '1200.00',
  PRIMARY KEY (`cohort_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_cohorts`
--

LOCK TABLES `tw_cohorts` WRITE;
/*!40000 ALTER TABLE `tw_cohorts` DISABLE KEYS */;
/*!40000 ALTER TABLE `tw_cohorts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tw_publishes`
--

DROP TABLE IF EXISTS `tw_publishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_publishes` (
  `publish_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cohort_id` int(10) unsigned NOT NULL,
  `championship_id` int(10) unsigned NOT NULL,
  `publish_date` int(10) unsigned NOT NULL,
  PRIMARY KEY (`publish_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_publishes`
--

LOCK TABLES `tw_publishes` WRITE;
/*!40000 ALTER TABLE `tw_publishes` DISABLE KEYS */;
/*!40000 ALTER TABLE `tw_publishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tw_stategies`
--

DROP TABLE IF EXISTS `tw_stategies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_stategies` (
  `strategy_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `strategy_code` text NOT NULL,
  PRIMARY KEY (`strategy_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_stategies`
--

LOCK TABLES `tw_stategies` WRITE;
/*!40000 ALTER TABLE `tw_stategies` DISABLE KEYS */;
/*!40000 ALTER TABLE `tw_stategies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tw_tactics`
--

DROP TABLE IF EXISTS `tw_tactics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_tactics` (
  `tactic_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `tactic_code` text NOT NULL,
  PRIMARY KEY (`tactic_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_tactics`
--

LOCK TABLES `tw_tactics` WRITE;
/*!40000 ALTER TABLE `tw_tactics` DISABLE KEYS */;
/*!40000 ALTER TABLE `tw_tactics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tw_user_rates`
--

DROP TABLE IF EXISTS `tw_user_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_user_rates` (
  `user_id` int(10) unsigned NOT NULL,
  `championship_id` int(10) unsigned NOT NULL,
  `user_rate` decimal(6,2) NOT NULL DEFAULT '1200.00',
  PRIMARY KEY (`user_id`,`championship_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_user_rates`
--

LOCK TABLES `tw_user_rates` WRITE;
/*!40000 ALTER TABLE `tw_user_rates` DISABLE KEYS */;
/*!40000 ALTER TABLE `tw_user_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tw_users`
--

DROP TABLE IF EXISTS `tw_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_users` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_users`
--

LOCK TABLES `tw_users` WRITE;
/*!40000 ALTER TABLE `tw_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `tw_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-03-19 10:04:58

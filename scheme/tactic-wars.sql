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
-- Table structure for table `tw_cohort_code`
--

DROP TABLE IF EXISTS `tw_cohort_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_cohort_code` (
  `code_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `code_type` enum('tactic','strategy') NOT NULL,
  `code_name` varchar(255) NOT NULL,
  `code_src` text NOT NULL,
  PRIMARY KEY (`code_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_cohort_code`
--

LOCK TABLES `tw_cohort_code` WRITE;
/*!40000 ALTER TABLE `tw_cohort_code` DISABLE KEYS */;
INSERT INTO `tw_cohort_code` VALUES (1,1,'tactic','tactic 1','resetQueue();\nvar _target = target();\nif (!_target || _target.lives <= 0) {\n    _target = nearest();\n}\nif (canAttack(_target)) {\n    attack(_target);\n} else {\n    turn(direction(_target));\n    move(distance(_target));\n}\n'),(2,1,'strategy','strategy 1','var _enemies = enemies(), _confederates = confederates();\r\nfor (var i in _enemies) {\r\n    if (_enemies[i].lives > 0) {\r\n        for (var j in _confederates) {\r\n            setTarget(_confederates[j], _enemies[i])\r\n        }\r\n    }\r\n}'),(16,1,'strategy','new code...',''),(12,1,'tactic','qwe','log(target());');
/*!40000 ALTER TABLE `tw_cohort_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tw_cohort_units`
--

DROP TABLE IF EXISTS `tw_cohort_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_cohort_units` (
  `unit_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cohort_id` int(10) unsigned NOT NULL,
  `unit_type` enum('footman','archer') NOT NULL,
  `unit_order` int(10) unsigned NOT NULL,
  `tactic_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`unit_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_cohort_units`
--

LOCK TABLES `tw_cohort_units` WRITE;
/*!40000 ALTER TABLE `tw_cohort_units` DISABLE KEYS */;
INSERT INTO `tw_cohort_units` VALUES (1,1,'footman',0,1),(2,1,'footman',1,12),(3,1,'footman',2,1),(4,1,'footman',3,1),(5,1,'footman',4,1);
/*!40000 ALTER TABLE `tw_cohort_units` ENABLE KEYS */;
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
  `rules_id` int(10) unsigned NOT NULL,
  `cohort_name` varchar(100) NOT NULL,
  `strategy_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`cohort_id`),
  UNIQUE KEY `name` (`user_id`,`cohort_name`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_cohorts`
--

LOCK TABLES `tw_cohorts` WRITE;
/*!40000 ALTER TABLE `tw_cohorts` DISABLE KEYS */;
INSERT INTO `tw_cohorts` VALUES (1,1,0,'Test Cohort',2);
/*!40000 ALTER TABLE `tw_cohorts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tw_publish_code`
--

DROP TABLE IF EXISTS `tw_publish_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_publish_code` (
  `code_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `code_type` enum('tactic','strategy') NOT NULL,
  `code_name` varchar(255) NOT NULL,
  `code_src` text NOT NULL,
  PRIMARY KEY (`code_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_publish_code`
--

LOCK TABLES `tw_publish_code` WRITE;
/*!40000 ALTER TABLE `tw_publish_code` DISABLE KEYS */;
/*!40000 ALTER TABLE `tw_publish_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tw_publish_units`
--

DROP TABLE IF EXISTS `tw_publish_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tw_publish_units` (
  `unit_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `publish_id` int(10) unsigned NOT NULL,
  `unit_type` enum('footman','archer') NOT NULL,
  `unit_order` int(10) unsigned NOT NULL,
  `tactic_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`unit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_publish_units`
--

LOCK TABLES `tw_publish_units` WRITE;
/*!40000 ALTER TABLE `tw_publish_units` DISABLE KEYS */;
/*!40000 ALTER TABLE `tw_publish_units` ENABLE KEYS */;
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
  `publish_rate` decimal(6,2) unsigned NOT NULL DEFAULT '1200.00',
  `strategy_id` int(10) unsigned NOT NULL,
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
  `user_password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tw_users`
--

LOCK TABLES `tw_users` WRITE;
/*!40000 ALTER TABLE `tw_users` DISABLE KEYS */;
INSERT INTO `tw_users` VALUES (1,'vtk666@gmail.com','5f4dcc3b5aa765d61d8327deb882cf99');
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

-- Dump completed on 2012-03-29 15:31:13

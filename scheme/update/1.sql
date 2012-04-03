ALTER TABLE `tw_publishes`
  DROP COLUMN `championship_id`,
   ADD COLUMN `publish_active` TINYINT(1) UNSIGNED DEFAULT '1' NOT NULL AFTER `cohort_id`,
   ADD COLUMN `publish_units` TEXT NOT NULL AFTER `publish_strategy`,
   ADD COLUMN `publish_tactics` TEXT NOT NULL AFTER `publish_units`,
       CHANGE `strategy_id` `publish_strategy` TEXT NOT NULL;

DROP TABLE `tw_publish_code`;
DROP TABLE `tw_publish_units`;
DROP TABLE `tw_championships`;
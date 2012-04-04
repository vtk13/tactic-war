ALTER TABLE `tw_publishes`
 ADD COLUMN `user_id` INT UNSIGNED NOT NULL AFTER `publish_id`,
 ADD COLUMN `publish_name` VARCHAR(255) NOT NULL AFTER `cohort_id`,
     CHANGE `publish_date` `publish_date` DATETIME NOT NULL;
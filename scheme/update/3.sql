ALTER TABLE `tw_publishes`
 ADD COLUMN `publish_battles` INT UNSIGNED NOT NULL AFTER `publish_date`,
 ADD COLUMN `rules_id` INT UNSIGNED NOT NULL AFTER `cohort_id`;

ALTER TABLE `tw_battles`
 ADD COLUMN `winner_id` INT UNSIGNED NOT NULL AFTER `publish2_id`,
 ADD COLUMN `battle_time` DATETIME NOT NULL AFTER `winner_id`,
 ADD COLUMN `battle_result` TEXT NOT NULL AFTER `winner_id`;

DROP TABLE `tw_user_rates`;

ALTER TABLE `tw_users`
 ADD COLUMN `user_rate` DECIMAL(6,2) UNSIGNED DEFAULT '1200' NOT NULL AFTER `user_password`;
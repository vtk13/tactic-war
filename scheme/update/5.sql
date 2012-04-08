ALTER TABLE `tw_publishes`
 ADD COLUMN `publish_approved` ENUM('pending','approved','rejected') DEFAULT 'pending' NOT NULL AFTER `publish_date`;

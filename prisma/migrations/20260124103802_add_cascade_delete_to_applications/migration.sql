-- DropForeignKey
ALTER TABLE `application` DROP FOREIGN KEY `Application_jobId_fkey`;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

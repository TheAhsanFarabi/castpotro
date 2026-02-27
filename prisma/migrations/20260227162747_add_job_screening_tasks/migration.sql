-- AlterTable
ALTER TABLE `application` ADD COLUMN `aiMatchScore` DOUBLE NULL,
    ADD COLUMN `submissionLink` TEXT NULL;

-- AlterTable
ALTER TABLE `job` ADD COLUMN `screeningPrompt` TEXT NULL,
    ADD COLUMN `screeningType` VARCHAR(191) NULL;

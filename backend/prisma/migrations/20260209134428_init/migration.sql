-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'REVIEWER');

-- CreateEnum
CREATE TYPE "PaperType" AS ENUM ('ORIGINAL', 'CASE_REPORT', 'REVIEW', 'LETTER', 'NOTE', 'COMMUNICATION', 'IMAGE', 'ABSTRACT_POSTER', 'ABSTRACT_ORAL', 'COMMENT', 'BOOK_CHAPTER', 'TRANSLATION');

-- CreateEnum
CREATE TYPE "Quartile" AS ENUM ('Q1', 'Q2', 'Q3', 'Q4');

-- CreateEnum
CREATE TYPE "ConferenceType" AS ENUM ('INTERNATIONAL', 'DOMESTIC');

-- CreateEnum
CREATE TYPE "PresentationType" AS ENUM ('ORAL', 'POSTER');

-- CreateEnum
CREATE TYPE "ApplicantType" AS ENUM ('FIRST_AUTHOR', 'CORRESPONDING', 'CO_AUTHOR');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISION');

-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'URGENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "employeeId" TEXT,
    "department" TEXT,
    "position" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "papers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleChinese" TEXT,
    "paperType" "PaperType" NOT NULL,
    "publicationDate" TIMESTAMP(3),
    "volume" TEXT,
    "issue" TEXT,
    "pages" TEXT,
    "doi" TEXT,
    "pmid" TEXT,
    "pdfUrl" TEXT,
    "pdfFilename" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedById" TEXT,

    CONSTRAINT "papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "affiliation" TEXT NOT NULL,
    "department" TEXT,
    "isFirst" BOOLEAN NOT NULL DEFAULT false,
    "isCorresponding" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "paperId" TEXT NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_info" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT,
    "issn" TEXT,
    "isSci" BOOLEAN NOT NULL DEFAULT false,
    "isSsci" BOOLEAN NOT NULL DEFAULT false,
    "impactFactor" DOUBLE PRECISION,
    "quartile" "Quartile",
    "ranking" INTEGER,
    "totalInField" INTEGER,
    "category" TEXT,
    "paperId" TEXT NOT NULL,

    CONSTRAINT "journal_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conference_info" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "date" TIMESTAMP(3),
    "type" "ConferenceType" NOT NULL,
    "presentationType" "PresentationType" NOT NULL,
    "paperId" TEXT NOT NULL,

    CONSTRAINT "conference_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_applications" (
    "id" TEXT NOT NULL,
    "applicantType" "ApplicantType" NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "rewardAmount" DOUBLE PRECISION,
    "rewardFormula" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewComment" TEXT,
    "hasHolisticCare" BOOLEAN NOT NULL DEFAULT false,
    "hasMedicalQuality" BOOLEAN NOT NULL DEFAULT false,
    "hasMedicalEducation" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paperId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "reviewerId" TEXT,

    CONSTRAINT "paper_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "AnnouncementType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "totalReward" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sciPaperCount" INTEGER NOT NULL DEFAULT 0,
    "nonSciPaperCount" INTEGER NOT NULL DEFAULT 0,
    "conferenceCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_analysis_logs" (
    "id" TEXT NOT NULL,
    "paperId" TEXT,
    "userId" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "inputData" JSONB,
    "outputData" JSONB,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_analysis_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeId_key" ON "users"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "papers_doi_key" ON "papers"("doi");

-- CreateIndex
CREATE UNIQUE INDEX "journal_info_paperId_key" ON "journal_info"("paperId");

-- CreateIndex
CREATE UNIQUE INDEX "conference_info_paperId_key" ON "conference_info"("paperId");

-- CreateIndex
CREATE UNIQUE INDEX "career_records_userId_year_key" ON "career_records"("userId", "year");

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "papers_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_info" ADD CONSTRAINT "journal_info_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conference_info" ADD CONSTRAINT "conference_info_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_applications" ADD CONSTRAINT "paper_applications_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "papers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_applications" ADD CONSTRAINT "paper_applications_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_applications" ADD CONSTRAINT "paper_applications_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

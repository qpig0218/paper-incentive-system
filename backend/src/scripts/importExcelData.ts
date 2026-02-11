import { PrismaClient, PaperType, ApplicantType, ApplicationStatus, Quartile } from '@prisma/client';
import * as XLSX from 'xlsx';
import path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Excel file paths
const EXCEL_FILES = [
  '/Users/chiateliao/Downloads/100-104年度.xls',
  '/Users/chiateliao/Downloads/105-109年度.xls',
  '/Users/chiateliao/Downloads/110-111年度.xls',
  '/Users/chiateliao/Downloads/112年度.xls',
  '/Users/chiateliao/Downloads/113年度.xls',
  '/Users/chiateliao/Downloads/114年度.xls',
];

// Map 論文類別 to PaperType
function mapPaperType(category: string): PaperType | null {
  if (!category) return null;
  const c = category.trim();

  if (c.includes('研究論文')) return PaperType.ORIGINAL;
  if (c.includes('病例報告') || c.includes('個案報告') || c.includes('專案報告')) return PaperType.CASE_REPORT;
  if (c.includes('口頭報告')) return PaperType.ABSTRACT_ORAL;
  if (c.includes('海報展示') || c.includes('海報') || c.includes('報告摘錄')) return PaperType.ABSTRACT_POSTER;
  if (c.includes('醫學教育雜誌')) return PaperType.ORIGINAL;
  if (c.includes('編輯或評議')) return PaperType.COMMENT;
  if (c.includes('專利')) return null; // Skip patents

  return PaperType.ORIGINAL;
}

// Determine if SCI
function isSci(category: string): boolean {
  if (!category) return false;
  return category.startsWith('SCI') || category.startsWith('SCI/SSCI');
}

// Parse IF value from string like "IF 3.500"
function parseIF(ifStr: string | null | undefined): number | null {
  if (!ifStr || typeof ifStr !== 'string') return null;
  const match = ifStr.match(/IF\s*([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
}

// Parse field ranking from string like "150 / 285"
function parseFieldRanking(rankStr: string | null | undefined): { ranking: number; total: number } | null {
  if (!rankStr || typeof rankStr !== 'string') return null;
  const match = rankStr.match(/(\d+)\s*\/\s*(\d+)/);
  if (match) {
    return { ranking: parseInt(match[1]), total: parseInt(match[2]) };
  }
  return null;
}

// Parse Rank value from "Rank 37.79"
function parseRank(rankStr: string | null | undefined): number | null {
  if (!rankStr || typeof rankStr !== 'string') return null;
  const match = rankStr.match(/Rank\s*([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
}

// Parse author field like "[通-申]7.陳奇祥"
function parseAuthor(authorStr: string | null | undefined): {
  name: string;
  order: number;
  isFirst: boolean;
  isCorresponding: boolean;
  isApplicant: boolean;
} | null {
  if (!authorStr || typeof authorStr !== 'string') return null;
  const str = authorStr.trim();
  if (!str) return null;

  let isCorresponding = false;
  let isApplicant = false;
  let remaining = str;

  // Parse tags like [通-申], [申], [通]
  const tagMatch = remaining.match(/^\[([^\]]+)\]/);
  if (tagMatch) {
    const tag = tagMatch[1];
    isCorresponding = tag.includes('通');
    isApplicant = tag.includes('申');
    remaining = remaining.substring(tagMatch[0].length);
  }

  // Parse order and name like "7.陳奇祥"
  const orderMatch = remaining.match(/^(\d+)\.(.*)/);
  let order = 1;
  let name = remaining;
  if (orderMatch) {
    order = parseInt(orderMatch[1]);
    name = orderMatch[2].trim();
  }

  const isFirst = order === 1;

  return { name, order, isFirst, isCorresponding, isApplicant };
}

// Parse publication date from integer YYYYMM
function parsePublicationDate(dateVal: number | string | null | undefined): Date | null {
  if (!dateVal) return null;
  const dateStr = String(dateVal);
  if (dateStr.length >= 6) {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) || 1;
    return new Date(year, month - 1, 1);
  }
  return null;
}

// Parse applicant field like "910608 陳奇祥"
function parseApplicant(applicantStr: string | null | undefined): { employeeId: string; name: string } | null {
  if (!applicantStr || typeof applicantStr !== 'string') return null;
  const match = applicantStr.trim().match(/^(\d+)\s+(.+)/);
  if (match) {
    return { employeeId: match[1], name: match[2].trim() };
  }
  return null;
}

// Parse department field like "2000 院長室"
function parseDepartment(deptStr: string | null | undefined): string {
  if (!deptStr || typeof deptStr !== 'string') return '未知科別';
  const match = deptStr.trim().match(/^\d+\s+(.+)/);
  return match ? match[1].trim() : deptStr.trim();
}

// Determine quartile from ranking percentage
function determineQuartile(ranking: number, total: number): Quartile | null {
  if (!total || total === 0) return null;
  const pct = (ranking / total) * 100;
  if (pct <= 25) return Quartile.Q1;
  if (pct <= 50) return Quartile.Q2;
  if (pct <= 75) return Quartile.Q3;
  return Quartile.Q4;
}

// Determine applicant type from author tags
function getApplicantType(authorStr: string | null | undefined): ApplicantType {
  if (!authorStr) return ApplicantType.CO_AUTHOR;
  const tagMatch = authorStr.match(/^\[([^\]]+)\]/);
  if (tagMatch) {
    const tag = tagMatch[1];
    if (tag.includes('通') && tag.includes('申')) return ApplicantType.CORRESPONDING;
    if (tag.includes('通')) return ApplicantType.CORRESPONDING;
  }
  // Check order
  const orderMatch = authorStr.match(/^\[?[^\]]*\]?(\d+)\./);
  if (orderMatch && parseInt(orderMatch[1]) === 1) return ApplicantType.FIRST_AUTHOR;
  return ApplicantType.CO_AUTHOR;
}

async function main() {
  console.log('Starting Excel data import...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@chimei.org.tw' },
    update: {},
    create: {
      email: 'admin@chimei.org.tw',
      password: hashedPassword,
      name: '系統管理員',
      role: 'ADMIN',
      department: '資訊部',
      employeeId: 'ADMIN001',
    },
  });
  console.log(`Admin user created: ${adminUser.id}`);

  // Track unique users by employeeId
  const userCache = new Map<string, string>(); // employeeId -> userId
  const defaultPassword = await bcrypt.hash('chimei2026', 10);

  let totalImported = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const filePath of EXCEL_FILES) {
    console.log(`\nProcessing: ${path.basename(filePath)}`);
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);
    console.log(`  Found ${rows.length} rows`);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        // Skip patents
        const category = row['論文類別'] as string;
        const paperType = mapPaperType(category);
        if (!paperType) {
          totalSkipped++;
          continue;
        }

        // Parse applicant
        const applicant = parseApplicant(row['申請者'] as string);
        let applicantUserId: string;

        if (applicant && applicant.employeeId) {
          if (userCache.has(applicant.employeeId)) {
            applicantUserId = userCache.get(applicant.employeeId)!;
          } else {
            const email = `${applicant.employeeId}@chimei.org.tw`;
            const user = await prisma.user.upsert({
              where: { email },
              update: {},
              create: {
                email,
                password: defaultPassword,
                name: applicant.name,
                employeeId: applicant.employeeId,
                department: parseDepartment(row['申請者科別'] as string),
                role: 'USER',
              },
            });
            userCache.set(applicant.employeeId, user.id);
            applicantUserId = user.id;
          }
        } else {
          applicantUserId = adminUser.id;
        }

        // Parse paper title
        const title = (row['論文名稱'] as string) || `${category} - ${row['流水號'] || i}`;

        // Parse publication date
        const pubDate = parsePublicationDate(row['發表日期']);

        // Parse volume/pages
        const volPages = (row['卷期/頁次'] as string) || '';
        const volMatch = volPages.match(/Vol\s*(\d+)/i);
        const noMatch = volPages.match(/NO\s*(\d+)/i);
        const pageMatch = volPages.match(/P\s*([\w\d]+-[\w\d]+|[\w\d]+)/i);

        // Create Paper
        const paper = await prisma.paper.create({
          data: {
            title,
            paperType,
            publicationDate: pubDate,
            volume: volMatch ? volMatch[1] : null,
            issue: noMatch ? noMatch[1] : null,
            pages: pageMatch ? pageMatch[1] : null,
            submittedById: applicantUserId,
          },
        });

        // Create Authors
        const authors: any[] = [];
        for (let authorIdx = 1; authorIdx <= 6; authorIdx++) {
          const authorStr = row[`作者${authorIdx}`] as string;
          const dept = row[`科別${authorIdx}`] as string;
          const parsed = parseAuthor(authorStr);
          if (parsed) {
            authors.push({
              name: parsed.name,
              order: parsed.order,
              isFirst: parsed.isFirst,
              isCorresponding: parsed.isCorresponding,
              affiliation: dept || '奇美醫院',
              department: dept || null,
              paperId: paper.id,
            });
          }
        }

        if (authors.length > 0) {
          await prisma.author.createMany({ data: authors });
        }

        // Create JournalInfo
        const journalName = (row['發表之雜誌/期刊'] as string) || '';
        const impactFactor = parseIF(row['IF'] as string);
        const fieldRanking = parseFieldRanking(row['所屬學門領域排名'] as string);
        const sciFlag = isSci(category);

        if (journalName) {
          const quartile = fieldRanking
            ? determineQuartile(fieldRanking.ranking, fieldRanking.total)
            : null;

          await prisma.journalInfo.create({
            data: {
              name: journalName,
              isSci: sciFlag,
              isSsci: category.includes('SSCI'),
              impactFactor,
              quartile,
              ranking: fieldRanking?.ranking || null,
              totalInField: fieldRanking?.total || null,
              category: (row['所屬學門領域'] as string) || null,
              paperId: paper.id,
            },
          });
        }

        // Create PaperApplication
        const rewardAmount = row['獎金'] != null ? Number(row['獎金']) : 0;
        const applicantType = getApplicantType(row['作者1'] as string);

        await prisma.paperApplication.create({
          data: {
            applicantType,
            status: ApplicationStatus.APPROVED,
            rewardAmount,
            rewardFormula: `${category} - ${row['論文辦法'] || ''}`,
            hasHolisticCare: row['全人照護'] === 'Y',
            hasMedicalQuality: row['醫療品質'] === 'Y',
            hasMedicalEducation: row['醫學教育'] === 'Y',
            paperId: paper.id,
            applicantId: applicantUserId,
          },
        });

        totalImported++;
        if (totalImported % 500 === 0) {
          console.log(`  Imported ${totalImported} records...`);
        }
      } catch (error: any) {
        totalErrors++;
        if (totalErrors <= 10) {
          console.error(`  Error at row ${i}: ${error.message}`);
        }
      }
    }
  }

  console.log(`\n========== IMPORT COMPLETE ==========`);
  console.log(`Total imported: ${totalImported}`);
  console.log(`Total skipped (patents): ${totalSkipped}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total users created: ${userCache.size + 1}`);

  // Print summary
  const paperCount = await prisma.paper.count();
  const userCount = await prisma.user.count();
  const authorCount = await prisma.author.count();
  const appCount = await prisma.paperApplication.count();
  console.log(`\nDatabase counts:`);
  console.log(`  Papers: ${paperCount}`);
  console.log(`  Users: ${userCount}`);
  console.log(`  Authors: ${authorCount}`);
  console.log(`  Applications: ${appCount}`);
}

main()
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

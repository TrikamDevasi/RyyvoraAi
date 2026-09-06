import { parse } from 'csv-parse/sync';
import Student from '../models/Student.model';
import Institution from '../models/Institution.model';
import User from '../models/User.model';
import logger from '../utils/logger';

interface StudentCSVRow {
  name: string;
  email: string;
  program: string;
  nsqfLevel: string;
  enrollmentNumber?: string;
  batch?: string;
  state?: string;
  gender?: string;
  institutionId?: string;
}

export interface UploadResult {
  inserted: number;
  failed: number;
  errors: { row: number; reason: string }[];
}

const REQUIRED_HEADERS = ['name', 'email', 'program', 'nsqfLevel'];

export const parseCSV = async (
  buffer: Buffer,
  institutionId: string
): Promise<UploadResult> => {
  const result: UploadResult = { inserted: 0, failed: 0, errors: [] };

  let rows: StudentCSVRow[];
  try {
    rows = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as StudentCSVRow[];
  } catch (err) {
    throw new Error('Failed to parse CSV file. Ensure it is valid CSV format.');
  }

  if (rows.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Validate headers
  const headers = Object.keys(rows[0]);
  const missingHeaders = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required CSV columns: ${missingHeaders.join(', ')}`);
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // 1-indexed + header row

    try {
      const nsqfLevel = parseInt(row.nsqfLevel, 10);
      if (isNaN(nsqfLevel) || nsqfLevel < 1 || nsqfLevel > 8) {
        throw new Error(`Invalid nsqfLevel: must be 1-8`);
      }

      if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        throw new Error('Invalid email address');
      }

      // Create or find user
      let user = await User.findOne({ email: row.email.toLowerCase() });
      if (!user) {
        user = await User.create({
          name: row.name,
          email: row.email.toLowerCase(),
          password: Math.random().toString(36).slice(-12), // temp password
          role: 'student',
        });
      }

      const enrollmentNumber =
        row.enrollmentNumber ||
        `ENR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      await Student.create({
        userId: user._id,
        institutionId,
        enrollmentNumber,
        program: row.program,
        nsqfLevel,
        batch: row.batch || new Date().getFullYear().toString(),
        state: row.state || 'Unknown',
        gender: row.gender || 'Not specified',
        placementStatus: 'studying',
      });

      result.inserted++;
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Unknown error';
      result.failed++;
      result.errors.push({ row: rowNum, reason });
      logger.warn(`CSV row ${rowNum} failed: ${reason}`);
    }
  }

  logger.info(
    `CSV import complete: ${result.inserted} inserted, ${result.failed} failed`
  );
  return result;
};

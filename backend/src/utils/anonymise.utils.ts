import { IStudent } from '../models/Student.model';

export interface AnonymisedStudent {
  _id: unknown;
  skills: IStudent['skills'];
  placementStatus: IStudent['placementStatus'];
  program: string;
  state: string;
  gender: string;
  nsqfLevel: number;
  overallScore: number;
  careerPathways: string[];
}

/**
 * DPDP-compliant: strips PII (name, email, phone, passportHash).
 * Retains only data necessary for fairness analysis.
 */
export const anonymiseStudent = (student: IStudent): AnonymisedStudent => {
  return {
    _id: student._id,
    skills: student.skills,
    placementStatus: student.placementStatus,
    program: student.program,
    state: student.state,
    gender: student.gender,
    nsqfLevel: student.nsqfLevel,
    overallScore: student.overallScore ?? 0,
    careerPathways: student.careerPathways,
  };
};

export const anonymiseExport = (data: IStudent[]): AnonymisedStudent[] => {
  return data.map(anonymiseStudent);
};

import { Request, Response } from 'express';
import IndustryInquiry from '../models/IndustryInquiry.model';
import { z } from 'zod';

const inquirySchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  plan: z.string().default('Starter'),
  teamSize: z.string().default('1-10'),
  message: z.string().optional(),
});

export const submitInquiry = async (req: Request, res: Response) => {
  try {
    const parsed = inquirySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: parsed.error.errors.map(e => e.message).join(', '),
      });
      return;
    }

    const inquiry = await IndustryInquiry.create(parsed.data);

    res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Inquiry submitted successfully. Our team will contact you soon.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await IndustryInquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const inquiry = await IndustryInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: inquiry,
      message: 'Inquiry status updated',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

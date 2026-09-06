import { RequestHandler } from 'express';
import AuditLog from '../models/AuditLog.model';
import logger from '../utils/logger';

export const auditLog = (action: string, resource: string): RequestHandler => {
  return (req, res, next) => {
    res.on('finish', () => {
      AuditLog.create({
        userId: req.user ? String(req.user._id) : undefined,
        userRole: req.user?.role,
        action,
        resource,
        resourceId: req.params.id ?? '',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] ?? '',
        dataAccessed: `${req.method} ${req.originalUrl}`,
      }).catch((err) => {
        logger.error('Failed to write audit log:', err);
      });
    });
    next();
  };
};

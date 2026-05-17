import { config } from '../config/environment.js';
import { ValidationError } from '../utils/APIError.js';
import { proxyMultipart } from '../utils/fastApiProxy.js';

export const uploadDocument = async (req, res, next) => {
  if (!req.file) {
    next(new ValidationError('file is required'));
    return;
  }

  return proxyMultipart(req, res, next, config.fastApi.documentUploadPath);
};


import { config } from '../config/environment.js';
import { ValidationError } from '../utils/APIError.js';
import { proxyMultipart } from '../utils/fastApiProxy.js';

export const uploadDocument = async (req, res, next) => {
  const payloadFile = req.file;

  if (!payloadFile) {
    next(new ValidationError('file is required'));
    return;
  }

  return proxyMultipart(req, res, next, config.fastApi.documentUploadPath, {
    file: payloadFile,
  });
};

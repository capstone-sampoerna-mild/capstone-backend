
import { config } from '../config/environment.js';
import { ValidationError } from '../utils/APIError.js';
import { proxyMultipart } from '../utils/fastApiProxy.js';

const pickFirstFile = (fileList) =>
  Array.isArray(fileList) && fileList.length > 0
    ? fileList[0]
    : undefined;

export const uploadDocument = async (
  req,
  res,
  next
) => {

  const files = req.files || {};

  const candidates = [
    {
      key: 'cv',
      file: pickFirstFile(files.cv),
    },
    {
      key: 'certificate',
      file: pickFirstFile(
        files.certificate
      ),
    },
    {
      key: 'file',
      file:
        req.file ||
        pickFirstFile(files.file),
    },
  ].filter((item) => item.file);

  // ================= VALIDATION =================
  if (candidates.length === 0) {

    next(
      new ValidationError(
        'file is required'
      )
    );

    return;
  }

  if (candidates.length > 1) {

    next(
      new ValidationError(
        'only one file is allowed: cv, certificate, or file'
      )
    );

    return;
  }

  // ================= DOCUMENT TYPE =================
  const providedType =
    req.body?.documentType ||
    req.body?.type;

  if (providedType) {

    const normalizedType =
      String(providedType)
        .toLowerCase();

    if (
      normalizedType !== 'cv' &&
      normalizedType !== 'certificate'
    ) {

      next(
        new ValidationError(
          'documentType must be cv or certificate'
        )
      );

      return;
    }
  }

  // ================= EXTRA DATA =================
  const skillset =
    req.body?.skillset || '[]';

  const name =
    req.body?.name || 'Anonymous';

  // ================= FORWARD TO FASTAPI =================
  return proxyMultipart(
    req,
    res,
    next,
    config.fastApi.documentUploadPath,
    {
      file: candidates[0].file,
      skillset,
      name,
      documentType:
        providedType || 'cv',
    }
  );
};

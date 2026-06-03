import { config } from '../config/environment.js';
import { proxyJson } from '../utils/fastApiProxy.js';

const buildJobRolePayload = (req) => {
  const payload = { ...(req.body || {}) };

  if (!payload.name && payload.nama) {
    payload.name = payload.nama;
  }

  return payload;
};

export const recommendJobRole = async (req, res, next) => {
  return proxyJson(
    req,
    res,
    next,
    config.fastApi.jobRoleRecommendPath,
    buildJobRolePayload(req)
  );
};

import { config } from '../config/environment.js';
import { proxyJson, proxyStream } from '../utils/fastApiProxy.js';

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

export const recommendJobRoleGemini = async (req, res, next) => {
  return proxyJson(
    req,
    res,
    next,
    config.fastApi.jobRoleRecommendGeminiPath,
    buildJobRolePayload(req)
  );
};

export const recommendJobRoleStream = async (req, res, next) => {
  return proxyStream(
    req,
    res,
    next,
    config.fastApi.jobRoleRecommendStreamPath,
    buildJobRolePayload(req)
  );
};

export const recommendJobRoleGeminiStream = async (req, res, next) => {
  return proxyStream(
    req,
    res,
    next,
    config.fastApi.jobRoleRecommendGeminiStreamPath,
    buildJobRolePayload(req)
  );
};

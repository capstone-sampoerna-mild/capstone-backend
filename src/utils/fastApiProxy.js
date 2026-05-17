import axios from 'axios';
import FormData from 'form-data';
import { config } from '../config/environment.js';

const normalizePath = (path) => {
  if (!path) {
    return '';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

export const buildFastApiUrl = (path) => {
  const baseUrl = config.fastApi.baseUrl.replace(/\/$/, '');
  return `${baseUrl}${normalizePath(path)}`;
};

const applyContentType = (res, headers) => {
  const contentType = headers?.['content-type'];
  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }
};

export const proxyJson = async (req, res, next, path, dataOverride = null) => {
  try {
    const upstreamResponse = await axios({
      method: 'post',
      url: buildFastApiUrl(path),
      data: dataOverride ?? req.body,
      timeout: config.fastApi.timeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Accept: req.headers.accept || '*/*',
      },
      validateStatus: () => true,
    });

    applyContentType(res, upstreamResponse.headers);
    return res.status(upstreamResponse.status).send(upstreamResponse.data);
  } catch (error) {
    next(error);
  }
};

export const proxyStream = async (req, res, next, path, dataOverride = null) => {
  try {
    const upstreamResponse = await axios({
      method: 'post',
      url: buildFastApiUrl(path),
      data: dataOverride ?? req.body,
      responseType: 'stream',
      timeout: config.fastApi.timeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Accept: req.headers.accept || '*/*',
      },
      validateStatus: () => true,
    });

    applyContentType(res, upstreamResponse.headers);
    res.status(upstreamResponse.status);
    upstreamResponse.data.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const proxyMultipart = async (req, res, next, path) => {
  try {
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const upstreamResponse = await axios({
      method: 'post',
      url: buildFastApiUrl(path),
      data: form,
      timeout: config.fastApi.timeoutMs,
      headers: {
        ...form.getHeaders(),
        Accept: req.headers.accept || '*/*',
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      validateStatus: () => true,
    });

    applyContentType(res, upstreamResponse.headers);
    return res.status(upstreamResponse.status).send(upstreamResponse.data);
  } catch (error) {
    next(error);
  }
};

import axios from 'axios';
import { config } from '../config/environment.js';

const buildUpstreamUrl = () => {
  const baseUrl = config.fastApi.baseUrl.replace(/\/$/, '');
  const path = config.fastApi.chatStreamPath.startsWith('/')
    ? config.fastApi.chatStreamPath
    : `/${config.fastApi.chatStreamPath}`;

  return `${baseUrl}${path}`;
};

export const streamAiChat = async (req, res, next) => {
  try {
    const upstreamResponse = await axios({
      method: 'post',
      url: buildUpstreamUrl(),
      data: req.body,
      responseType: 'stream',
      timeout: config.fastApi.timeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Accept: req.headers.accept || '*/*',
      },
      validateStatus: () => true,
    });

    const contentType = upstreamResponse.headers['content-type'];
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    res.status(upstreamResponse.status);
    upstreamResponse.data.pipe(res);
  } catch (error) {
    next(error);
  }
};
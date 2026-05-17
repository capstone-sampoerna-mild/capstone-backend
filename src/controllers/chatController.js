import { config } from '../config/environment.js';
import { proxyStream } from '../utils/fastApiProxy.js';

export const streamAiChat = async (req, res, next) => {
  return proxyStream(req, res, next, config.fastApi.chatStreamPath);
};
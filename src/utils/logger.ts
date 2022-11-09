import axios from 'axios';

type LogsnagConfig = {
  channel: string;
  event: string;
  icon: string;
  description: string;
  tags: { [key: string]: string };
  notify: boolean;
};

const API_URL = 'https://api.logsnag.com/v1/log';
const PROJECT_NAME = 'railtrack';

export const log = async (config: LogsnagConfig) =>
  axios.post(
    API_URL,
    {
      project: PROJECT_NAME,
      ...config,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LOGSNAG_TOKEN}`,
      },
    }
  );

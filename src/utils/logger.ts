import axios from 'axios';

type LogsnagConfig = {
  channel: string;
  event: string;
  icon: string;
  description: string;
  tags: { [key: string]: string | undefined };
  notify: boolean;
};

const API_URL = 'https://api.logsnag.com/v1/log';
const PROJECT_NAME = 'railtrack';

export const log = async (config: LogsnagConfig) => {
  const env = process.env.NODE_ENV;

  // don't send logsnag notification in dev environment
  if (env === 'development') {
    console.log(config.event, config.description);
    return;
  }

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
};

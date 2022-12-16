import axios from 'axios';

type LogsnagConfig = {
  channel: string;
  event: string;
  icon: string;
  description: string;
  tags: { [key: string]: string | undefined };
  notify: boolean;
};

type LogsnagInsightConfig = {
  title: string;
  value: string | number;
  icon: string;
};

const API_URL = 'https://api.logsnag.com/v1';
const PROJECT_NAME = 'railtrack';

export const log = async (config: LogsnagConfig) => {
  const env = process.env.NODE_ENV;

  // don't send logsnag notification in dev environment
  if (env === 'development') {
    console.log(config.event, config.description);
    return;
  }

  axios.post(
    API_URL + '/log',
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

export const insight = async (config: LogsnagInsightConfig) => {
  const env = process.env.NODE_ENV;

  // don't send logsnag notification in dev environment
  if (env === 'development') {
    console.log(config.title, config.value);
    return;
  }

  axios.post(
    API_URL + '/insight',
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

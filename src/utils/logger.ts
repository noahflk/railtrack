import { LogSnag, PublishOptions } from 'logsnag';

const logsnag = new LogSnag({
  token: process.env.LOGSNAG_TOKEN ?? '',
  project: 'railtrack',
});

export const log = (options: PublishOptions) => {
  try {
    logsnag.publish(options);
  } catch (error) {
    console.log('Unable to log event', error);
  }
};

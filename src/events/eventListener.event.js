import listenToCreateTopic from './createTopic.event.js';
import getHistoricTopics from './getHistoric.event.js';
import cron from 'node-cron';

const initEventListeners = () => {
  listenToCreateTopic();
  cron.schedule('0 */2 * * * *', async () => {
    console.log('Running Cron Job');
    await getHistoricTopics("CreateTopic");
  });
};

export default initEventListeners;
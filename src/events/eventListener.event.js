import listenToCreateTopic from './createTopic.event.js';
import getHistoricTopics from './getHistoric.event.js';
import cron from 'node-cron';

const initEventListeners = () => {
  listenToCreateTopic();
  getHistoricTopics("CreateTopic");
  cron.schedule('0 */2 * * * *', async () => {
    await getHistoricTopics("CreateTopic");
  });
};

export default initEventListeners;
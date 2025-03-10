import listenToCreateTopic from './createTopic.event.js';
import getHistoricTopics from './getHistoricTopics.event.js';
import listenToInvest from './invest.event.js';
import getHistoricInvests from './getHistoricInvests.event.js';
import cron from 'node-cron';

const initEventListeners = async () => {
  listenToCreateTopic();
  listenToInvest();
  await getHistoricTopics();
  await getHistoricInvests();
  cron.schedule('*/2 * * * *', async () => {
      await getHistoricTopics();
      await getHistoricInvests();
  });
};

export default initEventListeners;
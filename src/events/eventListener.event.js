import listenToCreateTopic from './createTopic.event.js';
import getHistoricTopics from './getHistoricTopics.event.js';
import listenToInvest from './invest.event.js';
import getHistoricInvests from './getHistoricInvests.event.js';
import cron from 'node-cron';

const initEventListeners = () => {
  listenToCreateTopic();
  listenToInvest();
  getHistoricTopics();
  getHistoricInvests();
  cron.schedule('*/2 * * * *', () => {
      getHistoricTopics();
      getHistoricInvests();
  });
};

export default initEventListeners;
import listenToCreateTopic from './createTopic.event.js';
import getHistoricTopics from './getHistoricTopics.event.js';
import listenToInvest from './invest.event.js';
import getHistoricInvests from './getHistoricInvests.event.js';
import listenToWithdraw from './withdraw.event.js';
import getHistoricWithdraws from './getHistoricWithdraws.event.js';
import cron from 'node-cron';

const initEventListeners = () => {
  listenToCreateTopic();
  listenToInvest();
  listenToWithdraw();
  getHistoricTopics();
  getHistoricInvests();
  getHistoricWithdraws();
  cron.schedule('*/10 * * * *', () => {
      getHistoricTopics();
      getHistoricInvests();
      getHistoricWithdraws();
  });
};

export default initEventListeners;
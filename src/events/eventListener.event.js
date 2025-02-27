import listenToCreateTopic from './createTopic.event.js';
import getHistoricTopics from './getHistoric.event.js';
import listenToInvest from './invest.event.js';

const initEventListeners = () => {
  listenToCreateTopic();
  getHistoricTopics("CreateTopic");
  listenToInvest();
};

export default initEventListeners;
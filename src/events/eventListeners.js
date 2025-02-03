import listenToCreateTopic from './topicListener.js';

const initEventListeners = () => {
  console.log('Initializing Event Listeners...');
  listenToCreateTopic();
};

export default initEventListeners;

let apiUrl;
let apiBot;
let botUrl;
let wsUrl;
let flowUrl;

// const apiStaging = 'http://192.168.100.178:8080';
const apiStaging = 'https://talklogic-staging.herokuapp.com';
const apiProduction = 'https://talklogic.herokuapp.com';
const apiBotStaging = 'https://dotcoid-staging.herokuapp.com';
const apiBotProduction = 'https://dotcoid.herokuapp.com';
const apiQiscus = 'https://qismo.qiscus.com';

const botStaging = 'https://your-staging.talklogics.co';
const botProduction = 'https://your.talklogics.co';

const customflowStaging = 'https://demo.nibblesoftworks.com/talkabot-staging/?channel_id=';
const customflowProduction = 'https://demo.nibblesoftworks.com/talkabot/?channel_id=';

if (process.env.NODE_ENV === 'production') {
  apiUrl = apiProduction;
  apiBot = apiBotProduction;
  botUrl = botProduction;
  wsUrl = 'wss://';
  flowUrl = customflowProduction;
} else {
  apiUrl = apiStaging;
  apiBot = apiBotStaging;
  botUrl = botStaging;
  wsUrl = 'wss://';
  flowUrl = customflowStaging;
}

const baseAPI = `${apiUrl}/api`;
const botEndpoint = `${botUrl}/user`;
const qiscusAPI = `${apiQiscus}/api`;
const wsAPI = `${wsUrl}${baseAPI.replace('https://', '')}`;

export { baseAPI, qiscusAPI, apiBot as botAPI, botEndpoint, wsAPI, flowUrl, botUrl };

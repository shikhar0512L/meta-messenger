import Pusher from "pusher";
import ClientPusher from 'pusher-js';

export const serverPusher = new Pusher({
    appId : "1526123",
    key : "7b9d9229584549988fc0",
    secret : "68abf10fe57656a2c6c8",
    cluster : "ap2",
    useTLS:true,
});

export const clientPusher = new ClientPusher('7b9d9229584549988fc0', {
    cluster: 'ap2',
  });
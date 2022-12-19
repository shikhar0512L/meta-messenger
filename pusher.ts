import Pusher from "pusher";
import ClientPusher from 'pusher-js';

export const serverPusher = new Pusher({
    appId : "aaaaaaa",
    key : "sssssssssss",
    secret : "qqqqqqqqqqqq",
    cluster : "rrrrrrrrr",
    useTLS:true,
});

export const clientPusher = new ClientPusher('llllllllll', {
    cluster: 'rrrrrrrrr',
  });

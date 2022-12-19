'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { clientPusher } from '../pusher';
import { Message } from '../typings';
import fetcher from '../utils/fetchMessages';
import MessageComponent from './MessageComponent';

type Props = {
  initialMessages:Message[];
}

const MessageList = ({initialMessages}:Props) => {


  const { data: messages, error, mutate } = useSWR<Message[]>("/api/getMessages", fetcher);
  useEffect(() => {
    const chanel = clientPusher.subscribe('messages');
    chanel.bind('new-message', async (data: Message) => {

      if (messages?.find((message) => message.id === data.id)) return;

      if (!messages) {
        mutate(fetcher);
      } else {

        mutate(fetcher, {
          optimisticData: [data, ...messages!],
          rollbackOnError: true,

        })
      }
    })

    return ()=>{
      chanel.unbind_all();
      chanel.unsubscribe();
    };
  }, [messages, mutate, clientPusher])




  return (
    <div className='space-y-5 px-5 pt-8 pb-32 max-w-2xl xl:max-w-4xl mx-auto'>
      {(messages || initialMessages).map((message) => (
        <MessageComponent key={message.id} message={message} />
      ))}
    </div>
  )
}

export default MessageList;
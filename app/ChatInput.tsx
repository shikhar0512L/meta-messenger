'use client';
import {useState , FormEvent} from 'react';
import { v4 as uuid } from 'uuid';
import { Message } from '../typings';
import useSWR from 'swr';
import fetcher from '../utils/fetchMessages';
import {unstable_getServerSession} from 'next-auth/next'

type Props = {
session: Awaited<ReturnType<typeof unstable_getServerSession>>;
}

const ChatInput = ({session}:Props) => {

const [input , setInput] = useState("");
const {data : messages, error , mutate} = useSWR("/api/getMessages" , fetcher); 
// console.log(messages);


const addMessage = async (e: FormEvent<HTMLFormElement> ) => {
e.preventDefault();

if(!input) return;
if(!session) return;
const messageToSend = input;
setInput("");

const id = uuid();

const message:Message = {
  id,
  message:messageToSend,
  created_at:Date.now(),
  username:session?.user?.name!,
  profilePic:session?.user?.image!,
  email:session?.user?.email!
};

const uploadMessageToUpstash = async() =>{
  const data = await fetch('/api/addMessage',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({message}),
  }).then(res => res.json());  

return [data.message , ...messages!]

};

// uploadMessageToUpstash();
await mutate(uploadMessageToUpstash , {
  optimisticData: [message , ...messages!],
  rollbackOnError:true,

})

};

  return (
    <div>
        <form onSubmit={addMessage} className='flex px-10 py-5 space-x-2 fixed bottom-0 z-50 w-full border-t bg-white border-gray-100'>
            <input type="text"
            value={input}
            disabled={!session}
            onChange={(e)=> setInput(e.target.value)}
            placeholder='Enter Message here...'
            className='flex-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 '
            />

            <button type="submit"
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed' 
            disabled={!input}>Send</button>
        </form>
    </div>
  );
};

export default ChatInput;
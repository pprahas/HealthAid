import { Message } from "@/types";
import { Avatar } from "./messageAvatar";

interface chatProps {
  messages: Message[];
}

export const ChatContainer = ({ messages }: chatProps) => {
  return (
    <div className="h-full mr-10">
      {messages &&
        messages.map((message: Message, index: number) => (
          <div>
            <div
              key={index}
              className={`py-2 flex flex-row w-full items-end ${
                message.senderType === "gpt" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`${
                  message.senderType === "gpt" ? "order-1" : "order-2"
                }`}
              >
                <Avatar sender={message.senderType} />
              </div>
              <div
                className={`snap-end px-2 w-[calc(100%-20%)] py-2 flex flex-col rounded-2xl text-white shadow-md ${
                  message.senderType === "gpt"
                    ? "order-2 ml-2 bg-gradient-to-r from-blue-800 to-indigo-800"
                    : "order-1 mr-2 bg-gradient-to-l from-gray-500 to-slate-700"
                }`}
              >
                <span className="text-md">{message.content}</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

import { Message } from "@/types";
import { Avatar } from "./messageAvatar";

interface chatProps {
  messages: Message[];
}

export const ChatContainer = ({ messages }: chatProps) => {
  const formatDate = (dateTimeStr: string) => {
    // Convert UTC date-time string to local Date object
    const date = new Date(dateTimeStr);
    // Define arrays to get month names and ordinal numbers
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const ordinals = (n: number) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    try {
      // Extract date components
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      let hour = date.getHours();
      const minute = ("0" + date.getMinutes()).slice(-2); // pad with leading 0 if needed
      const ampm = hour >= 12 ? "PM" : "AM";

      // Convert 24-hour format to 12-hour format
      hour = hour % 12;
      hour = hour ? hour : 12; // the hour '0' should be '12'

      // Construct the desired format
      return `${month} ${day}${ordinals(
        day
      )} ${year} @ ${hour}:${minute} ${ampm}`;
    } catch (error) {
      return `${date}`;
    }
  };
  return (
    <div className="h-full mr-10">
      {messages &&
        messages.map((message: Message, index: number) => (
          <div>
            {message.senderType == "gpt" && (
              <div>
                <div
                  key={index}
                  className="py-2 flex flex-row items-end justify-start"
                >
                  <div className="">
                    <Avatar sender={message.senderType} />
                  </div>
                  <div className="flex flex-col ">
                    <div className="px-2 max-w-[calc(100%-20%)] py-2 flex flex-col rounded-2xl text-white shadow-md ml-2 bg-gradient-to-r from-blue-800 to-indigo-800">
                      <span className="text-md">{message.content}</span>
                    </div>
                    <div className="ml-2">{formatDate(`${message.date}`)}</div>
                  </div>
                </div>
              </div>
            )}
            {message.senderType != "gpt" && (
              <div>
                <div
                  key={index}
                  className="py-2 flex flex-row items-end justify-end"
                >
                  <div className="flex flex-col ">
                    <div className="px-2 max-w-[calc(100%-20%)] py-2 flex flex-col rounded-2xl text-white shadow-md mr-2 bg-gradient-to-l from-gray-500 to-slate-700">
                      <span className="text-md">{message.content}</span>
                    </div>
                    <div className="ml-2">{formatDate(`${message.date}`)}</div>
                  </div>
                  <div>
                    <Avatar sender={message.senderType} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

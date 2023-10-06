interface Message {
    content: string;
    sender_type: string;
    date: Date;
}

export const messages: Message[] = [
    {
      content: "Lorem ipsum dolor sit amet?",
      sender_type: "AI",
      date: new Date("2023-03-02T09:00:00Z"),
    },
    {
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut labore et dolore magna aliqua?",
        sender_type: "Human",
        date: new Date("2023-03-02T09:01:00Z"),
    },
    {
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        sender_type: "AI",
        date: new Date("2023-03-02T09:02:00Z"),
    },
    {
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        sender_type: "AI",
        date: new Date("2023-03-02T09:02:00Z"),
    },
    {
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        sender_type: "Human",
        date: new Date("2023-03-02T09:02:00Z"),
    },
    {
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        sender_type: "Human",
        date: new Date("2023-03-02T09:02:00Z"),
    },
    {
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        sender_type: "AI",
        date: new Date("2023-03-02T09:02:00Z"),
    },
    {
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        sender_type: "Human",
        date: new Date("2023-03-02T09:02:00Z"),
    },
    {
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        sender_type: "AI",
        date: new Date("2023-03-02T09:02:00Z"),
    },
    {
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        sender_type: "AI",
        date: new Date("2023-03-02T09:02:00Z"),
    }
];

export type {Message};
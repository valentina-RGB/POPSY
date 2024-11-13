export interface Message {
  fromName: string;
  subject: string;
  date: string;
  id: number;
}

const messages: Message[] = [
  {
    fromName: 'Copa queso',
    subject: 'Copa queso pequeña',
    date: '$12.000',
    id: 0
  },
  {
    fromName: 'Salpicón con helado',
    subject: 'Delicioso salpicón',
    date: '$12.600',
    id: 1
  },
  {
    fromName: 'Browinie especial',
    subject: 'Report Results',
    date: '4:55 AM',
    id: 2

  },
  {
    fromName: 'Copa cereza',
    subject: 'The situation',
    date: 'Yesterday',
    id: 3
  },
  {
    fromName: 'Joanne Pollan',
    subject: 'Updated invitation: Swim lessons',
    date: 'Yesterday',
    id: 4
  },
  {
    fromName: 'Andrea Cornerston',
    subject: 'Last minute ask',
    date: 'Yesterday',
    id: 5
  },
  {
    fromName: 'Moe Chamont',
    subject: 'Family Calendar - Version 1',
    date: 'Last Week',
    id: 6
  },
  {
    fromName: 'Kelly Richardson',
    subject: 'Placeholder Headhots',
    date: 'Last Week',
    id: 7
  }
];

export const getMessages = () => messages;

export const getMessage = (id: number) => messages.find(m => m.id === id);

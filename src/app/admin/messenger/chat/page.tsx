// src/app/admin/messenger/chat/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Paperclip, Search, UserCircle, MoreVertical, PlusCircle } from 'lucide-react'; // Added PlusCircle
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // Added useToast

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSender: boolean; // True if admin sent the message, false if contact sent
}

interface Conversation {
  id: string;
  contactName: string;
  contactNumber?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  avatarUrl?: string; // Optional avatar URL
  messages: Message[];
}

const placeholderConversations: Conversation[] = [
  {
    id: 'convo-1',
    contactName: 'Alice Wonderland',
    contactNumber: '+1 555-1234',
    lastMessage: "Okay, I'll try that. Thanks!",
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
    avatarUrl: 'https://placehold.co/40x40.png?text=AW',
    messages: [
      { id: 'msg-1-1', text: 'Hello, I need help with my internet.', timestamp: '10:25 AM', isSender: false },
      { id: 'msg-1-2', text: 'Hi Alice, sure. Have you tried restarting your modem?', timestamp: '10:26 AM', isSender: true },
      { id: 'msg-1-3', text: "Yes, I did. It didn't work.", timestamp: '10:28 AM', isSender: false },
      { id: 'msg-1-4', text: "Okay, I'll try that. Thanks!", timestamp: '10:30 AM', isSender: false },
    ],
  },
  {
    id: 'convo-2',
    contactName: 'Bob The Builder Inc.',
    contactNumber: '+1 555-5678',
    lastMessage: 'Great, looking forward to the quote.',
    lastMessageTime: 'Yesterday',
    avatarUrl: 'https://placehold.co/40x40.png?text=BB',
    messages: [
      { id: 'msg-2-1', text: 'Can we build it?', timestamp: 'Yesterday', isSender: false },
      { id: 'msg-2-2', text: 'Yes, we can!', timestamp: 'Yesterday', isSender: true },
      { id: 'msg-2-3', text: 'Great, looking forward to the quote.', timestamp: 'Yesterday', isSender: false },
    ],
  },
  {
    id: 'convo-3',
    contactName: 'Charlie Brown',
    contactNumber: '+1 555-9012',
    lastMessage: 'Good grief.',
    lastMessageTime: 'Mon',
    unreadCount: 5,
    avatarUrl: 'https://placehold.co/40x40.png?text=CB',
    messages: [{ id: 'msg-3-1', text: 'Good grief.', timestamp: 'Mon', isSender: false }],
  },
];

export default function MessengerChatPage() {
  const { t } = useLocale();
  const { toast } = useToast(); // Initialize toast
  const iconSize = "h-4 w-4";
  const smallIconSize = "h-3 w-3";
  const actionIconSize = "h-5 w-5 text-muted-foreground"; // For header icons

  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState('');

  React.useEffect(() => {
    if (selectedConversation) {
      setMessages(selectedConversation.messages);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `msg-admin-${Date.now()}`,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: true,
    };
    setMessages(prev => [...prev, newMsg]);
    // Update the conversation's last message (in a real app, this would update backend)
    const updatedConversations = placeholderConversations.map(convo =>
      convo.id === selectedConversation.id
        ? { ...convo, lastMessage: newMessage, lastMessageTime: newMsg.timestamp, unreadCount: 0 }
        : convo
    );
    // In a real app, you'd update your state source for placeholderConversations if it's dynamic.
    // For this example, placeholderConversations is static, so the list won't visually update.

    setNewMessage('');
    console.log('Sending message:', newMsg, 'to conversation:', selectedConversation.id);
    // TODO: Implement actual message sending logic
  };

  const handleNewConversation = () => {
    toast({
      title: t('messenger_chat.new_conversation_toast_title'),
      description: t('messenger_chat.new_conversation_toast_desc'),
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex h-full w-full bg-background">
      {/* Left Sidebar: Conversation List */}
      <div className="flex flex-col w-full max-w-xs border-r border-border bg-card">
        <div className="p-3 border-b border-border flex items-center gap-2"> {/* Flex container for search and button */}
           <div className="relative flex-grow"> {/* Search input takes available space */}
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${smallIconSize} text-muted-foreground`} />
            <Input
              type="search"
              placeholder={t('messenger_chat.search_conversations_placeholder', 'Search or start new chat')}
              className="pl-8 h-8 text-xs"
            />
           </div>
           <Button
             variant="default"
             size="icon"
             className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white shrink-0" // Green button
             onClick={handleNewConversation}
             aria-label={t('messenger_chat.new_conversation_aria_label')}
           >
             <PlusCircle className={iconSize} />
           </Button>
        </div>
        <ScrollArea className="flex-1">
          {placeholderConversations.map((convo) => (
            <Button
              key={convo.id}
              variant="ghost"
              className={cn(
                "w-full h-auto justify-start p-3 rounded-none border-b border-border",
                selectedConversation?.id === convo.id && "bg-muted"
              )}
              onClick={() => setSelectedConversation(convo)}
            >
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src={convo.avatarUrl} alt={convo.contactName} data-ai-hint="person face" />
                <AvatarFallback>{getInitials(convo.contactName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-medium truncate">{convo.contactName}</p>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">{convo.lastMessageTime}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                  {convo.unreadCount && convo.unreadCount > 0 && (
                    <Badge variant="default" className="h-4 px-1.5 text-[10px] bg-primary text-primary-foreground ml-2">
                      {convo.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </Button>
          ))}
          {placeholderConversations.length === 0 && (
             <p className="text-xs text-muted-foreground text-center p-4">{t('messenger_chat.no_conversations')}</p>
          )}
        </ScrollArea>
      </div>

      {/* Right Main Area: Chat Window */}
      <div className="flex flex-1 flex-col bg-background">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-3 border-b border-border bg-card h-14">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={selectedConversation.avatarUrl} alt={selectedConversation.contactName} data-ai-hint="person face" />
                <AvatarFallback>{getInitials(selectedConversation.contactName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-xs font-semibold">{selectedConversation.contactName}</p>
                {selectedConversation.contactNumber && (
                    <p className="text-[10px] text-muted-foreground">{selectedConversation.contactNumber}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Search className={actionIconSize} />
                    <span className="sr-only">{t('messenger_chat.search_in_chat_sr', 'Search in chat')}</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className={actionIconSize} />
                    <span className="sr-only">{t('messenger_chat.more_options_sr', 'More options')}</span>
                </Button>
              </div>
            </div>

            {/* Message Display Area */}
            <ScrollArea className="flex-1 p-4 space-y-3 bg-muted/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    msg.isSender ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] p-2 rounded-lg shadow-sm",
                      msg.isSender
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground"
                    )}
                  >
                    <p className="text-xs whitespace-pre-wrap">{msg.text}</p>
                    <p className={cn("text-[10px] mt-1", msg.isSender ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-right")}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>

            {/* Message Input Footer */}
            <div className="p-3 border-t border-border bg-card h-16">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button variant="ghost" size="icon" type="button" className="h-8 w-8">
                  <Paperclip className={`${iconSize} text-muted-foreground`} />
                  <span className="sr-only">{t('messenger_chat.attach_file_sr', 'Attach file')}</span>
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('messenger_chat.message_input_placeholder', 'Type a message...')}
                  className="flex-1 h-8 text-xs"
                />
                <Button type="submit" size="icon" className="h-8 w-8">
                  <Send className={iconSize} />
                  <span className="sr-only">{t('messenger_chat.send_message_sr', 'Send message')}</span>
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/30">
            <MessageCircle className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-sm font-semibold text-muted-foreground">{t('messenger_chat.no_chat_selected_title', 'No Chat Selected')}</p>
            <p className="text-xs text-muted-foreground/80">{t('messenger_chat.no_chat_selected_desc', 'Select a conversation from the list to start chatting.')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

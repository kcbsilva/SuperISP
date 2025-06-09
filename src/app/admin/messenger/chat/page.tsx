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
import { MessageCircle, Send, Paperclip, Search, UserCircle, MoreVertical, PlusCircle, UserCheck, Users as UsersIcon, Repeat } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription as DialogDescriptionComponent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSender: boolean;
}

interface Conversation {
  id: string;
  contactName: string;
  contactNumber?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  avatarUrl?: string;
  messages: Message[];
  isAssignedToMe: boolean;
}

const initialConversations: Conversation[] = [
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
    isAssignedToMe: false,
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
    isAssignedToMe: true,
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
    isAssignedToMe: false,
  },
];

const placeholderDepartments = [
  { id: 'dept-1', name: 'Technical Support' },
  { id: 'dept-2', name: 'Billing & Payments' },
  { id: 'dept-3', name: 'Sales Enquiries' },
];

const placeholderUsers = [
  { id: 'user-1', name: 'John Doe (Support)' },
  { id: 'user-2', name: 'Jane Smith (Billing)' },
  { id: 'user-3', name: 'Mike Brown (Sales)' },
];

export default function MessengerChatPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-4 w-4";
  const smallIconSize = "h-3 w-3";
  const actionIconSize = "h-5 w-5 text-muted-foreground";

  const [conversations, setConversations] = React.useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const [conversationToTransferId, setConversationToTransferId] = React.useState<string | null>(null);
  const [transferTarget, setTransferTarget] = React.useState<{ type: 'Department' | 'Person', id: string, name: string } | null>(null);


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
    setConversations(prevConvos =>
      prevConvos.map(convo =>
        convo.id === selectedConversation.id
          ? { ...convo, lastMessage: newMessage, lastMessageTime: newMsg.timestamp, unreadCount: 0 }
          : convo
      )
    );
    setNewMessage('');
  };

  const handleNewConversation = () => {
    toast({
      title: t('messenger_chat.new_conversation_toast_title'),
      description: t('messenger_chat.new_conversation_toast_desc'),
    });
  };

  const handleAssignToMe = (conversationId: string) => {
    setConversations(prevConvos =>
      prevConvos.map(convo =>
        convo.id === conversationId ? { ...convo, isAssignedToMe: !convo.isAssignedToMe } : convo
      )
    );
    const assignedConvo = conversations.find(c => c.id === conversationId);
    toast({
      title: t('messenger_chat.assign_to_me_toast_title'),
      description: t('messenger_chat.assign_to_me_toast_desc', 'Conversation with {contactName} {status}.')
        .replace('{contactName}', assignedConvo?.contactName || 'Unknown')
        .replace('{status}', !assignedConvo?.isAssignedToMe ? t('messenger_chat.assigned_status') : t('messenger_chat.unassigned_status')),
    });
  };

  const handleOpenTransferModal = (conversationId: string) => {
    setConversationToTransferId(conversationId);
    setTransferTarget(null);
    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!conversationToTransferId || !transferTarget) return;
    const convoName = conversations.find(c => c.id === conversationToTransferId)?.contactName || 'this conversation';
    toast({
      title: t('messenger_chat.transfer_confirmed_toast_title'),
      description: t('messenger_chat.transfer_confirmed_toast_desc', '{convoName} transferred to {targetType}: {targetName}.')
        .replace('{convoName}', convoName)
        .replace('{targetType}', t(`messenger_chat.transfer_target_type_${transferTarget.type.toLowerCase()}` as any))
        .replace('{targetName}', transferTarget.name),
    });
    setIsTransferModalOpen(false);
    setConversationToTransferId(null);
    setTransferTarget(null);
  };


  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <div className="flex h-full w-full bg-background">
        {/* Left Sidebar: Conversation List */}
        <div className="flex flex-col w-full max-w-xs border-r border-border bg-card">
          <div className="p-3 border-b border-border flex items-center gap-2">
            <div className="relative flex-grow">
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
              className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white shrink-0"
              onClick={handleNewConversation}
              aria-label={t('messenger_chat.new_conversation_aria_label')}
            >
              <PlusCircle className={iconSize} />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-2"> {/* Added padding to ScrollArea */}
            {conversations.map((convo) => (
              <Button
                key={convo.id}
                variant="ghost"
                className={cn(
                  "w-full h-auto justify-start p-3 flex items-start mb-1", // Added mb-1, removed border-b
                  "border rounded-md", // Base border for all items
                  selectedConversation?.id === convo.id && "bg-muted",
                  convo.isAssignedToMe ? "border-green-500" : "border-yellow-500"
                )}
                onClick={() => setSelectedConversation(convo)}
              >
                <Avatar className="h-9 w-9 mr-3 mt-0.5 shrink-0">
                  <AvatarImage src={convo.avatarUrl} alt={convo.contactName} data-ai-hint="person face" />
                  <AvatarFallback>{getInitials(convo.contactName)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-left overflow-hidden mr-2">
                  <p className="text-xs font-medium truncate">{convo.contactName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {convo.unreadCount && convo.unreadCount > 0 && (
                      <Badge variant="default" className="h-4 min-w-[16px] px-1.5 text-[10px] bg-primary text-primary-foreground shrink-0 flex items-center justify-center">
                        {convo.unreadCount}
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground truncate flex-1">{convo.lastMessage}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-0.5 shrink-0">
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">{convo.lastMessageTime}</p>
                  <div className="flex items-center -mr-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleAssignToMe(convo.id); }}
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      title={convo.isAssignedToMe ? t('messenger_chat.unassign_from_me') : t('messenger_chat.assign_to_me')}
                    >
                      <UserCheck className={smallIconSize} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleOpenTransferModal(convo.id); }}
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      title={t('messenger_chat.transfer_conversation')}
                    >
                      <Repeat className={smallIconSize} />
                    </Button>
                  </div>
                </div>
              </Button>
            ))}
            {conversations.length === 0 && (
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
                  <AvatarImage src={selectedConversation.avatarUrl} alt={selectedConversation.contactName} data-ai-hint="person face"/>
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

      {/* Transfer Modal */}
      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">{t('messenger_chat.transfer_modal_title')}</DialogTitle>
            <DialogDescriptionComponent className="text-xs">
              {t('messenger_chat.transfer_modal_desc', 'Select a department or person to transfer this conversation to.')}
            </DialogDescriptionComponent>
          </DialogHeader>
          <Tabs defaultValue="department" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="department">{t('messenger_chat.transfer_tab_department')}</TabsTrigger>
              <TabsTrigger value="person">{t('messenger_chat.transfer_tab_person')}</TabsTrigger>
            </TabsList>
            <TabsContent value="department" className="mt-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {placeholderDepartments.map(dept => (
                  <Button
                    key={dept.id}
                    variant={transferTarget?.type === 'Department' && transferTarget.id === dept.id ? 'default' : 'outline'}
                    className="w-full justify-start text-xs"
                    onClick={() => setTransferTarget({ type: 'Department', id: dept.id, name: dept.name })}
                  >
                    <UsersIcon className={`mr-2 ${smallIconSize}`} /> {dept.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="person" className="mt-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {placeholderUsers.map(user => (
                  <Button
                    key={user.id}
                    variant={transferTarget?.type === 'Person' && transferTarget.id === user.id ? 'default' : 'outline'}
                    className="w-full justify-start text-xs"
                    onClick={() => setTransferTarget({ type: 'Person', id: user.id, name: user.name })}
                  >
                    <UserCircle className={`mr-2 ${smallIconSize}`} /> {user.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">{t('messenger_chat.transfer_modal_cancel_button')}</Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirmTransfer} disabled={!transferTarget}>
              {t('messenger_chat.transfer_modal_confirm_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

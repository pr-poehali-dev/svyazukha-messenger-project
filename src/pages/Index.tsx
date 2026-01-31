import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Message = {
  id: string;
  text?: string;
  time: string;
  isMine: boolean;
  type: 'text' | 'voice';
  duration?: number;
};

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  type: 'direct' | 'group' | 'channel';
  messages: Message[];
};

type Friend = {
  id: string;
  name: string;
  avatar: string;
  code: string;
  online: boolean;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'friends' | 'groups' | 'channels' | 'profile'>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<Chat[]>([
    { 
      id: '1', 
      name: 'Алексей Иванов', 
      avatar: '', 
      lastMessage: 'Привет! Как дела?', 
      time: '14:32', 
      unread: 2, 
      online: true, 
      type: 'direct',
      messages: [
        { id: '1', text: 'Привет! Как дела?', time: '14:30', isMine: false, type: 'text' },
        { id: '2', text: 'Отлично, спасибо! А у тебя?', time: '14:31', isMine: true, type: 'text' },
        { id: '3', text: 'Тоже хорошо! Планы на выходные?', time: '14:32', isMine: false, type: 'text' },
      ]
    },
    { 
      id: '2', 
      name: 'Мария Петрова', 
      avatar: '', 
      lastMessage: 'Спасибо за помощь!', 
      time: '13:15', 
      unread: 0, 
      online: false, 
      type: 'direct',
      messages: [
        { id: '1', text: 'Можешь помочь с проектом?', time: '13:10', isMine: false, type: 'text' },
        { id: '2', text: 'Конечно! Что нужно?', time: '13:12', isMine: true, type: 'text' },
        { id: '3', text: 'Спасибо за помощь!', time: '13:15', isMine: false, type: 'text' },
      ]
    },
    { 
      id: '3', 
      name: 'Веб-разработка', 
      avatar: '', 
      lastMessage: 'Кто-нибудь знает React?', 
      time: '12:45', 
      unread: 5, 
      type: 'group',
      messages: [
        { id: '1', text: 'Всем привет!', time: '12:30', isMine: false, type: 'text' },
        { id: '2', text: 'Кто-нибудь знает React?', time: '12:45', isMine: false, type: 'text' },
      ]
    },
    { 
      id: '4', 
      name: 'Новости СВЯЗУХИ', 
      avatar: '', 
      lastMessage: 'Новая версия выпущена!', 
      time: 'Вчера', 
      unread: 0, 
      type: 'channel',
      messages: [
        { id: '1', text: 'Новая версия выпущена!', time: 'Вчера', isMine: false, type: 'text' },
      ]
    },
  ]);

  const mockFriends: Friend[] = [
    { id: '1', name: 'Алексей Иванов', avatar: '', code: 'ALEX2024', online: true },
    { id: '2', name: 'Мария Петрова', avatar: '', code: 'MARIA567', online: false },
    { id: '3', name: 'Дмитрий Сидоров', avatar: '', code: 'DIM123', online: true },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selectedChat]);

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingTime(0);
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const sendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const currentTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      time: currentTime,
      isMine: true,
      type: 'text'
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === selectedChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: messageText,
          time: currentTime
        };
      }
      return chat;
    }));

    setMessageText('');
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!selectedChat || recordingTime === 0) {
      setIsRecording(false);
      return;
    }

    const currentTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: Date.now().toString(),
      time: currentTime,
      isMine: true,
      type: 'voice',
      duration: recordingTime
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === selectedChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: '🎙️ Голосовое сообщение',
          time: currentTime
        };
      }
      return chat;
    }));

    setIsRecording(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSidebar = () => (
    <div className="w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-6">
      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl">
        С
      </div>
      
      <nav className="flex-1 flex flex-col gap-4">
        <button
          onClick={() => setActiveTab('chats')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeTab === 'chats' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Icon name="MessageSquare" size={24} />
        </button>
        
        <button
          onClick={() => setActiveTab('friends')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeTab === 'friends' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Icon name="Users" size={24} />
        </button>
        
        <button
          onClick={() => setActiveTab('groups')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeTab === 'groups' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Icon name="UsersRound" size={24} />
        </button>
        
        <button
          onClick={() => setActiveTab('channels')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeTab === 'channels' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Icon name="Radio" size={24} />
        </button>
      </nav>

      <button
        onClick={() => setActiveTab('profile')}
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
          activeTab === 'profile' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
        }`}
      >
        <Icon name="Settings" size={24} />
      </button>
    </div>
  );

  const renderChatsList = () => (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold mb-4">Сообщения</h1>
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setSelectedChat(chat.id)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors border-b border-border ${
              selectedChat === chat.id ? 'bg-muted' : ''
            }`}
          >
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback className="bg-primary text-white">{chat.name[0]}</AvatarFallback>
              </Avatar>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              )}
            </div>
            
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">{chat.name}</h3>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <Badge className="bg-primary ml-2">{chat.unread}</Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </ScrollArea>
    </div>
  );

  const renderFriendsList = () => (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Друзья</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Icon name="UserPlus" size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Добавить друга</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Код друга</Label>
                  <Input placeholder="Введите код друга..." className="mt-2" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">Отправить запрос</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Поиск друзей..." className="pl-10" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {mockFriends.map((friend) => (
          <div key={friend.id} className="p-4 flex items-center gap-3 hover:bg-muted transition-colors border-b border-border">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback className="bg-primary text-white">{friend.name[0]}</AvatarFallback>
              </Avatar>
              {friend.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold">{friend.name}</h3>
              <p className="text-sm text-muted-foreground">Код: {friend.code}</p>
            </div>
            
            <Button size="sm" variant="ghost">
              <Icon name="MessageCircle" size={18} />
            </Button>
          </div>
        ))}
      </ScrollArea>
    </div>
  );

  const renderGroups = () => (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Группы</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Icon name="Plus" size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Создать группу</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Название группы</Label>
                  <Input placeholder="Моя группа" className="mt-2" />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea placeholder="О чем эта группа..." className="mt-2" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">Создать</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Поиск групп..." className="pl-10" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {chats.filter(c => c.type === 'group').map((group) => (
          <button
            key={group.id}
            className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors border-b border-border"
          >
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-secondary text-white">{group.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-sm text-muted-foreground">{group.lastMessage}</p>
            </div>
          </button>
        ))}
      </ScrollArea>
    </div>
  );

  const renderChannels = () => (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Каналы</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Icon name="Plus" size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Создать канал</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Название канала</Label>
                  <Input placeholder="Мой канал" className="mt-2" />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea placeholder="О чем этот канал..." className="mt-2" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">Создать</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Поиск каналов..." className="pl-10" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {chats.filter(c => c.type === 'channel').map((channel) => (
          <button
            key={channel.id}
            className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors border-b border-border"
          >
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-accent text-white">
                <Icon name="Radio" size={20} />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <h3 className="font-semibold">{channel.name}</h3>
              <p className="text-sm text-muted-foreground">{channel.lastMessage}</p>
            </div>
          </button>
        ))}
      </ScrollArea>
    </div>
  );

  const renderProfile = () => (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold">Профиль</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-primary text-white text-3xl">И</AvatarFallback>
            </Avatar>
            <Button size="sm" variant="outline">Изменить фото</Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Имя</Label>
              <Input defaultValue="Иван Иванов" className="mt-2" />
            </div>
            <div>
              <Label>О себе</Label>
              <Textarea defaultValue="Просто человек" className="mt-2" />
            </div>
            <div>
              <Label>Мой код друга</Label>
              <div className="flex gap-2 mt-2">
                <Input value="IVAN2024" readOnly />
                <Button size="sm" variant="outline">
                  <Icon name="Copy" size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button className="w-full bg-primary hover:bg-primary/90">Сохранить изменения</Button>
            <Button variant="outline" className="w-full">
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  const renderChatWindow = () => {
    if (!selectedChat) {
      return (
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center">
            <Icon name="MessageCircle" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Выберите чат</h2>
            <p className="text-muted-foreground">Выберите беседу из списка слева</p>
          </div>
        </div>
      );
    }

    const chat = chats.find(c => c.id === selectedChat);
    const messages = chat?.messages || [];

    return (
      <div className="flex-1 flex flex-col bg-background">
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-white">{chat?.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{chat?.name}</h3>
              <p className="text-xs text-muted-foreground">
                {chat?.online ? 'в сети' : 'был(а) недавно'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              <Icon name="Phone" size={20} />
            </Button>
            <Button size="sm" variant="ghost">
              <Icon name="Video" size={20} />
            </Button>
            <Button size="sm" variant="ghost">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-2xl ${
                    message.isMine
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-card text-foreground rounded-bl-sm'
                  }`}
                >
                  {message.type === 'text' ? (
                    <>
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isMine ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {message.time}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`rounded-full w-8 h-8 p-0 ${message.isMine ? 'hover:bg-white/20' : 'hover:bg-muted'}`}
                      >
                        <Icon name="Play" size={16} />
                      </Button>
                      <div className="flex-1">
                        <div className="h-1 bg-white/30 rounded-full w-32"></div>
                        <p className={`text-xs mt-1 ${message.isMine ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {formatDuration(message.duration || 0)} • {message.time}
                        </p>
                      </div>
                      <Icon name="Mic" size={16} className={message.isMine ? 'text-white/70' : 'text-muted-foreground'} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-card">
          {isRecording ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{formatDuration(recordingTime)}</span>
                <div className="h-1 bg-primary/30 rounded-full flex-1"></div>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Icon name="StopCircle" size={20} />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost">
                <Icon name="Paperclip" size={20} />
              </Button>
              <Input 
                placeholder="Введите сообщение..." 
                className="flex-1"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button 
                size="sm" 
                variant="ghost"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
              >
                <Icon name="Mic" size={20} />
              </Button>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={sendMessage}
                disabled={!messageText.trim()}
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center">
        <Icon name="Inbox" size={64} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Пока пусто</h2>
        <p className="text-muted-foreground">Начните создавать что-то новое!</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex">
      {renderSidebar()}
      
      {activeTab === 'chats' && renderChatsList()}
      {activeTab === 'friends' && renderFriendsList()}
      {activeTab === 'groups' && renderGroups()}
      {activeTab === 'channels' && renderChannels()}
      {activeTab === 'profile' && renderProfile()}

      {activeTab === 'chats' && renderChatWindow()}
      {(activeTab === 'friends' || activeTab === 'groups' || activeTab === 'channels') && renderEmptyState()}
    </div>
  );
};

export default Index;
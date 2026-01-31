import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  type: 'direct' | 'group' | 'channel';
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

  const mockChats: Chat[] = [
    { id: '1', name: 'Алексей Иванов', avatar: '', lastMessage: 'Привет! Как дела?', time: '14:32', unread: 2, online: true, type: 'direct' },
    { id: '2', name: 'Мария Петрова', avatar: '', lastMessage: 'Спасибо за помощь!', time: '13:15', unread: 0, online: false, type: 'direct' },
    { id: '3', name: 'Веб-разработка', avatar: '', lastMessage: 'Кто-нибудь знает React?', time: '12:45', unread: 5, type: 'group' },
    { id: '4', name: 'Новости СВЯЗУХИ', avatar: '', lastMessage: 'Новая версия выпущена!', time: 'Вчера', unread: 0, type: 'channel' },
  ];

  const mockFriends: Friend[] = [
    { id: '1', name: 'Алексей Иванов', avatar: '', code: 'ALEX2024', online: true },
    { id: '2', name: 'Мария Петрова', avatar: '', code: 'MARIA567', online: false },
    { id: '3', name: 'Дмитрий Сидоров', avatar: '', code: 'DIM123', online: true },
  ];

  const mockMessages = [
    { id: '1', text: 'Привет! Как дела?', time: '14:30', isMine: false },
    { id: '2', text: 'Отлично, спасибо! А у тебя?', time: '14:31', isMine: true },
    { id: '3', text: 'Тоже хорошо! Планы на выходные?', time: '14:32', isMine: false },
  ];

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
        {mockChats.map((chat) => (
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
        {mockChats.filter(c => c.type === 'group').map((group) => (
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
        {mockChats.filter(c => c.type === 'channel').map((channel) => (
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

    const chat = mockChats.find(c => c.id === selectedChat);

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
            {mockMessages.map((message) => (
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
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isMine ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              <Icon name="Paperclip" size={20} />
            </Button>
            <Input placeholder="Введите сообщение..." className="flex-1" />
            <Button size="sm" variant="ghost">
              <Icon name="Mic" size={20} />
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Icon name="Send" size={20} />
            </Button>
          </div>
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

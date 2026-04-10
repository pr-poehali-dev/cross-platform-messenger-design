import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Message = {
  id: number;
  from: string;
  text: string;
  time: string;
  type: "text" | "voice";
  duration?: string;
  fromName?: string;
};

const CHATS = [
  {
    id: 1,
    name: "Алексей Смирнов",
    avatar: "АС",
    color: "from-violet-500 to-purple-600",
    lastMessage: "Когда созвонимся?",
    time: "14:32",
    unread: 3,
    online: true,
    messages: [
      { id: 1, from: "them", text: "Привет! Как дела?", time: "14:10", type: "text" },
      { id: 2, from: "me", text: "Отлично, работаю над проектом 🚀", time: "14:12", type: "text" },
      { id: 3, from: "them", text: "", time: "14:20", type: "voice", duration: "0:24" },
      { id: 4, from: "me", text: "Послушал, понял. Давай обсудим детали.", time: "14:25", type: "text" },
      { id: 5, from: "them", text: "Когда созвонимся?", time: "14:32", type: "text" },
    ],
  },
  {
    id: 2,
    name: "Команда Проект X",
    avatar: "КП",
    color: "from-cyan-500 to-blue-600",
    lastMessage: "Мария: дизайн готов!",
    time: "13:15",
    unread: 0,
    online: false,
    isGroup: true,
    messages: [
      { id: 1, from: "Maria", fromName: "Мария", text: "Всем привет!", time: "12:00", type: "text" },
      { id: 2, from: "them", fromName: "Дмитрий", text: "Когда встреча?", time: "12:30", type: "text" },
      { id: 3, from: "me", text: "В 15:00 удобно?", time: "12:45", type: "text" },
      { id: 4, from: "Maria", fromName: "Мария", text: "дизайн готов!", time: "13:15", type: "text" },
    ],
  },
  {
    id: 3,
    name: "Наташа Королёва",
    avatar: "НК",
    color: "from-pink-500 to-rose-600",
    lastMessage: "",
    time: "11:50",
    unread: 1,
    online: true,
    messages: [
      { id: 1, from: "them", text: "", time: "11:50", type: "voice", duration: "1:02" },
    ],
  },
  {
    id: 4,
    name: "Иван Петров",
    avatar: "ИП",
    color: "from-emerald-500 to-teal-600",
    lastMessage: "Спасибо за помощь!",
    time: "Вчера",
    unread: 0,
    online: false,
    messages: [
      { id: 1, from: "me", text: "Помог с задачей?", time: "Вчера", type: "text" },
      { id: 2, from: "them", text: "Спасибо за помощь!", time: "Вчера", type: "text" },
    ],
  },
  {
    id: 5,
    name: "Дарья Волкова",
    avatar: "ДВ",
    color: "from-amber-500 to-orange-600",
    lastMessage: "Увидимся на конференции",
    time: "Пн",
    unread: 0,
    online: false,
    messages: [
      { id: 1, from: "them", text: "Увидимся на конференции", time: "Пн", type: "text" },
    ],
  },
];

const CONTACTS = [
  { id: 1, name: "Алексей Смирнов", status: "В сети", avatar: "АС", color: "from-violet-500 to-purple-600", phone: "+7 916 123-45-67", online: true },
  { id: 2, name: "Дарья Волкова", status: "Была 2 часа назад", avatar: "ДВ", color: "from-amber-500 to-orange-600", phone: "+7 903 234-56-78", online: false },
  { id: 3, name: "Иван Петров", status: "Был вчера", avatar: "ИП", color: "from-emerald-500 to-teal-600", phone: "+7 925 345-67-89", online: false },
  { id: 4, name: "Мария Иванова", status: "В сети", avatar: "МИ", color: "from-pink-500 to-rose-600", phone: "+7 977 456-78-90", online: true },
  { id: 5, name: "Наташа Королёва", status: "В сети", avatar: "НК", color: "from-pink-500 to-rose-600", phone: "+7 985 567-89-01", online: true },
  { id: 6, name: "Олег Сидоров", status: "Был 3 дня назад", avatar: "ОС", color: "from-indigo-500 to-blue-600", phone: "+7 999 678-90-12", online: false },
];

type Tab = "chats" | "contacts" | "profile";

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVoice, setPlayingVoice] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chats, setChats] = useState(CHATS);
  const [recordTime, setRecordTime] = useState(0);
  const recordInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentChat = chats.find((c) => c.id === activeChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, currentChat?.messages.length]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat
          ? {
              ...c,
              lastMessage: message,
              time: "Сейчас",
              messages: [
                ...c.messages,
                { id: Date.now(), from: "me", text: message, time: "Сейчас", type: "text" as const },
              ],
            }
          : c
      )
    );
    setMessage("");
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordTime(0);
    recordInterval.current = setInterval(() => setRecordTime((t) => t + 1), 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordInterval.current) clearInterval(recordInterval.current);
    if (!activeChat) return;
    const dur = `0:${recordTime.toString().padStart(2, "0")}`;
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat
          ? {
              ...c,
              lastMessage: "🎤 Голосовое",
              time: "Сейчас",
              messages: [
                ...c.messages,
                { id: Date.now(), from: "me", text: "", time: "Сейчас", type: "voice" as const, duration: dur },
              ],
            }
          : c
      )
    );
    setRecordTime(0);
  };

  const filteredContacts = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messenger-root">
      {showVideoCall && (
        <div className="video-call-overlay" onClick={() => setShowVideoCall(false)}>
          <div className="video-call-modal" onClick={(e) => e.stopPropagation()}>
            <div className="video-call-bg">
              <div className="video-call-noise" />
              <div className="video-call-avatar-ring">
                <div className={`video-call-avatar bg-gradient-to-br ${currentChat?.color || "from-violet-500 to-purple-600"}`}>
                  {currentChat?.avatar}
                </div>
              </div>
              <div className="video-call-name">{currentChat?.name}</div>
              <div className="video-call-status">
                <span className="video-call-dot" />
                Зашифрованный звонок...
              </div>
              <div className="video-call-enc">
                <Icon name="Shield" size={14} /> end-to-end шифрование
              </div>
            </div>
            <div className="video-call-controls">
              <button className="vc-btn vc-mic"><Icon name="Mic" size={20} /></button>
              <button className="vc-btn vc-end" onClick={() => setShowVideoCall(false)}>
                <Icon name="PhoneOff" size={22} />
              </button>
              <button className="vc-btn vc-cam"><Icon name="Video" size={20} /></button>
            </div>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon"><Icon name="MessageCircle" size={20} /></div>
            <span className="logo-text">Вектор</span>
          </div>
        </div>

        <div className="search-wrap">
          <Icon name="Search" size={15} className="search-icon-inner" />
          <input
            className="search-input"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav className="sidebar-nav">
          {(["chats", "contacts", "profile"] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={`nav-btn ${activeTab === tab ? "nav-btn-active" : ""}`}
              onClick={() => { setActiveTab(tab); if (tab !== "chats") setActiveChat(null); }}
            >
              <Icon
                name={tab === "chats" ? "MessageSquare" : tab === "contacts" ? "Users" : "User"}
                size={17}
              />
              <span>{tab === "chats" ? "Чаты" : tab === "contacts" ? "Контакты" : "Профиль"}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-list">
          {activeTab === "chats" && filteredChats.map((chat) => (
            <button
              key={chat.id}
              className={`chat-item ${activeChat === chat.id ? "chat-item-active" : ""}`}
              onClick={() => { setActiveChat(chat.id); setActiveTab("chats"); }}
            >
              <div className="chat-item-avatar-wrap">
                <div className={`chat-avatar bg-gradient-to-br ${chat.color}`}>{chat.avatar}</div>
                {chat.online && <span className="online-dot" />}
              </div>
              <div className="chat-item-info">
                <div className="chat-item-top">
                  <span className="chat-item-name">{chat.name}</span>
                  <span className="chat-item-time">{chat.time}</span>
                </div>
                <div className="chat-item-bottom">
                  <span className="chat-item-last">
                    {chat.lastMessage
                      ? chat.lastMessage
                      : <span className="voice-preview flex items-center gap-1"><Icon name="Mic" size={11} /> Голосовое</span>}
                  </span>
                  {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                </div>
              </div>
            </button>
          ))}

          {activeTab === "contacts" && filteredContacts.map((contact) => (
            <button
              key={contact.id}
              className="chat-item"
              onClick={() => {
                const existing = chats.find((c) => c.name === contact.name);
                if (existing) { setActiveChat(existing.id); setActiveTab("chats"); }
              }}
            >
              <div className="chat-item-avatar-wrap">
                <div className={`chat-avatar bg-gradient-to-br ${contact.color}`}>{contact.avatar}</div>
                {contact.online && <span className="online-dot" />}
              </div>
              <div className="chat-item-info">
                <div className="chat-item-top">
                  <span className="chat-item-name">{contact.name}</span>
                </div>
                <div className="chat-item-bottom">
                  <span className="chat-item-last">{contact.status}</span>
                </div>
              </div>
            </button>
          ))}

          {activeTab === "profile" && (
            <div className="profile-panel">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600">ВМ</div>
              </div>
              <div className="profile-name">Виктор Морозов</div>
              <div className="profile-username">@username</div>

              <div className="profile-fields">
                {([
                  { label: "Телефон", value: "+7 900 000-00-00", icon: "Phone" },
                  { label: "Статус", value: "На связи 🚀", icon: "Smile" },
                ] as { label: string; value: string; icon: string }[]).map((f) => (
                  <div key={f.label} className="profile-field">
                    <Icon name={f.icon} size={15} className="profile-field-icon" />
                    <div>
                      <div className="profile-field-label">{f.label}</div>
                      <div className="profile-field-value">{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="profile-settings">
                {([
                  { icon: "Bell", label: "Уведомления" },
                  { icon: "Lock", label: "Конфиденциальность" },
                  { icon: "Palette", label: "Оформление" },
                  { icon: "HelpCircle", label: "Помощь" },
                ] as { icon: string; label: string }[]).map((item) => (
                  <button key={item.label} className="profile-setting-btn">
                    <Icon name={item.icon} size={15} />
                    <span>{item.label}</span>
                    <Icon name="ChevronRight" size={13} className="ml-auto opacity-40" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="chat-area">
        {activeChat && currentChat ? (
          <>
            <div className="chat-header">
              <button className="back-btn" onClick={() => setActiveChat(null)}>
                <Icon name="ChevronLeft" size={20} />
              </button>
              <div className={`chat-avatar-sm bg-gradient-to-br ${currentChat.color}`}>{currentChat.avatar}</div>
              <div className="chat-header-info">
                <div className="chat-header-name">{currentChat.name}</div>
                <div className="chat-header-status">
                  {currentChat.online ? <><span className="online-dot-sm" />В сети</> : "Был недавно"}
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="action-btn" onClick={() => setShowVideoCall(true)}>
                  <Icon name="Video" size={19} />
                </button>
                <button className="action-btn" onClick={() => setShowVideoCall(true)}>
                  <Icon name="Phone" size={19} />
                </button>
                <button className="action-btn"><Icon name="MoreVertical" size={19} /></button>
              </div>
            </div>

            <div className="messages-area">
              <div className="messages-wrap">
                {currentChat.messages.map((msg) => (
                  <div key={msg.id} className={`msg-row ${msg.from === "me" ? "msg-row-me" : ""}`}>
                    {msg.from !== "me" && (
                      <div className={`msg-avatar-sm bg-gradient-to-br ${currentChat.color}`}>
                        {currentChat.avatar[0]}
                      </div>
                    )}
                    <div className={`msg-bubble ${msg.from === "me" ? "msg-bubble-me" : "msg-bubble-them"}`}>
                      {(msg as Message).fromName && (
                        <div className="msg-sender">{(msg as Message).fromName}</div>
                      )}
                      {msg.type === "voice" ? (
                        <div className="voice-msg" onClick={() => setPlayingVoice(playingVoice === msg.id ? null : msg.id)}>
                          <button className="voice-play-btn">
                            <Icon name={playingVoice === msg.id ? "Pause" : "Play"} size={13} />
                          </button>
                          <div className="voice-waveform">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <div
                                key={i}
                                className={`voice-bar ${playingVoice === msg.id ? "voice-bar-active" : ""}`}
                                style={{ height: `${6 + Math.sin(i * 0.8) * 7 + (i % 3) * 2}px` }}
                              />
                            ))}
                          </div>
                          <span className="voice-dur">{(msg as Message).duration}</span>
                        </div>
                      ) : (
                        <span>{msg.text}</span>
                      )}
                      <span className="msg-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="input-area">
              {isRecording ? (
                <div className="recording-bar">
                  <div className="rec-dot" />
                  <span className="rec-label">Запись</span>
                  <span className="rec-time">0:{recordTime.toString().padStart(2, "0")}</span>
                  <div className="rec-waves">
                    {[0,1,2,3,4].map(i => <div key={i} className="rec-wave" style={{ animationDelay: `${i * 0.12}s` }} />)}
                  </div>
                  <button className="rec-stop" onClick={stopRecording}>
                    <Icon name="Square" size={15} />
                  </button>
                </div>
              ) : (
                <>
                  <button className="input-icon-btn"><Icon name="Paperclip" size={17} /></button>
                  <input
                    className="msg-input"
                    placeholder="Сообщение..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button className="input-icon-btn" onClick={startRecording}>
                    <Icon name="Mic" size={17} />
                  </button>
                  <button
                    className={`send-btn ${message.trim() ? "send-btn-active" : ""}`}
                    onClick={sendMessage}
                    disabled={!message.trim()}
                  >
                    <Icon name="Send" size={17} />
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="MessageCircle" size={44} />
            </div>
            <div className="empty-title">Вектор</div>
            <div className="empty-sub">Выберите чат или начните новый разговор</div>
            <div className="empty-enc">
              <Icon name="Shield" size={13} /> Все сообщения защищены end-to-end шифрованием
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
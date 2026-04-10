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
type Modal = "new-chat" | "new-channel" | "new-contact" | "edit-username" | null;

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-indigo-500 to-blue-600",
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVoice, setPlayingVoice] = useState<number | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chats, setChats] = useState(CHATS);
  const [archivedChats, setArchivedChats] = useState<typeof CHATS>([]);
  const [showArchive, setShowArchive] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ chatId: number; x: number; y: number } | null>(null);
  const [recordTime, setRecordTime] = useState(0);
  const recordInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [username, setUsername] = useState("username");
  const [editingUsername, setEditingUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

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

  const archiveChat = (chatId: number) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    setArchivedChats(prev => [chat, ...prev]);
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChat === chatId) setActiveChat(null);
    setContextMenu(null);
  };

  const unarchiveChat = (chatId: number) => {
    const chat = archivedChats.find(c => c.id === chatId);
    if (!chat) return;
    setChats(prev => [chat, ...prev]);
    setArchivedChats(prev => prev.filter(c => c.id !== chatId));
  };

  const closeModal = () => {
    setModal(null);
    setNewName("");
    setNewPhone("");
    setNewChannelName("");
    setNewChannelDesc("");
    setEditingUsername("");
    setUsernameError("");
  };

  const handleSaveUsername = () => {
    const val = editingUsername.trim().replace(/^@/, "");
    if (!val) { setUsernameError("Юзернейм не может быть пустым"); return; }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(val)) {
      setUsernameError("3–20 символов: буквы, цифры, _");
      return;
    }
    setUsername(val);
    closeModal();
  };

  const handleAddContact = () => {
    if (!newName.trim()) return;
    closeModal();
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    const initials = newChannelName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    setChats((prev) => [
      {
        id: Date.now(),
        name: newChannelName.trim(),
        avatar: initials,
        color,
        lastMessage: "Канал создан",
        time: "Сейчас",
        unread: 0,
        online: false,
        isGroup: true,
        messages: [
          { id: 1, from: "them", text: `Канал «${newChannelName.trim()}» создан. ${newChannelDesc ? newChannelDesc : ""}`, time: "Сейчас", type: "text" as const },
        ],
      },
      ...prev,
    ]);
    closeModal();
  };

  const handleCreateChat = () => {
    if (!newName.trim()) return;
    const initials = newName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const newChat = {
      id: Date.now(),
      name: newName.trim(),
      avatar: initials,
      color,
      lastMessage: "",
      time: "Сейчас",
      unread: 0,
      online: false,
      messages: [] as { id: number; from: string; text: string; time: string; type: "text" | "voice" }[],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setActiveTab("chats");
    closeModal();
  };

  // Close context menu on outside click
  useEffect(() => {
    const hide = () => setContextMenu(null);
    if (contextMenu) window.addEventListener("click", hide);
    return () => window.removeEventListener("click", hide);
  }, [contextMenu]);

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

      {/* Modals */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {modal === "new-chat" && (
              <>
                <div className="modal-header">
                  <div className="modal-title">Новый чат</div>
                  <button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button>
                </div>
                <div className="modal-body">
                  <input className="modal-input" placeholder="Имя контакта" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
                  <input className="modal-input" placeholder="Номер телефона" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                  <button className="modal-btn-ok" onClick={handleCreateChat} disabled={!newName.trim()}>Создать</button>
                </div>
              </>
            )}
            {modal === "new-channel" && (
              <>
                <div className="modal-header">
                  <div className="modal-title">Новый канал</div>
                  <button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button>
                </div>
                <div className="modal-body">
                  <input className="modal-input" placeholder="Название канала" value={newChannelName} onChange={e => setNewChannelName(e.target.value)} autoFocus />
                  <textarea className="modal-input modal-textarea" placeholder="Описание (необязательно)" value={newChannelDesc} onChange={e => setNewChannelDesc(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                  <button className="modal-btn-ok" onClick={handleCreateChannel} disabled={!newChannelName.trim()}>Создать</button>
                </div>
              </>
            )}
            {modal === "new-contact" && (
              <>
                <div className="modal-header">
                  <div className="modal-title">Новый контакт</div>
                  <button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button>
                </div>
                <div className="modal-body">
                  <input className="modal-input" placeholder="Имя" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
                  <input className="modal-input" placeholder="Номер телефона" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                  <button className="modal-btn-ok" onClick={handleAddContact} disabled={!newName.trim()}>Добавить</button>
                </div>
              </>
            )}
            {modal === "edit-username" && (
              <>
                <div className="modal-header">
                  <div className="modal-title">Изменить юзернейм</div>
                  <button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button>
                </div>
                <div className="modal-body">
                  <div className="username-hint">Другие смогут найти вас по юзернейму. Только латиница, цифры и _</div>
                  <div className="username-input-wrap">
                    <span className="username-at">@</span>
                    <input
                      className="modal-input username-field"
                      placeholder="my_username"
                      value={editingUsername}
                      onChange={e => { setEditingUsername(e.target.value.replace(/^@/, "")); setUsernameError(""); }}
                      autoFocus
                      onKeyDown={e => e.key === "Enter" && handleSaveUsername()}
                    />
                  </div>
                  {usernameError && <div className="username-error">{usernameError}</div>}
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                  <button className="modal-btn-ok" onClick={handleSaveUsername} disabled={!editingUsername.trim()}>Сохранить</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          className="ctx-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <button className="ctx-item" onClick={() => archiveChat(contextMenu.chatId)}>
            <Icon name="Archive" size={15} /> В архив
          </button>
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon"><Icon name="MessageCircle" size={20} /></div>
            <span className="logo-text">Вектор</span>
          </div>
          <div className="header-actions">
            {activeTab === "chats" && (
              <>
                <button className="plus-btn" title="Новый чат" onClick={() => setModal("new-chat")}>
                  <Icon name="MessageSquarePlus" size={17} />
                </button>
                <button className="plus-btn" title="Новый канал" onClick={() => setModal("new-channel")}>
                  <Icon name="Radio" size={17} />
                </button>
              </>
            )}
            {activeTab === "contacts" && (
              <button className="plus-btn" title="Добавить контакт" onClick={() => setModal("new-contact")}>
                <Icon name="UserPlus" size={17} />
              </button>
            )}
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
          {activeTab === "chats" && (
            <>
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`chat-item ${activeChat === chat.id ? "chat-item-active" : ""}`}
                  onClick={() => { setActiveChat(chat.id); setActiveTab("chats"); }}
                  onContextMenu={e => { e.preventDefault(); setContextMenu({ chatId: chat.id, x: e.clientX, y: e.clientY }); }}
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

              {/* Archive entry */}
              {archivedChats.length > 0 && (
                <button className="archive-entry" onClick={() => setShowArchive(v => !v)}>
                  <div className="archive-icon"><Icon name="Archive" size={17} /></div>
                  <div className="chat-item-info">
                    <div className="chat-item-top">
                      <span className="chat-item-name">Архив</span>
                      <span className="chat-item-time">{archivedChats.length}</span>
                    </div>
                    <div className="chat-item-bottom">
                      <span className="chat-item-last">
                        {archivedChats[0]?.name} и другие
                      </span>
                    </div>
                  </div>
                  <Icon name={showArchive ? "ChevronUp" : "ChevronDown"} size={14} className="archive-chevron" />
                </button>
              )}

              {/* Archive list */}
              {showArchive && archivedChats.map((chat) => (
                <div key={chat.id} className="archived-chat-item">
                  <button
                    className={`chat-item ${activeChat === chat.id ? "chat-item-active" : ""} archive-sub-item`}
                    onClick={() => { setActiveChat(chat.id); }}
                  >
                    <div className="chat-item-avatar-wrap">
                      <div className={`chat-avatar bg-gradient-to-br ${chat.color}`} style={{ opacity: 0.7 }}>{chat.avatar}</div>
                    </div>
                    <div className="chat-item-info">
                      <div className="chat-item-top">
                        <span className="chat-item-name" style={{ opacity: 0.7 }}>{chat.name}</span>
                        <span className="chat-item-time">{chat.time}</span>
                      </div>
                      <div className="chat-item-bottom">
                        <span className="chat-item-last">{chat.lastMessage || "Голосовое"}</span>
                      </div>
                    </div>
                  </button>
                  <button className="unarchive-btn" title="Разархивировать" onClick={() => unarchiveChat(chat.id)}>
                    <Icon name="ArchiveRestore" size={14} />
                  </button>
                </div>
              ))}
            </>
          )}

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
              <button
                className="profile-username profile-username-btn"
                onClick={() => { setEditingUsername(username); setModal("edit-username"); }}
                title="Изменить юзернейм"
              >
                @{username}
                <Icon name="Pencil" size={11} className="profile-username-edit" />
              </button>

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
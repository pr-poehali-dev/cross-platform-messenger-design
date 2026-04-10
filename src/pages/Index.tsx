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
    id: 1, name: "Алексей Смирнов", avatar: "АС", color: "from-violet-500 to-purple-600",
    lastMessage: "Когда созвонимся?", time: "14:32", unread: 3, online: true,
    messages: [
      { id: 1, from: "them", text: "Привет! Как дела?", time: "14:10", type: "text" },
      { id: 2, from: "me", text: "Отлично, работаю над проектом 🚀", time: "14:12", type: "text" },
      { id: 3, from: "them", text: "", time: "14:20", type: "voice", duration: "0:24" },
      { id: 4, from: "me", text: "Послушал, понял. Давай обсудим детали.", time: "14:25", type: "text" },
      { id: 5, from: "them", text: "Когда созвонимся?", time: "14:32", type: "text" },
    ],
  },
  {
    id: 2, name: "Команда Проект X", avatar: "КП", color: "from-cyan-500 to-blue-600",
    lastMessage: "Мария: дизайн готов!", time: "13:15", unread: 0, online: false, isGroup: true,
    messages: [
      { id: 1, from: "Maria", fromName: "Мария", text: "Всем привет!", time: "12:00", type: "text" },
      { id: 2, from: "them", fromName: "Дмитрий", text: "Когда встреча?", time: "12:30", type: "text" },
      { id: 3, from: "me", text: "В 15:00 удобно?", time: "12:45", type: "text" },
      { id: 4, from: "Maria", fromName: "Мария", text: "дизайн готов!", time: "13:15", type: "text" },
    ],
  },
  {
    id: 3, name: "Наташа Королёва", avatar: "НК", color: "from-pink-500 to-rose-600",
    lastMessage: "", time: "11:50", unread: 1, online: true,
    messages: [{ id: 1, from: "them", text: "", time: "11:50", type: "voice", duration: "1:02" }],
  },
  {
    id: 4, name: "Иван Петров", avatar: "ИП", color: "from-emerald-500 to-teal-600",
    lastMessage: "Спасибо за помощь!", time: "Вчера", unread: 0, online: false,
    messages: [
      { id: 1, from: "me", text: "Помог с задачей?", time: "Вчера", type: "text" },
      { id: 2, from: "them", text: "Спасибо за помощь!", time: "Вчера", type: "text" },
    ],
  },
  {
    id: 5, name: "Дарья Волкова", avatar: "ДВ", color: "from-amber-500 to-orange-600",
    lastMessage: "Увидимся на конференции", time: "Пн", unread: 0, online: false,
    messages: [{ id: 1, from: "them", text: "Увидимся на конференции", time: "Пн", type: "text" }],
  },
];

const CONTACTS = [
  { id: 1, name: "Алексей Смирнов", status: "В сети", avatar: "АС", color: "from-violet-500 to-purple-600", online: true },
  { id: 2, name: "Дарья Волкова", status: "Была 2 часа назад", avatar: "ДВ", color: "from-amber-500 to-orange-600", online: false },
  { id: 3, name: "Иван Петров", status: "Был вчера", avatar: "ИП", color: "from-emerald-500 to-teal-600", online: false },
  { id: 4, name: "Мария Иванова", status: "В сети", avatar: "МИ", color: "from-pink-500 to-rose-600", online: true },
  { id: 5, name: "Наташа Королёва", status: "В сети", avatar: "НК", color: "from-pink-500 to-rose-600", online: true },
  { id: 6, name: "Олег Сидоров", status: "Был 3 дня назад", avatar: "ОС", color: "from-indigo-500 to-blue-600", online: false },
];

const NFT_ITEMS = [
  { id: 1, emoji: "🐻", name: "Медвежонок", rarity: "Обычный", price: 50, owned: false },
  { id: 2, emoji: "🐻‍❄️", name: "Полярный мишка", rarity: "Редкий", price: 150, owned: false },
  { id: 3, emoji: "❤️", name: "Сердечко", rarity: "Обычный", price: 30, owned: true },
  { id: 4, emoji: "💜", name: "Фиолетовое сердце", rarity: "Редкий", price: 100, owned: false },
  { id: 5, emoji: "💎", name: "Кристальное сердце", rarity: "Эпический", price: 300, owned: false },
  { id: 6, emoji: "📚", name: "Книга знаний", rarity: "Обычный", price: 40, owned: false },
  { id: 7, emoji: "📖", name: "Магическая книга", rarity: "Редкий", price: 120, owned: false },
  { id: 8, emoji: "🎒", name: "Рюкзак путника", rarity: "Обычный", price: 45, owned: false },
  { id: 9, emoji: "🎽", name: "Спортивный рюкзак", rarity: "Редкий", price: 130, owned: false },
  { id: 10, emoji: "🌙", name: "Лунный рюкзак", rarity: "Эпический", price: 350, owned: false },
  { id: 11, emoji: "⭐", name: "Звёздный мишка", rarity: "Легендарный", price: 500, owned: false },
  { id: 12, emoji: "🌈", name: "Радужное сердце", rarity: "Легендарный", price: 600, owned: false },
];

const MOON_PACKS = [
  { id: 1, moons: 100, price: 99, bonus: "" },
  { id: 2, moons: 300, price: 249, bonus: "+50 бонус" },
  { id: 3, moons: 700, price: 499, bonus: "+150 бонус" },
  { id: 4, moons: 1500, price: 999, bonus: "+300 бонус" },
  { id: 5, moons: 5000, price: 2999, bonus: "+1000 бонус" },
];

const AVATAR_EMOJIS = ["🐱","🦊","🐼","🐸","🦋","🌙","⚡","🔥","🌊","🎯","💫","🌸","🦁","🐯","🐺","🦝","🎭","👾","🤖","🎪"];
const AVATAR_COLORS_LIST = [
  { label: "", value: "from-violet-500 to-purple-600" },
  { label: "", value: "from-cyan-500 to-blue-600" },
  { label: "", value: "from-pink-500 to-rose-600" },
  { label: "", value: "from-emerald-500 to-teal-600" },
  { label: "", value: "from-amber-500 to-orange-600" },
  { label: "", value: "from-indigo-500 to-blue-600" },
  { label: "", value: "from-red-500 to-orange-600" },
  { label: "", value: "from-fuchsia-500 to-pink-600" },
];

type Tab = "chats" | "contacts" | "profile";
type ProfileSection = "main" | "privacy" | "shop" | "buy-moons";
type Modal = "new-chat" | "new-channel" | "new-contact" | "edit-username" | "avatar" | "buy-confirm" | "paid-msg" | null;

const RARITY_COLOR: Record<string, string> = {
  "Обычный": "#7b829a",
  "Редкий": "#3b82f6",
  "Эпический": "#a855f7",
  "Легендарный": "#f59e0b",
};

const AVATAR_BG_COLORS: Record<string, string> = {
  "from-violet-500 to-purple-600": "linear-gradient(135deg,#8b5cf6,#9333ea)",
  "from-cyan-500 to-blue-600": "linear-gradient(135deg,#06b6d4,#2563eb)",
  "from-pink-500 to-rose-600": "linear-gradient(135deg,#ec4899,#e11d48)",
  "from-emerald-500 to-teal-600": "linear-gradient(135deg,#10b981,#0d9488)",
  "from-amber-500 to-orange-600": "linear-gradient(135deg,#f59e0b,#ea580c)",
  "from-indigo-500 to-blue-600": "linear-gradient(135deg,#6366f1,#2563eb)",
  "from-red-500 to-orange-600": "linear-gradient(135deg,#ef4444,#ea580c)",
  "from-fuchsia-500 to-pink-600": "linear-gradient(135deg,#d946ef,#db2777)",
};

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
  // Profile sections
  const [profileSection, setProfileSection] = useState<ProfileSection>("main");
  // Avatar
  const [avatarEmoji, setAvatarEmoji] = useState("");
  const [avatarColor, setAvatarColor] = useState("from-violet-500 to-purple-600");
  const [tempEmoji, setTempEmoji] = useState("");
  const [tempColor, setTempColor] = useState("from-violet-500 to-purple-600");
  // Privacy
  const [paidMessages, setPaidMessages] = useState(false);
  const [paidPrice, setPaidPrice] = useState(10);
  const [whoCanMsg, setWhoCanMsg] = useState("all");
  const [showOnline, setShowOnline] = useState(true);
  // Moons & NFT
  const [moons, setMoons] = useState(175);
  const [nfts, setNfts] = useState(NFT_ITEMS);
  const [pendingNft, setPendingNft] = useState<typeof NFT_ITEMS[0] | null>(null);
  const [pendingPack, setPendingPack] = useState<typeof MOON_PACKS[0] | null>(null);
  const [buyStep, setBuyStep] = useState<"confirm" | "paying" | "done">("confirm");
  const [shopFilter, setShopFilter] = useState("Все");

  const currentChat = chats.find((c) => c.id === activeChat) ?? archivedChats.find((c) => c.id === activeChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, currentChat?.messages.length]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;
    setChats((prev) => prev.map((c) =>
      c.id === activeChat ? { ...c, lastMessage: message, time: "Сейчас", messages: [...c.messages, { id: Date.now(), from: "me", text: message, time: "Сейчас", type: "text" as const }] } : c
    ));
    setMessage("");
  };

  const startRecording = () => { setIsRecording(true); setRecordTime(0); recordInterval.current = setInterval(() => setRecordTime(t => t + 1), 1000); };
  const stopRecording = () => {
    setIsRecording(false);
    if (recordInterval.current) clearInterval(recordInterval.current);
    if (!activeChat) return;
    const dur = `0:${recordTime.toString().padStart(2, "0")}`;
    setChats(prev => prev.map(c => c.id === activeChat ? { ...c, lastMessage: "🎤 Голосовое", time: "Сейчас", messages: [...c.messages, { id: Date.now(), from: "me", text: "", time: "Сейчас", type: "voice" as const, duration: dur }] } : c));
    setRecordTime(0);
  };

  const filteredContacts = CONTACTS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
    setModal(null); setNewName(""); setNewPhone(""); setNewChannelName(""); setNewChannelDesc("");
    setEditingUsername(""); setUsernameError(""); setPendingNft(null); setPendingPack(null); setBuyStep("confirm");
  };

  const handleSaveUsername = () => {
    const val = editingUsername.trim().replace(/^@/, "");
    if (!val) { setUsernameError("Юзернейм не может быть пустым"); return; }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(val)) { setUsernameError("3–20 символов: буквы, цифры, _"); return; }
    setUsername(val); closeModal();
  };
  const handleAddContact = () => { if (!newName.trim()) return; closeModal(); };
  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    const initials = newChannelName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const color = AVATAR_COLORS_LIST[Math.floor(Math.random() * AVATAR_COLORS_LIST.length)].value;
    setChats(prev => [{ id: Date.now(), name: newChannelName.trim(), avatar: initials, color, lastMessage: "Канал создан", time: "Сейчас", unread: 0, online: false, isGroup: true, messages: [{ id: 1, from: "them", text: `Канал «${newChannelName.trim()}» создан.`, time: "Сейчас", type: "text" as const }] }, ...prev]);
    closeModal();
  };
  const handleCreateChat = () => {
    if (!newName.trim()) return;
    const initials = newName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const color = AVATAR_COLORS_LIST[Math.floor(Math.random() * AVATAR_COLORS_LIST.length)].value;
    const newChat = { id: Date.now(), name: newName.trim(), avatar: initials, color, lastMessage: "", time: "Сейчас", unread: 0, online: false, messages: [] as { id: number; from: string; text: string; time: string; type: "text" | "voice" }[] };
    setChats(prev => [newChat, ...prev]); setActiveChat(newChat.id); setActiveTab("chats"); closeModal();
  };

  const handleSaveAvatar = () => { setAvatarEmoji(tempEmoji); setAvatarColor(tempColor); closeModal(); };
  const openAvatarModal = () => { setTempEmoji(avatarEmoji); setTempColor(avatarColor); setModal("avatar"); };

  const handleBuyNft = (item: typeof NFT_ITEMS[0]) => { setPendingNft(item); setPendingPack(null); setBuyStep("confirm"); setModal("buy-confirm"); };
  const handleBuyPack = (pack: typeof MOON_PACKS[0]) => { setPendingPack(pack); setPendingNft(null); setBuyStep("confirm"); setModal("buy-confirm"); };

  const handleConfirmBuy = () => {
    if (pendingNft) {
      if (moons < pendingNft.price) return;
      setMoons(m => m - pendingNft.price);
      setNfts(prev => prev.map(n => n.id === pendingNft.id ? { ...n, owned: true } : n));
      closeModal();
    } else if (pendingPack) {
      setBuyStep("paying");
    }
  };

  const handlePaymentDone = () => { if (pendingPack) { setMoons(m => m + pendingPack.moons + parseInt(pendingPack.bonus) || m + pendingPack.moons); setBuyStep("done"); } };

  useEffect(() => {
    const hide = () => setContextMenu(null);
    if (contextMenu) window.addEventListener("click", hide);
    return () => window.removeEventListener("click", hide);
  }, [contextMenu]);

  const shopCategories = ["Все", "Мишки", "Сердечки", "Книги", "Рюкзаки"];
  const filteredNfts = nfts.filter(n => {
    if (shopFilter === "Все") return true;
    if (shopFilter === "Мишки") return n.emoji.includes("🐻") || n.emoji.includes("⭐");
    if (shopFilter === "Сердечки") return ["❤️","💜","💎","🌈"].includes(n.emoji);
    if (shopFilter === "Книги") return ["📚","📖"].includes(n.emoji);
    if (shopFilter === "Рюкзаки") return ["🎒","🎽","🌙"].includes(n.emoji);
    return true;
  });

  const avatarDisplay = avatarEmoji || "ВМ";

  return (
    <div className="messenger-root">
      {/* Video call */}
      {showVideoCall && (
        <div className="video-call-overlay" onClick={() => setShowVideoCall(false)}>
          <div className="video-call-modal" onClick={e => e.stopPropagation()}>
            <div className="video-call-bg">
              <div className="video-call-noise" />
              <div className="video-call-avatar-ring">
                <div className={`video-call-avatar bg-gradient-to-br ${currentChat?.color || "from-violet-500 to-purple-600"}`}>{currentChat?.avatar}</div>
              </div>
              <div className="video-call-name">{currentChat?.name}</div>
              <div className="video-call-status"><span className="video-call-dot" />Зашифрованный звонок...</div>
              <div className="video-call-enc"><Icon name="Shield" size={14} /> end-to-end шифрование</div>
            </div>
            <div className="video-call-controls">
              <button className="vc-btn vc-mic"><Icon name="Mic" size={20} /></button>
              <button className="vc-btn vc-end" onClick={() => setShowVideoCall(false)}><Icon name="PhoneOff" size={22} /></button>
              <button className="vc-btn vc-cam"><Icon name="Video" size={20} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>

            {/* New chat */}
            {modal === "new-chat" && (<>
              <div className="modal-header"><div className="modal-title">Новый чат</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body">
                <input className="modal-input" placeholder="Имя контакта" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
                <input className="modal-input" placeholder="Номер телефона" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                <button className="modal-btn-ok" onClick={handleCreateChat} disabled={!newName.trim()}>Создать</button>
              </div>
            </>)}

            {/* New channel */}
            {modal === "new-channel" && (<>
              <div className="modal-header"><div className="modal-title">Новый канал</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body">
                <input className="modal-input" placeholder="Название канала" value={newChannelName} onChange={e => setNewChannelName(e.target.value)} autoFocus />
                <textarea className="modal-input modal-textarea" placeholder="Описание (необязательно)" value={newChannelDesc} onChange={e => setNewChannelDesc(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                <button className="modal-btn-ok" onClick={handleCreateChannel} disabled={!newChannelName.trim()}>Создать</button>
              </div>
            </>)}

            {/* New contact */}
            {modal === "new-contact" && (<>
              <div className="modal-header"><div className="modal-title">Новый контакт</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body">
                <input className="modal-input" placeholder="Имя" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
                <input className="modal-input" placeholder="Номер телефона" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                <button className="modal-btn-ok" onClick={handleAddContact} disabled={!newName.trim()}>Добавить</button>
              </div>
            </>)}

            {/* Edit username */}
            {modal === "edit-username" && (<>
              <div className="modal-header"><div className="modal-title">Изменить юзернейм</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body">
                <div className="username-hint">Другие смогут найти вас по юзернейму. Только латиница, цифры и _</div>
                <div className="username-input-wrap">
                  <span className="username-at">@</span>
                  <input className="modal-input username-field" placeholder="my_username" value={editingUsername} onChange={e => { setEditingUsername(e.target.value.replace(/^@/, "")); setUsernameError(""); }} autoFocus onKeyDown={e => e.key === "Enter" && handleSaveUsername()} />
                </div>
                {usernameError && <div className="username-error">{usernameError}</div>}
              </div>
              <div className="modal-footer">
                <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                <button className="modal-btn-ok" onClick={handleSaveUsername} disabled={!editingUsername.trim()}>Сохранить</button>
              </div>
            </>)}

            {/* Avatar editor */}
            {modal === "avatar" && (<>
              <div className="modal-header"><div className="modal-title">Изменить аватар</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body">
                <div className="avatar-preview-wrap">
                  <div className={`avatar-preview bg-gradient-to-br ${tempColor}`}>{tempEmoji || "ВМ"}</div>
                </div>
                <div className="avatar-section-label">Эмодзи</div>
                <div className="avatar-emoji-grid">
                  <button className={`avatar-emoji-btn ${tempEmoji === "" ? "selected" : ""}`} onClick={() => setTempEmoji("")}>АА</button>
                  {AVATAR_EMOJIS.map(e => (
                    <button key={e} className={`avatar-emoji-btn ${tempEmoji === e ? "selected" : ""}`} onClick={() => setTempEmoji(e)}>{e}</button>
                  ))}
                </div>
                <div className="avatar-section-label">Цвет фона</div>
                <div className="avatar-color-grid">
                  {AVATAR_COLORS_LIST.map(c => (
                    <button key={c.value} className={`avatar-color-btn ${tempColor === c.value ? "selected" : ""}`} style={{ background: AVATAR_BG_COLORS[c.value] }} onClick={() => setTempColor(c.value)} />
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                <button className="modal-btn-ok" onClick={handleSaveAvatar}>Сохранить</button>
              </div>
            </>)}

            {/* Buy confirm / paying / done */}
            {modal === "buy-confirm" && (<>
              {buyStep === "confirm" && (<>
                <div className="modal-header">
                  <div className="modal-title">{pendingNft ? "Купить NFT" : "Купить луны"}</div>
                  <button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button>
                </div>
                <div className="modal-body" style={{ alignItems: "center", gap: 14 }}>
                  {pendingNft && <>
                    <div className="buy-confirm-emoji">{pendingNft.emoji}</div>
                    <div className="buy-confirm-name">{pendingNft.name}</div>
                    <div className="buy-confirm-rarity" style={{ color: RARITY_COLOR[pendingNft.rarity] }}>{pendingNft.rarity}</div>
                    <div className="buy-confirm-price"><span className="moon-icon">🌙</span> {pendingNft.price} лун</div>
                    {moons < pendingNft.price && <div className="buy-not-enough">Недостаточно лун. Пополните баланс.</div>}
                  </>}
                  {pendingPack && <>
                    <div className="buy-confirm-emoji">🌙</div>
                    <div className="buy-confirm-name">{pendingPack.moons} лун {pendingPack.bonus && <span className="pack-bonus">{pendingPack.bonus}</span>}</div>
                    <div className="buy-confirm-price">{pendingPack.price} ₽</div>
                    <div className="buy-card-info">Оплата переводом на карту</div>
                  </>}
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                  <button className="modal-btn-ok" onClick={handleConfirmBuy} disabled={!!pendingNft && moons < pendingNft.price}>
                    {pendingNft ? "Купить" : "Перейти к оплате"}
                  </button>
                </div>
              </>)}

              {buyStep === "paying" && pendingPack && (<>
                <div className="modal-header"><div className="modal-title">Оплата</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
                <div className="modal-body" style={{ gap: 12 }}>
                  <div className="pay-instruction">Переведите <strong>{pendingPack.price} ₽</strong> на карту:</div>
                  <div className="pay-card-number">2200 7012 3846 7770</div>
                  <div className="pay-bank">Сбербанк / любой банк</div>
                  <div className="pay-comment">В комментарии укажите ваш юзернейм: <strong>@{username}</strong></div>
                  <div className="pay-note">После перевода нажмите «Я оплатил» — луны зачислятся автоматически в тестовом режиме.</div>
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                  <button className="modal-btn-ok" onClick={handlePaymentDone}>Я оплатил</button>
                </div>
              </>)}

              {buyStep === "done" && (<>
                <div className="modal-header"><div className="modal-title">Готово!</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
                <div className="modal-body" style={{ alignItems: "center", gap: 10 }}>
                  <div className="buy-confirm-emoji">✅</div>
                  <div className="buy-confirm-name">Луны зачислены!</div>
                  <div className="buy-confirm-price"><span className="moon-icon">🌙</span> Баланс: {moons} лун</div>
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-ok" onClick={closeModal}>Закрыть</button>
                </div>
              </>)}
            </>)}

          </div>
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div className="ctx-menu" style={{ top: contextMenu.y, left: contextMenu.x }} onClick={e => e.stopPropagation()}>
          <button className="ctx-item" onClick={() => archiveChat(contextMenu.chatId)}>
            <Icon name="Archive" size={15} /> В архив
          </button>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon"><Icon name="MessageCircle" size={20} /></div>
            <span className="logo-text">Вектор</span>
          </div>
          <div className="header-actions">
            {activeTab === "chats" && (<>
              <button className="plus-btn" title="Новый чат" onClick={() => setModal("new-chat")}><Icon name="MessageSquarePlus" size={17} /></button>
              <button className="plus-btn" title="Новый канал" onClick={() => setModal("new-channel")}><Icon name="Radio" size={17} /></button>
            </>)}
            {activeTab === "contacts" && (
              <button className="plus-btn" title="Добавить контакт" onClick={() => setModal("new-contact")}><Icon name="UserPlus" size={17} /></button>
            )}
            {activeTab === "profile" && (
              <div className="moon-balance"><span className="moon-icon">🌙</span>{moons}</div>
            )}
          </div>
        </div>

        <div className="search-wrap">
          <Icon name="Search" size={15} className="search-icon-inner" />
          <input className="search-input" placeholder="Поиск..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        <nav className="sidebar-nav">
          {(["chats", "contacts", "profile"] as Tab[]).map(tab => (
            <button key={tab} className={`nav-btn ${activeTab === tab ? "nav-btn-active" : ""}`}
              onClick={() => { setActiveTab(tab); if (tab !== "chats") setActiveChat(null); if (tab === "profile") setProfileSection("main"); }}>
              <Icon name={tab === "chats" ? "MessageSquare" : tab === "contacts" ? "Users" : "User"} size={17} />
              <span>{tab === "chats" ? "Чаты" : tab === "contacts" ? "Контакты" : "Профиль"}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-list">
          {/* CHATS */}
          {activeTab === "chats" && (<>
            {filteredChats.map(chat => (
              <button key={chat.id}
                className={`chat-item ${activeChat === chat.id ? "chat-item-active" : ""}`}
                onClick={() => { setActiveChat(chat.id); setActiveTab("chats"); }}
                onContextMenu={e => { e.preventDefault(); setContextMenu({ chatId: chat.id, x: e.clientX, y: e.clientY }); }}>
                <div className="chat-item-avatar-wrap">
                  <div className={`chat-avatar bg-gradient-to-br ${chat.color}`}>{chat.avatar}</div>
                  {chat.online && <span className="online-dot" />}
                </div>
                <div className="chat-item-info">
                  <div className="chat-item-top"><span className="chat-item-name">{chat.name}</span><span className="chat-item-time">{chat.time}</span></div>
                  <div className="chat-item-bottom">
                    <span className="chat-item-last">{chat.lastMessage ? chat.lastMessage : <span className="voice-preview flex items-center gap-1"><Icon name="Mic" size={11} /> Голосовое</span>}</span>
                    {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
            {archivedChats.length > 0 && (
              <button className="archive-entry" onClick={() => setShowArchive(v => !v)}>
                <div className="archive-icon"><Icon name="Archive" size={17} /></div>
                <div className="chat-item-info">
                  <div className="chat-item-top"><span className="chat-item-name">Архив</span><span className="chat-item-time">{archivedChats.length}</span></div>
                  <div className="chat-item-bottom"><span className="chat-item-last">{archivedChats[0]?.name} и другие</span></div>
                </div>
                <Icon name={showArchive ? "ChevronUp" : "ChevronDown"} size={14} className="archive-chevron" />
              </button>
            )}
            {showArchive && archivedChats.map(chat => (
              <div key={chat.id} className="archived-chat-item">
                <button className={`chat-item ${activeChat === chat.id ? "chat-item-active" : ""} archive-sub-item`} onClick={() => setActiveChat(chat.id)}>
                  <div className="chat-item-avatar-wrap"><div className={`chat-avatar bg-gradient-to-br ${chat.color}`} style={{ opacity: 0.7 }}>{chat.avatar}</div></div>
                  <div className="chat-item-info">
                    <div className="chat-item-top"><span className="chat-item-name" style={{ opacity: 0.7 }}>{chat.name}</span><span className="chat-item-time">{chat.time}</span></div>
                    <div className="chat-item-bottom"><span className="chat-item-last">{chat.lastMessage || "Голосовое"}</span></div>
                  </div>
                </button>
                <button className="unarchive-btn" title="Разархивировать" onClick={() => unarchiveChat(chat.id)}><Icon name="ArchiveRestore" size={14} /></button>
              </div>
            ))}
          </>)}

          {/* CONTACTS */}
          {activeTab === "contacts" && filteredContacts.map(contact => (
            <button key={contact.id} className="chat-item" onClick={() => { const ex = chats.find(c => c.name === contact.name); if (ex) { setActiveChat(ex.id); setActiveTab("chats"); } }}>
              <div className="chat-item-avatar-wrap">
                <div className={`chat-avatar bg-gradient-to-br ${contact.color}`}>{contact.avatar}</div>
                {contact.online && <span className="online-dot" />}
              </div>
              <div className="chat-item-info">
                <div className="chat-item-top"><span className="chat-item-name">{contact.name}</span></div>
                <div className="chat-item-bottom"><span className="chat-item-last">{contact.status}</span></div>
              </div>
            </button>
          ))}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="profile-panel">
              {/* Avatar */}
              <div className="profile-avatar-wrap">
                <div className={`profile-avatar bg-gradient-to-br ${avatarColor}`} style={{ fontSize: avatarEmoji ? 32 : undefined }}>{avatarDisplay}</div>
                <button className="avatar-edit-btn" onClick={openAvatarModal} title="Изменить аватар">
                  <Icon name="Camera" size={13} />
                </button>
              </div>
              <div className="profile-name">Виктор Морозов</div>
              <button className="profile-username profile-username-btn" onClick={() => { setEditingUsername(username); setModal("edit-username"); }} title="Изменить юзернейм">
                @{username}<Icon name="Pencil" size={11} className="profile-username-edit" />
              </button>

              {/* Profile nav */}
              <div className="profile-nav">
                {([["main","Профиль","User"],["privacy","Приватность","Lock"],["shop","Магазин","ShoppingBag"],["buy-moons","Луны","Sparkles"]] as [ProfileSection, string, string][]).map(([sec, label, icon]) => (
                  <button key={sec} className={`profile-nav-btn ${profileSection === sec ? "profile-nav-active" : ""}`} onClick={() => setProfileSection(sec)}>
                    <Icon name={icon} size={14} />{label}
                  </button>
                ))}
              </div>

              {/* MAIN section */}
              {profileSection === "main" && (<>
                <div className="profile-fields">
                  {([{ label: "Телефон", value: "+7 900 000-00-00", icon: "Phone" }, { label: "Статус", value: "На связи 🚀", icon: "Smile" }] as { label: string; value: string; icon: string }[]).map(f => (
                    <div key={f.label} className="profile-field">
                      <Icon name={f.icon} size={15} className="profile-field-icon" />
                      <div><div className="profile-field-label">{f.label}</div><div className="profile-field-value">{f.value}</div></div>
                    </div>
                  ))}
                </div>
                <div className="profile-settings">
                  {([{ icon: "Bell", label: "Уведомления" }, { icon: "Palette", label: "Оформление" }, { icon: "HelpCircle", label: "Помощь" }] as { icon: string; label: string }[]).map(item => (
                    <button key={item.label} className="profile-setting-btn">
                      <Icon name={item.icon} size={15} /><span>{item.label}</span><Icon name="ChevronRight" size={13} className="ml-auto opacity-40" />
                    </button>
                  ))}
                </div>
              </>)}

              {/* PRIVACY section */}
              {profileSection === "privacy" && (
                <div className="privacy-panel">
                  <div className="privacy-title">Конфиденциальность</div>

                  <div className="privacy-block">
                    <div className="privacy-row">
                      <div>
                        <div className="privacy-label">Показывать статус «В сети»</div>
                        <div className="privacy-sub">Другие видят, когда вы активны</div>
                      </div>
                      <button className={`toggle-btn ${showOnline ? "toggle-on" : ""}`} onClick={() => setShowOnline(v => !v)}>
                        <span className="toggle-thumb" />
                      </button>
                    </div>
                    <div className="privacy-row">
                      <div>
                        <div className="privacy-label">Кто может писать мне</div>
                      </div>
                      <select className="privacy-select" value={whoCanMsg} onChange={e => setWhoCanMsg(e.target.value)}>
                        <option value="all">Все</option>
                        <option value="contacts">Контакты</option>
                        <option value="nobody">Никто</option>
                      </select>
                    </div>
                  </div>

                  <div className="privacy-divider" />

                  <div className="privacy-block">
                    <div className="privacy-block-title"><span className="moon-icon">🌙</span> Платные сообщения</div>
                    <div className="privacy-sub" style={{ marginBottom: 10 }}>Незнакомцы должны заплатить лунами, чтобы написать вам</div>
                    <div className="privacy-row">
                      <div><div className="privacy-label">Включить платные сообщения</div></div>
                      <button className={`toggle-btn ${paidMessages ? "toggle-on" : ""}`} onClick={() => setPaidMessages(v => !v)}>
                        <span className="toggle-thumb" />
                      </button>
                    </div>
                    {paidMessages && (
                      <div className="privacy-row" style={{ marginTop: 10 }}>
                        <div><div className="privacy-label">Цена за сообщение</div></div>
                        <div className="paid-price-wrap">
                          <button className="paid-price-btn" onClick={() => setPaidPrice(p => Math.max(1, p - 5))}>−</button>
                          <span className="paid-price-val"><span className="moon-icon">🌙</span>{paidPrice}</span>
                          <button className="paid-price-btn" onClick={() => setPaidPrice(p => p + 5)}>+</button>
                        </div>
                      </div>
                    )}
                    {paidMessages && (
                      <div className="paid-msg-info">Вы будете получать {paidPrice} лун за каждое сообщение от незнакомцев</div>
                    )}
                  </div>
                </div>
              )}

              {/* SHOP section */}
              {profileSection === "shop" && (
                <div className="shop-panel">
                  <div className="shop-header-row">
                    <div className="shop-title">NFT-коллекции</div>
                    <div className="moon-balance-lg"><span className="moon-icon">🌙</span>{moons} лун</div>
                  </div>
                  <div className="shop-cats">
                    {shopCategories.map(cat => (
                      <button key={cat} className={`shop-cat-btn ${shopFilter === cat ? "shop-cat-active" : ""}`} onClick={() => setShopFilter(cat)}>{cat}</button>
                    ))}
                  </div>
                  <div className="nft-grid">
                    {filteredNfts.map(item => (
                      <div key={item.id} className={`nft-card ${item.owned ? "nft-owned" : ""}`}>
                        <div className="nft-emoji">{item.emoji}</div>
                        <div className="nft-name">{item.name}</div>
                        <div className="nft-rarity" style={{ color: RARITY_COLOR[item.rarity] }}>{item.rarity}</div>
                        {item.owned
                          ? <div className="nft-owned-badge">Куплено ✓</div>
                          : <button className="nft-buy-btn" onClick={() => handleBuyNft(item)}><span className="moon-icon">🌙</span>{item.price}</button>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BUY MOONS section */}
              {profileSection === "buy-moons" && (
                <div className="buy-moons-panel">
                  <div className="buy-moons-title">Купить луны</div>
                  <div className="buy-moons-sub">Луны — внутренняя валюта для NFT и платных сообщений</div>
                  <div className="moon-balance-hero"><span style={{ fontSize: 36 }}>🌙</span><span className="moon-hero-num">{moons}</span><span className="moon-hero-label">ваш баланс</span></div>
                  <div className="packs-list">
                    {MOON_PACKS.map(pack => (
                      <button key={pack.id} className="pack-card" onClick={() => handleBuyPack(pack)}>
                        <div className="pack-left">
                          <span className="pack-moon-icon">🌙</span>
                          <div>
                            <div className="pack-moons">{pack.moons} лун {pack.bonus && <span className="pack-bonus">{pack.bonus}</span>}</div>
                          </div>
                        </div>
                        <div className="pack-price">{pack.price} ₽</div>
                      </button>
                    ))}
                  </div>
                  <div className="buy-moons-note">Оплата переводом на карту СБП. После оплаты луны зачисляются вручную в течение нескольких минут.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="chat-area">
        {activeChat && currentChat ? (<>
          <div className="chat-header">
            <button className="back-btn" onClick={() => setActiveChat(null)}><Icon name="ChevronLeft" size={20} /></button>
            <div className={`chat-avatar-sm bg-gradient-to-br ${currentChat.color}`}>{currentChat.avatar}</div>
            <div className="chat-header-info">
              <div className="chat-header-name">{currentChat.name}</div>
              <div className="chat-header-status">{currentChat.online ? <><span className="online-dot-sm" />В сети</> : "Был недавно"}</div>
            </div>
            <div className="chat-header-actions">
              <button className="action-btn" onClick={() => setShowVideoCall(true)}><Icon name="Video" size={19} /></button>
              <button className="action-btn" onClick={() => setShowVideoCall(true)}><Icon name="Phone" size={19} /></button>
              <button className="action-btn"><Icon name="MoreVertical" size={19} /></button>
            </div>
          </div>

          <div className="messages-area">
            <div className="messages-wrap">
              {currentChat.messages.map(msg => (
                <div key={msg.id} className={`msg-row ${msg.from === "me" ? "msg-row-me" : ""}`}>
                  {msg.from !== "me" && <div className={`msg-avatar-sm bg-gradient-to-br ${currentChat.color}`}>{currentChat.avatar[0]}</div>}
                  <div className={`msg-bubble ${msg.from === "me" ? "msg-bubble-me" : "msg-bubble-them"}`}>
                    {(msg as Message).fromName && <div className="msg-sender">{(msg as Message).fromName}</div>}
                    {msg.type === "voice" ? (
                      <div className="voice-msg" onClick={() => setPlayingVoice(playingVoice === msg.id ? null : msg.id)}>
                        <button className="voice-play-btn"><Icon name={playingVoice === msg.id ? "Pause" : "Play"} size={13} /></button>
                        <div className="voice-waveform">{Array.from({ length: 24 }).map((_, i) => <div key={i} className={`voice-bar ${playingVoice === msg.id ? "voice-bar-active" : ""}`} style={{ height: `${6 + Math.sin(i * 0.8) * 7 + (i % 3) * 2}px` }} />)}</div>
                        <span className="voice-dur">{(msg as Message).duration}</span>
                      </div>
                    ) : <span>{msg.text}</span>}
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
                <div className="rec-dot" /><span className="rec-label">Запись</span>
                <span className="rec-time">0:{recordTime.toString().padStart(2, "0")}</span>
                <div className="rec-waves">{[0,1,2,3,4].map(i => <div key={i} className="rec-wave" style={{ animationDelay: `${i * 0.12}s` }} />)}</div>
                <button className="rec-stop" onClick={stopRecording}><Icon name="Square" size={15} /></button>
              </div>
            ) : (<>
              <button className="input-icon-btn"><Icon name="Paperclip" size={17} /></button>
              <input className="msg-input" placeholder="Сообщение..." value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
              <button className="input-icon-btn" onClick={startRecording}><Icon name="Mic" size={17} /></button>
              <button className={`send-btn ${message.trim() ? "send-btn-active" : ""}`} onClick={sendMessage} disabled={!message.trim()}><Icon name="Send" size={17} /></button>
            </>)}
          </div>
        </>) : (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="MessageCircle" size={44} /></div>
            <div className="empty-title">Вектор</div>
            <div className="empty-sub">Выберите чат или начните новый разговор</div>
            <div className="empty-enc"><Icon name="Shield" size={13} /> Все сообщения защищены end-to-end шифрованием</div>
          </div>
        )}
      </main>
    </div>
  );
}

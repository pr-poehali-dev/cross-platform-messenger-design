import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API = {
  buyMoons: "https://functions.poehali.dev/d074885a-036d-4da5-90d8-3cd124596b6e",
  getMoons: "https://functions.poehali.dev/2827c692-71a8-47f5-b397-4e0e800e65ec",
  spendMoons: "https://functions.poehali.dev/c5ca2a17-b013-47b5-96fa-e2f6a5dd6d7b",
};

type Message = { id: number; from: string; text: string; time: string; type: "text" | "voice"; duration?: string; fromName?: string; reaction?: string; };
type Tab = "chats" | "contacts" | "profile";
type ProfileSection = "main" | "privacy" | "shop" | "buy-moons" | "gifts";
type Modal = "new-chat" | "new-channel" | "new-contact" | "edit-username" | "avatar" | "buy-confirm" | "story-view" | "secret-info" | null;

const CHATS = [
  { id: 1, name: "Алексей Смирнов", avatar: "АС", color: "from-violet-500 to-purple-600", lastMessage: "Когда созвонимся?", time: "14:32", unread: 3, online: true, secret: false,
    messages: [
      { id: 1, from: "them", text: "Привет! Как дела?", time: "14:10", type: "text" },
      { id: 2, from: "me", text: "Отлично, работаю над проектом 🚀", time: "14:12", type: "text" },
      { id: 3, from: "them", text: "", time: "14:20", type: "voice", duration: "0:24" },
      { id: 4, from: "me", text: "Послушал, понял. Давай обсудим детали.", time: "14:25", type: "text" },
      { id: 5, from: "them", text: "Когда созвонимся?", time: "14:32", type: "text" },
    ] },
  { id: 2, name: "Команда Проект X", avatar: "КП", color: "from-cyan-500 to-blue-600", lastMessage: "Мария: дизайн готов!", time: "13:15", unread: 0, online: false, secret: false, isGroup: true,
    messages: [
      { id: 1, from: "Maria", fromName: "Мария", text: "Всем привет!", time: "12:00", type: "text" },
      { id: 2, from: "them", fromName: "Дмитрий", text: "Когда встреча?", time: "12:30", type: "text" },
      { id: 3, from: "me", text: "В 15:00 удобно?", time: "12:45", type: "text" },
      { id: 4, from: "Maria", fromName: "Мария", text: "дизайн готов!", time: "13:15", type: "text" },
    ] },
  { id: 3, name: "Наташа Королёва", avatar: "НК", color: "from-pink-500 to-rose-600", lastMessage: "", time: "11:50", unread: 1, online: true, secret: false,
    messages: [{ id: 1, from: "them", text: "", time: "11:50", type: "voice", duration: "1:02" }] },
  { id: 4, name: "Иван Петров", avatar: "ИП", color: "from-emerald-500 to-teal-600", lastMessage: "Спасибо за помощь!", time: "Вчера", unread: 0, online: false, secret: false,
    messages: [{ id: 1, from: "me", text: "Помог с задачей?", time: "Вчера", type: "text" }, { id: 2, from: "them", text: "Спасибо за помощь!", time: "Вчера", type: "text" }] },
];

const CONTACTS = [
  { id: 1, name: "Алексей Смирнов", status: "В сети", avatar: "АС", color: "from-violet-500 to-purple-600", online: true },
  { id: 2, name: "Дарья Волкова", status: "Была 2 часа назад", avatar: "ДВ", color: "from-amber-500 to-orange-600", online: false },
  { id: 3, name: "Иван Петров", status: "Был вчера", avatar: "ИП", color: "from-emerald-500 to-teal-600", online: false },
  { id: 4, name: "Мария Иванова", status: "В сети", avatar: "МИ", color: "from-pink-500 to-rose-600", online: true },
  { id: 5, name: "Наташа Королёва", status: "В сети", avatar: "НК", color: "from-pink-500 to-rose-600", online: true },
];

const STORIES = [
  { id: 1, name: "Алексей", avatar: "АС", color: "from-violet-500 to-purple-600", emoji: "🌅", text: "Отличный день!", seen: false },
  { id: 2, name: "Мария", avatar: "МИ", color: "from-pink-500 to-rose-600", emoji: "🎉", text: "День рождения!", seen: false },
  { id: 3, name: "Наташа", avatar: "НК", color: "from-rose-500 to-pink-600", emoji: "🌙", text: "Ночной город", seen: true },
  { id: 4, name: "Иван", avatar: "ИП", color: "from-emerald-500 to-teal-600", emoji: "🏔️", text: "В горах", seen: true },
  { id: 5, name: "Вы", avatar: "ВМ", color: "from-violet-500 to-indigo-600", emoji: "➕", text: "", isMe: true },
];

const NFT_ITEMS = [
  { id: 1, emoji: "🐻", name: "Медвежонок", rarity: "Обычный", price: 50 },
  { id: 2, emoji: "🐻‍❄️", name: "Полярный мишка", rarity: "Редкий", price: 150 },
  { id: 3, emoji: "❤️", name: "Сердечко", rarity: "Обычный", price: 30 },
  { id: 4, emoji: "💜", name: "Фиолетовое сердце", rarity: "Редкий", price: 100 },
  { id: 5, emoji: "💎", name: "Кристальное сердце", rarity: "Эпический", price: 300 },
  { id: 6, emoji: "📚", name: "Книга знаний", rarity: "Обычный", price: 40 },
  { id: 7, emoji: "📖", name: "Магическая книга", rarity: "Редкий", price: 120 },
  { id: 8, emoji: "🎒", name: "Рюкзак путника", rarity: "Обычный", price: 45 },
  { id: 9, emoji: "🎽", name: "Спортивный рюкзак", rarity: "Редкий", price: 130 },
  { id: 10, emoji: "🌙", name: "Лунный рюкзак", rarity: "Эпический", price: 350 },
  { id: 11, emoji: "⭐", name: "Звёздный мишка", rarity: "Легендарный", price: 500 },
  { id: 12, emoji: "🌈", name: "Радужное сердце", rarity: "Легендарный", price: 600 },
];

const MOON_PACKS = [
  { id: 1, moons: 100, bonus: 0, price: 99 },
  { id: 2, moons: 300, bonus: 50, price: 249 },
  { id: 3, moons: 700, bonus: 150, price: 499 },
  { id: 4, moons: 1500, bonus: 300, price: 999 },
  { id: 5, moons: 5000, bonus: 1000, price: 2999 },
];

const REACTIONS = ["❤️","🔥","😂","👍","😮","🎉","💜","🌙"];
const RARITY_COLOR: Record<string, string> = { "Обычный": "#7b829a", "Редкий": "#3b82f6", "Эпический": "#a855f7", "Легендарный": "#f59e0b" };
const AVATAR_EMOJIS = ["🐱","🦊","🐼","🐸","🦋","🌙","⚡","🔥","🌊","🎯","💫","🌸","🦁","🐯","🐺","🦝","🎭","👾","🤖","🎪"];
const AVATAR_COLORS_LIST = [
  "from-violet-500 to-purple-600","from-cyan-500 to-blue-600","from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600","from-amber-500 to-orange-600","from-indigo-500 to-blue-600",
  "from-red-500 to-orange-600","from-fuchsia-500 to-pink-600",
];
const AVATAR_BG: Record<string, string> = {
  "from-violet-500 to-purple-600": "linear-gradient(135deg,#8b5cf6,#9333ea)",
  "from-cyan-500 to-blue-600": "linear-gradient(135deg,#06b6d4,#2563eb)",
  "from-pink-500 to-rose-600": "linear-gradient(135deg,#ec4899,#e11d48)",
  "from-emerald-500 to-teal-600": "linear-gradient(135deg,#10b981,#0d9488)",
  "from-amber-500 to-orange-600": "linear-gradient(135deg,#f59e0b,#ea580c)",
  "from-indigo-500 to-blue-600": "linear-gradient(135deg,#6366f1,#2563eb)",
  "from-red-500 to-orange-600": "linear-gradient(135deg,#ef4444,#ea580c)",
  "from-fuchsia-500 to-pink-600": "linear-gradient(135deg,#d946ef,#db2777)",
};
const SHOP_CATS = ["Все","Мишки","Сердечки","Книги","Рюкзаки"];

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
  const [profileSection, setProfileSection] = useState<ProfileSection>("main");
  const [avatarEmoji, setAvatarEmoji] = useState("");
  const [avatarColor, setAvatarColor] = useState("from-violet-500 to-purple-600");
  const [tempEmoji, setTempEmoji] = useState("");
  const [tempColor, setTempColor] = useState("from-violet-500 to-purple-600");
  const [paidMessages, setPaidMessages] = useState(false);
  const [paidPrice, setPaidPrice] = useState(10);
  const [whoCanMsg, setWhoCanMsg] = useState("all");
  const [showOnline, setShowOnline] = useState(true);
  // Moons — with backend
  const [moons, setMoons] = useState(0);
  const [gifts, setGifts] = useState<{ nft_id: number; emoji: string; name: string; purchased_at: string }[]>([]);
  const [loadingMoons, setLoadingMoons] = useState(false);
  const [pendingNft, setPendingNft] = useState<typeof NFT_ITEMS[0] | null>(null);
  const [pendingPack, setPendingPack] = useState<typeof MOON_PACKS[0] | null>(null);
  const [buyStep, setBuyStep] = useState<"confirm" | "paying" | "pending" | "done" | "error">("confirm");
  const [buyError, setBuyError] = useState("");
  const [shopFilter, setShopFilter] = useState("Все");
  // Stories
  const [stories, setStories] = useState(STORIES);
  const [viewingStory, setViewingStory] = useState<typeof STORIES[0] | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  // Reactions
  const [reactionPicker, setReactionPicker] = useState<number | null>(null);
  // Secret chats
  const [msgContextMenu, setMsgContextMenu] = useState<{ msgId: number; x: number; y: number } | null>(null);

  const currentChat = chats.find(c => c.id === activeChat) ?? archivedChats.find(c => c.id === activeChat);

  // Load moons from backend
  useEffect(() => {
    if (!username || username === "username") return;
    setLoadingMoons(true);
    fetch(`${API.getMoons}?username=${encodeURIComponent(username)}`)
      .then(r => r.json())
      .then(data => { setMoons(data.balance || 0); setGifts(data.nfts || []); })
      .catch(() => {})
      .finally(() => setLoadingMoons(false));
  }, [username]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeChat, currentChat?.messages.length]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;
    setChats(prev => prev.map(c => c.id === activeChat ? { ...c, lastMessage: message, time: "Сейчас", messages: [...c.messages, { id: Date.now(), from: "me", text: message, time: "Сейчас", type: "text" as const }] } : c));
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

  const archiveChat = (chatId: number) => {
    const chat = chats.find(c => c.id === chatId); if (!chat) return;
    setArchivedChats(prev => [chat, ...prev]); setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChat === chatId) setActiveChat(null); setContextMenu(null);
  };
  const unarchiveChat = (chatId: number) => {
    const chat = archivedChats.find(c => c.id === chatId); if (!chat) return;
    setChats(prev => [chat, ...prev]); setArchivedChats(prev => prev.filter(c => c.id !== chatId));
  };
  const createSecretChat = (chatId: number) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, secret: true } : c));
    setContextMenu(null);
    setModal("secret-info");
  };

  const closeModal = () => {
    setModal(null); setNewName(""); setNewPhone(""); setNewChannelName(""); setNewChannelDesc("");
    setEditingUsername(""); setUsernameError(""); setPendingNft(null); setPendingPack(null); setBuyStep("confirm"); setBuyError("");
    if (storyTimer.current) clearInterval(storyTimer.current); setViewingStory(null); setStoryProgress(0);
  };

  const handleSaveUsername = () => {
    const val = editingUsername.trim().replace(/^@/, "");
    if (!val) { setUsernameError("Юзернейм не может быть пустым"); return; }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(val)) { setUsernameError("3–20 символов: буквы, цифры, _"); return; }
    setUsername(val); closeModal();
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    const initials = newChannelName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const color = AVATAR_COLORS_LIST[Math.floor(Math.random() * AVATAR_COLORS_LIST.length)];
    setChats(prev => [{ id: Date.now(), name: newChannelName.trim(), avatar: initials, color, lastMessage: "Канал создан", time: "Сейчас", unread: 0, online: false, secret: false, isGroup: true, messages: [{ id: 1, from: "them", text: `Канал «${newChannelName.trim()}» создан.`, time: "Сейчас", type: "text" as const }] }, ...prev]);
    closeModal();
  };
  const handleCreateChat = () => {
    if (!newName.trim()) return;
    const initials = newName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const color = AVATAR_COLORS_LIST[Math.floor(Math.random() * AVATAR_COLORS_LIST.length)];
    const nc = { id: Date.now(), name: newName.trim(), avatar: initials, color, lastMessage: "", time: "Сейчас", unread: 0, online: false, secret: false, messages: [] as Message[] };
    setChats(prev => [nc, ...prev]); setActiveChat(nc.id); setActiveTab("chats"); closeModal();
  };

  const handleSaveAvatar = () => { setAvatarEmoji(tempEmoji); setAvatarColor(tempColor); closeModal(); };

  // Buy moons — creates pending request, sends TG notification
  const handleBuyPack = (pack: typeof MOON_PACKS[0]) => { setPendingPack(pack); setPendingNft(null); setBuyStep("confirm"); setModal("buy-confirm"); };
  const handleBuyNft = (item: typeof NFT_ITEMS[0]) => { setPendingNft(item); setPendingPack(null); setBuyStep("confirm"); setModal("buy-confirm"); };

  const handleConfirmBuy = async () => {
    if (pendingNft) {
      // NFT — spend moons via backend
      try {
        const r = await fetch(API.spendMoons, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, nft_id: pendingNft.id, nft_name: pendingNft.name, nft_emoji: pendingNft.emoji, price: pendingNft.price }) });
        const data = await r.json();
        if (!r.ok) { setBuyError(data.error || "Ошибка"); return; }
        setMoons(data.new_balance);
        setGifts(prev => [{ nft_id: pendingNft.id, emoji: pendingNft.emoji, name: pendingNft.name, purchased_at: new Date().toISOString() }, ...prev]);
        closeModal();
      } catch { setBuyError("Ошибка сети"); }
    } else if (pendingPack) {
      setBuyStep("paying");
    }
  };

  const handlePaymentSent = async () => {
    if (!pendingPack) return;
    setBuyStep("pending");
    try {
      await fetch(API.buyMoons, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pack_id: pendingPack.id, moons: pendingPack.moons, bonus: pendingPack.bonus, price_rub: pendingPack.price }) });
    } catch (e) { console.error(e); }
    // Don't credit moons yet — wait for admin approval via TG
  };

  // Stories
  const openStory = (story: typeof STORIES[0]) => {
    if (story.isMe) return;
    setViewingStory(story);
    setStoryProgress(0);
    setModal("story-view");
    setStories(prev => prev.map(s => s.id === story.id ? { ...s, seen: true } : s));
    if (storyTimer.current) clearInterval(storyTimer.current);
    storyTimer.current = setInterval(() => {
      setStoryProgress(p => { if (p >= 100) { clearInterval(storyTimer.current!); closeModal(); return 100; } return p + 2; });
    }, 100);
  };

  // Reactions
  const addReaction = (msgId: number, reaction: string) => {
    setChats(prev => prev.map(c => c.id === activeChat ? { ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, reaction } : m) } : c));
    setReactionPicker(null);
  };

  useEffect(() => {
    const hide = () => { setContextMenu(null); setMsgContextMenu(null); setReactionPicker(null); };
    window.addEventListener("click", hide);
    return () => window.removeEventListener("click", hide);
  }, []);

  const filteredNfts = NFT_ITEMS.filter(n => {
    if (shopFilter === "Все") return true;
    if (shopFilter === "Мишки") return ["🐻","🐻‍❄️","⭐"].includes(n.emoji);
    if (shopFilter === "Сердечки") return ["❤️","💜","💎","🌈"].includes(n.emoji);
    if (shopFilter === "Книги") return ["📚","📖"].includes(n.emoji);
    if (shopFilter === "Рюкзаки") return ["🎒","🎽","🌙"].includes(n.emoji);
    return true;
  });

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

      {/* MODALS */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className={`modal-box ${modal === "story-view" ? "modal-story" : ""}`} onClick={e => e.stopPropagation()}>

            {modal === "new-chat" && (<>
              <div className="modal-header"><div className="modal-title">Новый чат</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body">
                <input className="modal-input" placeholder="Имя" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
                <input className="modal-input" placeholder="Телефон" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
              </div>
              <div className="modal-footer"><button className="modal-btn-cancel" onClick={closeModal}>Отмена</button><button className="modal-btn-ok" onClick={handleCreateChat} disabled={!newName.trim()}>Создать</button></div>
            </>)}

            {modal === "new-channel" && (<>
              <div className="modal-header"><div className="modal-title">Новый канал</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body">
                <input className="modal-input" placeholder="Название" value={newChannelName} onChange={e => setNewChannelName(e.target.value)} autoFocus />
                <textarea className="modal-input modal-textarea" placeholder="Описание" value={newChannelDesc} onChange={e => setNewChannelDesc(e.target.value)} />
              </div>
              <div className="modal-footer"><button className="modal-btn-cancel" onClick={closeModal}>Отмена</button><button className="modal-btn-ok" onClick={handleCreateChannel} disabled={!newChannelName.trim()}>Создать</button></div>
            </>)}

            {modal === "new-contact" && (<>
              <div className="modal-header"><div className="modal-title">Новый контакт</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body">
                <input className="modal-input" placeholder="Имя" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
                <input className="modal-input" placeholder="Телефон" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
              </div>
              <div className="modal-footer"><button className="modal-btn-cancel" onClick={closeModal}>Отмена</button><button className="modal-btn-ok" onClick={() => closeModal()} disabled={!newName.trim()}>Добавить</button></div>
            </>)}

            {modal === "edit-username" && (<>
              <div className="modal-header"><div className="modal-title">Изменить юзернейм</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body">
                <div className="username-hint">Только латиница, цифры и _</div>
                <div className="username-input-wrap"><span className="username-at">@</span><input className="modal-input username-field" placeholder="my_username" value={editingUsername} onChange={e => { setEditingUsername(e.target.value.replace(/^@/, "")); setUsernameError(""); }} autoFocus onKeyDown={e => e.key === "Enter" && handleSaveUsername()} /></div>
                {usernameError && <div className="username-error">{usernameError}</div>}
              </div>
              <div className="modal-footer"><button className="modal-btn-cancel" onClick={closeModal}>Отмена</button><button className="modal-btn-ok" onClick={handleSaveUsername} disabled={!editingUsername.trim()}>Сохранить</button></div>
            </>)}

            {modal === "avatar" && (<>
              <div className="modal-header"><div className="modal-title">Изменить аватар</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body">
                <div className="avatar-preview-wrap"><div className={`avatar-preview bg-gradient-to-br ${tempColor}`} style={{ fontSize: tempEmoji ? 32 : undefined }}>{tempEmoji || "ВМ"}</div></div>
                <div className="avatar-section-label">Эмодзи</div>
                <div className="avatar-emoji-grid">
                  <button className={`avatar-emoji-btn ${tempEmoji === "" ? "selected" : ""}`} onClick={() => setTempEmoji("")}>АА</button>
                  {AVATAR_EMOJIS.map(e => <button key={e} className={`avatar-emoji-btn ${tempEmoji === e ? "selected" : ""}`} onClick={() => setTempEmoji(e)}>{e}</button>)}
                </div>
                <div className="avatar-section-label">Цвет</div>
                <div className="avatar-color-grid">{AVATAR_COLORS_LIST.map(c => <button key={c} className={`avatar-color-btn ${tempColor === c ? "selected" : ""}`} style={{ background: AVATAR_BG[c] }} onClick={() => setTempColor(c)} />)}</div>
              </div>
              <div className="modal-footer"><button className="modal-btn-cancel" onClick={closeModal}>Отмена</button><button className="modal-btn-ok" onClick={handleSaveAvatar}>Сохранить</button></div>
            </>)}

            {modal === "secret-info" && (<>
              <div className="modal-header"><div className="modal-title">🔐 Секретный чат</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
              <div className="modal-body" style={{ alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 48 }}>🔐</div>
                <div className="buy-confirm-name">Секретный режим включён</div>
                <div className="username-hint" style={{ textAlign: "center" }}>Сообщения шифруются на вашем устройстве. Никто, кроме участников, не может их прочитать. Переписка не хранится на серверах.</div>
                <div className="secret-features">
                  {["End-to-end шифрование","Автоудаление сообщений","Нет пересылки","Нет скриншотов"].map(f => <div key={f} className="secret-feature"><Icon name="Check" size={13} />{f}</div>)}
                </div>
              </div>
              <div className="modal-footer"><button className="modal-btn-ok" onClick={closeModal}>Понятно</button></div>
            </>)}

            {modal === "story-view" && viewingStory && (
              <div className="story-modal-inner">
                <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${storyProgress}%` }} /></div>
                <button className="story-close-btn" onClick={closeModal}><Icon name="X" size={18} /></button>
                <div className={`story-bg bg-gradient-to-br ${viewingStory.color}`}>
                  <div className="story-header-row">
                    <div className={`story-modal-avatar bg-gradient-to-br ${viewingStory.color}`}>{viewingStory.avatar}</div>
                    <div className="story-modal-name">{viewingStory.name}</div>
                  </div>
                  <div className="story-content-emoji">{viewingStory.emoji}</div>
                  <div className="story-content-text">{viewingStory.text}</div>
                </div>
                <div className="story-reactions-bar">
                  {REACTIONS.map(r => <button key={r} className="story-react-btn" onClick={() => closeModal()}>{r}</button>)}
                </div>
              </div>
            )}

            {modal === "buy-confirm" && (<>
              {buyStep === "confirm" && (<>
                <div className="modal-header"><div className="modal-title">{pendingNft ? "Купить NFT" : "Купить луны"}</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
                <div className="modal-body" style={{ alignItems: "center", gap: 12 }}>
                  {pendingNft && <>
                    <div className="buy-confirm-emoji">{pendingNft.emoji}</div>
                    <div className="buy-confirm-name">{pendingNft.name}</div>
                    <div className="buy-confirm-rarity" style={{ color: RARITY_COLOR[pendingNft.rarity] }}>{pendingNft.rarity}</div>
                    <div className="buy-confirm-price"><span className="moon-icon">🌙</span>{pendingNft.price} лун</div>
                    <div style={{ fontSize: 12, color: "var(--m-muted)" }}>Ваш баланс: 🌙 {moons}</div>
                    {moons < pendingNft.price && <div className="buy-not-enough">Недостаточно лун. Пополните баланс.</div>}
                    {buyError && <div className="buy-not-enough">{buyError}</div>}
                  </>}
                  {pendingPack && <>
                    <div className="buy-confirm-emoji">🌙</div>
                    <div className="buy-confirm-name">{pendingPack.moons + pendingPack.bonus} лун{pendingPack.bonus > 0 && <span className="pack-bonus" style={{ marginLeft: 6 }}>+{pendingPack.bonus} бонус</span>}</div>
                    <div className="buy-confirm-price">{pendingPack.price} ₽</div>
                  </>}
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                  <button className="modal-btn-ok" onClick={handleConfirmBuy} disabled={!!pendingNft && moons < pendingNft.price}>{pendingNft ? "Купить" : "К оплате"}</button>
                </div>
              </>)}

              {buyStep === "paying" && pendingPack && (<>
                <div className="modal-header"><div className="modal-title">Оплата</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
                <div className="modal-body" style={{ gap: 12 }}>
                  <div className="pay-instruction">Переведите <strong>{pendingPack.price} ₽</strong> на карту:</div>
                  <div className="pay-card-number">2200 7012 3846 7770</div>
                  <div className="pay-bank">Сбербанк / любой банк через СБП</div>
                  <div className="pay-comment">В комментарии укажите: <strong>@{username}</strong></div>
                  <div className="pay-note">После перевода нажмите «Отправил» — мы пришлём луны после проверки платежа.</div>
                </div>
                <div className="modal-footer">
                  <button className="modal-btn-cancel" onClick={closeModal}>Отмена</button>
                  <button className="modal-btn-ok" onClick={handlePaymentSent}>Я отправил ✓</button>
                </div>
              </>)}

              {buyStep === "pending" && (<>
                <div className="modal-header"><div className="modal-title">Заявка принята</div><button className="modal-close" onClick={closeModal}><Icon name="X" size={16} /></button></div>
                <div className="modal-body" style={{ alignItems: "center", gap: 12 }}>
                  <div className="buy-confirm-emoji">⏳</div>
                  <div className="buy-confirm-name">Ожидаем подтверждения</div>
                  <div className="username-hint" style={{ textAlign: "center" }}>Администратор проверит платёж и зачислит луны. Обычно это занимает несколько минут.</div>
                </div>
                <div className="modal-footer"><button className="modal-btn-ok" onClick={closeModal}>Закрыть</button></div>
              </>)}
            </>)}
          </div>
        </div>
      )}

      {/* Context menus */}
      {contextMenu && (
        <div className="ctx-menu" style={{ top: contextMenu.y, left: contextMenu.x }} onClick={e => e.stopPropagation()}>
          <button className="ctx-item" onClick={() => archiveChat(contextMenu.chatId)}><Icon name="Archive" size={15} /> В архив</button>
          <button className="ctx-item" onClick={() => createSecretChat(contextMenu.chatId)}><Icon name="Lock" size={15} /> Секретный чат</button>
        </div>
      )}
      {msgContextMenu && (
        <div className="ctx-menu" style={{ top: msgContextMenu.y, left: msgContextMenu.x }} onClick={e => e.stopPropagation()}>
          <div className="ctx-reactions">
            {REACTIONS.map(r => <button key={r} className="ctx-reaction-btn" onClick={() => { addReaction(msgContextMenu.msgId, r); setMsgContextMenu(null); }}>{r}</button>)}
          </div>
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
            {activeTab === "chats" && (<><button className="plus-btn" title="Новый чат" onClick={() => setModal("new-chat")}><Icon name="MessageSquarePlus" size={17} /></button><button className="plus-btn" title="Новый канал" onClick={() => setModal("new-channel")}><Icon name="Radio" size={17} /></button></>)}
            {activeTab === "contacts" && <button className="plus-btn" title="Добавить контакт" onClick={() => setModal("new-contact")}><Icon name="UserPlus" size={17} /></button>}
            {activeTab === "profile" && <div className="moon-balance">{loadingMoons ? "…" : <><span className="moon-icon">🌙</span>{moons}</>}</div>}
          </div>
        </div>

        <div className="search-wrap">
          <Icon name="Search" size={15} className="search-icon-inner" />
          <input className="search-input" placeholder="Поиск..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        <nav className="sidebar-nav">
          {(["chats","contacts","profile"] as Tab[]).map(tab => (
            <button key={tab} className={`nav-btn ${activeTab === tab ? "nav-btn-active" : ""}`} onClick={() => { setActiveTab(tab); if (tab !== "chats") setActiveChat(null); if (tab === "profile") setProfileSection("main"); }}>
              <Icon name={tab === "chats" ? "MessageSquare" : tab === "contacts" ? "Users" : "User"} size={17} />
              <span>{tab === "chats" ? "Чаты" : tab === "contacts" ? "Контакты" : "Профиль"}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-list">
          {/* CHATS */}
          {activeTab === "chats" && (<>
            {/* Stories strip */}
            <div className="stories-strip">
              {stories.map(s => (
                <button key={s.id} className={`story-btn ${s.seen ? "story-seen" : ""} ${s.isMe ? "story-me" : ""}`} onClick={() => openStory(s)}>
                  <div className={`story-avatar bg-gradient-to-br ${s.color}`}>{s.isMe ? "+" : s.avatar}</div>
                  <span className="story-name">{s.name}</span>
                </button>
              ))}
            </div>

            {chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(chat => (
              <button key={chat.id} className={`chat-item ${activeChat === chat.id ? "chat-item-active" : ""}`}
                onClick={() => { setActiveChat(chat.id); }}
                onContextMenu={e => { e.preventDefault(); setContextMenu({ chatId: chat.id, x: e.clientX, y: e.clientY }); }}>
                <div className="chat-item-avatar-wrap">
                  <div className={`chat-avatar bg-gradient-to-br ${chat.color}`}>{chat.avatar}</div>
                  {chat.online && <span className="online-dot" />}
                  {chat.secret && <span className="secret-badge">🔐</span>}
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
                  <div className="chat-item-bottom"><span className="chat-item-last">{archivedChats[0]?.name}</span></div>
                </div>
                <Icon name={showArchive ? "ChevronUp" : "ChevronDown"} size={14} className="archive-chevron" />
              </button>
            )}
            {showArchive && archivedChats.map(chat => (
              <div key={chat.id} className="archived-chat-item">
                <button className={`chat-item archive-sub-item ${activeChat === chat.id ? "chat-item-active" : ""}`} onClick={() => setActiveChat(chat.id)}>
                  <div className="chat-item-avatar-wrap"><div className={`chat-avatar bg-gradient-to-br ${chat.color}`} style={{ opacity: 0.7 }}>{chat.avatar}</div></div>
                  <div className="chat-item-info">
                    <div className="chat-item-top"><span className="chat-item-name" style={{ opacity: 0.7 }}>{chat.name}</span><span className="chat-item-time">{chat.time}</span></div>
                    <div className="chat-item-bottom"><span className="chat-item-last">{chat.lastMessage || "Голосовое"}</span></div>
                  </div>
                </button>
                <button className="unarchive-btn" onClick={() => unarchiveChat(chat.id)}><Icon name="ArchiveRestore" size={14} /></button>
              </div>
            ))}
          </>)}

          {/* CONTACTS */}
          {activeTab === "contacts" && CONTACTS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(contact => (
            <button key={contact.id} className="chat-item" onClick={() => { const ex = chats.find(c => c.name === contact.name); if (ex) { setActiveChat(ex.id); setActiveTab("chats"); } }}>
              <div className="chat-item-avatar-wrap"><div className={`chat-avatar bg-gradient-to-br ${contact.color}`}>{contact.avatar}</div>{contact.online && <span className="online-dot" />}</div>
              <div className="chat-item-info"><div className="chat-item-top"><span className="chat-item-name">{contact.name}</span></div><div className="chat-item-bottom"><span className="chat-item-last">{contact.status}</span></div></div>
            </button>
          ))}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="profile-panel">
              <div className="profile-avatar-wrap">
                <div className={`profile-avatar bg-gradient-to-br ${avatarColor}`} style={{ fontSize: avatarEmoji ? 32 : undefined }}>{avatarEmoji || "ВМ"}</div>
                <button className="avatar-edit-btn" onClick={() => { setTempEmoji(avatarEmoji); setTempColor(avatarColor); setModal("avatar"); }}><Icon name="Camera" size={13} /></button>
              </div>
              <div className="profile-name">Виктор Морозов</div>
              <button className="profile-username profile-username-btn" onClick={() => { setEditingUsername(username); setModal("edit-username"); }}>
                @{username}<Icon name="Pencil" size={11} className="profile-username-edit" />
              </button>

              <div className="profile-nav">
                {([["main","Профиль","User"],["privacy","Приватность","Lock"],["shop","Магазин","ShoppingBag"],["buy-moons","Луны","Sparkles"],["gifts","Подарки","Gift"]] as [ProfileSection,string,string][]).map(([sec,label,icon]) => (
                  <button key={sec} className={`profile-nav-btn ${profileSection === sec ? "profile-nav-active" : ""}`} onClick={() => setProfileSection(sec)}>
                    <Icon name={icon} size={13} />{label}
                  </button>
                ))}
              </div>

              {profileSection === "main" && (<>
                <div className="profile-fields">
                  {([{ label: "Телефон", value: "+7 900 000-00-00", icon: "Phone" },{ label: "Статус", value: "На связи 🚀", icon: "Smile" }] as { label: string; value: string; icon: string }[]).map(f => (
                    <div key={f.label} className="profile-field"><Icon name={f.icon} size={15} className="profile-field-icon" /><div><div className="profile-field-label">{f.label}</div><div className="profile-field-value">{f.value}</div></div></div>
                  ))}
                </div>
                <div className="profile-settings">
                  {([{ icon: "Bell", label: "Уведомления" },{ icon: "Palette", label: "Оформление" },{ icon: "HelpCircle", label: "Помощь" }] as { icon: string; label: string }[]).map(item => (
                    <button key={item.label} className="profile-setting-btn"><Icon name={item.icon} size={15} /><span>{item.label}</span><Icon name="ChevronRight" size={13} className="ml-auto opacity-40" /></button>
                  ))}
                </div>
              </>)}

              {profileSection === "privacy" && (
                <div className="privacy-panel">
                  <div className="privacy-title">Конфиденциальность</div>
                  <div className="privacy-block">
                    <div className="privacy-row"><div><div className="privacy-label">Показывать «В сети»</div><div className="privacy-sub">Другие видят вашу активность</div></div><button className={`toggle-btn ${showOnline ? "toggle-on" : ""}`} onClick={() => setShowOnline(v => !v)}><span className="toggle-thumb" /></button></div>
                    <div className="privacy-row" style={{ marginTop: 12 }}><div><div className="privacy-label">Кто может писать</div></div><select className="privacy-select" value={whoCanMsg} onChange={e => setWhoCanMsg(e.target.value)}><option value="all">Все</option><option value="contacts">Контакты</option><option value="nobody">Никто</option></select></div>
                  </div>
                  <div className="privacy-block">
                    <div className="privacy-block-title"><span className="moon-icon">🌙</span> Платные сообщения</div>
                    <div className="privacy-sub" style={{ marginBottom: 10 }}>Незнакомцы платят лунами чтобы написать вам</div>
                    <div className="privacy-row"><div><div className="privacy-label">Включить</div></div><button className={`toggle-btn ${paidMessages ? "toggle-on" : ""}`} onClick={() => setPaidMessages(v => !v)}><span className="toggle-thumb" /></button></div>
                    {paidMessages && (<>
                      <div className="privacy-row" style={{ marginTop: 10 }}><div><div className="privacy-label">Цена за сообщение</div></div>
                        <div className="paid-price-wrap"><button className="paid-price-btn" onClick={() => setPaidPrice(p => Math.max(1, p-5))}>−</button><span className="paid-price-val"><span className="moon-icon">🌙</span>{paidPrice}</span><button className="paid-price-btn" onClick={() => setPaidPrice(p => p+5)}>+</button></div>
                      </div>
                      <div className="paid-msg-info">Вы получаете {paidPrice} лун за каждое сообщение от незнакомцев</div>
                    </>)}
                  </div>
                </div>
              )}

              {profileSection === "shop" && (
                <div className="shop-panel">
                  <div className="shop-header-row"><div className="shop-title">NFT-коллекции</div><div className="moon-balance-lg"><span className="moon-icon">🌙</span>{moons}</div></div>
                  <div className="shop-cats">{SHOP_CATS.map(cat => <button key={cat} className={`shop-cat-btn ${shopFilter === cat ? "shop-cat-active" : ""}`} onClick={() => setShopFilter(cat)}>{cat}</button>)}</div>
                  <div className="nft-grid">
                    {filteredNfts.map(item => (
                      <div key={item.id} className="nft-card">
                        <div className="nft-emoji">{item.emoji}</div>
                        <div className="nft-name">{item.name}</div>
                        <div className="nft-rarity" style={{ color: RARITY_COLOR[item.rarity] }}>{item.rarity}</div>
                        <button className="nft-buy-btn" onClick={() => handleBuyNft(item)} disabled={moons < item.price}><span className="moon-icon">🌙</span>{item.price}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profileSection === "buy-moons" && (
                <div className="buy-moons-panel">
                  <div className="buy-moons-title">Купить луны</div>
                  <div className="buy-moons-sub">Для NFT и платных функций</div>
                  <div className="moon-balance-hero"><span style={{ fontSize: 36 }}>🌙</span><span className="moon-hero-num">{moons}</span><span className="moon-hero-label">ваш баланс</span></div>
                  <div className="packs-list">
                    {MOON_PACKS.map(pack => (
                      <button key={pack.id} className="pack-card" onClick={() => handleBuyPack(pack)}>
                        <div className="pack-left"><span className="pack-moon-icon">🌙</span><div><div className="pack-moons">{pack.moons} лун{pack.bonus > 0 && <span className="pack-bonus">+{pack.bonus}</span>}</div></div></div>
                        <div className="pack-price">{pack.price} ₽</div>
                      </button>
                    ))}
                  </div>
                  <div className="buy-moons-note">После оплаты администратор вручную подтверждает платёж и начисляет луны.</div>
                </div>
              )}

              {profileSection === "gifts" && (
                <div className="gifts-panel">
                  <div className="shop-title">Мои подарки</div>
                  {gifts.length === 0
                    ? <div className="gifts-empty"><div style={{ fontSize: 40 }}>🎁</div><div className="gifts-empty-text">Пока нет подарков.<br />Купи NFT в магазине!</div></div>
                    : <div className="gifts-grid">
                        {gifts.map((g, i) => (
                          <div key={i} className="gift-card">
                            <div className="gift-emoji">{g.emoji}</div>
                            <div className="gift-name">{g.name}</div>
                            <div className="gift-date">{new Date(g.purchased_at).toLocaleDateString("ru-RU")}</div>
                          </div>
                        ))}
                      </div>}
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
              <div className="chat-header-name">
                {currentChat.name}
                {currentChat.secret && <span className="secret-label">🔐</span>}
              </div>
              <div className="chat-header-status">{currentChat.online ? <><span className="online-dot-sm" />В сети</> : "Был недавно"}</div>
            </div>
            <div className="chat-header-actions">
              <button className="action-btn" onClick={() => setShowVideoCall(true)}><Icon name="Video" size={19} /></button>
              <button className="action-btn" onClick={() => setShowVideoCall(true)}><Icon name="Phone" size={19} /></button>
              <button className="action-btn"><Icon name="MoreVertical" size={19} /></button>
            </div>
          </div>

          {currentChat.secret && (
            <div className="secret-banner"><Icon name="Lock" size={13} /> Секретный чат · end-to-end шифрование</div>
          )}

          <div className="messages-area">
            <div className="messages-wrap">
              {currentChat.messages.map(msg => (
                <div key={msg.id} className={`msg-row ${msg.from === "me" ? "msg-row-me" : ""}`}
                  onContextMenu={e => { e.preventDefault(); setMsgContextMenu({ msgId: msg.id, x: e.clientX, y: e.clientY }); }}>
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
                    {(msg as Message).reaction && <span className="msg-reaction">{(msg as Message).reaction}</span>}
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
              <input className="msg-input" placeholder={currentChat.secret ? "🔐 Зашифрованное сообщение..." : "Сообщение..."} value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
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
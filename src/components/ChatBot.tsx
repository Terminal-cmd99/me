import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, MessageSquare, Send, Sparkles, X } from 'lucide-react';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  action?: 'share-location';
  locationPrompt?: string;
}

interface ChatLocation {
  latitude: number;
  longitude: number;
}

const sessionNameKey = 'janoi-user-name';

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

const firstGreetingMessages = [
  'หวัดดี เจน้อยน่ารักไงจะใครล่ะ เธอชื่อไรอะ จะได้เรียกถูก',
  'ฮัลโหลล เจน้อยมาแล้วแม่ ก่อนเมาท์ บอกชื่อมาก่อนเร็ว',
  'ดีจ้า คนเหงาท่านหนึ่ง เธอชื่ออะไร เจน้อยจะได้จำไว้ในสมอง',
  'มาแล้วว เจน้อยเอง ไม่ใช่บอทจืด ๆ นะ เธอชื่อไรอะ',
  'โอ๊ะ มีคนเข้ามาเมาท์ ชื่ออะไรคะคนสวย/คนหล่อ/คนเท่',
];

const returningGreetingMessages = [
  (name: string) => `กลับมาแล้วเหรอ ${name} เมาท์ไรดีวันนี้`,
  (name: string) => `${name} มาอีกละ เจน้อยพร้อมเผือกมาก`,
  (name: string) => `ว่าไง ${name} วันนี้ใจพังหรือแค่อยากเมาท์`,
  (name: string) => `อุ๊ย ${name} โผล่มาแล้ว มีเรื่องอะไรมาเล่า`,
  (name: string) => `${name} จ๋า เจน้อยนั่งรอฟังอยู่ พูดมาเลย`,
];

const nameSavedMessages = [
  (name: string) => `โอเค ${name} เจน้อยเก็บไว้ในสมองแล้วนะ เมาท์ไรต่อดี`,
  (name: string) => `รับทราบ ${name} ชื่อน่าจำอยู่ เจน้อยล็อกไว้ในหัวใจละ`,
  (name: string) => `${name} ใช่ปะ ได้เลยแม่ เจน้อยจำไว้แล้ว มีเรื่องไรเล่า`,
  (name: string) => `เค ${name} ต่อไปเจน้อยจะเรียกชื่อนี้นะ อย่ามาหลอกกันล่ะ`,
  (name: string) => `จดจำ ${name} เรียบร้อยในสมองเจน้อย ว่าแต่วันนี้มาโหมดไหน`,
];

const placeKeywords = [
  'ร้าน',
  'อาหาร',
  'คาเฟ่',
  'กาแฟ',
  'ที่เที่ยว',
  'สถานที่',
  'เที่ยวไหนดี',
  'ใกล้ฉัน',
  'ใกล้ๆ',
  'แถวนี้',
  'restaurant',
  'cafe',
  'nearby',
  'place',
  'food',
];

function asksForPlace(text: string) {
  const normalized = text.toLowerCase();
  return placeKeywords.some((keyword) => normalized.includes(keyword));
}

function splitAssistantReply(reply: string): string[] {
  const chunks = reply
    .split(/\n{2,}|(?<=[.!?。！？])\s+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (chunks.length > 1) {
    return chunks;
  }

  const sentences = reply
    .split(/(?<=[.!?。！？])\s+|(?<=นะ|จ้า|จ๊ะ|แม่|เธอ|เลย|อะ)\s+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (sentences.length > 1) {
    return sentences;
  }

  if (reply.length <= 120) {
    return [reply];
  }

  const words = reply.split(' ');
  const result: string[] = [];
  let current = '';

  for (const word of words) {
    if (`${current} ${word}`.trim().length > 110 && current) {
      result.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }

  if (current) {
    result.push(current.trim());
  }

  return result;
}

function createAssistantMessages(reply: string, idPrefix = `assistant-${Date.now()}`): ChatMessage[] {
  return splitAssistantReply(reply).map((content, index) => ({
    id: `${idPrefix}-${index}`,
    role: 'assistant',
    content,
  }));
}

const createStarterMessages = (name: string): ChatMessage[] => [
  {
    id: 'welcome',
    role: 'assistant',
    content: name ? pickRandom(returningGreetingMessages)(name) : pickRandom(firstGreetingMessages),
  },
];

export function ChatBot() {
  const [userName, setUserName] = useState(() => sessionStorage.getItem(sessionNameKey) || '');
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => createStarterMessages(userName));
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<ChatLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'asking' | 'allowed' | 'denied'>('idle');
  const viewportRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [messages, isLoading, isOpen]);

  const requestBotReply = async (nextMessages: ChatMessage[], nextLocation: ChatLocation | null) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: nextMessages.map(({ role, content }) => ({ role, content })),
        userName,
        location: nextLocation,
      }),
    });

    const data = (await response.json()) as { reply?: string; error?: string };

    if (!response.ok || !data.reply) {
      throw new Error(data.error || 'Unable to get a response right now.');
    }

    return data.reply;
  };

  const sendMessage = async () => {
    const trimmed = input.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    if (!userName) {
      const nextName = trimmed.slice(0, 40);
      sessionStorage.setItem(sessionNameKey, nextName);
      setUserName(nextName);
      setMessages([
        ...nextMessages,
        ...createAssistantMessages(
          pickRandom(nameSavedMessages)(nextName),
          `assistant-name-${Date.now()}`
        ),
      ]);
      setIsLoading(false);
      return;
    }

    if (asksForPlace(trimmed) && !location) {
      setMessages([
        ...nextMessages,
        {
          id: `assistant-location-${Date.now()}`,
          role: 'assistant',
          content: 'แชร์โลเคชั่นให้เจน้อยก่อน เดี๋ยวเจน้อยแนะนำสถานที่ให้ แบบไม่มั่วนะจ๊ะ',
          action: 'share-location',
          locationPrompt: trimmed,
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const reply = await requestBotReply(nextMessages, location);

      setMessages((current) => [
        ...current,
        ...createAssistantMessages(reply),
      ]);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage();
  };

  const requestLocation = (prompt?: string) => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setMessages((current) => [
        ...current,
        ...createAssistantMessages('เครื่องเธอไม่ให้เจน้อยดูโลอะ งั้นบอกย่านหรือจังหวัดมาก็ได้ เดี๋ยวช่วยคิดให้'),
      ]);
      return;
    }

    setLocationStatus('asking');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation(nextLocation);
        setLocationStatus('allowed');

        if (!prompt) {
          setMessages((current) => [
            ...current,
            ...createAssistantMessages('ได้โลแล้วแม่ ทีนี้ถามเรื่องร้านหรือสถานที่มาได้เลย'),
          ]);
          return;
        }

        const userMessage: ChatMessage = {
          id: `user-location-${Date.now()}`,
          role: 'user',
          content: prompt,
        };

        const locationNotice = createAssistantMessages('ได้โลแล้ว เดี๋ยวเจน้อยดูให้แป๊บ', `assistant-location-ok-${Date.now()}`);
        const nextMessages = [...messages, userMessage, ...locationNotice];

        setMessages(nextMessages);
        setIsLoading(true);
        setError(null);

        try {
          const reply = await requestBotReply(nextMessages, nextLocation);
          setMessages((current) => [...current, ...createAssistantMessages(reply)]);
        } catch (locationError) {
          setError(locationError instanceof Error ? locationError.message : 'Something went wrong.');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setLocationStatus('denied');
        setMessages((current) => [
          ...current,
          ...createAssistantMessages('ไม่แชร์ก็ไม่เป็นไรแม่ งั้นบอกย่านหรือจังหวัดมาก็ได้ เดี๋ยวเจน้อยช่วยเดาแบบมีสติ'),
        ]);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          className="w-[min(360px,calc(100vw-3rem))] overflow-hidden"
          style={{
            background: '#1a1a3e',
            border: '4px solid #00d4ff',
            boxShadow: '6px 6px 0 #ff6b9d',
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              background: 'linear-gradient(90deg, #6b4ee6 0%, #00d4ff 100%)',
              borderBottom: '4px solid #0a0a1a',
            }}
          >
            <div className="flex items-center gap-2 text-[#0a0a1a]">
              <Sparkles className="h-4 w-4" />
              <span className="font-pixel text-[10px]">J NOI</span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center"
              style={{
                background: '#0a0a1a',
                boxShadow: '2px 2px 0 rgba(255,255,255,0.25)',
              }}
              aria-label="Close chat"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          <div
            ref={viewportRef}
            className="max-h-[360px] min-h-[260px] space-y-3 overflow-y-auto px-3 py-3"
            style={{ background: 'rgba(10, 10, 26, 0.88)' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[85%] px-3 py-2 font-retro text-lg leading-tight"
                  style={{
                    background: message.role === 'user' ? '#00d4ff' : '#6b4ee6',
                    color: message.role === 'user' ? '#0a0a1a' : '#ffffff',
                    boxShadow:
                      message.role === 'user'
                        ? '3px 3px 0 rgba(255, 107, 157, 0.65)'
                        : '3px 3px 0 rgba(0, 212, 255, 0.45)',
                  }}
                >
                  {message.content}
                  {message.action === 'share-location' && (
                    <button
                      type="button"
                      onClick={() => requestLocation(message.locationPrompt)}
                      disabled={locationStatus === 'asking'}
                      className="mt-3 block px-3 py-2 font-pixel text-[9px] disabled:opacity-60"
                      style={{
                        background: '#ffd700',
                        color: '#0a0a1a',
                        border: '3px solid #ffffff',
                        boxShadow: '3px 3px 0 #ff6b9d',
                      }}
                    >
                      {locationStatus === 'asking' ? 'กำลังขอโล...' : 'แชร์โลเคชั่น'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-2 px-3 py-2 font-retro text-lg text-white"
                  style={{
                    background: '#6b4ee6',
                    boxShadow: '3px 3px 0 rgba(0, 212, 255, 0.45)',
                  }}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  เจน้อยกำลังพิมพ์...
                </div>
              </div>
            )}
          </div>

          <div className="px-3 pb-3 pt-2" style={{ borderTop: '4px solid #6b4ee6' }}>
            {error && (
              <p className="mb-2 font-retro text-lg text-[#ff6b9d]">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                placeholder={userName ? 'เมาท์กับเจน้อยได้เลย...' : 'บอกชื่อมาก่อนเร็ว...'}
                className="min-h-[56px] flex-1 resize-none px-3 py-2 font-retro text-lg outline-none"
                style={{
                  background: '#0a0a1a',
                  color: '#ffffff',
                  border: '3px solid #6b4ee6',
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    if (canSend) {
                      void sendMessage();
                    }
                  }
                }}
              />

              <button
                type="submit"
                disabled={!canSend}
                className="flex h-14 w-14 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: '#ffd700',
                  color: '#0a0a1a',
                  border: '3px solid #ffffff',
                  boxShadow: '3px 3px 0 #ff6b9d',
                }}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 px-4 py-3 font-pixel text-xs transition-transform hover:scale-105"
        style={{
          background: '#00d4ff',
          color: '#0a0a1a',
          border: '4px solid #fff',
          boxShadow: '4px 4px 0 #6b4ee6',
        }}
      >
        <MessageSquare className="h-4 w-4" />
        {isOpen ? 'CLOSE J NOI' : 'J NOI'}
      </button>
    </div>
  );
}

import { useState } from 'react';
import { Lock, RefreshCcw } from 'lucide-react';

interface ChatLog {
  id: number;
  created_at: string;
  user_name: string | null;
  question: string;
  answer: string;
  ip_address: string | null;
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  user_agent: string | null;
}

export function BackendPage() {
  const [passcode, setPasscode] = useState('');
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadLogs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/history?limit=200', {
        headers: {
          'X-Admin-Passcode': passcode,
        },
      });
      const data = (await response.json()) as { logs?: ChatLog[]; error?: string };

      if (!response.ok || !data.logs) {
        throw new Error(data.error || 'Cannot load chat history.');
      }

      setLogs(data.logs);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Cannot load chat history.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a1a] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-pixel text-xs text-[#00d4ff]">J NOI BACKEND</p>
            <h1 className="heading-md mt-3">Chat History</h1>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 font-retro text-xl text-[#a0a0c0]">
              <Lock className="h-4 w-4" />
              Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              className="h-11 bg-[#1a1a3e] px-3 font-retro text-xl outline-none"
              style={{ border: '3px solid #6b4ee6' }}
            />
            <button
              type="button"
              onClick={loadLogs}
              disabled={isLoading || !passcode}
              className="flex h-11 items-center justify-center gap-2 px-4 font-pixel text-[10px] disabled:opacity-50"
              style={{
                background: '#00d4ff',
                color: '#0a0a1a',
                border: '3px solid #fff',
                boxShadow: '3px 3px 0 #ff6b9d',
              }}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              LOAD
            </button>
          </div>
        </div>

        {error && <p className="mb-4 font-retro text-xl text-[#ff6b9d]">{error}</p>}

        <div className="overflow-x-auto" style={{ border: '4px solid #6b4ee6' }}>
          <table className="min-w-full border-collapse bg-[#1a1a3e] font-retro text-lg">
            <thead>
              <tr className="bg-[#6b4ee6] text-left text-white">
                <th className="min-w-[170px] p-3">Date</th>
                <th className="min-w-[120px] p-3">User</th>
                <th className="min-w-[260px] p-3">Question</th>
                <th className="min-w-[320px] p-3">Answer</th>
                <th className="min-w-[140px] p-3">IP</th>
                <th className="min-w-[120px] p-3">Place</th>
                <th className="min-w-[180px] p-3">Location</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-[#6b4ee6]/50 align-top">
                  <td className="p-3 text-[#a0a0c0]">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-3 text-[#00d4ff]">{log.user_name || '-'}</td>
                  <td className="whitespace-pre-wrap p-3">{log.question}</td>
                  <td className="whitespace-pre-wrap p-3 text-[#ffd700]">{log.answer}</td>
                  <td className="p-3 text-[#a0a0c0]">{log.ip_address || '-'}</td>
                  <td className="p-3 text-[#a0a0c0]">
                    {[log.city, log.country].filter(Boolean).join(', ') || '-'}
                  </td>
                  <td className="p-3 text-[#a0a0c0]">
                    {log.latitude && log.longitude ? `${log.latitude}, ${log.longitude}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

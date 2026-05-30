import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { startWhatsAppPairing, getWhatsAppStatus, disconnectWhatsApp } from '../lib/whatsappClient';

interface WhatsAppSettingsProps {
  userId: string;
}

export function WhatsAppSettings({ userId }: WhatsAppSettingsProps) {
  const [waStatus, setWaStatus] = useState<string>('not_found');
  const [waQrCode, setWaQrCode] = useState<string | null>(null);
  const [waPhone, setWaPhone] = useState<string | null>(null);
  const [waPermissions, setWaPermissions] = useState<Record<string, boolean>>({
    send_messages: false, read_chats: false, access_contacts: false, manage_contacts: false,
    access_groups: false, send_group_messages: false, read_group_chats: false, view_message_history: false
  });
  const [waPairing, setWaPairing] = useState(false);
  const waPollRef = useRef<any>(null);

  useEffect(() => {
    loadStatus();
    return () => {
      if (waPollRef.current) clearInterval(waPollRef.current);
    };
  }, []);

  const loadStatus = async () => {
    try {
      const { data: settings } = await supabase
        .from('user_settings')
        .select('whatsapp_permissions, whatsapp_paired, whatsapp_phone')
        .eq('user_id', userId)
        .single();
      if (settings) {
        if (settings.whatsapp_permissions) setWaPermissions(prev => ({ ...prev, ...settings.whatsapp_permissions }));
        if (settings.whatsapp_paired) setWaStatus('paired');
        if (settings.whatsapp_phone) setWaPhone(settings.whatsapp_phone);
      }
    } catch (e) {
      console.error('Failed to load whatsapp settings:', e);
    }
  };

  const toggleWaPermission = async (key: string) => {
    const nextPermissions = { ...waPermissions, [key]: !waPermissions[key] };
    setWaPermissions(nextPermissions);
    try {
      await supabase.from('user_settings').upsert({
        user_id: userId,
        whatsapp_permissions: nextPermissions,
        whatsapp_paired: waStatus === 'paired',
        whatsapp_phone: waPhone || null,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save WhatsApp permissions:', error);
    }
  };

  return (
    <section>
      <h2 className="text-[13px] uppercase tracking-wide text-zinc-500 font-medium px-4 mb-2">WhatsApp Integration</h2>
      <div className="bg-[#1C1C1E] rounded-[20px] overflow-hidden">
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${waStatus === 'paired' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : waStatus === 'qr_ready' || waStatus === 'init' ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'bg-zinc-600'}`} />
              <span className={`text-[13px] font-semibold uppercase tracking-wider ${waStatus === 'paired' ? 'text-emerald-500' : waStatus === 'qr_ready' || waStatus === 'init' ? 'text-amber-500' : 'text-zinc-500'}`}>
                {waStatus === 'paired' ? `Connected${waPhone ? ` (${waPhone})` : ''}` : waStatus === 'qr_ready' ? 'Scan QR code' : waStatus === 'init' ? 'Connecting...' : 'Not connected'}
              </span>
            </div>
            {waStatus === 'paired' ? (
              <button
                onClick={async () => {
                  await disconnectWhatsApp(userId);
                  setWaStatus('not_found');
                  setWaPhone(null);
                  setWaQrCode(null);
                  await supabase.from('user_settings').upsert({ user_id: userId, whatsapp_paired: false, whatsapp_phone: null, whatsapp_permissions: waPermissions, updated_at: new Date().toISOString() });
                }}
                className="px-3 py-1.5 bg-red-500/10 active:bg-red-500/20 rounded-full text-[13px] font-semibold text-red-500 transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={async () => {
                  setWaPairing(true);
                  try {
                    await startWhatsAppPairing(userId);
                    setWaStatus('init');
                    waPollRef.current = setInterval(async () => {
                      try {
                        const s = await getWhatsAppStatus(userId);
                        setWaStatus(s.status);
                        if (s.qrCode) setWaQrCode(s.qrCode);
                        if (s.phone) setWaPhone(s.phone);
                        if (s.status === 'paired' || s.status === 'disconnected' || s.error) {
                          if (s.status === 'paired') {
                            await supabase.from('user_settings').upsert({ user_id: userId, whatsapp_paired: true, whatsapp_phone: s.phone || null, whatsapp_permissions: waPermissions, updated_at: new Date().toISOString() });
                          }
                          if (waPollRef.current) clearInterval(waPollRef.current);
                          waPollRef.current = null;
                          setWaPairing(false);
                        }
                      } catch {
                        if (waPollRef.current) clearInterval(waPollRef.current);
                        waPollRef.current = null;
                        setWaPairing(false);
                      }
                    }, 1500);
                  } catch (e: any) {
                    setWaPairing(false);
                    if (waPollRef.current) clearInterval(waPollRef.current);
                  }
                }}
                disabled={waPairing}
                className="px-3 py-1.5 bg-white/10 active:bg-white/20 rounded-full text-[13px] font-semibold text-white transition-colors disabled:opacity-50"
              >
                {waPairing ? 'Pairing...' : 'Pair'}
              </button>
            )}
          </div>

          {waQrCode && waStatus === 'qr_ready' && (
            <div className="flex flex-col items-center pt-4 border-t border-white/5">
              <img src={waQrCode} alt="WhatsApp QR" className="w-48 h-48 rounded-[16px] bg-white p-3 mb-2" />
              <p className="text-[13px] text-zinc-500 text-center">Open WhatsApp &gt; Linked Devices &gt; Link a Device</p>
              <button onClick={() => { setWaQrCode(null); setWaStatus('not_found'); }} className="text-[15px] font-semibold text-red-500 mt-2 p-2 active:opacity-70">Cancel</button>
            </div>
          )}
        </div>

        {waStatus === 'paired' && (
          <div className="border-t border-white/5">
            {[
              { key: 'send_messages', label: 'Send Messages' },
              { key: 'read_chats', label: 'Read Chats' },
              { key: 'access_contacts', label: 'Access Contacts' },
              { key: 'manage_contacts', label: 'Manage Contacts' },
              { key: 'access_groups', label: 'Access Groups' },
              { key: 'send_group_messages', label: 'Send Group Messages' },
              { key: 'read_group_chats', label: 'Read Group Chats' },
              { key: 'view_message_history', label: 'View Message History' },
            ].map((p, i, arr) => (
              <div key={p.key} className={`p-3 flex items-center justify-between ${i !== arr.length - 1 ? 'border-b border-white/5' : ''}`}>
                <span className="text-[15px] text-white">{p.label}</span>
                <button
                  onClick={() => toggleWaPermission(p.key)}
                  aria-pressed={waPermissions[p.key] ? 'true' : 'false'}
                  className={`w-11 h-6 rounded-full transition-all flex items-center ${waPermissions[p.key] ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white transition-all shadow-sm ${waPermissions[p.key] ? 'ml-5' : 'ml-[2px]'}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

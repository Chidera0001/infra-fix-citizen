import { useOnlineStatus } from '@/hooks/use-online-status';

export function ConnectionDebugger() {
  const { isOnline, isChecking, connectionQuality, lastChecked } = useOnlineStatus();

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-3 rounded-lg text-xs z-50">
      <div className="font-bold mb-1">Connection Debug</div>
      <div>Status: {isOnline ? '🟢 Online' : '🔴 Offline'}</div>
      <div>Checking: {isChecking ? '⏳ Yes' : '✅ No'}</div>
      <div>Quality: {connectionQuality}</div>
      <div>Navigator: {navigator.onLine ? '🟢 Online' : '🔴 Offline'}</div>
      <div>Last Check: {lastChecked?.toLocaleTimeString() || 'Never'}</div>
    </div>
  );
}

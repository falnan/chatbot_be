const lastUserActivityMap = new Map(); // { sender: timestamp }

// Konfigurasi: waktu maksimal user dianggap aktif (dalam menit)
const INACTIVITY_LIMIT_MINUTES = 60;

// Konfigurasi: seberapa sering kita mengecek user tidak aktif (dalam menit)
const CLEANUP_INTERVAL_MINUTES = 5;

export function recordUserActivity(sender) {
  lastUserActivityMap.set(sender, Date.now());
}
export default function isUserRecentlyActive(sender) {
  const lastActivity = lastUserActivityMap.get(sender);
  if (!lastActivity) return false;

  const diffMinutes = (Date.now() - lastActivity) / (1000 * 60);
  return diffMinutes < INACTIVITY_LIMIT_MINUTES;
}

setInterval(() => {
  const now = Date.now();
  const totalBefore = lastUserActivityMap.size;

  for (const [sender, lastActivity] of lastUserActivityMap.entries()) {
    const diffMinutes = (now - lastActivity) / (1000 * 60);
    if (diffMinutes >= INACTIVITY_LIMIT_MINUTES) {
      lastUserActivityMap.delete(sender);
      console.log(
        `[🧹] User ${sender} dihapus (tidak aktif > ${INACTIVITY_LIMIT_MINUTES} menit)`
      );
    }
  }

  const totalAfter = lastUserActivityMap.size;
  if (totalBefore !== totalAfter) {
    console.log(
      `🧹 Cleanup selesai: ${totalBefore - totalAfter} user dihapus.`
    );
  }
}, CLEANUP_INTERVAL_MINUTES * 60 * 1000); // ⏱️ Jalankan sesuai interval

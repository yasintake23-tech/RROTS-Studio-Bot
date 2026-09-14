# RROTS Studio Bot

RROTS Studio için hazırlanmış temel Discord botu (V1).

## V1 komutları

- `/ping` — Bot gecikmesini gösterir.
- `/help` — Komut listesini gösterir.
- `/serverinfo` — Sunucu bilgilerini gösterir.
- `/userinfo [kullanıcı]` — Kullanıcı bilgilerini gösterir.
- `/avatar [kullanıcı]` — Avatarı gösterir.
- `/clear <miktar>` — Mesajları siler.
- `/kick <kullanıcı> [sebep]` — Üyeyi sunucudan atar.
- `/ban <kullanıcı> [sebep]` — Üyeyi yasaklar.
- `/timeout <kullanıcı> <süre> [sebep]` — Üyeye zaman aşımı verir.

## Gereksinimler

- Node.js 20+
- Discord bot token
- Botun sunucuda olması
- `applications.commands` ve `bot` kapsamlarının açık olması

## Kurulum

1. Bu klasörü bilgisayara çıkar.
2. Terminali bu klasörde aç.
3. `npm install` çalıştır.
4. `.env.example` dosyasını `.env` olarak kopyala.
5. `.env` içindeki değerleri doldur:
   - `DISCORD_TOKEN`: Developer Portal > Bot bölümündeki token
   - `CLIENT_ID`: Developer Portal > General Information > Application ID
   - `GUILD_ID`: RROTS Studio sunucu ID'si
6. Komutları sunucuya kaydet:
   `npm run deploy`
7. Botu çalıştır:
   `npm start`

## Token güvenliği

`.env` dosyasını kimseyle paylaşma ve GitHub'a yükleme.

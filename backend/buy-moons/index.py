"""
Создание заявки на покупку лун и отправка уведомления в Telegram @Evraziks
"""
import json
import os
import psycopg2
import urllib.request
import urllib.parse

ADMIN_USERNAME = "@Evraziks"
CARD_NUMBER = "2200 7012 3846 7770"

def get_chat_id(bot_token: str) -> int | None:
    url = f"https://api.telegram.org/bot{bot_token}/getUpdates"
    try:
        with urllib.request.urlopen(url, timeout=5) as resp:
            data = json.loads(resp.read())
        for upd in reversed(data.get("result", [])):
            msg = upd.get("message") or upd.get("callback_query", {}).get("message")
            if msg:
                chat = msg.get("chat", {})
                username = chat.get("username", "")
                if username.lower() == ADMIN_USERNAME.lstrip("@").lower():
                    return chat["id"]
    except Exception:
        pass
    return None

def send_tg_message(bot_token: str, chat_id: int, text: str, reply_markup: dict | None = None) -> int | None:
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    if reply_markup:
        payload["reply_markup"] = json.dumps(reply_markup)
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read())
            return result.get("result", {}).get("message_id")
    except Exception:
        return None

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    username = body.get("username", "").strip()
    pack_id = body.get("pack_id")
    moons = body.get("moons", 0)
    bonus = body.get("bonus", 0)
    price_rub = body.get("price_rub", 0)

    if not username or not moons or not price_rub:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Не хватает данных"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO moon_purchases (username, moons, bonus_moons, price_rub, status) VALUES (%s, %s, %s, %s, 'pending') RETURNING id",
        (username, moons, bonus, price_rub)
    )
    purchase_id = cur.fetchone()[0]
    conn.commit()

    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    tg_sent = False

    if bot_token:
        chat_id = get_chat_id(bot_token)
        if chat_id:
            total = moons + bonus
            text = (
                f"🌙 <b>Новая покупка лун!</b>\n\n"
                f"👤 Пользователь: <b>@{username}</b>\n"
                f"💰 Сумма: <b>{price_rub} ₽</b>\n"
                f"🌙 Лун: <b>{moons}</b>" + (f" + {bonus} бонус = <b>{total}</b>" if bonus else "") + "\n"
                f"🆔 Заявка: <b>#{purchase_id}</b>\n\n"
                f"Карта получателя: <code>{CARD_NUMBER}</code>\n"
                f"Подтвердите получение перевода:"
            )
            markup = {
                "inline_keyboard": [[
                    {"text": "✅ Подтвердить", "callback_data": f"approve_{purchase_id}"},
                    {"text": "❌ Отклонить", "callback_data": f"reject_{purchase_id}"}
                ]]
            }
            msg_id = send_tg_message(bot_token, chat_id, text, markup)
            if msg_id:
                cur.execute("UPDATE moon_purchases SET tg_message_id = %s WHERE id = %s", (msg_id, purchase_id))
                conn.commit()
                tg_sent = True

    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": True, "purchase_id": purchase_id, "tg_sent": tg_sent})
    }

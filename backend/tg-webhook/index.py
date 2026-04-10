"""
Webhook от Telegram: обрабатывает нажатия кнопок Подтвердить/Отклонить покупку лун
"""
import json
import os
import psycopg2
import urllib.request

def answer_callback(bot_token: str, callback_id: str, text: str):
    url = f"https://api.telegram.org/bot{bot_token}/answerCallbackQuery"
    payload = json.dumps({"callback_query_id": callback_id, "text": text}).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        urllib.request.urlopen(req, timeout=5)
    except Exception:
        pass

def edit_message(bot_token: str, chat_id: int, message_id: int, text: str):
    url = f"https://api.telegram.org/bot{bot_token}/editMessageText"
    payload = json.dumps({"chat_id": chat_id, "message_id": message_id, "text": text, "parse_mode": "HTML"}).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        urllib.request.urlopen(req, timeout=5)
    except Exception:
        pass

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    callback = body.get("callback_query")
    if not callback:
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

    callback_id = callback["id"]
    data = callback.get("data", "")
    chat_id = callback["message"]["chat"]["id"]
    message_id = callback["message"]["message_id"]

    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")

    if data.startswith("approve_") or data.startswith("reject_"):
        action = "approve" if data.startswith("approve_") else "reject"
        purchase_id = int(data.split("_")[1])

        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()

        cur.execute("SELECT username, moons, bonus_moons, price_rub, status FROM moon_purchases WHERE id = %s", (purchase_id,))
        row = cur.fetchone()

        if not row:
            answer_callback(bot_token, callback_id, "❌ Заявка не найдена")
            cur.close(); conn.close()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

        username, moons, bonus, price_rub, status = row

        if status != "pending":
            answer_callback(bot_token, callback_id, "Заявка уже обработана")
            cur.close(); conn.close()
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

        if action == "approve":
            total = moons + bonus
            cur.execute(
                """INSERT INTO user_moons (username, balance) VALUES (%s, %s)
                   ON CONFLICT (username) DO UPDATE SET balance = user_moons.balance + EXCLUDED.balance, updated_at = NOW()""",
                (username, total)
            )
            cur.execute("UPDATE moon_purchases SET status = 'approved', updated_at = NOW() WHERE id = %s", (purchase_id,))
            conn.commit()
            answer_callback(bot_token, callback_id, f"✅ Начислено {total} лун для @{username}")
            edit_message(bot_token, chat_id, message_id,
                f"✅ <b>Заявка #{purchase_id} подтверждена</b>\n👤 @{username} получил <b>{total} 🌙</b>\n💰 {price_rub} ₽")
        else:
            cur.execute("UPDATE moon_purchases SET status = 'rejected', updated_at = NOW() WHERE id = %s", (purchase_id,))
            conn.commit()
            answer_callback(bot_token, callback_id, f"❌ Отклонено для @{username}")
            edit_message(bot_token, chat_id, message_id,
                f"❌ <b>Заявка #{purchase_id} отклонена</b>\n👤 @{username} — {price_rub} ₽")

        cur.close()
        conn.close()

    return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

"""
Списание лун за покупку NFT и сохранение в коллекцию пользователя
"""
import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    username = body.get("username", "").strip()
    nft_id = body.get("nft_id")
    nft_name = body.get("nft_name", "")
    nft_emoji = body.get("nft_emoji", "")
    price = body.get("price", 0)

    if not username or not nft_id or not price:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Не хватает данных"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute("SELECT balance FROM user_moons WHERE username = %s", (username,))
    row = cur.fetchone()
    balance = row[0] if row else 0

    if balance < price:
        cur.close(); conn.close()
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Недостаточно лун", "balance": balance})}

    cur.execute(
        "UPDATE user_moons SET balance = balance - %s, updated_at = NOW() WHERE username = %s",
        (price, username)
    )
    cur.execute(
        "INSERT INTO user_nfts (username, nft_id, nft_name, nft_emoji) VALUES (%s, %s, %s, %s)",
        (username, nft_id, nft_name, nft_emoji)
    )
    conn.commit()

    cur.execute("SELECT balance FROM user_moons WHERE username = %s", (username,))
    new_balance = cur.fetchone()[0]

    cur.close()
    conn.close()

    return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True, "new_balance": new_balance})}

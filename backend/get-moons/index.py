"""
Получить баланс лун и NFT пользователя по username
"""
import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    params = event.get("queryStringParameters") or {}
    username = params.get("username", "").strip()

    if not username:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "username required"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute("SELECT balance FROM user_moons WHERE username = %s", (username,))
    row = cur.fetchone()
    balance = row[0] if row else 0

    cur.execute("SELECT nft_id, nft_name, nft_emoji, purchased_at FROM user_nfts WHERE username = %s ORDER BY purchased_at DESC", (username,))
    nfts = [{"nft_id": r[0], "name": r[1], "emoji": r[2], "purchased_at": str(r[3])} for r in cur.fetchall()]

    cur.close()
    conn.close()

    return {"statusCode": 200, "headers": headers, "body": json.dumps({"balance": balance, "nfts": nfts})}

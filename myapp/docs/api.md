# サーバー統括管理Webアプリ API仕様

## GET /api/servers
登録されているサーバー一覧を取得する。

## POST /api/servers
新しいサーバーを登録する。

リクエスト例：

{
  "name": "Minecraft Server",
  "status": "ONLINE",
  "cpu_usage": 25,
  "memory_usage": 60
}

## PUT /api/servers/:id
指定したサーバーの状態や使用率を更新する。

リクエスト例：

{
  "status": "ONLINE",
  "cpu_usage": 40,
  "memory_usage": 70
}
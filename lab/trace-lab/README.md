# TRACE LAB — ORBIT LAB

公開ページ: https://knotspace.github.io/orbit-lab/lab/trace-lab/

## 公開構成

- フロントエンド: GitHub Pages
- API: Cloudflare Workers
- 保存先: Cloudflare D1
- Worker ソース: `worker.js`
- D1 初期スキーマ: `schema.sql`

## APIを一度だけ接続する

1. CloudflareでD1データベースを `trace-lab` という名前で作成する。
2. 作成画面に表示されたDatabase IDを `wrangler.toml` の `database_id` に設定する。
3. GitHubリポジトリの Settings → Secrets and variables → Actions に次の3つを登録する。
   - `CLOUDFLARE_API_TOKEN`: Workers と D1 の編集権限を持つAPI Token
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID
4. Cloudflare Dashboard → Workers & Pages → `trace-lab-api` → Settings → Variables and Secrets で、Secret `ADMIN_KEY` に長くランダムな管理キーを登録する。GitHub Actionsに `TRACE_LAB_ADMIN_KEY` を追加しても、現在のデプロイworkflowからWorkerへは自動転送されません。
5. Actions → Deploy TRACE LAB API → Run workflow を実行する。
6. 成功後に表示される `https://trace-lab-api.<subdomain>.workers.dev` をページの「接続設定」に入力する。管理キーも同じ値を入力する。

以後、`lab/trace-lab/` の変更を `main` にpushするとWorkerも自動デプロイされる。DBスキーマも毎回安全に再適用される（CREATE TABLE IF NOT EXISTS）。

## 機能とプライバシー

- びっくり表示: IPアドレスとIPから推定した地域を表示
- URL転送: 作成者が指定したHTTP/HTTPS URLへ転送
- アクセス記録: 管理キーで保護された一覧
- GPS: 訪問者が自分でボタンを押し、ブラウザで許可した場合のみ送信
- リンクの有効期限は発行から24時間。Workerの削除処理は毎時実行され、発行から24時間以上経過したリンクとアクセス記録を削除するため、実際の削除まで最大約25時間となる。回答・GPS情報もアクセス記録にひもづいて削除される設計。

訪問者には、IPアドレス・IPから推定した地域・接続事業者情報・アクセス時刻を記録することを事前に表示する。IPの概算地域判定にはIPの地域情報は概算であり、住所や正確な現在地ではない。GPSは訪問者が明示的に許可した場合だけ取得する。隠れた追跡や嫌がらせには使用しない。生年月日・性別などの個人情報は入力しないことを推奨し、未成年者は特に入力しない。


## 同意と収集データ（2026-11-15）

- 共有URLを開いただけではアクセス記録を作成しません。訪問者が表示内容を確認し、「同意して続ける」を押した後にIPアドレス・IP推定地域・接続事業者情報・アクセス時刻を記録します。
- IP位置推定のため、訪問者のIPアドレスを外部サービス GPSは別の操作とブラウザー許可が必要です。
- 生年月日・性別は新たに収集せず、管理画面の取得対象からも除外しました。旧バージョンで保存された可能性のある値は即時削除していません。既存データの削除は別途確認が必要です。
- メッセージは任意で、リンク作成者に表示されます。氏名・住所・連絡先などを入力しないよう案内します。

## APIの入力・接続制限（2026-11-13）

- `Origin` ヘッダー付きのブラウザー要求は `https://knotspace.github.io` のみ許可し、それ以外は403で拒否する。
- POSTのJSON本文は実際のバイト数で最大8KiBに制限し、超過時は413を返す。転送先URLは最大2,048文字。
- CORSと入力サイズ制限に加えて、2026-11-18にIPハッシュを使うAPIレート制限を追加した。ただしアプリケーション側の基本制限であり、CloudflareのWAF・ネットワーク層Rate Limiting Rulesの代替ではない。

## APIのレート制限（2026-11-18）

- 作成APIはIPごとに15分8回、アクセス記録APIは15分30回、メッセージ送信APIは15分10回、GPS送信APIは15分5回、制作者用記録APIは15分30回に制限する。
- IPアドレスはレート制限キーのSHA-256ハッシュに変換して保存し、レート制限テーブルには生IPを保存しない。
- 上限超過時はHTTP 429とRetry-Afterを返す。レート制限カウンターは有効期限後に定期削除する。
- これはD1を使ったアプリケーション側の基本制限であり、Cloudflareのネットワーク層WAF・Rate Limiting Rulesの代替ではない。大規模な攻撃への耐性を保証しない。

## 地域情報の取得方法（2026-11-18）

訪問元のIPアドレスと地域情報はCloudflare Workerの `request.cf` メタデータから取得します。IPアドレスを `ipwho.is` やOpen-Meteoなどの外部IP・住所検索サービスへ送信しません。市区町村名はCloudflareが返す値をそのまま表示し、都道府県名のみローカル辞書で日本語化します。
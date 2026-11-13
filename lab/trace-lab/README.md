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
- リンクの有効期限は発行から24時間。Workerの定期削除処理は毎日1回実行され、発行から24時間以上経過したリンクとアクセス記録を削除するため、実際の削除まで最大約48時間かかる場合がある。回答・GPS情報もアクセス記録にひもづいて削除される設計。

訪問者には、IPアドレス・IPから推定した地域・接続事業者情報・アクセス時刻を記録することを事前に表示する。IPの概算地域判定にはipwho.is、地域名の表示補助にはOpen-Meteo Geocoding APIを利用する。IPの地域情報は概算であり、住所や正確な現在地ではない。GPSは訪問者が明示的に許可した場合だけ取得する。隠れた追跡や嫌がらせには使用しない。生年月日・性別などの個人情報は入力しないことを推奨し、未成年者は特に入力しない。


## APIの入力・接続制限（2026-11-13）

- `Origin` ヘッダー付きのブラウザー要求は `https://knotspace.github.io` のみ許可し、それ以外は403で拒否する。
- POSTのJSON本文は実際のバイト数で最大8KiBに制限し、超過時は413を返す。転送先URLは最大2,048文字。
- これらはCORSと入力サイズの制限であり、認証やレート制限の代替ではない。公開APIのレート制限・乱用防止は引き続き確認課題。

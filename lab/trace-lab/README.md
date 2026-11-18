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

- びっくり表示: Cloudflareがリクエストに付与するIP由来の国・地域・市区町村・ネットワーク組織情報を表示する。
- URL転送: 作成者が指定したHTTP/HTTPS URLへ転送する。
- アクセス記録: 管理キーで保護された一覧。IPアドレス、推定地域、ネットワーク組織、アクセス時刻を記録する。
- GPS: 訪問者が自分でボタンを押し、ブラウザーで許可した場合のみ送信する。
- 任意メッセージ: 訪問者が任意で入力する。氏名・住所・連絡先などの個人情報は入力しないよう案内する。
- 生年月日・性別は現在のフォーム/APIでは収集しない。
- リンクとアクセス記録は発行から24時間経過後に削除対象となる。削除処理は毎時実行のため、実際の削除まで最大約25時間かかる場合がある。メッセージ・GPS情報もアクセス記録と一緒に削除される。

## 同意と収集データ（2026-11-18）

- 共有URLを開いただけではアクセス記録を作成しない。訪問者が説明を確認し、「同意して続ける」を押した後に記録する。
- 記録する項目は、IPアドレス、Cloudflare由来の国・地域・市区町村・ネットワーク組織情報、アクセス時刻。
- IPアドレスを外部のIP・住所検索サービスへ送信しない。
- GPS座標は別操作とブラウザー許可が必要。許可しない場合は取得しない。
- メッセージは任意。個人を特定できる情報を入力しないよう画面で案内する。
- 管理キーを持つリンク作成者は、同意後に保存されたアクセス記録を確認できる。管理キーや制作者専用URLを第三者に共有しない。

## APIの入力・接続制限（2026-11-13）

- `Origin` ヘッダー付きのブラウザー要求は `https://knotspace.github.io` のみ許可し、それ以外は403で拒否する。
- POSTのJSON本文は実際のバイト数で最大8KiBに制限し、超過時は413を返す。転送先URLは最大2,048文字。
- CORSと入力サイズ制限に加えて、IPハッシュを使うAPIレート制限を適用する。ただしアプリケーション側の基本制限であり、CloudflareのWAF・ネットワーク層Rate Limiting Rulesの代替ではない。

## APIのレート制限（2026-11-18）

- 作成APIはIPごとに15分8回、アクセス記録APIは15分30回、メッセージ送信APIは15分10回、GPS送信APIは15分5回、制作者用記録APIは15分30回に制限する。
- IPアドレスはレート制限キーのSHA-256ハッシュに変換して保存し、レート制限テーブルには生IPを保存しない。
- 上限超過時はHTTP 429とRetry-Afterを返す。レート制限カウンターは有効期限後に定期削除する。
- これはD1を使ったアプリケーション側の基本制限であり、Cloudflareのネットワーク層WAF・Rate Limiting Rulesの代替ではない。大規模な攻撃への耐性を保証しない。

## 地域情報の取得方法（2026-11-18）

訪問元のIPアドレスと地域情報はCloudflare Workerの `request.cf` メタデータから取得する。外部のIP・住所検索APIへの送信は行わない。市区町村名はCloudflareが返す表記をそのまま表示するため、英語表記になる場合がある。都道府県名のみローカル辞書で日本語化する。

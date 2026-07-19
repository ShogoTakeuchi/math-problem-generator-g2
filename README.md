# さんすう島 — 小学2年生の計算れんしゅう

小学2年生向けの計算練習Webアプリです。1コース10問で、次の4種類を練習できます。

- 2桁どうし・答えが2桁の、繰り上がりがある足し算
- 2桁どうし・答えが正の数の、繰り下がりがある引き算
- 1〜9の九九
- 九九の範囲で解ける、余りのない割り算

練習結果はブラウザの `localStorage` に保存します。サーバーやアカウント登録は不要です。

## 技術構成

- React 19
- React Router v8（SPA / Declarative mode）
- TypeScript
- Vite 8
- Tailwind CSS v4
- Bun

## ローカル開発

```sh
bun install
bun run dev
```

主なコマンド:

```sh
bun test          # 問題生成ルールのテスト
bun run typecheck # TypeScriptの型チェック
bun run build     # 本番ビルド
bun run preview   # 本番ビルドのローカル確認
```

## Cloudflare Pagesへの公開

Cloudflare DashboardでこのGitHubリポジトリをPagesプロジェクトとして接続し、次の値を指定します。

| 項目 | 値 |
|---|---|
| Production branch | `main` |
| Build command | `bun run build` |
| Build output directory | `dist` |

Cloudflare Pagesは、トップレベルの `404.html` がない静的ReactアプリをSPAとして扱います。そのため、`/practice/addition` などのURLへ直接アクセスした場合も `index.html` にフォールバックします。

## ディレクトリ

```text
src/
├── components/       # 共通の装飾・ブランド表示
├── lib/              # 問題生成と学習記録
├── pages/            # コース選択・練習画面
├── App.tsx           # ルーティング
└── styles.css        # Tailwind CSS v4 + アプリ固有スタイル
```

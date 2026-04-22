# 📄 デュエメイト 仕様書（MVP版・依存関係順）

---

## ■ 1. アプリ概要

* アプリ名：デュエメイト

* 目的：
  デュエル・マスターズの対戦結果を記録し、レーティングおよびランキングを可視化する

* ターゲット：
  デュエル・マスターズプレイヤー（主に日本）

* 解決する課題：

  * 対戦結果が記録・蓄積されない
  * プレイヤーの実力を定量的に比較できない

---

## ■ 2. MVP機能

* ユーザー登録 / ログイン
* 対戦結果の記録（双方入力方式）
* レーティング表示
* ランキング表示

---
了解。そのフォーマットに合わせて、修正内容を反映した確定版を出す👇

---

了解。そのフォーマットに合わせて、修正内容を反映した確定版を出す👇

---

## ■ 3. データ設計（最優先）

### users

* id
* name
* email（UNIQUE, NOT NULL）
* password
* rating（初期1500）
* match_count（confirmed試合のみ）
* created_at
* updated_at
* is_active

---

### matches

matches

- id
- player1_id
- player2_id
- created_by

- player1_score
- player2_score

- player1_submitted_at
- player2_submitted_at

- status（pending / reported / confirmed / disputed / cancelled）

- winner_id（NULL可）

- is_rating_applied

- created_at
- updated_at

---

#### ■ 制約

* player1_id != player2_id
* 各プレイヤーは1回のみ結果入力可能（アプリ側で制御）

---

### rating_logs（任意・推奨）

* id
* user_id
* match_id
* change_amount
* old_rating（推奨）
* new_rating（推奨）
* created_at

---




## ■ 4. 試合結果入力仕様

各プレイヤーは以下から選択：

* win（勝利）
* lose（敗北）
* draw（引き分け）
* invalid（無効試合）

※ ログインユーザーは「自分の結果のみ」入力可能
※ 同一ユーザーによる複数回入力は禁止

---

## ■ 5. 試合状態（status）

| 状態        | 説明               |
| --------- | ---------------- |
| pending   | 片方または両方未入力       |
| confirmed | 両者一致（勝敗 or 引き分け） |
| cancelled | 無効試合（invalid一致）  |
| disputed  | 入力不一致            |

---

## ■ 6. 判定ロジック

※ 判定処理は「result入力API実行時」に毎回実行する

### ■ 処理ルール

- 片方のみ結果入力されている場合
  → status = pending のまま

- 両プレイヤーの結果が揃った場合のみ以下を適用

  - win / lose が対応して一致 → confirmed（勝敗確定）
  - draw 同士 → confirmed（引き分け）
  - invalid 同士 → cancelled
  - それ以外 → disputed

---

## ■ 7. 対戦フロー（重要）

① 対戦作成
↓
② 各プレイヤーが「自分の結果のみ」入力（1人1回まで）
↓
③ 判定（上記ロジック適用）

---

## ■ 8. レーティング仕様

* 初期値：1500
* 勝利：+10
* 敗北：-10
* 引き分け：変動なし

### ■ 更新ルール（重要）

- rating更新は「POST /api/matches/:id/result」内で実行する
- statusがconfirmedに変化した瞬間に1回のみ実行
- is_rating_applied = false の場合のみ実行可能
- rating更新後、is_rating_applied を true に更新
- cancelled / disputed は更新対象外

※ rating更新は判定処理と同一トランザクション内で実行する

---

## ■ 9. ランキング仕様

* ソート：レーティング降順
* 表示：上位100人
* 条件：

  * confirmed試合数が10以上

---


## ■ 10. API設計

### 認証

* POST /api/auth/register
  → ユーザー登録

* POST /api/auth/login
  → ログイン処理

---

### 試合

* POST /api/matches
  → 対戦作成（created_byにログインユーザー）
  → status = pending で作成

---

* POST /api/matches/:id/result
  → 自分の結果のみ送信（1ユーザー1回のみ）

#### ■ 責務

このAPIは以下の処理を一貫して行う：

1. ログインユーザーのresultを保存
2. 既に自分のresultが存在する場合はエラー
3. 判定ロジックを実行（毎回実行）
4. 両プレイヤーのresultが揃っている場合のみstatusを更新（既に確定済みの場合は更新しない）
5. statusがconfirmedに変化し、かつis_rating_applied=falseの場合のみrating更新を実行
6. rating更新後、is_rating_appliedをtrueに更新

※ 上記処理は1トランザクションで実行する

---

### データ取得

* GET /api/users/me
  → 自分のユーザー情報を取得

* GET /api/ranking
  → ランキング情報取得（rating降順・条件付き）

---

## ■ 11. 非機能要件（最低限）

* 認証ユーザーのみ操作可能
* 他人の試合を編集不可
* レスポンスが極端に遅くならない
* 不正入力の防止（自己対戦禁止など）

---

## ■ 12. 運用ルール

* disputed状態の試合は一定期間後に自動cancelledへ変更（将来対応）

---

## ■ 13. 技術構成

* フロントエンド：Next.js（TypeScript）
* バックエンド：Next.js API Routes
* データベース：PostgreSQL（Supabase）
* 認証：Supabase Auth

---

## ■ 14. 将来拡張

* QRコードによる対戦作成
* Eloレーティング導入
* 不正検知機能
* フレンド機能

---

## ■ 15. UI（最後）

### ・ログイン画面

* メール・パスワードでログイン

### ・登録画面

* ユーザー新規登録

### ・マイページ

* レーティング表示
* 試合数・戦績表示（confirmed試合のみ）

### ・対戦記録画面

* 対戦相手選択
* 試合結果入力

---

### 補足（重要な指摘）

今回の並びはかなり良いが、まだ一つだけ弱点がある。

👉 **「APIの前にユースケース（操作単位）」が無い**


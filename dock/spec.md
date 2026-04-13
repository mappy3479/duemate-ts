# 📄 デュエメイト 仕様書（MVP版・修正版）

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

## ■ 3. 画面一覧

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

## ■ 4. 対戦フロー（重要）

① 対戦作成
↓
② 各プレイヤーが「自分の結果のみ」入力（1人1回まで）
↓
③ 判定

* 一致 → confirmed（確定）
* 不一致 → disputed
* 両者invalid → cancelled

---

## ■ 5. 試合結果入力仕様

各プレイヤーは以下から選択：

* win（勝利）
* lose（敗北）
* draw（引き分け）
* invalid（無効試合）

※ ログインユーザーは「自分の結果のみ」入力可能
※ 同一ユーザーによる複数回入力は禁止

---

## ■ 6. 試合状態（status）

| 状態        | 説明               |
| --------- | ---------------- |
| pending   | 片方または両方未入力       |
| confirmed | 両者一致（勝敗 or 引き分け） |
| cancelled | 無効試合（invalid一致）  |
| disputed  | 入力不一致            |

---

## ■ 7. 判定ロジック

* win / lose が対応して一致 → 勝敗確定
* draw 同士 → 引き分け確定
* invalid 同士 → cancelled
* それ以外 → disputed

---

## ■ 8. レーティング仕様

* 初期値：1500
* 勝利：+10
* 敗北：-10
* 引き分け：変動なし

### ■ 更新ルール（重要）

* rating更新は「statusがconfirmedに変化した瞬間」に1回のみ実行
* 同一試合による重複更新は禁止
* disputed → confirmed に変化した場合のみ更新対象
* cancelled は更新対象外

---

## ■ 9. ランキング仕様

* ソート：レーティング降順
* 表示：上位100人
* 条件：

  * confirmed試合数が10以上

---

## ■ 10. データ設計

### users

* id
* name
* email
* password
* rating（初期1500）
* match_count（confirmed試合のみ）
* created_at
* updated_at
* is_active

---

### matches

* id
* player1_id
* player2_id
* created_by（作成者）
* player1_result
* player2_result
* player1_submitted_at
* player2_submitted_at
* status
* winner_id
* is_rating_applied（重複防止）
* created_at
* updated_at

### ■ 制約

* player1_id != player2_id
* 各プレイヤーは1回のみ結果入力可能

---

### rating_logs（任意・推奨）

* id
* user_id
* match_id
* change_amount
* created_at

---

## ■ 11. API設計

### 認証

* POST /api/auth/register
* POST /api/auth/login

---

### 試合

* POST /api/matches
  → 対戦作成（created_byにログインユーザー）

* POST /api/matches/:id/result
  → 自分の結果のみ送信
  → 1ユーザー1回のみ

---

### データ取得

* GET /api/users/me
* GET /api/ranking

---

## ■ 12. 技術構成

* フロントエンド：Next.js（TypeScript）
* バックエンド：Next.js API Routes
* データベース：PostgreSQL（Supabase）
* 認証：Supabase Auth

---

## ■ 13. 非機能要件（最低限）

* 認証ユーザーのみ操作可能
* 他人の試合を編集不可
* レスポンスが極端に遅くならない
* 不正入力の防止（自己対戦禁止など）

---

## ■ 14. 運用ルール

* disputed状態の試合は一定期間後に自動cancelledへ変更（将来対応）

---

## ■ 15. 将来拡張

* QRコードによる対戦作成
* Eloレーティング導入
* 不正検知機能
* フレンド機能

---

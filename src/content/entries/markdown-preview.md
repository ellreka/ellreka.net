---
date: "2026-10-25"
title: "Markdown の表示確認"
description: "見出し・リスト・コードなど、記事で使う記法をひととおり並べた表示確認用のページです。"
tags: ["Markdown", "Preview"]
draft: true
---

記事で使う Markdown の記法をひととおり並べた、表示確認用のページです。`draft: true` なので本番には出ません。

[[toc]]

## 見出し

見出しは h2 から h4 まで使います。h1 は記事のタイトルにだけ使います。

### 見出し 3

本文の段落です。見出しの前は広めに、後ろは段落と同じ間隔で空けます。

#### 見出し 4

本文の段落です。

## 段落とインライン

ふつうの段落です。日本語と English が混ざった文章や、長い URL を含む文章でも読みやすく折り返されるかを確認します。行間は少し広めにしています。

2 つ目の段落です。
同じ段落の中で改行すると、半角スペースのように続けて表示されます。

**太字**、_斜体_、~~取り消し線~~、`インラインコード`、[リンク](https://ellreka.net/)、<kbd>Cmd</kbd> + <kbd>K</kbd>、<mark>ハイライト</mark> を混ぜた文章です。H<sub>2</sub>O や x<sup>2</sup> も書けます。

単独の URL は自動でリンクになります。

<https://github.com/ellreka>

絵文字のショートコードは Unicode に変わります :tada: :rocket:

脚注を付けた文です。[^1] もう 1 つ脚注を付けます。[^note]

## リスト

### 箇条書き

- 1 つ目の項目
- 2 つ目の項目。長い文章が折り返されたときに、2 行目が記号ではなく本文の位置にそろうかを確認します。
- 入れ子のリスト
  - 入れ子の 1 つ目
  - 入れ子の 2 つ目
    - さらに入れ子

### 番号付き

1. 手順の 1 つ目
2. 手順の 2 つ目
3. 手順の 3 つ目
   1. 入れ子の番号付き
   2. 入れ子の番号付き

### 段落を含むリスト

- 項目の中に段落があるリストです。

  2 つ目の段落も項目の中に入ります。

- 次の項目です。

## 引用

> 引用の段落です。出典を書くときは最後の行にリンクを置きます。
>
> 2 つ目の段落です。[ellreka.net](https://ellreka.net/) より

> 引用の中に入れ子の引用を書きます。
>
> > 入れ子の引用です。

## アラート

> [!NOTE]
> 補足の情報です。

> [!TIP]
> 便利な使い方です。

> [!IMPORTANT]
> 大事な情報です。

> [!WARNING]
> 注意が必要なことです。

> [!CAUTION]
> 危険な操作です。

## コンテナ

::: tip
ヒントです。
:::

::: info
補足です。
:::

::: warning
注意です。
:::

::: danger
危険です。
:::

::: tip タイトル付きのヒント
タイトルを変えたコンテナです。
:::

::: details クリックで開く
折りたたまれた内容です。
:::

## コード

言語を指定したコードブロックです。

```ts
type Entry = {
  title: string;
  date: string;
  tags: string[];
};

export function formatDate(date: string): string {
  return date.slice(0, 10);
}
```

シェルのコマンドです。

```sh
pnpm install
pnpm dev
```

横に長い行は横スクロールします。

```sh
curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | bash -s -- --a-very-long-option-name --another-very-long-option-name
```

言語の指定が無いコードブロックです。

```
plain text
  インデントも そのまま
```

### 行のハイライト

```ts {1,3-4}
const a = 1;
const b = 2;
const c = 3;
const d = 4;
```

### 差分・フォーカス・エラー

```ts
export function hello() {
  console.log("old"); // [!code --]
  console.log("new"); // [!code ++]
  console.log("look here"); // [!code focus]
  console.log("problem"); // [!code error]
  console.log("careful"); // [!code warning]
}
```

### 行番号

```ts :line-numbers
const a = 1;
const b = 2;
const c = 3;
```

```ts :line-numbers=10
const start = 10;
const next = 11;
```

## 表

| 記法   |    書き方    |     備考 |
| :----- | :----------: | -------: |
| 太字   |  `**text**`  |   左寄せ |
| 斜体   |   `_text_`   | 中央寄せ |
| コード | `` `code` `` |   右寄せ |

## 画像と動画

![キーボードの写真](https://assets.ellreka.net/qmk-input-jp.png)

<video src="https://assets.ellreka.net/copy-selected-tabs-url.mp4" controls></video>

## 区切り線

区切り線の前の段落です。

---

区切り線の後の段落です。

## 属性

クラスを付けた段落です。 {.custom-class}

[^1]: 脚注の本文です。

[^note]: 名前を付けた脚注です。

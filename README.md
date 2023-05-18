# StableSpellWizard
Stable Diffusionを使うための呪文生成器です

## インストール
```
npm install
```

## 実行
```
npm run build-start
```

# 使い方
1. ドロップダウンで追加したい呪文のカテゴリを選ぶ
2. 表示されるリストないから追加したいものを選ぶ（複数選択可）
3. Add Prompt/Add negativePromptボタンを押下して、呪文を追加する
    - Add Prompt：prompt listに追加
    - Add negativePrompt：Negative listに追加
4. 追加したいものを追加しきったら、各リストの上にあるcopy clip bordボタンを押下
5. クリップボードに、各リストに追加されてある順番で、該当する英単語が","区切りで連結されたものがコピーされる
6. Stable Diffusionに貼り付ける

## その他機能

### リスト
項目の並び替えに対応してます。  
要素を選択して、ドラッグアンドドロップで、順序が変えられます

## word.jsonについて
ワードを追加したい場合、word.jsonを編集してください。  
提供しているword.jsonは、過激なエロワードを載せてません。  


// import * as dictJson from "./word.json";
import { loadJSON } from "./utils";

window.onload = async () => {
  let categorySelectEl = <HTMLSelectElement>document.getElementById("category");

  let word = await loadJSON<any>("./word.json");
  word.dict
    .map((el: { category: any }) => el.category)
    .forEach((category: string) => {
      console.log(category);
      categorySelectEl.add(createCategoryOption(category));
    });

  // ワードリストを初期化
  updateWordSelect();

  // カテゴリ選択時にワードリストを更新する
  categorySelectEl.addEventListener("change", async (ev) => {
    updateWordSelect();
  });

  document.getElementById("addPrompt")?.addEventListener("click", () => {
    let options = (<HTMLSelectElement>document.getElementById("wordList"))
      .selectedOptions;
    let prompt = <HTMLDivElement>document.getElementById("prompt");

    addOptionsForPrompt(options, prompt);
  });
  document.getElementById("addNegative")?.addEventListener("click", () => {
    let options = (<HTMLSelectElement>document.getElementById("wordList"))
      .selectedOptions;
    let prompt = <HTMLDivElement>document.getElementById("negativePrompt");
    addOptionsForPrompt(options, prompt);
  });

  document.getElementById("clipPrompt")?.addEventListener("click", () => {
    let prompt = <HTMLDivElement>document.getElementById("prompt");
    let str = Array.from(prompt.children)
      .map((el) => <HTMLDivElement>el)
      .map((el) => el.dataset.prompt)
      .join(",");

    copyClipBoard(str);
  });
  document.getElementById("clipNegative")?.addEventListener("click", () => {
    let prompt = <HTMLDivElement>document.getElementById("negativePrompt");
    let str = Array.from(prompt.children)
      .map((el) => <HTMLDivElement>el)
      .map((el) => el.dataset.prompt)
      .join(",");

    copyClipBoard(str);
  });
};

/**
 * 呪文の追加
 * @param options
 * @param prompt
 */
function addOptionsForPrompt(
  options: HTMLCollectionOf<HTMLOptionElement>,
  prompt: HTMLDivElement
) {
  Array.from(options)
    .filter((option) => {
      if (prompt.children.length === 0) return true;

      // ２重登録の防止
      return Array.from(prompt.children)
        .filter((el) => el.tagName.toLowerCase() === "div")
        .map((el) => <HTMLDivElement>el)
        .some((el) => el.innerText !== option.value);
    })
    .map((option) => {
      let tmpEl = document.createElement("div");
      tmpEl.innerText = option.value;
      tmpEl.dataset.prompt = option.dataset.prompt;
      prompt.appendChild(tmpEl);
    });
}

async function updateWordSelect() {
  let categorySelectEl = <HTMLSelectElement>document.getElementById("category");

  let wordSelectEl = <HTMLSelectElement>document.getElementById("wordList");
  while (wordSelectEl.firstChild) {
    wordSelectEl.removeChild(wordSelectEl.firstChild);
  }

  let word = await loadJSON<any>("./word.json");
  word.dict
    .filter((el: { category: any }) => categorySelectEl.value === el.category)
    .map((el: { wordList: [] }) => createWordOption(el.wordList))
    .forEach((el: HTMLOptionElement[]) => {
      el.forEach((opt) => wordSelectEl.add(opt));
    });
}

/**
 * categoryのoptionを生成する
 * @param opt
 * @returns HTMLOptionElement
 */
function createCategoryOption(opt: string) {
  let option = document.createElement("option");
  option.value = opt;
  option.innerText = opt;
  return option;
}

/**
 * wordListのoptionを生成する
 * @param wordList
 * @returns HTMLOptionElement
 */
function createWordOption(wordList: []): HTMLOptionElement[] {
  return wordList.map((word: { jp: string; en: string }) => {
    let option = document.createElement("option");
    option.value = word.jp;
    option.innerText = word.jp;
    option.dataset.prompt = word.en;
    return option;
  });
}

function copyClipBoard(text: string) {
  // テキストをクリップボードにコピーする
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("コピーが成功しました");
    })
    .catch((err) => {
      console.error("コピーが失敗しました:", err);
    });
}
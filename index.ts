// import * as dictJson from "./word.json";
import { loadJSON } from "./utils";
import Sortable from "sortablejs";

window.onload = async () => {
  let categorySelectEl = <HTMLSelectElement>document.getElementById("category");

  let word = await loadJSON<any>("./word.json");
  word.dict
    .map((el: { category: any }) => el.category)
    .forEach((category: string) => {
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

    addOptionsForPrompt(options, prompt, "bg-primary");
  });
  document.getElementById("addNegative")?.addEventListener("click", () => {
    let options = (<HTMLSelectElement>document.getElementById("wordList"))
      .selectedOptions;
    let prompt = <HTMLDivElement>document.getElementById("negativePrompt");
    addOptionsForPrompt(options, prompt, "bg-danger");
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

  let sortEl = document.getElementById("prompt")!;
  Sortable.create(sortEl);
  let sortNegativeEl = <HTMLDivElement>(
    document.getElementById("negativePrompt")
  );
  Sortable.create(sortNegativeEl);
};

/**
 * 呪文の追加
 * @param options
 * @param prompt
 */
function addOptionsForPrompt(
  options: HTMLCollectionOf<HTMLOptionElement>,
  prompt: HTMLDivElement,
  kinds: "bg-primary" | "bg-danger"
) {
  Array.from(options)
    .filter((option) => {
      if (prompt.children.length === 0) {
        return true;
      }

      // ２重登録の防止
      return !Array.from(prompt.children)
        .filter((el) => el.tagName.toLowerCase() === "div")
        .map((el) => <HTMLDivElement>el)
        .some((el) => el.innerText === option.value);
    })
    .map((option) => {
      let closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.classList.add("btn-close", "ms-auto");
      closeBtn.ariaLabel = "Close";
      closeBtn.addEventListener("click", (ev) => {
        let pEl = closeBtn.parentElement;
        pEl?.remove();
      });

      let tmpEl = document.createElement("div");
      tmpEl.innerText = option.value;
      tmpEl.dataset.prompt = option.dataset.prompt;
      tmpEl.classList.add(
        "p-3",
        "mb-2",
        kinds,
        "text-white",
        "d-flex",
        "justify-content-between"
      );
      prompt.appendChild(tmpEl);
      tmpEl.appendChild(closeBtn);
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

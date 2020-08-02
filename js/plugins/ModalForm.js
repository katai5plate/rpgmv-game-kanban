(() => {
  const html = str => {
    const el = document.createElement("div");
    el.innerHTML = str.join("\n");
    return el.firstElementChild;
  };
  document.body.appendChild(
    html([
      `<dialog id="modal">`,
      `<p id="modal_info"></p>`,
      `<p>`,
      `<input id="modal_text" style="width: 100%;"`,
      `                       onchange="window.modal.onInputChange()" `,
      `                       onkeydown="window.modal.onInputChange()" />`,
      `</p>`,
      `<p>`,
      `<button id="modal_button" onclick="(async () => await window.modal.submit())()">　決定　</button>`,
      `<button id="modal_cancel" onclick="window.modal.close()">やめる</button>`,
      `</p>`,
      `<p id="modal_valid" style="color: red;"></p>`,
      `</dialog>`
    ])
  );
  document.body.appendChild(
    html([
      `<dialog id="citizenModal">`,
      `<p id="citizenModal_info"></p>`,
      `<p>`,
      `<input id="citizenModal_text" style="width: 100%;"`,
      `                       onchange="window.citizenModal.onInputChange()" `,
      `                       onkeydown="window.citizenModal.onInputChange()" />`,
      `</p>`,
      `<p>`,
      `<button id="citizenModal_button" onclick="(async () => await window.citizenModal.submit())()">　決定　</button>`,
      `<button id="citizenModal_cancel" onclick="window.citizenModal.close()">やめる</button>`,
      `</p>`,
      `<p id="citizenModal_valid" style="color: red;"></p>`,
      `</dialog>`
    ])
  );
  class Modal {
    constructor(infoMessage, isCitizen) {
      this.isActive = false;
      this.infoMessage = infoMessage;
      this.isCitizen = isCitizen;
      this.triggerSwitchId = null;
      if (isCitizen) {
        this.body = document.getElementById("citizenModal");
        this.info = document.getElementById("citizenModal_info");
        this.input = document.getElementById("citizenModal_text");
        this.button = document.getElementById("citizenModal_button");
        this.cancel = document.getElementById("citizenModal_cancel");
        this.valid = document.getElementById("citizenModal_valid");
      } else {
        this.body = document.getElementById("modal");
        this.info = document.getElementById("modal_info");
        this.input = document.getElementById("modal_text");
        this.button = document.getElementById("modal_button");
        this.cancel = document.getElementById("modal_cancel");
        this.valid = document.getElementById("modal_valid");
      }
      this.body.addEventListener("cancel", event => event.preventDefault());
      ["mousedown", "touchstart", "click"].forEach(x =>
        this.body.addEventListener(x, e => e.stopPropagation())
      );
      this.init();
    }
    init() {
      this.info.innerText = this.infoMessage;
      this.valid.innerText = "";
      this.input.value = "";
      [this.info, this.input, this.button, this.cancel, this.valid].forEach(
        x => {
          x.disabled = false;
        }
      );
      this.onInputChange();
    }
    open(triggerSwitchId) {
      this.isActive = true;
      this.triggerSwitchId = triggerSwitchId;
      $gameSwitches.setValue(this.triggerSwitchId, false);
      this.init();
      this.body.showModal();
    }
    close() {
      this.isActive = false;
      $gameSwitches.setValue(this.triggerSwitchId, true);
      this.body.close();
    }
    updateButton(active) {
      if (active) {
        this.button.disabled = false;
        return;
      }
      this.button.disabled = true;
    }
    onInputChange() {
      const result = this.isCitizen
        ? window.api.validateKanban(this.input.value, 22)
        : window.api.validateKanban(this.input.value);
      if (typeof result === "number" || result < 0) {
        this.updateButton(false);
        if (result === -1) {
          this.valid.innerText = "文字列のサイズが大きすぎます。";
          return;
        }
        if (result === -2) {
          this.valid.innerText = "文字列が短すぎます。";
          return;
        }
        if (result === -3) {
          this.valid.innerText = "文字列が長すぎます。";
          return;
        }
      }
      this.updateButton(true);
      this.valid.innerText = "";
    }
    async submit() {
      const value = window.api.validateKanban(this.input.value);
      if (typeof value === "number" || value < 0) {
        window.api.through("無効な入力値です: " + value);
        return this.close();
      }
      [this.input, this.button, this.cancel].forEach(x => {
        x.disabled = true;
      });
      this.info.innerText = "しばらくお待ちください・・・";
      if (!this.isCitizen) {
        try {
          await window.api.setSignal(
            $gameMap._mapId,
            $gamePlayer.x,
            $gamePlayer.y,
            value
          );
        } catch (e) {
          console.log(e);
        }
      } else {
        window.api.addCitizen(
          $gameMap._mapId,
          $gamePlayer.x,
          $gamePlayer.y,
          value
        );
      }
      return this.close();
    }
  }
  window.modal = new Modal("看板に入力する文章を決めてください。", false);
  window.citizenModal = new Modal(
    "住民の幽霊のセリフを決めてください\n※ 幽霊はゲームを閉じると消えてしまいます。\n※ 場所移動するごとに姿まで変わります。",
    true
  );

  const _onKeyDown = Input._onKeyDown;
  Input._onKeyDown = function(event) {
    if (window.modal.isActive || window.citizenModal.isActive) return;
    _onKeyDown.call(this, event);
  };
  const _onKeyUp = Input._onKeyUp;
  Input._onKeyUp = function(event) {
    if (window.modal.isActive || window.citizenModal.isActive) return;
    _onKeyUp.call(this, event);
  };
})();

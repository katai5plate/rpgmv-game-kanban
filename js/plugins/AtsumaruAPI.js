(() => {
  const createCitizenData = (eventId, x, y, citizenId, message) => ({
    id: eventId,
    name: "EV" + eventId,
    note: "",
    pages: [
      {
        conditions: {
          actorId: 1,
          actorValid: false,
          itemId: 1,
          itemValid: false,
          selfSwitchCh: "A",
          selfSwitchValid: false,
          switch1Id: 1,
          switch1Valid: false,
          switch2Id: 1,
          switch2Valid: false,
          variableId: 1,
          variableValid: false,
          variableValue: 0
        },
        directionFix: false,
        image: {
          tileId: 0,
          characterName: "People1",
          direction: 2,
          pattern: 1,
          characterIndex: citizenId // 0-7
        },
        list: [
          {
            code: 101,
            indent: 0,
            parameters: ["", 0, 1, 1]
          },
          {
            code: 401,
            indent: 0,
            parameters: [
              [
                "少年",
                "少女",
                "青年",
                "町娘",
                "労働者",
                "主婦",
                "老人",
                "老婆"
              ][citizenId]
            ]
          },
          {
            code: 401,
            indent: 0,
            parameters: ["　　　　　" + message] // MAX 22
          },
          {
            code: 0,
            indent: 0,
            parameters: []
          }
        ],
        moveFrequency: 3,
        moveRoute: {
          list: [
            {
              code: 42,
              parameters: [127],
              indent: null
            },
            {
              code: 9,
              indent: null
            },
            {
              code: 0,
              parameters: []
            }
          ],
          repeat: true,
          skippable: false,
          wait: false
        },
        moveSpeed: 3,
        moveType: 3,
        priorityType: 1,
        stepAnime: false,
        through: false,
        trigger: 0,
        walkAnime: true
      }
    ],
    x,
    y,
    meta: {}
  });
  const createKanbanData = (eventId, x, y, username, message) => ({
    id: eventId,
    name: "EV" + eventId,
    note: "",
    pages: [
      {
        conditions: {
          actorId: 1,
          actorValid: false,
          itemId: 1,
          itemValid: false,
          selfSwitchCh: "A",
          selfSwitchValid: false,
          switch1Id: 1,
          switch1Valid: false,
          switch2Id: 1,
          switch2Valid: false,
          variableId: 1,
          variableValid: false,
          variableValue: 0
        },
        directionFix: false,
        image: {
          tileId: 842,
          characterName: "",
          characterIndex: 0,
          direction: 2,
          pattern: 0
        },
        list: [
          { code: 101, indent: 0, parameters: ["", 0, 0, 1] },
          { code: 401, indent: 0, parameters: [username] },
          ...(x => {
            const template = text => ({
              code: 401,
              indent: 0,
              parameters: [`　　　　　${text}`]
            });
            return x.length > 15
              ? [template(x.slice(0, 15)), template(x.slice(15))]
              : [template(x)];
          })(message),
          {
            code: 102,
            indent: 0,
            parameters: [["閉じる", "お邪魔"], 0, 0, 2, 0]
          },
          { code: 402, indent: 0, parameters: [0, "閉じる"] },
          { code: 0, indent: 1, parameters: [] },
          { code: 402, indent: 0, parameters: [1, "お邪魔"] },
          {
            code: 205,
            indent: 1,
            parameters: [
              -1,
              {
                list: [
                  {
                    code: 44,
                    parameters: [
                      { name: "Jump1", volume: 90, pitch: 100, pan: 0 }
                    ],
                    indent: null
                  },
                  { code: 37, indent: null },
                  { code: 12, indent: null },
                  { code: 38, indent: null },
                  { code: 0 }
                ],
                repeat: false,
                skippable: false,
                wait: true
              }
            ]
          },
          {
            code: 505,
            indent: 1,
            parameters: [
              {
                code: 44,
                parameters: [{ name: "Jump1", volume: 90, pitch: 100, pan: 0 }],
                indent: null
              }
            ]
          },
          { code: 505, indent: 1, parameters: [{ code: 37, indent: null }] },
          { code: 505, indent: 1, parameters: [{ code: 12, indent: null }] },
          { code: 505, indent: 1, parameters: [{ code: 38, indent: null }] },
          { code: 0, indent: 1, parameters: [] },
          { code: 404, indent: 0, parameters: [] },
          { code: 0, indent: 0, parameters: [] }
        ],
        moveFrequency: 3,
        moveRoute: {
          list: [{ code: 0, parameters: [] }],
          repeat: true,
          skippable: false,
          wait: false
        },
        moveSpeed: 3,
        moveType: 0,
        priorityType: 1,
        stepAnime: false,
        through: false,
        trigger: 0,
        walkAnime: true
      }
    ],
    x,
    y,
    meta: {}
  });
  const createCitizen = (mapId, x, y, message) => {
    const eventId = $gameMap._events.length;
    $dataMap.events[eventId] = createCitizenData(
      eventId,
      x,
      y,
      (Math.random() * 8) | 0,
      message
    );
    $gameMap._events[eventId] = new Game_Event(mapId, eventId);
    const sprite = SceneManager._scene._spriteset;
    sprite._characterSprites.push(
      new Sprite_Character($gameMap._events[eventId])
    );
    sprite._tilemap.addChild(
      sprite._characterSprites[sprite._characterSprites.length - 1]
    );
    $gameMap._events[eventId].locate(x, y);
  };
  const createKanban = (mapId, x, y, username, message) => {
    const eventId = $gameMap._events.length;
    $dataMap.events[eventId] = createKanbanData(
      eventId,
      x,
      y,
      username,
      message
    );
    $gameMap._events[eventId] = new Game_Event(mapId, eventId);
    const sprite = SceneManager._scene._spriteset;
    sprite._characterSprites.push(
      new Sprite_Character($gameMap._events[eventId])
    );
    sprite._tilemap.addChild(
      sprite._characterSprites[sprite._characterSprites.length - 1]
    );
    $gameMap._events[eventId].locate(x, y);
  };
  const error = (a, b) => {
    console.error(a, b);
    SceneManager.stop();
    Graphics.printError(a, b);
    AudioManager.stopAll();
  };
  const through = (a, e = undefined) => {
    console.error(e === undefined ? a : e);
    alert(a);
  };
  const tryit = async (fn, triggerSwitchId, onError) => {
    triggerSwitchId && $gameSwitches.setValue(triggerSwitchId, false);
    try {
      const res = await fn();
      triggerSwitchId && $gameSwitches.setValue(triggerSwitchId, true);
      return res;
    } catch (e) {
      throw onError(e);
    }
  };
  const convertData = (id, x, y, message) =>
    `${id.padZero(2)}${x.padZero(2)}${y.padZero(2)}${message}`;
  const dateToTimestamp = d => parseInt(d / 1000);
  const timestampToDate = t => new Date(t * 1000);
  const getByte = t => new TextEncoder("utf-8").encode(t).length;
  const escapeHTML = str =>
    str.replace(
      /[&<>'"]/g,
      tag =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;"
        }[tag] || tag)
    );
  window.api = {
    cacheAllSignals: [],
    localCitizen: [],
    dateToTimestamp,
    timestampToDate,
    getByte,
    error,
    tryit,
    through,
    convertData,
    escapeHTML,
    whois: null,
    getWhois: async triggerSwitchId => {
      triggerSwitchId && $gameSwitches.setValue(triggerSwitchId, false);
      const data = await tryit(
        () => window.RPGAtsumaru.experimental.user.getSelfInformation(),
        null,
        console.log
      );
      triggerSwitchId && $gameSwitches.setValue(triggerSwitchId, true);
      window.api.whois = data;
      return data;
    },
    getSignal: async () => {
      const data = await tryit(
        () => window.RPGAtsumaru.experimental.signal.getGlobalSignals(),
        null,
        e => error(["受信に失敗しました・・・", e])
      );
      console.log("受信完了");
      return data.map(d => {
        const [id1, id2, x1, x2, y1, y2] = [...d.data.slice(0, 6)];
        const [id, x, y] = [`${id1}${id2}`, `${x1}${x2}`, `${y1}${y2}`].map(
          Number
        );
        return { ...d, message: d.data.slice(6), mapId: id, x, y };
      });
    },
    generateAllKanban: async (triggerSwitchId, forceReflesh = false) => {
      triggerSwitchId && $gameSwitches.setValue(triggerSwitchId, false);
      const data =
        window.api.cacheAllSignals.length === 0 || forceReflesh
          ? await window.api.getSignal()
          : window.api.cacheAllSignals;
      window.api.cacheAllSignals = data;
      data.forEach(k => {
        if ($gameMap._mapId === k.mapId)
          createKanban(k.mapId, k.x, k.y, k.senderName, k.message);
      });
      triggerSwitchId && $gameSwitches.setValue(triggerSwitchId, true);
    },
    youAreOK: () =>
      window.api.cacheAllSignals.length !== 0 &&
      window.api.whois &&
      window.api.cacheAllSignals.filter(x => x.senderId === window.api.whois.id)
        .length === 0,
    getCountDown: () => {
      const your = window.api.cacheAllSignals.filter(
        x => x.senderId === window.api.whois.id
      )[0];
      return (
        1000 -
        window.api.cacheAllSignals.filter(x => x.createdAt >= your.createdAt)
          .length
      );
    },
    setSignal: async (id, x, y, message, triggerSwitchId) => {
      const fixed = convertData(id, x, y, message);
      await tryit(
        () => window.RPGAtsumaru.experimental.signal.sendSignalToGlobal(fixed),
        null,
        e => through("送信に失敗しました・・・", e)
      );
      await new Promise(r => setTimeout(r, 5000));
      await window.api.generateAllKanban(triggerSwitchId, true);
    },
    validateKanban: (message, maxLength = 31) => {
      const fixed = window.api.escapeHTML(message);
      // 入力データは 94 バイト以内か
      if (window.api.getByte(fixed) > 94) return -1;
      // 入力データは 5 バイト以上か
      if (window.api.getByte(fixed) < 5) return -2;
      // 入力データは 31 文字以内か
      if ([...fixed].length > maxLength) return -3;
      // OK!
      return fixed;
    },
    addCitizen: (id, x, y, message) => {
      window.api.localCitizen.push({ id, x, y, message });
      createCitizen(id, x, y, message);
    },
    spawnAllCitizen: () => {
      window.api.localCitizen.forEach(({ id, x, y, message }) => {
        if ($gameMap._mapId === id) createCitizen(id, x, y, message);
      });
    }
  };
})();

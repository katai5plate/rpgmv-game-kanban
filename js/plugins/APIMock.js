(() => {
  if (window.require === undefined || Utils.isNwjs() !== true) {
    return;
  }
  window.mockSignals = {
    data: new Array(100)
      .fill(0)
      .map(() => ({
        id: (Math.random() * 99999999) | 0,
        senderId: (Math.random() * 99999999) | 0,
        senderName: Math.random()
          .toString(36)
          .slice(2)
          .toUpperCase(),
        data: window.api.convertData(
          (Math.random() * 7 + 2) | 0,
          (Math.random() * 19) | 0,
          (Math.random() * 13) | 0,
          [
            ...Math.random()
              .toString()
              .slice(2)
          ]
            .map(v => "いろはにほへとちりぬ"[v])
            .join("")
        ),
        createdAt: window.api.dateToTimestamp(
          new Date(
            `2020-01-01 ${(Math.random() * 23) | 0}:${(Math.random() * 59) |
              0}:${(Math.random() * 59) | 0}`
          )
        )
      }))
      .sort(({ createdAt: a }, { createdAt: b }) => a - b),
    insert: data => {
      if (window.mockSignals.data.length === 1000) {
        window.mockSignals.data = [...window.mockSignals.data.slice(1), data];
        return;
      }
      window.mockSignals.data = [...window.mockSignals.data, data];
    }
  };
  window.RPGAtsumaru = {
    experimental: {
      user: {
        getSelfInformation: () =>
          Promise.resolve({
            id: 12345678,
            name: "テスター",
            profile: "ほげほげ",
            twitterId: "",
            url: "",
            isPremium: true
          })
      },
      signal: {
        sendSignalToGlobal: data => {
          if (window.api.getByte(data) > 100) {
            return Promise.reject({ code: "BAD_REQUEST" });
          }
          window.mockSignals.insert({
            id: 12345678,
            senderId: 12345678,
            senderName: "名無しさん" + Math.random(),
            data,
            createdAt: window.api.dateToTimestamp(new Date())
          });
          return Promise.resolve();
        },
        getGlobalSignals: () => Promise.resolve(window.mockSignals.data)
      }
    }
  };
})();

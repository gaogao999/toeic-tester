/**
 * 発音 — 端末の英語音声で読み上げる（Web Speech API）。
 *
 * **声の選び方はえいごペットから移した。**端末に入っている英語音声を全部見て、
 * 品質がよさそうな順に並べる（拡張・Premium・Neural → ネットワーク音声 → 定番の声）。
 * ふざけた声（Zarvox・Bahh など）は外す。
 *
 * 注意:
 * - **iPhone は最初の1回に必ずタップが要る。**画面を開いただけで読み上げることはできない
 * - 声の一覧は遅れて届く端末がある。届くまで数秒見張って、届いたら選び直す
 * - ネットワークの声（Google など）はオフラインだと黙る。そのときは端末の声に切り替える
 */
const Speech = (() => {
  const GOOD = /(enhanced|premium|neural|natural|siri)/i;
  const NICE = ['Ava', 'Allison', 'Samantha', 'Susan', 'Zoe', 'Evan', 'Nathan', 'Noelle', 'Joelle', 'Nicky',
    'Aaron', 'Tom', 'Alex', 'Serena', 'Daniel', 'Kate', 'Oliver', 'Stephanie', 'Malcolm', 'Jamie', 'Karen',
    'Lee', 'Matilda', 'Moira', 'Tessa', 'Rishi', 'Google US English', 'Google UK English', 'Aria', 'Jenny',
    'Guy', 'Michelle', 'Christopher', 'Eric', 'Libby', 'Ryan', 'Sonia', 'Natasha', 'William'];
  const BAD = /(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|organ|princess|ralph|superstar|trinoids|whisper|wobble|zarvox|fred|bruce|agnes|kathy|victoria|eloquence|reed|rocko|sandy|shelley|grandma|grandpa|flo|eddy|compact)/i;

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  let chosen = null;
  let onChange = () => {};

  const all = () => (supported ? speechSynthesis.getVoices() : []).filter((v) => /^en[-_]?/i.test(v.lang));

  function usable(v) {
    const n = v.name || '';
    if (BAD.test(n)) return false;
    if (GOOD.test(n)) return true;
    if (v.localService === false) return true;
    return NICE.some((x) => n.includes(x));
  }

  function score(v) {
    const n = v.name || '';
    let s = 0;
    if (GOOD.test(n)) s += 100;
    if (v.localService === false) s += 40;
    const i = NICE.findIndex((x) => n.includes(x));
    if (i >= 0) s += NICE.length - i;
    if (/en[-_]US/i.test(v.lang)) s += 6;
    else if (/en[-_]GB/i.test(v.lang)) s += 4;
    return s;
  }

  /** 選べる声。品質のよさそうな順 */
  function voices() {
    const a = all();
    const good = a.filter(usable);
    return (good.length ? good : a).slice().sort((x, y) => score(y) - score(x));
  }

  function label(v) {
    const accent = /en[-_]GB/i.test(v.lang) ? 'イギリス'
      : /en[-_]AU/i.test(v.lang) ? 'オーストラリア'
        : /en[-_]IN/i.test(v.lang) ? 'インド' : 'アメリカ';
    return `${v.name}（${accent}${GOOD.test(v.name) ? '・高品質' : ''}）`;
  }

  function pick() {
    const vs = voices();
    if (!vs.length) return null;
    const want = Store.getSettings().voiceName;
    return (want && vs.find((v) => v.name === want)) || vs[0];
  }

  function localVoice() {
    return voices().find((v) => v.localService !== false) || all().find((v) => v.localService !== false) || null;
  }

  function speak(text, noNet) {
    if (!supported || !text) return false;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      let v = chosen || (chosen = pick());
      // ネットの声はオフラインだと黙ってしまうので、端末の声に替える
      if (v && v.localService === false && (noNet || navigator.onLine === false)) v = localVoice();
      if (v) {
        u.voice = v;
        u.lang = v.lang || 'en-US';
      }
      u.rate = Store.getSettings().rate || 0.85;
      if (v && v.localService === false && !noNet) {
        u.onerror = (ev) => {
          if (ev && (ev.error === 'interrupted' || ev.error === 'canceled')) return;
          speak(text, true); // ネットの声がだめなら、端末の声でもう一度
        };
      }
      speechSynthesis.cancel();
      try { speechSynthesis.resume(); } catch (e) { /* 古い Safari は resume が無い */ }
      speechSynthesis.speak(u);
      return true;
    } catch (e) {
      return false;
    }
  }

  function setVoice(name) {
    Store.updateSettings({ voiceName: name });
    chosen = voices().find((v) => v.name === name) || null;
  }

  function init(changed) {
    if (!supported) return;
    onChange = changed || onChange;
    const refresh = () => {
      chosen = pick();
      onChange();
    };
    speechSynthesis.onvoiceschanged = refresh;
    // 声の一覧が遅れて届く端末がある。数秒だけ見張る
    let n = 0;
    let last = -1;
    const t = setInterval(() => {
      const c = speechSynthesis.getVoices().length;
      if (c !== last) {
        last = c;
        refresh();
      }
      if (++n > 20 || (c > 0 && n > 6)) clearInterval(t);
    }, 500);
    refresh();
  }

  return {
    supported,
    init,
    speak,
    voices,
    label,
    setVoice,
    current: () => chosen,
    hasGood: () => voices().some((v) => GOOD.test(v.name))
  };
})();

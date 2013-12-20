(function(){
  var start, isBlink, isLight, isRun, isShow, isWarned, handler, latency, stopBy, delay, audioRemind, audioEnd, mcAudio, newAudio, soundToggle, show, adjust, toggle, reset, blink, count, run, resize, split$ = ''.split, replace$ = ''.replace;
  start = null;
  isBlink = false;
  isLight = true;
  isRun = false;
  isShow = true;
  isWarned = false;
  handler = null;
  latency = 0;
  stopBy = null;
  delay = 60000;
  audioRemind = null;
  audioEnd = null;
  mcAudio = function(strings){
    var tokens, url, sounds, res$, i$, len$, token, playing;
    tokens = split$.call(strings, '_');
    url = 'audio/mcmj/';
    res$ = [];
    for (i$ = 0, len$ = tokens.length; i$ < len$; ++i$) {
      token = tokens[i$];
      url + token + '.mp3';
      res$.push(url + token + '.ogg');
    }
    sounds = res$;
    playing = new Howl({
      urls: sounds,
      onend: function(){
        if (tokens.length > 1) {
          return mcAudio(replace$.call(strings, tokens[0] + '_', ''));
        } else {
          return this.unload();
        }
      }
    });
    return playing.play();
  };
  newAudio = function(file){
    var x$, node;
    x$ = node = new Audio();
    x$.src = file;
    x$.loop = false;
    x$.load();
    document.body.appendChild(node);
    return node;
  };
  soundToggle = function(des, state){
    var x$;
    if (state) {
      return des.play();
    } else {
      x$ = des;
      x$.currentTime = 0;
      x$.pause();
      return x$;
    }
  };
  show = function(){
    isShow = !isShow;
    return $('.fbtn').css('opacity', isShow ? '1.0' : '0.1');
  };
  adjust = function(it, v){
    if (isBlink) {
      return;
    }
    delay = delay + it * 1000;
    if (it === 0) {
      delay = v * 1000;
    }
    if (delay <= 0) {
      delay = 0;
    }
    $('#timer').text(delay);
    return resize();
  };
  toggle = function(){
    isRun = !isRun;
    $('#toggle').text(isRun ? "STOP" : "RUN");
    if (!isRun && handler) {
      stopBy = new Date();
      clearInterval(handler);
      handler = null;
      soundToggle(audioEnd, false);
      soundToggle(audioRemind, false);
    }
    if (stopBy) {
      latency = latency + new Date().getTime() - stopBy.getTime();
    }
    if (isRun) {
      return run();
    }
  };
  reset = function(){
    if (delay === 0) {
      delay = 1000;
    }
    soundToggle(audioRemind, false);
    soundToggle(audioEnd, false);
    stopBy = 0;
    isWarned = false;
    isBlink = false;
    latency = 0;
    start = null;
    isRun = true;
    toggle();
    if (handler) {
      clearInterval(handler);
    }
    handler = null;
    $('#timer').text(delay);
    $('#timer').css('color', '#fff');
    return resize();
  };
  blink = function(){
    isBlink = true;
    isLight = !isLight;
    return $('#timer').css('color', isLight ? '#fff' : '#f00');
  };
  count = function(){
    var tm, diff;
    tm = $('#timer');
    diff = start.getTime() - new Date().getTime() + delay + latency;
    if (diff > 60000) {
      isWarned = false;
    }
    if (diff < 60000 && !isWarned) {
      isWarned = true;
      soundToggle(audioRemind, true);
    }
    if (diff < 55000) {
      soundToggle(audioRemind, false);
    }
    if (diff < 0 && !isBlink) {
      soundToggle(audioEnd, true);
      isBlink = true;
      diff = 0;
      clearInterval(handler);
      handler = setInterval(function(){
        return blink();
      }, 500);
    }
    tm.text(diff + "");
    return resize();
  };
  run = function(){
    if (start === null) {
      start = new Date();
      latency = 0;
      isBlink = false;
    }
    if (handler) {
      clearInterval(handler);
    }
    if (isBlink) {
      return handler = setInterval(function(){
        return blink();
      }, 500);
    } else {
      return handler = setInterval(function(){
        return count();
      }, 100);
    }
  };
  resize = function(){
    var tm, w, h, len;
    tm = $('#timer');
    w = tm.width();
    h = $(window).height();
    len = tm.text().length;
    len >= 3 || (len = 3);
    tm.css('font-size', 1.5 * w / len + "px");
    return tm.css('line-height', h + "px");
  };
  window.onload = function(){
    $('#timer').text(delay);
    resize();
    audioRemind = newAudio('audio/smb_warning.mp3');
    return audioEnd = mcAudio('ohno_wts_de_qz');
  };
  window.onresize = function(){
    return resize();
  };
}).call(this);

<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI R&D Center | 湘南工科大学 情報学部</title>
<meta name="description" content="湘南工科大学 情報学部 AI R&D Center 統合紹介ページ。学生が主体となって進めるAI研究・開発の全貌を、ニュース・指導教員・施設・研究活動・業績としてまとめています。">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#14161c;
    --bg-soft:#181b22;
    --surface:#1d2029;
    --surface-2:#242833;
    --line:#2c303c;
    --text:#edeff4;
    --text-dim:#98a0b3;
    --text-faint:#666e82;
    --accent:#e7ff6e;
    --accent-dim:#b8cc4f;
    --accent2:#8c93ff;
    --radius:2px;
    --maxw:1180px;
    --serif:'Fraunces', Georgia, serif;
    --sans:'Inter', -apple-system, 'Hiragino Sans', 'Noto Sans JP', sans-serif;
    --mono:'IBM Plex Mono', 'SFMono-Regular', monospace;
  }
  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  @media (prefers-reduced-motion: reduce){
    html{scroll-behavior:auto;}
    *{animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important;}
  }
  body{
    margin:0;
    background:var(--bg);
    color:var(--text);
    font-family:var(--sans);
    line-height:1.7;
    font-size:16px;
    -webkit-font-smoothing:antialiased;
  }
  img{max-width:100%; display:block; height:auto;}
  a{color:inherit;}
  h1,h2,h3,h4{font-family:var(--serif); font-weight:700; margin:0; letter-spacing:-0.01em;}
  p{margin:0 0 1em; color:var(--text-dim);}
  .wrap{max-width:var(--maxw); margin:0 auto; padding:0 28px;}
  .mono{font-family:var(--mono);}
  ::selection{background:var(--accent); color:#14161c;}

  /* progress bar */
  #progress{position:fixed; top:0; left:0; height:2px; width:0%; background:var(--accent); z-index:200; transition:width 0.08s linear;}

  /* header */
  header{
    position:fixed; top:0; left:0; right:0; z-index:150;
    background:rgba(20,22,28,0.86);
    backdrop-filter:blur(10px);
    border-bottom:1px solid var(--line);
  }
  .nav-row{display:flex; align-items:center; justify-content:space-between; height:64px;}
  .brand{display:flex; align-items:center; gap:10px; font-family:var(--serif); font-size:19px; font-weight:600; color:var(--text); text-decoration:none;}
  .brand-mark{width:9px; height:9px; background:var(--accent); border-radius:50%; flex:none;}
  nav.links{display:flex; gap:28px; font-size:14px;}
  nav.links a{text-decoration:none; color:var(--text-dim); padding:4px 0; border-bottom:1px solid transparent; transition:color .2s, border-color .2s;}
  nav.links a:hover, nav.links a.active{color:var(--text); border-color:var(--accent);}
  .menu-btn{display:none; background:none; border:1px solid var(--line); color:var(--text); width:38px; height:38px; border-radius:var(--radius); cursor:pointer;}
  @media (max-width:880px){
    nav.links{position:fixed; top:64px; left:0; right:0; background:var(--bg-soft); flex-direction:column; padding:18px 28px; gap:14px; border-bottom:1px solid var(--line); transform:translateY(-8px); opacity:0; pointer-events:none; transition:opacity .2s, transform .2s;}
    nav.links.open{opacity:1; transform:translateY(0); pointer-events:auto;}
    .menu-btn{display:block;}
  }

  /* hero */
  #home{position:relative; padding:150px 0 96px; overflow:hidden; border-bottom:1px solid var(--line);}
  .hero-bg{position:absolute; inset:0; z-index:0;}
  .hero-bg img{width:100%; height:100%; object-fit:cover; opacity:0.34; filter:grayscale(30%);}
  .hero-bg::after{content:''; position:absolute; inset:0; background:linear-gradient(100deg, var(--bg) 28%, rgba(20,22,28,0.65) 62%, rgba(20,22,28,0.25) 100%);}
  .hero-inner{position:relative; z-index:1; max-width:760px;}
  .eyebrow{font-family:var(--mono); font-size:13px; color:var(--accent2); margin-bottom:22px; display:flex; align-items:center; gap:10px;}
  .eyebrow .rule{width:32px; height:1px; background:var(--accent2);}
  h1.hero-title{font-size:clamp(42px, 6.6vw, 78px); line-height:1.02; color:var(--text);}
  h1.hero-title em{font-style:normal; color:var(--accent);}
  .hero-sub{font-size:18px; margin-top:24px; max-width:560px; color:var(--text-dim);}
  .hero-meta{display:flex; gap:28px; margin-top:44px; flex-wrap:wrap;}
  .hero-meta div{font-family:var(--mono); font-size:13px; color:var(--text-faint);}
  .hero-meta strong{display:block; font-family:var(--serif); font-size:26px; color:var(--text); font-weight:600; margin-bottom:2px;}
  .hero-net{position:absolute; right:-40px; bottom:-40px; width:420px; max-width:46vw; z-index:1; opacity:0.9;}
  @media (max-width:700px){ .hero-net{display:none;} #home{padding:130px 0 64px;} }
  .hero-net path{stroke:var(--accent2); stroke-width:1; fill:none; stroke-dasharray:600; stroke-dashoffset:600; animation:draw 2.4s ease forwards .3s;}
  .hero-net circle{fill:var(--accent); opacity:0; animation:pop .5s ease forwards;}

  @keyframes draw{ to{stroke-dashoffset:0;} }
  @keyframes pop{ to{opacity:1;} }
  @keyframes fadeUp{ from{opacity:0; transform:translateY(14px);} to{opacity:1; transform:translateY(0);} }
  .hero-inner > *{animation:fadeUp .7s ease both;}
  .hero-inner > *:nth-child(2){animation-delay:.08s;}
  .hero-inner > *:nth-child(3){animation-delay:.16s;}
  .hero-inner > *:nth-child(4){animation-delay:.24s;}

  section{padding:96px 0;}
  .section-head{display:flex; justify-content:space-between; align-items:flex-end; gap:24px; margin-bottom:48px; flex-wrap:wrap; border-bottom:1px solid var(--line); padding-bottom:24px;}
  .section-head h2{font-size:clamp(28px,3.4vw,38px);}
  .section-head .index{font-family:var(--mono); font-size:13px; color:var(--text-faint);}
  .section-lede{max-width:600px; color:var(--text-dim); margin-top:10px;}

  /* news ticker */
  #news{padding-top:64px; padding-bottom:64px; background:var(--bg-soft); border-bottom:1px solid var(--line);}
  .ticker-shell{overflow:hidden; position:relative; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:22px 0;}
  .ticker-shell::before, .ticker-shell::after{content:''; position:absolute; top:0; bottom:0; width:80px; z-index:2; pointer-events:none;}
  .ticker-shell::before{left:0; background:linear-gradient(90deg, var(--bg-soft), transparent);}
  .ticker-shell::after{right:0; background:linear-gradient(270deg, var(--bg-soft), transparent);}
  .ticker-track{display:flex; width:max-content; gap:56px; animation:ticker 62s linear infinite;}
  .ticker-shell:hover .ticker-track{animation-play-state:paused;}
  .ticker-item{display:flex; align-items:baseline; gap:14px; white-space:nowrap; font-size:15px; color:var(--text-dim);}
  .ticker-item .d{font-family:var(--mono); font-size:12px; color:var(--accent2);}
  @keyframes ticker{ from{transform:translateX(0);} to{transform:translateX(-50%);} }
  .news-foot{margin-top:22px; text-align:right;}
  .news-foot a{font-family:var(--mono); font-size:13px; text-decoration:none; color:var(--text-dim); border-bottom:1px solid var(--line); padding-bottom:2px;}
  .news-foot a:hover{color:var(--accent); border-color:var(--accent);}

  /* about strip */
  .about-grid{display:grid; grid-template-columns:1.1fr 0.9fr; gap:56px; align-items:center;}
  @media (max-width:800px){ .about-grid{grid-template-columns:1fr;} }
  .about-grid img{border:1px solid var(--line);}
  .about-text p{color:var(--text-dim); font-size:16.5px;}
  .stat-row{display:flex; gap:36px; margin-top:28px; flex-wrap:wrap;}
  .stat{border-left:2px solid var(--accent); padding-left:14px;}
  .stat strong{display:block; font-family:var(--serif); font-size:30px; color:var(--text);}
  .stat span{font-family:var(--mono); font-size:12.5px; color:var(--text-faint);}

  /* members */
  .members-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--line); border:1px solid var(--line);}
  @media (max-width:760px){ .members-grid{grid-template-columns:repeat(2,1fr);} }
  @media (max-width:460px){ .members-grid{grid-template-columns:1fr;} }
  .member{background:var(--surface); padding:30px 26px; text-decoration:none; display:block; transition:background .2s;}
  .member:hover{background:var(--surface-2);}
  .member img{width:64px; height:64px; object-fit:cover; border-radius:50%; margin-bottom:18px; filter:grayscale(40%); border:1px solid var(--line);}
  .member .name{font-family:var(--serif); font-size:19px; color:var(--text); margin-bottom:4px;}
  .member .role{font-family:var(--mono); font-size:12.5px; color:var(--text-faint);}

  /* facility */
  .tab-bar{display:flex; gap:8px; flex-wrap:wrap; margin-bottom:32px;}
  .tab-btn{font-family:var(--mono); font-size:13px; background:none; border:1px solid var(--line); color:var(--text-dim); padding:10px 18px; border-radius:var(--radius); cursor:pointer; transition:all .2s;}
  .tab-btn:hover{color:var(--text); border-color:var(--text-faint);}
  .tab-btn.active{background:var(--accent); color:#14161c; border-color:var(--accent);}
  .facility-panel{display:none; animation:fadeUp .4s ease both;}
  .facility-panel.active{display:block;}
  .facility-photos{display:grid; grid-template-columns:1.3fr 1fr; gap:14px; margin-bottom:22px;}
  @media (max-width:640px){ .facility-photos{grid-template-columns:1fr;} }
  .facility-photos img{border:1px solid var(--line); width:100%; height:280px; object-fit:cover;}
  .facility-photos img:last-child{height:280px;}
  .facility-desc{max-width:600px; color:var(--text-dim);}

  /* research */
  #research{background:var(--bg-soft); border-top:1px solid var(--line); border-bottom:1px solid var(--line);}
  .research-layout{display:grid; grid-template-columns:220px 1fr; gap:48px; align-items:flex-start;}
  @media (max-width:840px){ .research-layout{grid-template-columns:1fr;} }
  .rtab-list{display:f

  上記のようなスタイルにしてほしい

  色は黒は暗いからやっぱり白と青で

  デバッグが面倒なのでいったんソースはGithub ioを前提にしておいてください
  簡単にCMSを前提に戻せると良いでしょう
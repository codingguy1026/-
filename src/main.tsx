import React, { FormEvent, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Modal = 'create' | 'join' | 'quick' | 'game' | null

type Game = {
  id: string
  title: string
  kicker: string
  description: string
  emoji: string
  players: string
  time: string
  tone: string
  ready: boolean
}

const games: Game[] = [
  {
    id: 'draw',
    title: '이게 뭐게?',
    kicker: 'DRAW & GUESS',
    description: '한 명은 그리고, 나머지는 채팅으로 맞혀! 명작보다 웃긴 그림이 환영받는 곳.',
    emoji: '✏️',
    players: '2–8명',
    time: '약 8분',
    tone: 'violet',
    ready: true,
  },
  {
    id: 'faker',
    title: '가짜를 찾아라',
    kicker: 'FIND THE FAKE',
    description: '한 명만 다른 제시어를 받는다. 힌트를 듣고 수상한 플레이어를 찾아내자.',
    emoji: '🕵️',
    players: '4–10명',
    time: '약 6분',
    tone: 'coral',
    ready: true,
  },
  {
    id: 'three',
    title: '3초 대답',
    kicker: 'THREE SECONDS',
    description: '생각할 시간은 딱 3초. 머릿속에 떠오른 답을 누구보다 빠르게 던져!',
    emoji: '⚡',
    players: '2–12명',
    time: '약 5분',
    tone: 'yellow',
    ready: true,
  },
  {
    id: 'initial',
    title: '초성 배틀',
    kicker: 'INITIAL RUSH',
    description: '초성이 뜨는 순간 키보드 전쟁 시작. 조건에 맞는 단어를 가장 먼저 입력해.',
    emoji: '⌨️',
    players: '2–10명',
    time: '약 5분',
    tone: 'mint',
    ready: true,
  },
  {
    id: 'vote',
    title: '눈치 투표',
    kicker: 'VOTE TO WIN',
    description: '모두 답하고 모두 고른다. 가장 웃기거나 기묘한 답이 점수를 가져간다.',
    emoji: '👀',
    players: '3–12명',
    time: '약 7분',
    tone: 'blue',
    ready: false,
  },
  {
    id: 'relay',
    title: '그림 릴레이',
    kicker: 'DRAW RELAY',
    description: '조금 그리고 넘기고 또 그린다. 마지막에 완성된 그림은 아무도 책임지지 않음.',
    emoji: '🎨',
    players: '3–8명',
    time: '약 9분',
    tone: 'pink',
    ready: false,
  },
]

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M14 7l5 5-5 5" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3z" />
      <path d="M9.5 12l1.7 1.7 3.5-4" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" />
    </svg>
  )
}

function App() {
  const initialRoom = new URLSearchParams(window.location.search).get('room')?.toUpperCase() ?? ''
  const [nickname, setNickname] = useState('')
  const [modal, setModal] = useState<Modal>(initialRoom ? 'join' : null)
  const [roomCode, setRoomCode] = useState(initialRoom)
  const [createdCode, setCreatedCode] = useState('')
  const [notice, setNotice] = useState(initialRoom ? `초대받은 방 ${initialRoom} 코드가 준비됐어.` : '')
  const [selectedGame, setSelectedGame] = useState<Game>(games[0])
  const [isPublic, setIsPublic] = useState(true)

  const inviteLink = useMemo(() => {
    if (!createdCode) return ''
    return `${window.location.origin}${window.location.pathname}?room=${createdCode}`
  }, [createdCode])

  const requireNickname = () => {
    if (!nickname.trim()) {
      setNotice('먼저 닉네임을 입력해 줘!')
      document.getElementById('nickname')?.focus()
      return false
    }
    setNotice('')
    return true
  }

  const quickStart = () => {
    if (!requireNickname()) return
    setModal('quick')
  }

  const createRoom = () => {
    if (!requireNickname()) return
    setCreatedCode(randomCode())
    setModal('create')
  }

  const openJoin = () => {
    if (!requireNickname()) return
    setModal('join')
  }

  const openGame = (game: Game) => {
    setSelectedGame(game)
    setModal('game')
  }

  const submitJoin = (event: FormEvent) => {
    event.preventDefault()
    const code = roomCode.trim().toUpperCase()
    if (code.length < 4) {
      setNotice('방 코드를 다시 확인해 줘.')
      return
    }
    setNotice(`${nickname}님, ${code} 방으로 들어갈 준비 완료!`)
    setModal(null)
  }

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setNotice('초대 링크를 복사했어!')
    } catch {
      setNotice(`초대 링크: ${inviteLink}`)
    }
  }

  return (
    <main className="site-shell" id="top">
      <div className="page-wrap">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="모여 홈">
            <strong>모여<span>!</span></strong>
            <i />
            <small>PLAY<br />TOGETHER</small>
          </a>
          <nav className="top-nav" aria-label="주요 메뉴">
            <a href="#games">게임 찾기</a>
            <a href="#start">빠른 시작</a>
            <span className="nav-pill"><span className="status-dot" /> ONLINE PLAYGROUND</span>
          </nav>
        </header>

        <section className="hero" id="start">
          <div className="hero-copy">
            <p className="eyebrow">NO FRIENDS REQUIRED</p>
            <h1>혼자 와도,<br /><span>같이 놀게.</span></h1>
            <p className="hero-description">
              공개방에 들어가 처음 보는 사람과 바로 한 판.<br />
              친구가 있다면 코드로 같은 방에 모이면 되고.
            </p>
            <div className="hero-tags">
              <span>가입 없이</span><span>가벼운 한 판</span><span>과금 유도 없음</span>
            </div>
          </div>

          <aside className="start-card">
            <div className="start-card-head">
              <div>
                <span className="ready-kicker">READY?</span>
                <h2>바로 놀러 가자.</h2>
              </div>
              <span className="spark"><SparkIcon /></span>
            </div>

            <label htmlFor="nickname">어떻게 불러줄까?</label>
            <input
              id="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="닉네임 입력"
              maxLength={16}
              autoComplete="nickname"
            />
            {notice && <p className="notice" role="status">{notice}</p>}

            <button className="quick-button" onClick={quickStart}>
              <span><SparkIcon /> 빠른 시작</span>
              <ArrowIcon />
            </button>

            <div className="secondary-actions">
              <button onClick={createRoom}>방 만들기</button>
              <button onClick={openJoin}>코드로 입장</button>
            </div>

            <p className="signup-note"><ShieldIcon /> 닉네임 하나면 준비 끝</p>
          </aside>
        </section>

        <section className="games-section" id="games">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CHOOSE YOUR CHAOS</p>
              <h2>오늘은 뭐 할래?</h2>
            </div>
            <p>처음 보는 사람끼리도 규칙을 금방 이해하고<br />바로 웃을 수 있는 게임부터.</p>
          </div>

          <div className="game-grid">
            {games.map((game, index) => (
              <button
                className={`game-card ${game.tone}`}
                key={game.id}
                onClick={() => openGame(game)}
                aria-label={`${game.title} 자세히 보기`}
              >
                <div className="game-card-top">
                  <span className="game-number">0{index + 1}</span>
                  <span className={`game-state ${game.ready ? '' : 'soon'}`}>{game.ready ? 'PLAY' : 'SOON'}</span>
                </div>
                <div className="game-emoji" aria-hidden="true">{game.emoji}</div>
                <span className="game-kicker">{game.kicker}</span>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <div className="game-meta">
                  <span>{game.players}</span>
                  <span>{game.time}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="lobby-preview">
          <div className="lobby-copy">
            <p className="eyebrow">PUBLIC LOBBY</p>
            <h2>친구가 없어도<br />시작은 가능해야지.</h2>
            <p>빠른 시작은 사람이 있는 공개방을 찾아 들어가고, 없으면 새 공개방을 만드는 흐름으로 연결할 예정이야.</p>
          </div>
          <div className="lobby-flow" aria-label="빠른 시작 흐름">
            <article><b>01</b><strong>닉네임 정하기</strong><span>계정 없이 입장</span></article>
            <i>→</i>
            <article><b>02</b><strong>게임 자동 선택</strong><span>또는 직접 고르기</span></article>
            <i>→</i>
            <article><b>03</b><strong>공개방 합류</strong><span>바로 한 판 시작</span></article>
          </div>
        </section>

        <footer>
          <span><ShieldIcon /> 과금 없이. 베팅 없이. 즐거움은 같이.</span>
          <span>모여! · 온라인 미니게임 놀이터</span>
        </footer>
      </div>

      {modal && (
        <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <button className="close" onClick={() => setModal(null)} aria-label="닫기">×</button>

            {modal === 'quick' && (
              <>
                <span className="modal-kicker">QUICK START</span>
                <h3>매칭 준비 완료 ⚡</h3>
                <p><strong>{nickname}</strong>님으로 공개방을 찾는 흐름이야. 지금은 프론트엔드 프로토타입이라 실제 유저 매칭은 다음 단계에서 연결해.</p>
                <div className="matching-demo">
                  <span className="matching-dot" /><span className="matching-dot" /><span className="matching-dot" />
                  공개방 찾는 중...
                </div>
                <button className="modal-primary" onClick={() => { setSelectedGame(games[Math.floor(Math.random() * 4)]); setModal('game') }}>
                  게임 하나 골라보기 <ArrowIcon />
                </button>
              </>
            )}

            {modal === 'create' && (
              <>
                <span className="modal-kicker">CREATE ROOM</span>
                <h3>새 방 만들기</h3>
                <p><strong>{nickname}</strong>님이 방장이야. 공개방으로 만들면 다른 사람도 찾아올 수 있어.</p>
                <div className="visibility-switch">
                  <button className={isPublic ? 'active' : ''} onClick={() => setIsPublic(true)}>🌐 공개방</button>
                  <button className={!isPublic ? 'active' : ''} onClick={() => setIsPublic(false)}>🔒 비공개방</button>
                </div>
                <div className="room-code">{createdCode}</div>
                <button className="modal-primary" onClick={copyInvite}>초대 링크 복사 <ArrowIcon /></button>
              </>
            )}

            {modal === 'join' && (
              <form onSubmit={submitJoin}>
                <span className="modal-kicker">JOIN ROOM</span>
                <h3>코드로 입장</h3>
                <p>친구에게 받은 방 코드를 입력하면 같은 방으로 들어갈 수 있어.</p>
                <input
                  autoFocus
                  className="code-input"
                  value={roomCode}
                  onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
                  placeholder="예: A7K2QF"
                  maxLength={8}
                />
                <button className="modal-primary" type="submit">입장하기 <ArrowIcon /></button>
              </form>
            )}

            {modal === 'game' && (
              <>
                <span className="modal-kicker">{selectedGame.kicker}</span>
                <div className={`modal-game-icon ${selectedGame.tone}`}>{selectedGame.emoji}</div>
                <h3>{selectedGame.title}</h3>
                <p>{selectedGame.description}</p>
                <div className="modal-meta"><span>{selectedGame.players}</span><span>{selectedGame.time}</span></div>
                {selectedGame.ready ? (
                  <button className="modal-primary" onClick={() => { setModal(null); quickStart() }}>
                    이 게임으로 빠른 시작 <ArrowIcon />
                  </button>
                ) : (
                  <button className="modal-primary disabled" type="button" disabled>준비 중인 게임</button>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

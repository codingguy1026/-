import React, { FormEvent, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Modal = 'create' | 'join' | 'practice' | null

const prompts = [
  '우주에서 라면 먹는 고양이',
  '축구하는 문어',
  '비 오는 날의 공룡',
  '잠든 로봇',
  '춤추는 붕어빵',
]

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M15 49l4-14L43 11c2-2 5-2 7 0l3 3c2 2 2 5 0 7L29 45l-14 4z" />
      <path d="M36 18l10 10" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.5-4 2.5-6 5.5-6s5 2 5.5 6" />
      <path d="M15 6.5a2.5 2.5 0 0 1 0 5M16 13c2.5.3 4 2.1 4.5 5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M14 7l5 5-5 5" />
    </svg>
  )
}

function App() {
  const initialRoom = new URLSearchParams(window.location.search).get('room')?.toUpperCase() ?? ''
  const [nickname, setNickname] = useState('')
  const [mode, setMode] = useState<'create' | 'join'>(initialRoom ? 'join' : 'create')
  const [modal, setModal] = useState<Modal>(null)
  const [roomCode, setRoomCode] = useState(initialRoom)
  const [createdCode, setCreatedCode] = useState('')
  const [notice, setNotice] = useState(initialRoom ? `초대받은 방 ${initialRoom}에 입장할 수 있어!` : '')
  const [promptIndex, setPromptIndex] = useState(0)

  const inviteLink = useMemo(() => {
    if (!createdCode) return ''
    return `${window.location.origin}${window.location.pathname}?room=${createdCode}`
  }, [createdCode])

  const requireNickname = () => {
    if (!nickname.trim()) {
      setNotice('먼저 닉네임을 입력해 줘!')
      return false
    }
    setNotice('')
    return true
  }

  const createRoom = () => {
    if (!requireNickname()) return
    setCreatedCode(randomCode())
    setModal('create')
  }

  const joinRoom = () => {
    if (!requireNickname()) return
    setModal('join')
  }

  const submitJoin = (event: FormEvent) => {
    event.preventDefault()
    const code = roomCode.trim().toUpperCase()
    if (code.length < 4) {
      setNotice('방 코드를 다시 확인해 줘.')
      return
    }
    setNotice(`${nickname}님, ${code} 방으로 입장 준비 완료!`)
    setModal(null)
  }

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setNotice('초대 링크를 복사했어! 친구에게 던져 버려 😎')
    } catch {
      setNotice(`초대 링크: ${inviteLink}`)
    }
  }

  const openPractice = () => {
    setPromptIndex(Math.floor(Math.random() * prompts.length))
    setModal('practice')
  }

  const handlePrimaryAction = () => {
    if (mode === 'create') createRoom()
    else joinRoom()
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
          <div className="top-nav">
            <span className="nav-pill">첫 번째 놀이터</span>
            <span className="nav-copy">친구랑, 한 판 더.</span>
          </div>
        </header>

        <section className="hero-copy-block">
          <p className="eyebrow">LET’S PLAY</p>
          <h1>다 모였어? 그럼, 시작하자.</h1>
          <p>그림 실력은 상관없어. 웃길 준비만 해 와!</p>
        </section>

        <section className="play-grid" id="play">
          <article className="game-card">
            <div className="card-topline">
              <span className="game-tag">DRAW &amp; GUESS</span>
              <span>01 / 첫 번째 게임</span>
            </div>

            <div className="game-title-row">
              <div className="pencil-sticker">
                <PencilIcon />
              </div>
              <h2>이게<br />뭐게?</h2>
            </div>

            <p className="game-description">
              한 명은 그리고, 나머지는 맞히고.<br />
              명작보다 웃긴 그림이 환영받는 곳.
            </p>

            <div className="card-bottomline">
              <div className="game-meta">
                <span><PeopleIcon /> 2–8명</span>
                <span><ClockIcon /> 한 턴 90초</span>
              </div>
              <button className="practice-button" onClick={openPractice}>
                혼자 연습하기 <ArrowIcon />
              </button>
            </div>
          </article>

          <article className="join-card">
            <div>
              <span className="ready-kicker">READY?</span>
              <h2>같이 놀 준비 됐어?</h2>
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

            <div className="mode-switch" role="tablist" aria-label="방 입장 방식">
              <button
                type="button"
                className={mode === 'create' ? 'active' : ''}
                onClick={() => setMode('create')}
                role="tab"
                aria-selected={mode === 'create'}
              >
                방 만들기
              </button>
              <button
                type="button"
                className={mode === 'join' ? 'active' : ''}
                onClick={() => setMode('join')}
                role="tab"
                aria-selected={mode === 'join'}
              >
                코드로 입장
              </button>
            </div>

            <div className="mode-description">
              {mode === 'create' ? (
                <p>방을 만들고 친구에게 초대 링크를 보내 줘.<br />모이면 방장이 게임을 시작할 수 있어.</p>
              ) : (
                <p>친구에게 받은 방 코드를 준비해 줘.<br />닉네임만 정하면 바로 합류할 수 있어.</p>
              )}
            </div>

            {notice && <p className="notice" role="status">{notice}</p>}

            <button className="primary-action" onClick={handlePrimaryAction}>
              {mode === 'create' ? '새로운 방 만들기' : '코드 입력하고 입장'}
              <ArrowIcon />
            </button>

            <p className="signup-note"><ShieldIcon /> 가입 없이 닉네임으로 플레이</p>
          </article>
        </section>

        <section className="steps" aria-label="게임 방법">
          <article><b>01</b><span>친구들을 모으고</span></article>
          <article><b>02</b><span>제시어를 그리고</span></article>
          <article><b>03</b><span>정답을 외쳐!</span></article>
        </section>

        <footer>
          <span><ShieldIcon /> 과금 없이. 베팅 없이. 즐거움은 같이.</span>
          <span>모여! · 그림 맞히기</span>
        </footer>
      </div>

      {modal && (
        <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <button className="close" onClick={() => setModal(null)} aria-label="닫기">×</button>

            {modal === 'create' && (
              <>
                <span className="modal-kicker">NEW ROOM</span>
                <h3>방 만들기 완료!</h3>
                <p><strong>{nickname}</strong>님이 방장이야. 친구들에게 아래 코드를 보내 줘.</p>
                <div className="room-code">{createdCode}</div>
                <button className="modal-primary" onClick={copyInvite}>초대 링크 복사 <ArrowIcon /></button>
              </>
            )}

            {modal === 'join' && (
              <form onSubmit={submitJoin}>
                <span className="modal-kicker">JOIN ROOM</span>
                <h3>코드로 입장</h3>
                <p>친구가 보내 준 방 코드를 입력해 줘.</p>
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

            {modal === 'practice' && (
              <>
                <span className="modal-kicker">SOLO PRACTICE</span>
                <h3>혼자 연습하기</h3>
                <p>90초 안에 이 제시어를 그려 봐!</p>
                <div className="practice-prompt">{prompts[promptIndex]}</div>
                <button className="modal-primary" onClick={openPractice}>다른 제시어 <ArrowIcon /></button>
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

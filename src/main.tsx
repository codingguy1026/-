import React, { FormEvent, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Modal = 'create' | 'join' | 'practice' | null

const prompts = ['우주에서 라면 먹는 고양이', '축구하는 문어', '비 오는 날의 공룡', '잠든 로봇', '춤추는 붕어빵']

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function App() {
  const [nickname, setNickname] = useState('')
  const [modal, setModal] = useState<Modal>(null)
  const [roomCode, setRoomCode] = useState('')
  const [createdCode, setCreatedCode] = useState('')
  const [notice, setNotice] = useState('')
  const [promptIndex, setPromptIndex] = useState(0)

  const inviteLink = useMemo(() => {
    if (!createdCode) return ''
    return `${window.location.origin}?room=${createdCode}`
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
      setNotice('초대 링크를 복사했어!')
    } catch {
      setNotice(`초대 링크: ${inviteLink}`)
    }
  }

  const openPractice = () => {
    setPromptIndex(Math.floor(Math.random() * prompts.length))
    setModal('practice')
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="모여 홈">
          <span className="brand-dot" />
          <strong>모여!</strong>
          <span>PLAY TOGETHER</span>
        </a>
        <a className="tiny-link" href="#play">LET’S PLAY ↘</a>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">첫 번째 놀이터 <span>친구랑, 한 판 더.</span></p>
        <div className="hero-grid">
          <div>
            <h1>다 모였어?<br /><em>그럼, 시작하자.</em></h1>
            <p className="hero-copy">그림 실력은 상관없어.<br />웃길 준비만 해 와!</p>
          </div>
          <div className="scribble-card" aria-hidden="true">
            <div className="scribble-face">
              <i className="eye left" /><i className="eye right" /><i className="mouth" />
            </div>
            <span>?</span>
          </div>
        </div>
      </section>

      <section className="game-section">
        <div className="section-label">DRAW &amp; GUESS <b>01 / 첫 번째 게임</b></div>
        <div className="game-grid">
          <div>
            <h2>이게<br /><span>뭐게?</span></h2>
          </div>
          <div className="game-copy">
            <p>한 명은 그리고, 나머지는 맞히고.<br />명작보다 웃긴 그림이 환영받는 곳.</p>
            <div className="chips">
              <span>2–8명</span><span>한 턴 90초</span>
            </div>
            <button className="text-button" onClick={openPractice}>혼자 연습하기 ↗</button>
          </div>
        </div>
      </section>

      <section className="play-panel" id="play">
        <div className="panel-copy">
          <span className="mini-label">READY?</span>
          <h2>같이 놀 준비<br />됐어?</h2>
          <p>방을 만들고 친구에게 초대 링크를 보내 줘.<br />모이면 방장이 게임을 시작할 수 있어.</p>
        </div>

        <div className="join-card">
          <label htmlFor="nickname">어떻게 불러줄까?</label>
          <input
            id="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="닉네임 입력"
            maxLength={16}
          />
          {notice && <p className="notice" role="status">{notice}</p>}
          <div className="actions">
            <button className="primary" onClick={createRoom}>방 만들기 <span>→</span></button>
            <button className="secondary" onClick={joinRoom}>코드로 입장</button>
          </div>
          <p className="signup-note"><span>●</span> 가입 없이 닉네임으로 플레이</p>
        </div>
      </section>

      <section className="steps">
        <article><b>01</b><span>친구들을 모으고</span></article>
        <article><b>02</b><span>제시어를 그리고</span></article>
        <article><b>03</b><span>정답을 외쳐!</span></article>
      </section>

      <footer>
        <strong>과금 없이. 베팅 없이.<br />즐거움은 같이.</strong>
        <span>모여! · 그림 맞히기</span>
      </footer>

      {modal && (
        <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <button className="close" onClick={() => setModal(null)} aria-label="닫기">×</button>

            {modal === 'create' && (
              <>
                <span className="mini-label">NEW ROOM</span>
                <h3>새로운 방 만들기</h3>
                <p>{nickname}님이 방장이야. 친구들에게 아래 코드를 보내 줘.</p>
                <div className="room-code">{createdCode}</div>
                <button className="primary wide" onClick={copyInvite}>초대 링크 복사</button>
              </>
            )}

            {modal === 'join' && (
              <form onSubmit={submitJoin}>
                <span className="mini-label">JOIN ROOM</span>
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
                <button className="primary wide" type="submit">입장하기</button>
              </form>
            )}

            {modal === 'practice' && (
              <>
                <span className="mini-label">SOLO PRACTICE</span>
                <h3>혼자 연습하기</h3>
                <p>90초 안에 이 제시어를 그려 봐!</p>
                <div className="practice-prompt">{prompts[promptIndex]}</div>
                <button className="primary wide" onClick={openPractice}>다른 제시어</button>
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

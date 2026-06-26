import { useState } from 'react'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import './Profile.css'

export default function Profile() {
  const [imgError, setImgError] = useState(false)

  const handleSignOut = async () => {
    localStorage.removeItem('cal_token')
    localStorage.removeItem('cal_token_exp')
    await signOut(auth)
  }

  return (
    <div className="card profile-card">
      {imgError ? (
        <div className="profile-avatar-fallback">🐸</div>
      ) : (
        <img
          src="/avatar.png"
          className="profile-avatar"
          onError={() => setImgError(true)}
          alt="Yen"
        />
      )}
      <div className="profile-name">Yen</div>
      <div className="profile-dot"><span className="dot" />online</div>
      <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
    </div>
  )
}

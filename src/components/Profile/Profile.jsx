import { useState } from 'react'
import './Profile.css'

export default function Profile() {
  const [imgError, setImgError] = useState(false)

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
    </div>
  )
}

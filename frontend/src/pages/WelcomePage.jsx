import React from 'react'
import { useNavigate } from 'react-router-dom'


export const WelcomePage = () => {
    const navigate = useNavigate()
    return (
        <section className='container' >
            <div className='wellcome-section'>
                <div className="wellcome-section__message">
                    <h1>Welcome to Grin-Storage</h1>
                    <button className='sign-in_btn' onClick={() => navigate('/sign-in')}>
                        Sign in to continue
                    </button>
                </div>
            </div>
        </section>
  )
}

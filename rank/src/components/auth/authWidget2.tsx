/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useContext, useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { StoreContext } from '../../App'
import { CreateUser } from '../../services/userService'
import React from 'react'

export function AuthWidget2 (): JSX.Element {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const authInfo = useContext(StoreContext)

  async function signIn (email: string, pass: string): Promise<void> {
    const auth = getAuth()
    await setPersistence(auth, browserLocalPersistence).then(
      () => {
        signInWithEmailAndPassword(auth, email, pass)
          .then((userCredential) => {
            const user = userCredential.user
            authInfo.setLogInInfo( true,user.email!, user.displayName!)
          })
          .catch((error) => {
            setErrorMessage('Sign In Failed with Error Code: ' + error.code + ': ' + error.message)
          })
      }
    )
  }

  function register (email: string, pass: string): void {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, pass).then((userCredential) => {
      const user = userCredential.user
      void CreateUser(user.email!)
      authInfo.setLogInInfo(true, user.email!, user.displayName!)
    })
      .catch((error) => {
        setErrorMessage('Register Failed with Error Code: ' + error.code + ': ' + errorMessage)
      })
  }

  return (
        <>
            <div className="auth-widget-wrapper">
                <div className="auth-inputRow">
                &nbsp;&nbsp;&nbsp;&nbsp;email&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
                </div>
                <div className="auth-inputRow">
                    password <input type="password" name="pw" value={pass} onChange={(e) => { setPass(e.target.value) }}></input>
                </div>
                <div className="auth-inputRow">
                    <button className="button-3" onClick={(e) => { void signIn(email, pass) }}>
                        Sign In
                    </button>
                    <button className="auth-button-3" onClick={(e) => { register(email, pass) }}>
                        Register
                    </button>
                </div>
            </div>
        </>
  )
}
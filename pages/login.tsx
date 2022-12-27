import LoggedInStateButton from '../components/login-btn'
import SignInCard from '../components/SignInCard'

export default function Login() {
  return (
    <div className='mt-2'>
      <LoggedInStateButton />
      <br />
      <SignInCard />
    </div>
  )
}

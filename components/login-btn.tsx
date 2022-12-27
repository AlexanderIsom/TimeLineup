import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function LoggedInStateButton() {
  const { data: session } = useSession()
  if (session) {
    const { user } = session

    return (
      <>
        {user?.image && (
          <Image
            src={user.image}
            alt=''
            width={38}
            height={38}
            className='mx-auto'
          />
        )}
        Signed in as {user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()} className='bg-sky-800 rounded-md px-2'>
        Sign in
      </button>
    </>
  )
}

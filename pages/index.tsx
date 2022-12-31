import { useSession, getSession } from 'next-auth/react'
import Header from '../components/Header'

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <Header />
        <h1>Index</h1>
      </>
    )
  }
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

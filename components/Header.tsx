import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Header({ title }: { title?: string }) {
  return (
    <Head>
      <title>TimeLineup {title ? '- ' + title : ''}</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>
  )
}

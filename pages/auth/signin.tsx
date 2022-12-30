import { signIn, getProviders } from 'next-auth/react'
import Image from 'next/image'
import backgroundImage from '../../public/RubberBandits.png'

import styles from '../../styles/Signin.module.scss'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function singin({ providers }: any) {
  return (
    <>
      <div>
        <div className={classNames(styles.center, styles.backgroundImage)}>
          <Image src={backgroundImage} alt='' />
        </div>
        <div className={classNames(styles.center, styles.glass)}>
          <div className={styles.signInText}>Sign in options</div>
          {providers &&
            Object.values(providers).map((provider: any) => (
              <button
                key={provider.id}
                className={classNames(
                  styles.provider_button,
                  styles[provider.id]
                )}
                onClick={() => signIn(provider.id)}
              >
                {provider.name.toUpperCase()}
              </button>
            ))}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import styles from '../styles/Navbar.module.scss'
import Image from 'next/image'

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Projects', href: '/project', current: false },
  { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CustomNavbar() {
  const router = useRouter()
  const { data: session } = useSession()

  if (session && session.user) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.justify}>
            <div className={styles.navbarContainer}>
              <Image
                width={128}
                height={128}
                className={styles.logo}
                src='/square-clock.png'
                alt='Your Company'
              />
              <div className={styles.itemsContainer}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      router.asPath === item.href
                        ? styles.activeLink
                        : styles.inactiveLink,
                      styles.navbarItem
                    )}
                    aria-current={
                      router.asPath === item.href ? 'page' : undefined
                    }
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className={styles.profileUsernameText}>
              {session.user.name}
            </div>
            <div className={styles.profileContainer}>
              {/* Profile dropdown */}
              <button
                className={styles.profileButton}
                onClick={() => signOut()}
              >
                <Image
                  src={session.user.image as string}
                  width={38}
                  height={38}
                  alt='profile image'
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return <></>
}

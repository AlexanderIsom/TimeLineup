import { useRouter } from "next/router";
import Link from "next/link";
import styles from "/styles/Navbar.module.scss";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/", current: true },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function CustomNavbar() {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.justify}>
          <div className={styles.navbarContainer}>
            <div className={styles.itemsContainer}>
              <div className={styles.title}>TimeLineup</div>
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
                    router.asPath === item.href ? "page" : undefined
                  }
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.profileUsernameText}>
            Demo user
          </div>
          <div className={styles.profileContainer}>
            {/* Profile dropdown */}
            <Link className={styles.profileButton} href={"/"}>
              <Image
                className={styles.profileIcon}
                src={`/UserIcons/demo.png`} width={500} height={500}
                alt="profile image"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );


}

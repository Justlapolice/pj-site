'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaHome, FaAddressBook, FaUserAlt, FaTshirt, FaCar, FaChartBar } from 'react-icons/fa';
import { SiDiscord } from 'react-icons/si';

interface User extends Record<string, any> {
  roles?: string[];
  image?: string | null;
}

interface SidebarProps {
  displayName: string;
  initials: string;
}

const Sidebar = ({ displayName, initials }: SidebarProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user as User | undefined;
  
  // Log des informations de session pour le débogage
  React.useEffect(() => {
    if (session?.user) {
      console.log('[SIDEBAR] Informations de session:', {
        guildNickname: session.user.guildNickname,
        globalName: session.user.name,
        displayName,
        initials,
        userImage: session.user.image
      });
    }
  }, [session, displayName, initials]);

  // Vérifier si l'utilisateur a le rôle requis pour voir les statistiques
  const canViewStatistics = user?.roles?.includes('1331527328219529216') || false;

  const avatarUrl =
    user?.image && user.image !== 'null'
      ? user.image
      : '/default-avatar.png';

  // Liens de base accessibles à tous
  const baseLinks = [
    { href: '/accueil', icon: <FaHome />, label: 'Accueil' },
    { href: '/infocrs', icon: <FaAddressBook />, label: 'Informations sur la CRS' },
    { href: '/organigramme', icon: <FaUserAlt />, label: 'Organigramme' },
    { href: '/tenues', icon: <FaTshirt />, label: 'Tenues' },
    { href: '/vehicules', icon: <FaCar />, label: 'Véhicules' },
  ];

  // Ajouter le lien des statistiques si l'utilisateur a le rôle requis
  const adminLinks = canViewStatistics 
    ? [{ href: '/statistiques', icon: <FaChartBar />, label: 'Statistiques' }]
    : [];

  // Fusionner les tableaux de liens
  const links = [...baseLinks, ...adminLinks];

  return (
    <aside style={styles.sidebar}>
      {/* USER */}
      <div style={styles.user}>
        <Image
          src={avatarUrl}
          alt="Avatar"
          width={50}
          height={50}
          style={styles.avatar}
        />
        <div>
          <p style={styles.name}>{displayName}</p>
          <p style={styles.status}>Connecté</p>
        </div>
      </div>

      {/* LINKS */}
      <nav style={styles.nav}>
        {links.map(({ href, icon, label }) => {
          const isActive = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link href={href} key={href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  ...styles.link,
                  backgroundColor: isActive
                    ? 'rgba(37, 99, 235, 0.25)'
                    : 'transparent ',
                  color: isActive ? '#fff' : '#cbd5e1',
                  transform: isActive ? 'scale(1.02)' : 'none',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    'rgba(37, 99, 235, 0.15)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = isActive
                    ? 'rgba(37, 99, 235, 0.25)'
                    : 'transparent')
                }
              >
                <span style={styles.icon}>{icon}</span>
                <span>{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div style={styles.footer}>
        <SiDiscord size={18} />
        <span style={{ marginLeft: 8 }}>Connecté via Discord</span>
      </div>
    </aside>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: '270px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    background: 'rgba(17, 24, 39, 0.95)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    zIndex: 50,
    boxShadow: '4px 0 15px rgba(0,0,0,0.2)',
    overflowY: 'auto',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '12px 8px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    position: 'relative',
    zIndex: 10,
  },
  avatar: {
    borderRadius: '50%',
    border: '2px solid #2563eb',
    boxShadow: '0 0 10px #2563eb60',
    objectFit: 'cover',
  },
  name: {
    margin: 0,
    fontWeight: 600,
    color: '#fff',
  },
  status: {
    margin: 0,
    fontSize: 13,
    color: '#94a3b8',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flexGrow: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 16px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 500,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  icon: {
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
  },
  footer: {
    marginTop: 30,
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: 16,
    fontSize: 13,
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',

  },
};

export default Sidebar;

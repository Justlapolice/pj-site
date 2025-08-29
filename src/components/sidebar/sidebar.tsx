"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  FaHome,
  FaAddressBook,
  FaUserAlt,
  FaTshirt,
  FaCar,
  FaChartBar,
  FaFile,
} from "react-icons/fa";
import { SiDiscord } from "react-icons/si";
import { FaFileArrowUp } from "react-icons/fa6";

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

  const canViewStatistics =
    user?.roles?.includes("1331527328219529216") || false;

  const avatarUrl =
    user?.image && user.image !== "null" ? user.image : "/default-avatar.png";

  const baseLinks = [
    { href: "/accueil", icon: <FaHome />, label: "Accueil" },
    {
      href: "/infopj",
      icon: <FaAddressBook />,
      label: "Informations et règlement",
    },
    { href: "/organigramme", icon: <FaUserAlt />, label: "Organigramme" },
    { href: "/tenues", icon: <FaTshirt />, label: "Tenues" },
    { href: "/vehicules", icon: <FaCar />, label: "Véhicules" },
    { href: "/enquetes", icon: <FaFile />, label: "Enquêtes" },
    {
      href: "/rapportvacation",
      icon: <FaFileArrowUp />,
      label: "Rapport de patrouille",
    },
  ];

  const adminLinks = canViewStatistics
    ? [{ href: "/statistiques", icon: <FaChartBar />, label: "Statistiques" }]
    : [];

  const links = [...baseLinks, ...adminLinks];

  return (
    <aside style={styles.sidebar}>
      {/* USER CARD */}
      <div style={styles.userCard}>
        <div style={styles.avatarWrapper}>
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={60}
            height={60}
            style={styles.avatar}
          />
          <div style={styles.avatarHalo} />
        </div>
        <div style={styles.userInfo}>
          <button
            style={styles.userName}
            onClick={(e) => {
              e.preventDefault();
              void signOut({ callbackUrl: "/login" });
            }}
          >
            {displayName}
          </button>
          <span style={styles.userStatus}>En ligne</span>
        </div>
      </div>

      {/* NAV LINKS */}
      <nav style={styles.nav}>
        {links.map(({ href, icon, label }) => {
          const isActive =
            pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  ...styles.linkCard,
                  ...(isActive ? styles.activeLinkCard : {}),
                }}
              >
                <span style={styles.linkIcon}>{icon}</span>
                <span>{label}</span>
                {isActive && <span style={styles.activeBadge}></span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={styles.footerCard}>
        <SiDiscord size={22} color="#60A5FA" />
        <span style={{ marginLeft: 10 }}>Connecté via Discord</span>
      </div>
    </aside>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: 270,
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(5, 12, 48, 1)",
    display: "flex",
    flexDirection: "column",
    padding: 20,
    gap: 25,
    boxShadow: "8px 0 30px rgba(0,0,0,0.7)",
    zIndex: 100,
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: 20,
    background: "rgba(15,25,70,0.8)",
    position: "relative",
    overflow: "hidden",
  },
  avatarWrapper: {
    position: "relative",
    width: 60,
    height: 60,
  },
  avatar: {
    borderRadius: "50%",
    border: "2px solid #60A5FA",
    zIndex: 10,
    objectFit: "cover",
  },
  avatarHalo: {
    position: "absolute",
    top: -5,
    left: -5,
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "rgba(96,165,250,0.3)",
    filter: "blur(12px)",
    zIndex: 5,
    animation: "pulse 2s infinite",
  },
  userInfo: {
    marginLeft: 14,
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    background: "none",
    border: "none",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    padding: 0,
  },
  userStatus: {
    color: "#93C5FD",
    fontSize: 13,
    marginTop: 2,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    flexGrow: 1,
  },
  linkCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 16,
    fontWeight: 500,
    color: "#CBD5E1",
    fontSize: 15,
    position: "relative",
    cursor: "pointer",
    background: "rgba(10,20,60,0.5)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
  },
  activeLinkCard: {
    color: "#fff",
    transform: "scale(1.05)",
    background: "rgba(5,25,80,0.8)",
    boxShadow: "0 6px 16px rgba(96,165,250,0.5)",
  },
  activeBadge: {
    position: "absolute",
    right: 0,
    top: "10%",
    width: 6,
    height: "80%",
    background: "#60A5FA",
    borderRadius: 4,
  },
  linkIcon: {
    fontSize: 18,
    display: "flex",
    alignItems: "center",
  },
  footerCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: 18,
    background: "rgba(15,25,70,0.8)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
};

export default Sidebar;

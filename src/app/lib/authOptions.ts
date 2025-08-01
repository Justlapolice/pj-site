// import provider et session

import { DefaultSession, NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

declare module "next-auth" {
  interface Session {
    user: {
      guildNickname?: string | null;
      avatar?: string | null;
      roles?: string[];
    } & DefaultSession["user"]
  }
  
  interface User {
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordGuildNickname?: string | null;
    discordAvatar?: string | null;
    discordRoles?: string[];
    createdAt?: number;
    expired?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds guilds.members.read",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("[AUTH] Début du processus de connexion");
      if (account?.provider === "discord" && account.access_token) {
        const guildId = "865982689437286410";
        const requiredRoleId = "1397621439388975274";
        console.log("[AUTH] Compte Discord détecté, vérification du serveur et du rôle...");

        try {
          const res = await fetch(
            `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          if (!res.ok) {
            console.error("[AUTH ERREUR] L'utilisateur n'est pas dans le serveur ou erreur API:", await res.text());
            return false;
          }

          const data = await res.json();
          console.log("[AUTH] Données du membre:", JSON.stringify(data, null, 2));
          
          const hasRole = data.roles && data.roles.includes(requiredRoleId);
          console.log(`[AUTH] Rôle requis (${requiredRoleId}) présent:`, hasRole);

          if (!hasRole) {
            console.error("[AUTH ERREUR] Rôle manquant. Rôles de l'utilisateur:", data.roles);
            return false;
          }
        } catch (error) {
          console.error("Error during Discord auth:", error);
          return false; // Retourne false en cas d'erreur
        }
      }

      return true;
    },

    async jwt({ token, account, user }) {
      console.log("[JWT] Génération du token");
      if (account?.provider === "discord" && account.access_token) {
        const accessToken = account.access_token;
        const guildId = "865982689437286410";

        try {
          console.log("[JWT] Récupération des informations du serveur...");
          const guildRes = await fetch(
            `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
            {
              headers: { 
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
            }
          );
          
          if (!guildRes.ok) {
            console.error("[JWT ERREUR] Impossible de récupérer les infos du serveur:", await guildRes.text());
            throw new Error("Erreur lors de la récupération des informations du serveur");
          }
          
          const guildData = await guildRes.json();
          console.log("[JWT] Données du serveur:", JSON.stringify(guildData, null, 2));
          token.discordGuildNickname = guildData.nick || null;
          token.discordRoles = guildData.roles || [];

          console.log("[JWT] Récupération des informations utilisateur...");
          const userRes = await fetch(`https://discord.com/api/v10/users/@me`, {
            headers: { 
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
          });
          
          if (!userRes.ok) {
            console.error("[JWT ERREUR] Impossible de récupérer les infos utilisateur:", await userRes.text());
            throw new Error("Erreur lors de la récupération des informations utilisateur");
          }
          
          const userData = await userRes.json();
          console.log("[JWT] Données utilisateur:", JSON.stringify(userData, null, 2));

          const { id, avatar } = userData;
          token.discordAvatar = avatar
            ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${
                avatar.startsWith("a_") ? "gif" : "png"
              }?size=128`
            : null;
        } catch (err) {
          token.discordGuildNickname = null;
          token.discordAvatar = null;
        }

        token.createdAt = Date.now();
      }

      // Mark token as expired instead of returning null
      if (token.createdAt && typeof token.createdAt === 'number' && Date.now() - token.createdAt > 60 * 60 * 1000) {
        token.expired = true;
      } else {
        token.expired = false;
      }

      return token;
    },

    async session({ session, token }) {
      console.log("[SESSION] Création de la session");
      
      // Check if token is expired
      if (token.expired) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      if (!token || !session.user) {
        console.error("[SESSION ERREUR] Pas de token ou d'utilisateur disponible");
        return session;
      }
      
      // S'assurer que l'objet user existe
      session.user = session.user || {} as any;
      
      // Mettre à jour les propriétés de l'utilisateur
      session.user.guildNickname = token.discordGuildNickname || null;
      session.user.avatar = token.discordAvatar || null;
      session.user.roles = token.discordRoles || [];
      
      console.log("[SESSION] Session créée avec succès:", {
        user: session.user,
        expires: session.expires,
        hasToken: !!token
      });
      
      return session;
    },
  },
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

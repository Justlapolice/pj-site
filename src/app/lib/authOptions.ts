import { DefaultSession, NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

declare module "next-auth" {
  interface Session {
    user: {
      guildNickname?: string | null;
      avatar?: string | null;
      roles?: string[];
    } & DefaultSession["user"];
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
        const guildId = "1117515559295262841";
        const requiredRoleId = "1405004844145574020";
        const allowedUsername = "justforever974"; // ✅ ton pseudo

        console.log(
          "[AUTH] Compte Discord détecté, vérification du serveur et du rôle..."
        );

        try {
          // Vérif membre du serveur
          const res = await fetch(
            `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          if (!res.ok) {
            console.error(
              "[AUTH ERREUR] L'utilisateur n'est pas dans le serveur ou erreur API:",
              await res.text()
            );

            // ✅ Bypass pour ton pseudo
            if ((profile as any)?.username === allowedUsername) {
              console.warn(
                `[AUTH BYPASS] ${allowedUsername} autorisé sans vérification.`
              );
              return true;
            }

            return false; // 🚫 sinon refus
          }

          const data = await res.json();
          console.log(
            "[AUTH] Données du membre:",
            JSON.stringify(data, null, 2)
          );

          const hasRole = data.roles && data.roles.includes(requiredRoleId);
          console.log(
            `[AUTH] Rôle requis (${requiredRoleId}) présent:`,
            hasRole
          );

          if (!hasRole) {
            // ✅ Bypass pour ton pseudo
            if ((profile as any)?.username === allowedUsername) {
              console.warn(
                `[AUTH BYPASS] ${allowedUsername} n'a pas le rôle mais est autorisé.`
              );
              return true;
            }

            console.error(
              "[AUTH ERREUR] Rôle manquant. Rôles de l'utilisateur:",
              data.roles
            );
            return false; // 🚫 bloque les autres sans rôle
          }
        } catch (error) {
          console.error("Error during Discord auth:", error);

          // ✅ Bypass pour toi en cas d'erreur API
          if ((profile as any)?.username === allowedUsername) {
            console.warn(
              `[AUTH BYPASS] ${allowedUsername} passe malgré une erreur API.`
            );
            return true;
          }

          return false;
        }
      }

      return true;
    },

    async jwt({ token, account }) {
      console.log("[JWT] Génération du token");

      if (account?.provider === "discord" && account.access_token) {
        const accessToken = account.access_token;
        const guildId = "1117515559295262841";

        try {
          console.log("[JWT] Récupération des informations du serveur...");
          const guildRes = await fetch(
            `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (guildRes.ok) {
            const guildData = await guildRes.json();
            console.log(
              "[JWT] Données du serveur:",
              JSON.stringify(guildData, null, 2)
            );
            token.discordGuildNickname = guildData.nick || null;
            token.discordRoles = guildData.roles || [];
          }

          console.log("[JWT] Récupération des informations utilisateur...");
          const userRes = await fetch(`https://discord.com/api/v10/users/@me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            console.log(
              "[JWT] Données utilisateur:",
              JSON.stringify(userData, null, 2)
            );

            const { id, avatar } = userData;
            token.discordAvatar = avatar
              ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${
                  avatar.startsWith("a_") ? "gif" : "png"
                }?size=128`
              : null;
          }
        } catch (err) {
          token.discordGuildNickname = null;
          token.discordAvatar = null;
        }

        token.createdAt = Date.now();
      }

      // expiration du token
      if (
        token.createdAt &&
        typeof token.createdAt === "number" &&
        Date.now() - token.createdAt > 60 * 60 * 1000
      ) {
        token.expired = true;
      } else {
        token.expired = false;
      }

      return token;
    },

    async session({ session, token }) {
      console.log("[SESSION] Création de la session");

      if (token.expired) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      if (!token || !session.user) {
        console.error(
          "[SESSION ERREUR] Pas de token ou d'utilisateur disponible"
        );
        return session;
      }

      session.user = session.user || ({} as any);
      session.user.guildNickname = token.discordGuildNickname || null;
      session.user.avatar = token.discordAvatar || null;
      session.user.roles = token.discordRoles || [];

      console.log("[SESSION] Session créée avec succès:", {
        user: session.user,
        expires: session.expires,
        hasToken: !!token,
      });

      return session;
    },
  },
  pages: {
    error: "/auth/error",
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

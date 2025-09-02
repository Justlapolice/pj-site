"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../components/sidebar/sidebar";
import { Effectif } from "@prisma/client";
import JustLoggedInToast from "./JustLoggedInToast";
import WelcomeCards from "../../components/accueil/cardaccueil/WelcomeCards";
import StatsSection from "../../components/accueil/statsaccueil/StatsSection";
import HeaderAccueil from "../../components/accueil/headeraccueil/HeaderAccueil";

const roleImages: Record<string, string> = {
  "1221836487516225668": "/grades/admin.png",
  "1117516044408471642": "/grades/compolice.png",
  "1201527681209090058": "/grades/cdtd.png",
  "1117516048397246585": "/grades/cdt.png",
  "1117516050314051594": "/grades/cptltn.png",
  "1117516054999093260": "/grades/majrulp.png",
  "554624526210695218": "/grades/meex.png",
  "1117516055804399697": "/grades/maj.png",
  "1117516058681688074": "/grades/gpx.png",
  "1117516059763810375": "/grades/gpxs.png",
  "1117516061026291843": "/grades/elvgpx.png",
  "1117516061957439589": "/grades/pa.png",
};

// Mapping des rôles Discord vers les grades
const roleToGrade: Record<string, string> = {
  // CEA
  "1117516061957439589": "Policier Adjoint",
  "1117516061026291843": "Élève Gardien de la Paix",
  "1117516059763810375": "Gardien de la Paix Stagiaire",
  "1117516058681688074": "Gardien de la Paix",
  "1117516055804399697": "Major",
  "554624526210695218": "Major Exceptionnel",
  "1117516054999093260": "Major RULP",

  // CC
  "1117516050314051594": "Lieutenant Capitaine",
  "1117516048397246585": "Commandant",
  "1201527681209090058": "Commandant Divisionnaire",

  // CCD

  "1117516044408471642": "Commissaire de Police",
  "1221836487516225668": "Commissaire Général",
};

const roleToQualifications: Record<string, string> = {
  "1117516079099564175": "Agent de Police Judiciaire ",
  "1117516078055161926": "Officier de Police Judiciaire",
};

const postePJ: Record<string, string> = {
  "1117516102898036756": "Membre PJ",
  "1117516088196997181": "Adjoint PJ",
  "1358837249751384291": "Responsable PJ",
};

export default function AccueilIntranet() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as
    | { guildNickname?: string; name?: string | null; roles?: string[] }
    | undefined;

  const getGradeInfo = (roles?: string[]) => {
    if (!roles) return { grade: null, roleId: null };
    for (const roleId of roles) {
      if (roleToGrade[roleId]) {
        return { grade: roleToGrade[roleId], roleId };
      }
    }
    return { grade: null, roleId: null };
  };

  const { grade, roleId: gradeRoleId } = getGradeInfo(user?.roles);

  const getQualificationInfo = (roles?: string[]) => {
    if (!roles) return { qualification: null, roleId: null };
    for (const roleId of roles) {
      if (roleToQualifications[roleId]) {
        return { qualification: roleToQualifications[roleId], roleId };
      }
    }
    return { qualification: null, roleId: null };
  };

  const { qualification } = getQualificationInfo(user?.roles);

  const getPostePJInfo = (roles?: string[]) => {
    if (!roles) return { postePJName: null, roleId: null };
    for (const roleId of roles) {
      if (postePJ[roleId]) {
        return { postePJName: postePJ[roleId], roleId };
      }
    }
    return { postePJName: null, roleId: null };
  };

  const { postePJName } = getPostePJInfo(user?.roles);

  const displayName = user?.guildNickname || user?.name || "Utilisateur";
  const cleanDisplayName = displayName.replace(/^\s*(\[[^\]]*\]\s*)+/g, "");
  const pathname = usePathname();
  const [effectifs, setEffectifs] = useState<Effectif[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Déconnexion automatique toutes les heures
  useEffect(() => {
    const timer = setInterval(() => {
      signOut({
        callbackUrl: "/login",
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  // Génération des initiales à partir du nom nettoyé
  const initials = cleanDisplayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  // Récupération des données des effectifs
  useEffect(() => {
    const fetchEffectifs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // URL complète pour local et prod
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const response = await fetch(`${baseUrl}/api/effectifs`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "Erreur lors du fetch des effectifs:",
            response.status,
            errorText
          );
          throw new Error(
            `Erreur HTTP ${response.status}: ${
              errorText || "Impossible de charger les données"
            }`
          );
        }

        const data = await response.json();

        // Normalisation des formations pour éviter les erreurs
        const normalizedData = data.map((e: any) => ({
          ...e,
          formations: Array.isArray(e.formations) ? e.formations : [],
        }));

        setEffectifs(normalizedData);
      } catch (err: any) {
        console.error("Erreur lors du chargement des effectifs:", err);
        setError("Impossible de charger les données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEffectifs();
  }, []);

  const { totalEffectifs } = useMemo(() => {
    const total = effectifs.length;
    return {
      totalEffectifs: total,
    };
  }, [effectifs]);

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">
            Chargement de la page {pathname} en cours...
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="min-h-screen text-white flex">
      <Sidebar displayName={displayName} initials={initials} />
      <div className="flex-1 ml-[270px] relative z-10">
        <Suspense fallback={null}>
          <JustLoggedInToast displayName={displayName} />
        </Suspense>

        <HeaderAccueil displayName={cleanDisplayName} />

        <main className="flex-1 p-6 lg:p-8">
          <WelcomeCards
            cleanDisplayName={cleanDisplayName}
            grade={grade}
            gradeRoleId={gradeRoleId}
            qualification={qualification}
            postePJ={postePJName}
            roleImages={roleImages}
            roles={user?.roles || []}
          />

          <StatsSection
            totalEffectifs={totalEffectifs}
            roles={user?.roles || []}
          />
        </main>
      </div>
    </div>
  );
}

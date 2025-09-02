"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "../../components/ui/use-toast";

export default function JustLoggedInToast({
  displayName,
}: {
  displayName: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasShownToast = useRef(false);

  useEffect(() => {
    const justLoggedIn = searchParams.get("justLoggedIn");
    if (justLoggedIn && !hasShownToast.current) {
      // Évite de mettre le toast succes en double
      hasShownToast.current = true;
      toast({
        title: "Authentification réussie",
        description: `Tu es authentifié en tant que ${displayName}.`,
        variant: "success",
      });

      router.replace("/accueil");
    }
  }, [searchParams, displayName, router]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "../../components/ui/use-toast";

export default function JustLoggedInToast({
  displayName,
}: {
  displayName: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const justLoggedIn = searchParams.get("justLoggedIn");
    if (justLoggedIn) {
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

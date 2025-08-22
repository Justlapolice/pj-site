import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../lib/authOptions"
import LoginClient from "./LoginClient"

export default async function Login() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/accueil")
  }

  return <LoginClient />
}

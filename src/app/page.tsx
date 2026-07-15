import { redirect } from "next/navigation";

// The product opens on the real first question: "where is worth going?"
export default function Home() {
  redirect("/discover");
}

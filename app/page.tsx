import Chat from "@/components/Chat";
import InviteGate from "@/components/InviteGate";
import { getSessionInvite } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Page() {
  const invite = await getSessionInvite();
  return <main className="shell">{invite ? <Chat /> : <InviteGate />}</main>;
}

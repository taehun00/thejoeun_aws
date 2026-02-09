// pages/tester/detail/[testerid].js
import { useRouter } from "next/router";
import TesterDetailPageView from "../../../components/tester/TesterDetailPage";

export default function TesterDetailPage() {
  const router = useRouter();
  const { testerid } = router.query;

  if (!testerid) return null;

  return <TesterDetailPageView testerid={testerid} />;
}
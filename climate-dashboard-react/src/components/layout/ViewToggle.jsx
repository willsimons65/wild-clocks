import { useNavigate, useLocation } from "react-router-dom";
import SegmentedControl from "@/components/ui/SegmentedControl";

export default function ViewToggle() {
  const navigate = useNavigate();
  const location = useLocation();

  const isInsights = location.pathname === "/insights";
  const selectedKey = isInsights ? "insights" : "feed";

  return (
    <SegmentedControl
      selectedKey={selectedKey}
      options={[
        { key: "feed", label: "Feed", onClick: () => navigate(-1) },
        { key: "insights", label: "Insights", onClick: () => navigate("/insights") },
      ]}
    />
  );
}


import SegmentedControl from "@/components/ui/SegmentedControl";

export default function ViewerSegmentedControl({ mode, setMode }) {
  return (
    <SegmentedControl
      selectedKey={mode}
      options={[
        { key: "photos", label: "Photos", onClick: () => setMode("photos") },
        { key: "compare", label: "Compare", onClick: () => setMode("compare") },
      ]}
    />
  );
}


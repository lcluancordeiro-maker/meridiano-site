import type { InteractiveWidget } from "@/data/curriculum";
import SlopeExplorer from "./SlopeExplorer";
import TwoPointExplorer from "./TwoPointExplorer";

const WIDGETS: Record<InteractiveWidget, React.ComponentType> = {
  "slope-explorer": SlopeExplorer,
  "two-point-explorer": TwoPointExplorer,
};

export default function InteractiveWidgetRenderer({ widget }: { widget: InteractiveWidget }) {
  const Widget = WIDGETS[widget];
  return <Widget />;
}

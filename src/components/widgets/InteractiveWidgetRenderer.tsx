import type { InteractiveWidget } from "@/data/curriculum";
import FractionVisualizer from "./FractionVisualizer";
import ProbabilitySpinner from "./ProbabilitySpinner";
import QuadraticExplorer from "./QuadraticExplorer";
import SlopeExplorer from "./SlopeExplorer";
import TwoPointExplorer from "./TwoPointExplorer";
import UnitCircleExplorer from "./UnitCircleExplorer";

const WIDGETS: Record<InteractiveWidget, React.ComponentType> = {
  "slope-explorer": SlopeExplorer,
  "two-point-explorer": TwoPointExplorer,
  "quadratic-explorer": QuadraticExplorer,
  "unit-circle-explorer": UnitCircleExplorer,
  "fraction-visualizer": FractionVisualizer,
  "probability-spinner": ProbabilitySpinner,
};

export default function InteractiveWidgetRenderer({ widget }: { widget: InteractiveWidget }) {
  const Widget = WIDGETS[widget];
  return <Widget />;
}

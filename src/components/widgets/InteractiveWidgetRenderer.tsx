import type { InteractiveWidget } from "@/data/curriculum";
import CompoundInterestExplorer from "./CompoundInterestExplorer";
import FractionVisualizer from "./FractionVisualizer";
import MeanMedianExplorer from "./MeanMedianExplorer";
import ProbabilitySpinner from "./ProbabilitySpinner";
import QuadraticExplorer from "./QuadraticExplorer";
import SlopeExplorer from "./SlopeExplorer";
import TangentLineExplorer from "./TangentLineExplorer";
import TwoPointExplorer from "./TwoPointExplorer";
import UnitCircleExplorer from "./UnitCircleExplorer";

const WIDGETS: Record<InteractiveWidget, React.ComponentType> = {
  "slope-explorer": SlopeExplorer,
  "two-point-explorer": TwoPointExplorer,
  "quadratic-explorer": QuadraticExplorer,
  "unit-circle-explorer": UnitCircleExplorer,
  "fraction-visualizer": FractionVisualizer,
  "probability-spinner": ProbabilitySpinner,
  "mean-median-explorer": MeanMedianExplorer,
  "compound-interest-explorer": CompoundInterestExplorer,
  "tangent-line-explorer": TangentLineExplorer,
};

export default function InteractiveWidgetRenderer({ widget }: { widget: InteractiveWidget }) {
  const Widget = WIDGETS[widget];
  return <Widget />;
}

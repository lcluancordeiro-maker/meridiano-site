import type { InteractiveWidget } from "@/data/curriculum";
import CompoundInterestExplorer from "./CompoundInterestExplorer";
import FractionVisualizer from "./FractionVisualizer";
import MeanMedianExplorer from "./MeanMedianExplorer";
import NormalDistributionExplorer from "./NormalDistributionExplorer";
import ProbabilitySpinner from "./ProbabilitySpinner";
import PythagoreanExplorer from "./PythagoreanExplorer";
import QuadraticExplorer from "./QuadraticExplorer";
import SequenceExplorer from "./SequenceExplorer";
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
  "pythagorean-explorer": PythagoreanExplorer,
  "sequence-explorer": SequenceExplorer,
  "normal-distribution-explorer": NormalDistributionExplorer,
};

export default function InteractiveWidgetRenderer({ widget }: { widget: InteractiveWidget }) {
  const Widget = WIDGETS[widget];
  return <Widget />;
}

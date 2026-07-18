import type { InteractiveWidget } from "@/data/curriculum";
import CombinationExplorer from "./CombinationExplorer";
import CompoundInterestExplorer from "./CompoundInterestExplorer";
import ConfusionMatrixExplorer from "./ConfusionMatrixExplorer";
import FractionVisualizer from "./FractionVisualizer";
import IntervalExplorer from "./IntervalExplorer";
import MatrixExplorer from "./MatrixExplorer";
import MeanMedianExplorer from "./MeanMedianExplorer";
import NormalDistributionExplorer from "./NormalDistributionExplorer";
import PercentageChangeExplorer from "./PercentageChangeExplorer";
import PrimeFactorizationExplorer from "./PrimeFactorizationExplorer";
import ProbabilitySpinner from "./ProbabilitySpinner";
import PythagoreanExplorer from "./PythagoreanExplorer";
import QuadraticExplorer from "./QuadraticExplorer";
import RegressionLineExplorer from "./RegressionLineExplorer";
import SequenceExplorer from "./SequenceExplorer";
import SlopeExplorer from "./SlopeExplorer";
import Solid3DExplorer from "./Solid3DExplorer";
import TangentLineExplorer from "./TangentLineExplorer";
import TruthTableExplorer from "./TruthTableExplorer";
import TwoPointExplorer from "./TwoPointExplorer";
import UnitCircleExplorer from "./UnitCircleExplorer";
import VectorExplorer from "./VectorExplorer";
import VennDiagramExplorer from "./VennDiagramExplorer";

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
  "regression-line-explorer": RegressionLineExplorer,
  "percentage-change-explorer": PercentageChangeExplorer,
  "confusion-matrix-explorer": ConfusionMatrixExplorer,
  "matrix-explorer": MatrixExplorer,
  "prime-factorization-explorer": PrimeFactorizationExplorer,
  "combination-explorer": CombinationExplorer,
  "solid-3d-explorer": Solid3DExplorer,
  "vector-explorer": VectorExplorer,
  "venn-diagram-explorer": VennDiagramExplorer,
  "truth-table-explorer": TruthTableExplorer,
  "interval-explorer": IntervalExplorer,
};

export default function InteractiveWidgetRenderer({ widget }: { widget: InteractiveWidget }) {
  const Widget = WIDGETS[widget];
  return <Widget />;
}

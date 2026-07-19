"use client";

import dynamic from "next/dynamic";
import type { InteractiveWidget } from "@/data/curriculum";

function WidgetLoading() {
  return <div className="h-48 animate-pulse rounded-2xl border border-border bg-surface" aria-hidden />;
}

// Each entry is code-split into its own chunk and only fetched when this
// specific widget renders — a topic page no longer pays for the other 23
// widgets it never uses. (Was previously one eagerly-loaded shared chunk
// covering all widgets on every /trilha/*/* page, widget or not.)
const WIDGETS: Record<InteractiveWidget, React.ComponentType> = {
  "slope-explorer": dynamic(() => import("./SlopeExplorer"), { ssr: false, loading: WidgetLoading }),
  "two-point-explorer": dynamic(() => import("./TwoPointExplorer"), { ssr: false, loading: WidgetLoading }),
  "quadratic-explorer": dynamic(() => import("./QuadraticExplorer"), { ssr: false, loading: WidgetLoading }),
  "unit-circle-explorer": dynamic(() => import("./UnitCircleExplorer"), { ssr: false, loading: WidgetLoading }),
  "fraction-visualizer": dynamic(() => import("./FractionVisualizer"), { ssr: false, loading: WidgetLoading }),
  "probability-spinner": dynamic(() => import("./ProbabilitySpinner"), { ssr: false, loading: WidgetLoading }),
  "mean-median-explorer": dynamic(() => import("./MeanMedianExplorer"), { ssr: false, loading: WidgetLoading }),
  "compound-interest-explorer": dynamic(() => import("./CompoundInterestExplorer"), { ssr: false, loading: WidgetLoading }),
  "tangent-line-explorer": dynamic(() => import("./TangentLineExplorer"), { ssr: false, loading: WidgetLoading }),
  "pythagorean-explorer": dynamic(() => import("./PythagoreanExplorer"), { ssr: false, loading: WidgetLoading }),
  "sequence-explorer": dynamic(() => import("./SequenceExplorer"), { ssr: false, loading: WidgetLoading }),
  "normal-distribution-explorer": dynamic(() => import("./NormalDistributionExplorer"), { ssr: false, loading: WidgetLoading }),
  "regression-line-explorer": dynamic(() => import("./RegressionLineExplorer"), { ssr: false, loading: WidgetLoading }),
  "percentage-change-explorer": dynamic(() => import("./PercentageChangeExplorer"), { ssr: false, loading: WidgetLoading }),
  "confusion-matrix-explorer": dynamic(() => import("./ConfusionMatrixExplorer"), { ssr: false, loading: WidgetLoading }),
  "matrix-explorer": dynamic(() => import("./MatrixExplorer"), { ssr: false, loading: WidgetLoading }),
  "prime-factorization-explorer": dynamic(() => import("./PrimeFactorizationExplorer"), { ssr: false, loading: WidgetLoading }),
  "combination-explorer": dynamic(() => import("./CombinationExplorer"), { ssr: false, loading: WidgetLoading }),
  "solid-3d-explorer": dynamic(() => import("./Solid3DExplorer"), { ssr: false, loading: WidgetLoading }),
  "vector-explorer": dynamic(() => import("./VectorExplorer"), { ssr: false, loading: WidgetLoading }),
  "venn-diagram-explorer": dynamic(() => import("./VennDiagramExplorer"), { ssr: false, loading: WidgetLoading }),
  "truth-table-explorer": dynamic(() => import("./TruthTableExplorer"), { ssr: false, loading: WidgetLoading }),
  "interval-explorer": dynamic(() => import("./IntervalExplorer"), { ssr: false, loading: WidgetLoading }),
  "bubble-sort-explorer": dynamic(() => import("./BubbleSortExplorer"), { ssr: false, loading: WidgetLoading }),
  "integer-line-explorer": dynamic(() => import("./IntegerLineExplorer"), { ssr: false, loading: WidgetLoading }),
  "equation-balance-explorer": dynamic(() => import("./EquationBalanceExplorer"), { ssr: false, loading: WidgetLoading }),
  "power-root-explorer": dynamic(() => import("./PowerRootExplorer"), { ssr: false, loading: WidgetLoading }),
  "proportion-percent-explorer": dynamic(() => import("./ProportionPercentExplorer"), { ssr: false, loading: WidgetLoading }),
  "quadratic-roots-explorer": dynamic(() => import("./QuadraticRootsExplorer"), { ssr: false, loading: WidgetLoading }),
  "complex-plane-explorer": dynamic(() => import("./ComplexPlaneExplorer"), { ssr: false, loading: WidgetLoading }),
  "probability-bar-explorer": dynamic(() => import("./ProbabilityBarExplorer"), { ssr: false, loading: WidgetLoading }),
  "probability-rules-explorer": dynamic(() => import("./ProbabilityRulesExplorer"), { ssr: false, loading: WidgetLoading }),
  "binomial-distribution-explorer": dynamic(() => import("./BinomialDistributionExplorer"), { ssr: false, loading: WidgetLoading }),
  "confidence-interval-explorer": dynamic(() => import("./ConfidenceIntervalExplorer"), { ssr: false, loading: WidgetLoading }),
  "hypothesis-test-explorer": dynamic(() => import("./HypothesisTestExplorer"), { ssr: false, loading: WidgetLoading }),
};

export default function InteractiveWidgetRenderer({ widget }: { widget: InteractiveWidget }) {
  const Widget = WIDGETS[widget];
  return <Widget />;
}

// ============================================================
// AARAMBHA — AI & Statistical Anomaly Detection Engine
// Problem Statement ID: 26102 (MoSPI - Smart Automation)
// ============================================================

/**
 * 1. Unit Price Anomaly Detector
 * Compares project unit cost against regional Schedule of Rates (SoR) / CPWD benchmark.
 */
function evaluatePriceAnomaly(unitPrice, benchmarkPrice) {
  const deviation = ((unitPrice - benchmarkPrice) / benchmarkPrice) * 100;
  let score = 0;
  let status = 'normal';
  let severity = 'low';

  if (deviation > 35) {
    score = Math.min(100, Math.round(50 + deviation));
    status = 'HIGH PRIORITY REVIEW';
    severity = 'high';
  } else if (deviation > 15) {
    score = Math.round(30 + deviation);
    status = 'REVIEW RECOMMENDED';
    severity = 'medium';
  } else if (deviation > 5) {
    score = Math.round(15 + deviation);
    status = 'WATCH';
    severity = 'low';
  }

  return {
    category: 'price-anomaly',
    deviationPct: parseFloat(deviation.toFixed(2)),
    score,
    status,
    severity,
    finding: deviation > 0
      ? `Unit rate is ${deviation.toFixed(1)}% higher than the regional benchmark of ₹${benchmarkPrice.toLocaleString('en-IN')}.`
      : `Unit rate is within acceptable peer baseline.`
  };
}

/**
 * 2. Bid Spread & Cartelization Detector
 * Analyzes difference between lowest bid (L1) and highest bid (L5) in tender.
 * A narrow spread (<3% vs peer median 6.8%) indicates synthetic competitive bidding.
 */
function evaluateBidPattern(bids, historicalMedianSpread = 6.8) {
  if (!bids || bids.length < 2) return null;

  const amounts = bids.map((b) => b.bidAmount).sort((a, b) => a - b);
  const lowest = amounts[0];
  const highest = amounts[amounts.length - 1];
  const currentSpread = ((highest - lowest) / lowest) * 100;

  const spreadDeficit = ((currentSpread - historicalMedianSpread) / historicalMedianSpread) * 100;
  let score = 0;
  let status = 'normal';

  if (currentSpread < 3.0) {
    score = 81;
    status = 'REVIEW RECOMMENDED';
  } else if (currentSpread < 4.5) {
    score = 55;
    status = 'WATCH';
  } else {
    score = 15;
    status = 'NORMAL';
  }

  return {
    category: 'bid-pattern',
    currentSpreadPct: parseFloat(currentSpread.toFixed(2)),
    historicalMedianSpreadPct: historicalMedianSpread,
    spreadDeficitPct: parseFloat(spreadDeficit.toFixed(1)),
    score,
    status,
    finding: currentSpread < 3.0
      ? `Tender spread of ${currentSpread.toFixed(1)}% is narrower than historical median of ${historicalMedianSpread}%. Potential bid rotation pattern.`
      : `Bid spread distribution conforms to standard competitive thresholds.`
  };
}

/**
 * 3. Physical vs Financial Decoupling Detector
 * Identifies front-loaded disbursement where funds paid out far exceed physical works completed.
 */
function evaluateExecutionVariance(physicalProgressPct, financialUtilizationPct, expectedProgressPct = 72) {
  const gap = physicalProgressPct - financialUtilizationPct; // negative if funds ahead of work
  let score = 0;
  let status = 'normal';

  if (gap < -15) {
    score = 75;
    status = 'HIGH PRIORITY REVIEW';
  } else if (gap < -5) {
    score = 54;
    status = 'REVIEW RECOMMENDED';
  } else {
    score = 10;
    status = 'NORMAL';
  }

  return {
    category: 'execution-variance',
    physicalProgressPct,
    financialUtilizationPct,
    gapPercentagePoints: parseFloat(gap.toFixed(1)),
    score,
    status,
    finding: gap < 0
      ? `Financial disbursement (${financialUtilizationPct.toFixed(1)}%) is ahead of on-ground physical progress (${physicalProgressPct}%). Gap: ${gap.toFixed(1)} percentage points.`
      : `Execution pace aligns with disbursement schedule.`
  };
}

/**
 * 4. Contractor Track Record & Delay Risk Evaluator
 */
function evaluateContractorRisk(delayRate, peerDelayRate = 9.4, cancelledCount = 0) {
  const ratio = delayRate / peerDelayRate;
  let score = Math.min(100, Math.round(ratio * 30 + cancelledCount * 5));

  return {
    category: 'contractor-history',
    delayRate,
    peerDelayRate,
    ratio: parseFloat(ratio.toFixed(2)),
    score,
    status: ratio > 2.0 ? 'REVIEW RECOMMENDED' : 'NORMAL',
    finding: `Contractor historical delay rate of ${delayRate}% is ${ratio.toFixed(1)}x higher than peer baseline (${peerDelayRate}%).`
  };
}

/**
 * 5. Composite Risk Score Engine
 * Weighted aggregation following MoSPI methodology guidelines
 */
function computeCompositeRisk(signals) {
  const weights = {
    'price-anomaly': 0.25,
    'execution-variance': 0.25,
    'payment-anomaly': 0.20,
    'contractor-history': 0.15,
    'bid-pattern': 0.10,
    'document-discrepancy': 0.05
  };

  let totalWeightedScore = 0;
  let totalWeightUsed = 0;

  for (const signal of signals) {
    const w = weights[signal.category] || 0.1;
    totalWeightedScore += signal.score * w;
    totalWeightUsed += w;
  }

  const finalScore = Math.round(totalWeightedScore / (totalWeightUsed || 1));
  let level = 'normal';
  if (finalScore >= 70) level = 'high';
  else if (finalScore >= 50) level = 'review';
  else if (finalScore >= 30) level = 'watch';

  return {
    overallScore: finalScore,
    riskLevel: level,
    label: level === 'high' ? 'HIGH PRIORITY REVIEW' : level === 'review' ? 'REVIEW RECOMMENDED' : level === 'watch' ? 'WATCH' : 'NORMAL',
    disclaimer: 'Risk scores are statistical indicators for human prioritization and do not independently establish fraud, corruption, or criminal liability.'
  };
}

module.exports = {
  evaluatePriceAnomaly,
  evaluateBidPattern,
  evaluateExecutionVariance,
  evaluateContractorRisk,
  computeCompositeRisk
};

export function canSubmitAssessmentDecision(
  mode: 'complete' | 'reject' | 'return',
  reason: string,
  answers: ('YES' | 'NO')[]
) {
  return mode === 'complete' ? answers.every((answer) => answer === 'YES') : !!reason.trim() || answers.includes('NO')
}

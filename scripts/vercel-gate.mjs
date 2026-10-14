/**
 * Build gate for Vercel. Runs before every Vercel build (see vercel.json).
 *
 * The gate stays closed until PORTFOLIO_PREVIEW_GATE=open is set for an
 * environment. Set it only after Deployment Protection is configured
 * (All Deployments, Vercel Authentication). Until then the build fails, so
 * no portfolio content is deployed. Local builds (no VERCEL=1) are not gated.
 */
if (process.env.VERCEL === '1' && process.env.PORTFOLIO_PREVIEW_GATE !== 'open') {
  console.error(
    [
      '',
      'Build gate closed. This deployment was stopped on purpose.',
      'Configure Deployment Protection first: Settings → Deployment Protection →',
      'All Deployments with Vercel Authentication. Then set PORTFOLIO_PREVIEW_GATE=open',
      'for the Preview environment and redeploy. See docs/DEPLOY-VERCEL.md.',
      '',
    ].join('\n'),
  );
  process.exit(1);
}
console.log(`Build gate open (VERCEL_ENV=${process.env.VERCEL_ENV ?? 'local'}).`);

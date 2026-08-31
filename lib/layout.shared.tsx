import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const gitConfig = {
  user: 'buildd-ai',
  repo: 'buildd',
  branch: 'main',
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em', color: '#c8956a' }}>
          buildd
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: 'Dashboard',
        url: 'https://buildd.dev',
        active: 'none',
      },
    ],
  };
}

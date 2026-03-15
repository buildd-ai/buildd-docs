import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const gitConfig = {
  user: 'buildd-ai',
  repo: 'buildd',
  branch: 'main',
};

export const memoryGitConfig = {
  user: 'buildd-ai',
  repo: 'memory',
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
        text: 'Memory Docs',
        url: '/memory',
        active: 'none',
      },
      {
        text: 'Dashboard',
        url: 'https://buildd.dev',
        active: 'none',
      },
    ],
  };
}

export function memoryBaseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Buildd Memory',
    },
    githubUrl: `https://github.com/${memoryGitConfig.user}/${memoryGitConfig.repo}`,
    links: [
      {
        text: 'Task Queue Docs',
        url: '/docs',
        active: 'none',
      },
      {
        text: 'Memory',
        url: 'https://buildd.dev/memory',
        active: 'none',
      },
    ],
  };
}

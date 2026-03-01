import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const gitConfig = {
  user: 'buildlabs',
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
      title: 'Buildd',
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
        text: 'Memory App',
        url: 'https://memory.buildd.dev',
        active: 'none',
      },
    ],
  };
}

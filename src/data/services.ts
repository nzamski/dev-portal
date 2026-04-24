import type { Service } from '../types';

export const ALL_SERVICES: Service[] = [
  // CI/CD
  { id: 'github',         name: 'GitHub',         url: 'https://github.com',                         category: 'ci-cd',         description: 'Code hosting & reviews' },
  { id: 'gitlab',         name: 'GitLab',          url: 'https://gitlab.com',                         category: 'ci-cd',         description: 'DevOps platform' },
  { id: 'jenkins',        name: 'Jenkins',         url: 'http://jenkins.internal',                    category: 'ci-cd',         description: 'Build automation' },
  { id: 'circleci',       name: 'CircleCI',        url: 'https://circleci.com',                       category: 'ci-cd',         description: 'Continuous integration' },
  { id: 'github-actions', name: 'Actions',         url: 'https://github.com/features/actions',        category: 'ci-cd',         description: 'GitHub workflows' },
  { id: 'argocd',         name: 'Argo CD',         url: 'https://argocd.internal',                    category: 'ci-cd',         description: 'GitOps CD for Kubernetes' },
  // Monitoring
  { id: 'grafana',        name: 'Grafana',         url: 'https://grafana.internal',                   category: 'monitoring',    description: 'Metrics & dashboards' },
  { id: 'datadog',        name: 'Datadog',         url: 'https://app.datadoghq.com',                  category: 'monitoring',    description: 'APM & observability' },
  { id: 'sentry',         name: 'Sentry',          url: 'https://sentry.io',                          category: 'monitoring',    description: 'Error tracking' },
  { id: 'pagerduty',      name: 'PagerDuty',       url: 'https://pagerduty.com',                      category: 'monitoring',    description: 'On-call & incidents' },
  { id: 'prometheus',     name: 'Prometheus',      url: 'https://prometheus.internal',                category: 'monitoring',    description: 'Metrics collection' },
  { id: 'kibana',         name: 'Kibana',          url: 'https://kibana.internal',                    category: 'monitoring',    description: 'Log visualization' },
  // Infra
  { id: 'aws',            name: 'AWS',             url: 'https://console.aws.amazon.com',             category: 'infra',         description: 'Cloud infrastructure' },
  { id: 'gcp',            name: 'GCP',             url: 'https://console.cloud.google.com',           category: 'infra',         description: 'Google Cloud' },
  { id: 'azure',          name: 'Azure',           url: 'https://portal.azure.com',                   category: 'infra',         description: 'Microsoft Cloud' },
  { id: 'terraform',      name: 'Terraform',       url: 'https://app.terraform.io',                   category: 'infra',         description: 'Infrastructure as code' },
  { id: 'k8s',            name: 'Kubernetes',      url: 'https://k8s.internal',                       category: 'infra',         description: 'Container orchestration' },
  { id: 'vault',          name: 'Vault',           url: 'https://vault.internal',                     category: 'infra',         description: 'Secrets management' },
  // Code & Docs
  { id: 'jira',           name: 'Jira',            url: 'https://jira.internal',                      category: 'code',          description: 'Issue tracking' },
  { id: 'confluence',     name: 'Confluence',      url: 'https://confluence.internal',                category: 'code',          description: 'Team wiki' },
  { id: 'sonar',          name: 'SonarQube',       url: 'https://sonar.internal',                     category: 'code',          description: 'Code quality' },
  { id: 'npm',            name: 'npm',             url: 'https://npmjs.com',                          category: 'code',          description: 'Package registry' },
  // Communication
  { id: 'slack',          name: 'Slack',           url: 'https://slack.com',                          category: 'communication', description: 'Team messaging' },
  { id: 'linear',         name: 'Linear',          url: 'https://linear.app',                         category: 'communication', description: 'Project management' },
  // Data
  { id: 'snowflake',      name: 'Snowflake',       url: 'https://snowflake.com',                      category: 'data',          description: 'Data warehouse' },
  { id: 'metabase',       name: 'Metabase',        url: 'https://metabase.internal',                  category: 'data',          description: 'Business analytics' },
  { id: 'airflow',        name: 'Airflow',         url: 'https://airflow.internal',                   category: 'data',          description: 'Workflow orchestration' },
  // Security
  { id: 'snyk',           name: 'Snyk',            url: 'https://snyk.io',                            category: 'security',      description: 'Dependency scanning' },
  { id: 'okta',           name: 'Okta',            url: 'https://okta.com',                           category: 'security',      description: 'Identity & SSO' },
];

export const DEFAULT_BOARD_IDS = [
  'github', 'grafana', 'jira',        'slack',   'aws',       'datadog',
  'k8s',    'sentry',  'terraform',   'argocd',  'linear',    'pagerduty',
  'vault',  'okta',    'github-actions', 'confluence', 'prometheus', 'snyk',
];

export const CATEGORY_LABELS: Record<string, string> = {
  'ci-cd':        'CI / CD',
  monitoring:     'Monitoring',
  infra:          'Infrastructure',
  code:           'Code & Docs',
  communication:  'Communication',
  data:           'Data',
  security:       'Security',
};

-- Dev Portal schema

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon_name   TEXT NOT NULL DEFAULT '',
  links       JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS board_items (
  position   SMALLINT NOT NULL,
  service_id TEXT     NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (service_id)
);

-- Seed
INSERT INTO settings (key, value) VALUES ('title', 'Dev Portal')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO services (id, name, description, links) VALUES
  ('github',         'GitHub',         'Code hosting & reviews',    '[{"label":"","url":"https://github.com"}]'),
  ('gitlab',         'GitLab',         'DevOps platform',           '[{"label":"","url":"https://gitlab.com"}]'),
  ('jenkins',        'Jenkins',        'Build automation',          '[{"label":"","url":"http://jenkins.internal"}]'),
  ('circleci',       'CircleCI',       'Continuous integration',    '[{"label":"","url":"https://circleci.com"}]'),
  ('github-actions', 'Actions',        'GitHub workflows',          '[{"label":"","url":"https://github.com/features/actions"}]'),
  ('argocd',         'Argo CD',        'GitOps CD for Kubernetes',  '[{"label":"","url":"https://argocd.internal"}]'),
  ('grafana',        'Grafana',        'Metrics & dashboards',      '[{"label":"","url":"https://grafana.internal"}]'),
  ('datadog',        'Datadog',        'APM & observability',       '[{"label":"","url":"https://app.datadoghq.com"}]'),
  ('sentry',         'Sentry',         'Error tracking',            '[{"label":"","url":"https://sentry.io"}]'),
  ('pagerduty',      'PagerDuty',      'On-call & incidents',       '[{"label":"","url":"https://pagerduty.com"}]'),
  ('prometheus',     'Prometheus',     'Metrics collection',        '[{"label":"","url":"https://prometheus.internal"}]'),
  ('kibana',         'Kibana',         'Log visualization',         '[{"label":"","url":"https://kibana.internal"}]'),
  ('aws',            'AWS',            'Cloud infrastructure',      '[{"label":"","url":"https://console.aws.amazon.com"}]'),
  ('gcp',            'GCP',            'Google Cloud',              '[{"label":"","url":"https://console.cloud.google.com"}]'),
  ('azure',          'Azure',          'Microsoft Cloud',           '[{"label":"","url":"https://portal.azure.com"}]'),
  ('terraform',      'Terraform',      'Infrastructure as code',    '[{"label":"","url":"https://app.terraform.io"}]'),
  ('k8s',            'Kubernetes',     'Container orchestration',   '[{"label":"","url":"https://k8s.internal"}]'),
  ('vault',          'Vault',          'Secrets management',        '[{"label":"","url":"https://vault.internal"}]'),
  ('jira',           'Jira',           'Issue tracking',            '[{"label":"","url":"https://jira.internal"}]'),
  ('confluence',     'Confluence',     'Team wiki',                 '[{"label":"","url":"https://confluence.internal"}]'),
  ('sonar',          'SonarQube',      'Code quality',              '[{"label":"","url":"https://sonar.internal"}]'),
  ('npm',            'npm',            'Package registry',          '[{"label":"","url":"https://npmjs.com"}]'),
  ('slack',          'Slack',          'Team messaging',            '[{"label":"","url":"https://slack.com"}]'),
  ('linear',         'Linear',         'Project management',        '[{"label":"","url":"https://linear.app"}]'),
  ('snowflake',      'Snowflake',      'Data warehouse',            '[{"label":"","url":"https://snowflake.com"}]'),
  ('metabase',       'Metabase',       'Business analytics',        '[{"label":"","url":"https://metabase.internal"}]'),
  ('airflow',        'Airflow',        'Workflow orchestration',    '[{"label":"","url":"https://airflow.internal"}]'),
  ('snyk',           'Snyk',           'Dependency scanning',       '[{"label":"","url":"https://snyk.io"}]'),
  ('okta',           'Okta',           'Identity & SSO',            '[{"label":"","url":"https://okta.com"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO board_items (position, service_id) VALUES
  (0,  'github'),
  (1,  'grafana'),
  (2,  'jira'),
  (3,  'slack'),
  (4,  'aws'),
  (5,  'datadog'),
  (6,  'k8s'),
  (7,  'sentry'),
  (8,  'terraform'),
  (9,  'argocd'),
  (10, 'linear'),
  (11, 'pagerduty'),
  (12, 'vault'),
  (13, 'okta'),
  (14, 'github-actions'),
  (15, 'confluence'),
  (16, 'prometheus'),
  (17, 'snyk')
ON CONFLICT (service_id) DO NOTHING;

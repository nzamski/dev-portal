-- Dev Portal schema

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon_name   TEXT NOT NULL DEFAULT '',
  links       JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS board_items (
  position   SMALLINT NOT NULL,
  service_id UUID     NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (service_id)
);

-- Seed
INSERT INTO settings (key, value) VALUES ('title', 'Dev Portal')
  ON CONFLICT (key) DO NOTHING;

INSERT INTO services (id, name, description, icon_name, links) VALUES
  ('b931b991-76e3-4f57-96fe-1f3a33182a3b', 'GitHub',         'Code hosting & reviews',    'github',          '[{"label":"","url":"https://github.com"}]'),
  ('0a0a2662-e95e-44bf-955b-924f8f624773', 'GitLab',         'DevOps platform',           'gitlab',          '[{"label":"","url":"https://gitlab.com"}]'),
  ('956060fa-8087-4451-a5dc-e781495d30ed', 'Jenkins',        'Build automation',          'jenkins',         '[{"label":"","url":"http://jenkins.internal"}]'),
  ('b1c88d04-375b-4f7a-a2be-d86896042ea5', 'CircleCI',       'Continuous integration',    'circleci',        '[{"label":"","url":"https://circleci.com"}]'),
  ('96064823-f924-4fb7-9f19-892cc23847f2', 'Actions',        'GitHub workflows',          'githubactions',   '[{"label":"","url":"https://github.com/features/actions"}]'),
  ('4f4074d3-1f23-44a5-bdb1-e0b82a42b8d8', 'Argo CD',        'GitOps CD for Kubernetes',  'argo',            '[{"label":"","url":"https://argocd.internal"}]'),
  ('f337ac4e-9852-410c-9a76-ccbd96fcb937', 'Grafana',        'Metrics & dashboards',      'grafana',         '[{"label":"","url":"https://grafana.internal"}]'),
  ('29380fef-03fe-494b-a5a3-edcdb426d28e', 'Datadog',        'APM & observability',       'datadog',         '[{"label":"","url":"https://app.datadoghq.com"}]'),
  ('e4a633e3-703b-402d-9bff-1b5a8bc4287e', 'Sentry',         'Error tracking',            'sentry',          '[{"label":"","url":"https://sentry.io"}]'),
  ('a56d41bf-0a67-4110-98fb-7b2cb579a4b1', 'PagerDuty',      'On-call & incidents',       'pagerduty',       '[{"label":"","url":"https://pagerduty.com"}]'),
  ('3e4cdf4c-8423-4517-bfd5-38919a9d1329', 'Prometheus',     'Metrics collection',        'prometheus',      '[{"label":"","url":"https://prometheus.internal"}]'),
  ('2a14162f-d709-453b-9dfb-e4fcdf02b25f', 'Kibana',         'Log visualization',         'kibana',          '[{"label":"","url":"https://kibana.internal"}]'),
  ('b3c387d4-aeef-4548-a2f0-6248a97236f1', 'AWS',            'Cloud infrastructure',      'MdCloud',         '[{"label":"","url":"https://console.aws.amazon.com"}]'),
  ('1ad65e38-f767-4a48-bed1-132cc602c55e', 'GCP',            'Google Cloud',              'googlecloud',     '[{"label":"","url":"https://console.cloud.google.com"}]'),
  ('5b3ec0e9-76eb-4da6-8ee6-afaa722ac208', 'Azure',          'Microsoft Cloud',           'MdStorage',       '[{"label":"","url":"https://portal.azure.com"}]'),
  ('026e0040-af23-4b8a-88e7-3e40078861a5', 'Terraform',      'Infrastructure as code',    'terraform',       '[{"label":"","url":"https://app.terraform.io"}]'),
  ('534cb355-8d1c-4632-87c8-0356df4b0b1d', 'Kubernetes',     'Container orchestration',   'kubernetes',      '[{"label":"","url":"https://k8s.internal"}]'),
  ('ea30faea-f340-4d88-af35-a4e0868bdb3c', 'Vault',          'Secrets management',        'vault',           '[{"label":"","url":"https://vault.internal"}]'),
  ('e765b8b0-fd7b-43ec-a847-d1efab155d18', 'Jira',           'Issue tracking',            'jira',            '[{"label":"","url":"https://jira.internal"}]'),
  ('5588e509-e6c5-4c81-b36c-b180de1be844', 'Confluence',     'Team wiki',                 'confluence',      '[{"label":"","url":"https://confluence.internal"}]'),
  ('275d1c68-a801-4801-bbc8-b253c89fc720', 'SonarQube',      'Code quality',              'sonarqubeserver', '[{"label":"","url":"https://sonar.internal"}]'),
  ('60b6f4fb-9f1c-488c-ab4a-6f2743243854', 'npm',            'Package registry',          'npm',             '[{"label":"","url":"https://npmjs.com"}]'),
  ('851129ba-2253-4a6d-b532-ab7a2786655a', 'Slack',          'Team messaging',            'MdChat',          '[{"label":"","url":"https://slack.com"}]'),
  ('a45c0831-d73e-4359-840c-e30ce7a81ec2', 'Linear',         'Project management',        'linear',          '[{"label":"","url":"https://linear.app"}]'),
  ('9f4ce230-a095-437e-b927-74ac68d09483', 'Snowflake',      'Data warehouse',            'snowflake',       '[{"label":"","url":"https://snowflake.com"}]'),
  ('6669af1e-7819-438d-a867-93015077bb9a', 'Metabase',       'Business analytics',        'metabase',        '[{"label":"","url":"https://metabase.internal"}]'),
  ('a9689bd4-2717-497f-ab15-c9c4a34b8bc1', 'Airflow',        'Workflow orchestration',    'apacheairflow',   '[{"label":"","url":"https://airflow.internal"}]'),
  ('59363439-4799-41fd-97d1-451789ea9ccb', 'Snyk',           'Dependency scanning',       'snyk',            '[{"label":"","url":"https://snyk.io"}]'),
  ('1b504e82-690d-483a-81dd-60c65c40d3a7', 'Okta',           'Identity & SSO',            'okta',            '[{"label":"","url":"https://okta.com"}]')
ON CONFLICT (id) DO UPDATE SET icon_name = EXCLUDED.icon_name;

INSERT INTO board_items (position, service_id) VALUES
  (0,  'b931b991-76e3-4f57-96fe-1f3a33182a3b'),
  (1,  'f337ac4e-9852-410c-9a76-ccbd96fcb937'),
  (2,  'e765b8b0-fd7b-43ec-a847-d1efab155d18'),
  (3,  '851129ba-2253-4a6d-b532-ab7a2786655a'),
  (4,  'b3c387d4-aeef-4548-a2f0-6248a97236f1'),
  (5,  '29380fef-03fe-494b-a5a3-edcdb426d28e'),
  (6,  '534cb355-8d1c-4632-87c8-0356df4b0b1d'),
  (7,  'e4a633e3-703b-402d-9bff-1b5a8bc4287e'),
  (8,  '026e0040-af23-4b8a-88e7-3e40078861a5'),
  (9,  '4f4074d3-1f23-44a5-bdb1-e0b82a42b8d8'),
  (10, 'a45c0831-d73e-4359-840c-e30ce7a81ec2'),
  (11, 'a56d41bf-0a67-4110-98fb-7b2cb579a4b1'),
  (12, 'ea30faea-f340-4d88-af35-a4e0868bdb3c'),
  (13, '1b504e82-690d-483a-81dd-60c65c40d3a7'),
  (14, '96064823-f924-4fb7-9f19-892cc23847f2'),
  (15, '5588e509-e6c5-4c81-b36c-b180de1be844'),
  (16, '3e4cdf4c-8423-4517-bfd5-38919a9d1329'),
  (17, '59363439-4799-41fd-97d1-451789ea9ccb')
ON CONFLICT (service_id) DO NOTHING;

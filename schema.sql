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
  ('a9689bd4-2717-497f-ab15-c9c4a34b8bc1', 'Airflow',    'Workflow orchestration', 'apacheairflow',   '[{"label":"","url":"https://airflow.internal"}]'),
  ('e765b8b0-fd7b-43ec-a847-d1efab155d18', 'Jira',       'Issue tracking',         'jira',            '[{"label":"","url":"https://jira.internal"}]'),
  ('5588e509-e6c5-4c81-b36c-b180de1be844', 'Confluence', 'Team wiki',              'confluence',      '[{"label":"","url":"https://confluence.internal"}]'),
  ('d5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f01', 'Cargo',     'Internal file storage',  'MdFolder',        '[{"label":"","url":"https://cargo.internal"}]'),
  ('d5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f02', 'Chat',      'Internal messaging',     'MdChat',          '[{"label":"","url":"https://chat.internal"}]'),
  ('0a0a2662-e95e-44bf-955b-924f8f624773', 'GitLab',     'DevOps platform',        'gitlab',          '[{"label":"","url":"https://gitlab.com"}]'),
  ('d5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f03', 'Kafka',     'Message streaming',      'apachekafka',     '[{"label":"","url":"https://kafka.internal"}]'),
  ('d5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f04', 'OpenShift', 'Container platform',     'redhatopenshift', '[{"label":"","url":"https://openshift.internal"}]'),
  ('2a14162f-d709-453b-9dfb-e4fcdf02b25f', 'Kibana',     'Log visualization',      'kibana',          '[{"label":"","url":"https://kibana.internal"}]'),
  ('f337ac4e-9852-410c-9a76-ccbd96fcb937', 'Grafana',    'Metrics & dashboards',   'grafana',         '[{"label":"","url":"https://grafana.internal"}]'),
  ('d5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f05', 'Splunk',    'Log analysis',           'splunk',          '[{"label":"","url":"https://splunk.internal"}]'),
  ('d5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f06', 'Portal',    'Cloud developer portal', 'MdCloud',         '[{"label":"","url":"https://portal.internal"}]')
ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name   = EXCLUDED.icon_name,
  links       = EXCLUDED.links;

INSERT INTO board_items (position, service_id) VALUES
  (0,  'a9689bd4-2717-497f-ab15-c9c4a34b8bc1'),
  (1,  'e765b8b0-fd7b-43ec-a847-d1efab155d18'),
  (2,  '5588e509-e6c5-4c81-b36c-b180de1be844'),
  (3,  'd5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f01'),
  (4,  'd5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f02'),
  (5,  '0a0a2662-e95e-44bf-955b-924f8f624773'),
  (6,  'd5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f03'),
  (7,  'd5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f04'),
  (8,  '2a14162f-d709-453b-9dfb-e4fcdf02b25f'),
  (9,  'f337ac4e-9852-410c-9a76-ccbd96fcb937'),
  (10, 'd5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f05'),
  (11, 'd5e6f7a8-b9c0-4d1e-8f2a-3b4c5d6e7f06')
ON CONFLICT (service_id) DO UPDATE SET position = EXCLUDED.position;

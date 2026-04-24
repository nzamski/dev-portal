import {
  SiGithub, SiGitlab, SiJenkins, SiCircleci, SiGithubactions, SiArgo,
  SiGrafana, SiDatadog, SiSentry, SiPagerduty, SiPrometheus, SiKibana,
  SiGooglecloud, SiTerraform, SiKubernetes, SiVault,
  SiJira, SiConfluence, SiSonarqubeserver, SiNpm,
  SiSlack, SiLinear,
  SiSnowflake, SiMetabase, SiApacheairflow,
  SiSnyk, SiOkta,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export type IconData = { Icon: IconType | null; hex: string; fallbackLabel?: string };

export const SERVICE_ICONS: Record<string, IconData> = {
  github:           { Icon: SiGithub,            hex: '181717' },
  gitlab:           { Icon: SiGitlab,            hex: 'FC6D26' },
  jenkins:          { Icon: SiJenkins,           hex: 'D24939' },
  circleci:         { Icon: SiCircleci,          hex: '343434' },
  'github-actions': { Icon: SiGithubactions,     hex: '2088FF' },
  argocd:           { Icon: SiArgo,              hex: 'EF7B4D' },
  grafana:          { Icon: SiGrafana,           hex: 'F46800' },
  datadog:          { Icon: SiDatadog,           hex: '632CA6' },
  sentry:           { Icon: SiSentry,            hex: '362D59' },
  pagerduty:        { Icon: SiPagerduty,         hex: '06AC38' },
  prometheus:       { Icon: SiPrometheus,        hex: 'E6522C' },
  kibana:           { Icon: SiKibana,            hex: '005571' },
  aws:              { Icon: FaAws,               hex: 'FF9900' },
  gcp:              { Icon: SiGooglecloud,       hex: '4285F4' },
  azure:            { Icon: null,                hex: '0078D4', fallbackLabel: 'Az' },
  terraform:        { Icon: SiTerraform,         hex: '7B42BC' },
  k8s:              { Icon: SiKubernetes,        hex: '326CE5' },
  vault:            { Icon: SiVault,             hex: 'FFEC6E' },
  jira:             { Icon: SiJira,              hex: '0052CC' },
  confluence:       { Icon: SiConfluence,        hex: '172B4D' },
  sonar:            { Icon: SiSonarqubeserver,   hex: '4E9BCD' },
  npm:              { Icon: SiNpm,               hex: 'CB3837' },
  slack:            { Icon: SiSlack,             hex: '4A154B' },
  linear:           { Icon: SiLinear,            hex: '5E6AD2' },
  snowflake:        { Icon: SiSnowflake,         hex: '29B5E8' },
  metabase:         { Icon: SiMetabase,          hex: '509EE3' },
  airflow:          { Icon: SiApacheairflow,     hex: '017CEE' },
  snyk:             { Icon: SiSnyk,              hex: '4C4A73' },
  okta:             { Icon: SiOkta,              hex: '007DC1' },
};

export function resolveIconColor(serviceId: string): string {
  const iconData = SERVICE_ICONS[serviceId];
  if (!iconData) return 'rgba(255,255,255,0.4)';
  const { hex } = iconData;
  return parseInt(hex, 16) < 0x333333 ? '#e0e0e0' : `#${hex}`;
}

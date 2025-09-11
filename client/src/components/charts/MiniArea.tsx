import { vars } from '@client/app/theme.css';

export default function MiniArea({
  data,
  height = 80,
  stroke = vars.color.primary,
  fill = 'rgba(91,207,251,0.2)',
}: {
  data: number[];
  height?: number;
  stroke?: string;
  fill?: string;
}) {
  const w = 240;
  const h = height;
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - ((v - min) / range) * h] as const);
  const d = ['M ' + pts[0].join(' '), ...pts.slice(1).map((p) => 'L ' + p.join(' '))].join(' ');
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="trend">
      <path d={area} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth={2} />
    </svg>
  );
}

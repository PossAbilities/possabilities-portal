import { SKIN } from '../lib/tokens'
const INK = '#240530', P = '#48065A', T = '#66CCCC', K = '#EC008C', W = '#FFFFFF'
type Style = 'short' | 'long' | 'curly' | 'cap' | 'phones'

function HairHead({ skin, hair, style, cx = 50, cy = 34 }: { skin: string; hair: string; style: Style; cx?: number; cy?: number }) {
  return (
    <>
      {style === 'long' && <rect x={cx - 25} y={cy - 10} width={50} height={52} rx={22} fill={hair} />}
      {style === 'curly' ? <circle cx={cx} cy={cy + 2} r={21} fill={skin} /> : <circle cx={cx} cy={cy} r={22} fill={skin} />}
      {style === 'short' && <path d={`M${cx - 23} ${cy - 2} A23 23 0 0 1 ${cx + 23} ${cy - 2} Q${cx + 10} ${cy - 14} ${cx - 23} ${cy - 2}Z`} fill={hair} />}
      {style === 'long' && <path d={`M${cx - 23} ${cy + 2} A23 24 0 0 1 ${cx + 23} ${cy + 2} Q${cx + 8} ${cy - 14} ${cx - 23} ${cy + 2}Z`} fill={hair} />}
      {style === 'curly' && [[-17, -12], [-6, -19], [7, -19], [18, -11], [-22, 0], [22, 0]].map(([dx, dy], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r={9} fill={hair} />)}
      {style === 'cap' && <><path d={`M${cx - 23} ${cy - 2} A23 23 0 0 1 ${cx + 23} ${cy - 2}Z`} fill={hair} /><rect x={cx - 2} y={cy - 8} width={30} height={8} rx={4} fill={hair} /></>}
      {style === 'phones' && <><path d={`M${cx - 23} ${cy} A23 23 0 0 1 ${cx + 23} ${cy}`} stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round" /><rect x={cx - 30} y={cy - 6} width={12} height={22} rx={6} fill={hair} /><rect x={cx + 18} y={cy - 6} width={12} height={22} rx={6} fill={hair} /></>}
      <circle cx={cx - 8} cy={cy + 1} r={2.6} fill={INK} /><circle cx={cx + 8} cy={cy + 1} r={2.6} fill={INK} />
      <path d={`M${cx - 8} ${cy + 11} Q${cx} ${cy + 18} ${cx + 8} ${cy + 11}`} stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
    </>
  )
}
const ARMS: Record<string, number[][]> = { wave: [[31, 72, 14, 112], [69, 72, 90, 34]], cheer: [[31, 72, 10, 34], [69, 72, 90, 34]], stand: [[31, 72, 14, 112], [69, 72, 86, 112]] }
function Person({ x, y, s, skin, hair, style, top, bottom, pose = 'wave' }: { x: number; y: number; s: number; skin: string; hair: string; style: Style; top: string; bottom: string; pose?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={34} y={116} width={15} height={62} rx={7.5} fill={bottom} /><rect x={52} y={116} width={15} height={62} rx={7.5} fill={bottom} />
      <ellipse cx={40} cy={180} rx={13} ry={6.5} fill={INK} /><ellipse cx={62} cy={180} rx={13} ry={6.5} fill={INK} />
      <rect x={26} y={56} width={48} height={74} rx={24} fill={top} />
      {ARMS[pose].map(([ax, ay, bx, by], i) => <g key={i}><path d={`M${ax} ${ay} L${bx} ${by}`} stroke={top} strokeWidth={15} strokeLinecap="round" /><circle cx={bx} cy={by} r={8.5} fill={skin} /></g>)}
      <HairHead skin={skin} hair={hair} style={style} />
    </g>
  )
}
function Wheelchair({ x, y, s, skin, hair, style, top, bottom }: { x: number; y: number; s: number; skin: string; hair: string; style: Style; top: string; bottom: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={38} y={104} width={68} height={20} rx={10} fill={bottom} /><rect x={92} y={112} width={16} height={52} rx={8} fill={bottom} /><ellipse cx={104} cy={168} rx={14} ry={6.5} fill={INK} />
      <rect x={28} y={56} width={48} height={66} rx={24} fill={top} />
      <path d="M33 72 L18 106" stroke={top} strokeWidth={15} strokeLinecap="round" /><circle cx={18} cy={106} r={8.5} fill={skin} />
      <path d="M69 72 L90 36" stroke={top} strokeWidth={15} strokeLinecap="round" /><circle cx={90} cy={36} r={8.5} fill={skin} />
      <circle cx={46} cy={140} r={36} fill="none" stroke={INK} strokeWidth={7} /><circle cx={46} cy={140} r={5} fill={INK} />
      <path d="M30 104 V146 H100 L106 164" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx={112} cy={176} r={8} fill={INK} />
      <HairHead skin={skin} hair={hair} style={style} cx={52} cy={32} />
    </g>
  )
}
/** Five people cheering on the brand wave. Includes a wheelchair user and a headphone wearer. */
export function Crowd({ className, hills = true }: { className?: string; hills?: boolean }) {
  return (
    <svg viewBox="0 0 520 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true" className={className} style={{ display: 'block', width: '100%', height: '100%' }}>
      {hills && <path d="M0 300V240C4 222 20 212 44 208C92 198 160 208 230 224C330 246 420 214 520 176V300Z" fill={K} />}
      <Person x={18} y={56} s={0.98} skin={SKIN[1]} hair={INK} style="short" top={K} bottom={P} />
      <Person x={110} y={70} s={0.92} skin={SKIN[3]} hair={INK} style="curly" top={T} bottom={P} pose="cheer" />
      <Wheelchair x={196} y={66} s={0.98} skin={SKIN[0]} hair="#B5651D" style="long" top={W} bottom={P} />
      <Person x={318} y={60} s={0.98} skin={SKIN[2]} hair={INK} style="phones" top={P} bottom={INK} />
      <Person x={410} y={72} s={0.92} skin={SKIN[4]} hair={INK} style="short" top={W} bottom={INK} pose="cheer" />
      {hills && <path d="M0 300V272C6 260 26 252 52 250C130 240 190 252 260 258C350 272 430 246 520 214V300Z" fill={T} />}
    </svg>
  )
}

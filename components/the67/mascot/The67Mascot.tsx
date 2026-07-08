import type { MascotPose, MascotView } from "@/lib/the67/mascot/constants";
import { MASCOT_COLORS } from "@/lib/the67/mascot/constants";

interface The67MascotProps {
  view?: MascotView;
  pose?: MascotPose;
  /** Mirror for turnaround back-3/4 */
  flip?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  showGuides?: boolean;
}

interface LimbConfig {
  lx: number;
  ly: number;
  lrx: number;
  lry: number;
  la: number;
  rax: number;
  ray: number;
  rrx: number;
  rry: number;
  ra: number;
  llx: number;
  lly: number;
  llrx: number;
  llry: number;
  llrot: number;
  rlx: number;
  rly: number;
  rlrx: number;
  rlry: number;
  rlrot: number;
  bodyRot?: number;
  bodyY?: number;
}

function getPoseConfig(pose: MascotPose): LimbConfig {
  switch (pose) {
    case "curious":
      return {
        lx: 34, ly: 138, lrx: 11, lry: 7, la: -28,
        rax: 166, ray: 118, rrx: 11, rry: 7, ra: 42,
        llx: 72, lly: 248, llrx: 10, llry: 7, llrot: 4,
        rlx: 138, rly: 258, rlrx: 10, rlry: 7, rlrot: 10,
        bodyRot: 3, bodyY: 2,
      };
    case "playful":
      return {
        lx: 38, ly: 108, lrx: 11, lry: 7, la: -52,
        rax: 162, ray: 102, rrx: 11, rry: 7, ra: 52,
        llx: 68, lly: 252, llrx: 10, llry: 7, llrot: -6,
        rlx: 142, rly: 256, rlrx: 10, rlry: 7, rlrot: 8,
        bodyY: -6,
      };
    case "bold":
      return {
        lx: 28, ly: 142, lrx: 12, lry: 8, la: -8,
        rax: 172, ray: 132, rrx: 12, rry: 8, ra: 8,
        llx: 62, lly: 252, llrx: 11, llry: 8, llrot: -14,
        rlx: 148, rly: 252, rlrx: 11, rlry: 8, rlrot: 14,
      };
    case "gentle":
      return {
        lx: 36, ly: 152, lrx: 10, lry: 6, la: 12,
        rax: 164, ray: 148, rrx: 10, rry: 6, ra: -12,
        llx: 76, lly: 254, llrx: 9, llry: 6, llrot: 2,
        rlx: 134, rly: 260, rlrx: 9, rlry: 6, rlrot: 6,
        bodyY: 4,
      };
    case "dreamy":
      return {
        lx: 36, ly: 134, lrx: 10, lry: 6, la: -18,
        rax: 164, ray: 126, rrx: 10, rry: 6, ra: 18,
        llx: 74, lly: 246, llrx: 9, llry: 6, llrot: -4,
        rlx: 136, rly: 250, rlrx: 9, rlry: 6, rlrot: 4,
        bodyY: -10,
      };
    default:
      return {
        lx: 32, ly: 140, lrx: 11, lry: 7, la: -6,
        rax: 168, ray: 130, rrx: 11, rry: 7, ra: 6,
        llx: 70, lly: 250, llrx: 10, llry: 7, llrot: 0,
        rlx: 140, rly: 258, rlrx: 10, rlry: 7, rlrot: 8,
      };
  }
}

function VinylBody({
  variant,
  flip = false,
}: {
  variant: "front" | "side" | "back" | "threeQuarter";
  flip?: boolean;
}) {
  const sx = flip ? -1 : 1;
  const tx = flip ? 200 : 0;

  if (variant === "side") {
    return (
      <g transform={`translate(${tx},0) scale(${sx},1)`}>
        {/* 6 profile — dominant mass */}
        <path
          d="M88 52 C62 52 48 78 48 112 C48 146 62 168 88 176 C104 180 118 170 124 150 L132 96 C136 72 124 52 100 52 Z"
          fill={MASCOT_COLORS.body}
          stroke={MASCOT_COLORS.bodySeam}
          strokeWidth="1.2"
        />
        <path
          d="M88 52 C62 52 48 78 48 112 C48 146 62 168 88 176 C104 180 118 170 124 150 L132 96 C136 72 124 52 100 52 Z"
          fill="url(#vinylSideShade)"
        />
        {/* 7 profile edge */}
        <path
          d="M124 48 L148 48 C158 48 162 58 158 72 L142 168 C138 188 124 202 108 196 C98 192 94 176 100 154 L118 72 C122 56 130 48 142 48 Z"
          fill={MASCOT_COLORS.bodyShadow}
          stroke={MASCOT_COLORS.bodySeam}
          strokeWidth="1.2"
        />
        {/* counter hint */}
        <ellipse cx="78" cy="118" rx="16" ry="22" fill={MASCOT_COLORS.bodyHighlight} opacity="0.5" />
        {/* eyes — side shows 2 visible */}
        <circle cx="96" cy="78" r="3.2" fill={MASCOT_COLORS.eye} />
        <circle cx="112" cy="68" r="3.2" fill={MASCOT_COLORS.eye} />
      </g>
    );
  }

  if (variant === "back") {
    return (
      <g transform={`translate(${tx},0) scale(${sx},1)`}>
        <path
          d="M52 88 C52 48 92 34 112 54 C128 70 132 100 124 128 C116 156 92 172 72 164 C54 158 52 128 52 88 Z"
          fill={MASCOT_COLORS.body}
          stroke={MASCOT_COLORS.bodySeam}
          strokeWidth="1.2"
        />
        <path
          d="M128 44 L188 44 C202 44 208 56 202 74 L168 172 C160 202 138 218 116 208 C100 200 94 178 102 152 L132 74 C138 56 148 44 168 44 Z"
          fill={MASCOT_COLORS.body}
          stroke={MASCOT_COLORS.bodySeam}
          strokeWidth="1.2"
        />
        <path
          d="M52 88 C52 48 92 34 112 54 C128 70 132 100 124 128 C116 156 92 172 72 164 C54 158 52 128 52 88 Z"
          fill="url(#vinylBackShade)"
        />
        {/* seam line */}
        <path d="M108 148 Q120 152 132 148" fill="none" stroke={MASCOT_COLORS.bodySeam} strokeWidth="1" />
        {/* eyes on back — same positions, no expression change */}
        <circle cx="82" cy="78" r="3.2" fill={MASCOT_COLORS.eye} />
        <circle cx="98" cy="78" r="3.2" fill={MASCOT_COLORS.eye} />
        <circle cx="152" cy="64" r="3.2" fill={MASCOT_COLORS.eye} />
        <circle cx="170" cy="64" r="3.2" fill={MASCOT_COLORS.eye} />
      </g>
    );
  }

  if (variant === "threeQuarter") {
    return (
      <g transform={`translate(${tx},0) scale(${sx},1)`}>
        <path
          d="M48 90 C48 46 94 30 118 50 C136 66 140 98 132 128 C124 158 98 176 76 168 C58 162 48 132 48 90 Z"
          fill={MASCOT_COLORS.body}
          stroke={MASCOT_COLORS.bodySeam}
          strokeWidth="1.2"
        />
        <path
          d="M48 90 C48 46 94 30 118 50 C136 66 140 98 132 128 C124 158 98 176 76 168 C58 162 48 132 48 90 Z"
          fill="url(#vinylFrontShade)"
        />
        <ellipse cx="88" cy="112" rx="14" ry="20" fill={MASCOT_COLORS.bodyHighlight} opacity="0.35" />
        <path
          d="M122 42 L182 42 C196 42 204 54 198 72 L164 170 C156 198 134 214 112 204 C96 196 90 174 98 150 L128 72 C134 54 144 42 164 42 Z"
          fill={MASCOT_COLORS.body}
          stroke={MASCOT_COLORS.bodySeam}
          strokeWidth="1.2"
        />
        <path
          d="M158 42 L182 42 C192 42 198 52 194 66 L176 148 C170 170 158 184 144 178 C134 174 130 158 136 138 L152 66 C156 52 164 42 176 42 Z"
          fill={MASCOT_COLORS.bodyShadow}
          opacity="0.45"
        />
        <circle cx="86" cy="76" r="3.2" fill={MASCOT_COLORS.eye} />
        <circle cx="102" cy="76" r="3.2" fill={MASCOT_COLORS.eye} />
        <circle cx="156" cy="60" r="3.2" fill={MASCOT_COLORS.eye} />
        <circle cx="174" cy="60" r="3.2" fill={MASCOT_COLORS.eye} />
      </g>
    );
  }

  // front — canonical
  return (
    <g transform={`translate(${tx},0) scale(${sx},1)`}>
      <path
        d="M48 90 C48 46 94 30 118 50 C136 66 140 98 132 128 C124 158 98 176 76 168 C58 162 48 132 48 90 Z"
        fill={MASCOT_COLORS.body}
        stroke={MASCOT_COLORS.bodySeam}
        strokeWidth="1.2"
      />
      <path
        d="M48 90 C48 46 94 30 118 50 C136 66 140 98 132 128 C124 158 98 176 76 168 C58 162 48 132 48 90 Z"
        fill="url(#vinylFrontShade)"
      />
      <ellipse cx="88" cy="112" rx="14" ry="20" fill={MASCOT_COLORS.bodyHighlight} opacity="0.4" />
      <path
        d="M128 42 L188 42 C202 42 208 56 202 74 L168 172 C160 202 138 218 116 208 C100 200 94 178 102 152 L132 74 C138 56 148 44 168 44 Z"
        fill={MASCOT_COLORS.body}
        stroke={MASCOT_COLORS.bodySeam}
        strokeWidth="1.2"
      />
      <path
        d="M128 42 L188 42 C202 42 208 56 202 74 L168 172 C160 202 138 218 116 208 C100 200 94 178 102 152 L132 74 C138 56 148 44 168 44 Z"
        fill="url(#vinylFrontShade7)"
        opacity="0.6"
      />
      <circle cx="82" cy="76" r="3.2" fill={MASCOT_COLORS.eye} />
      <circle cx="98" cy="76" r="3.2" fill={MASCOT_COLORS.eye} />
      <circle cx="152" cy="60" r="3.2" fill={MASCOT_COLORS.eye} />
      <circle cx="170" cy="60" r="3.2" fill={MASCOT_COLORS.eye} />
    </g>
  );
}

function Limbs({ config }: { config: LimbConfig }) {
  return (
    <g>
      <ellipse
        cx={config.lx}
        cy={config.ly}
        rx={config.lrx}
        ry={config.lry}
        fill={MASCOT_COLORS.body}
        stroke={MASCOT_COLORS.bodySeam}
        strokeWidth="1"
        transform={`rotate(${config.la} ${config.lx} ${config.ly})`}
      />
      <ellipse
        cx={config.rax}
        cy={config.ray}
        rx={config.rrx}
        ry={config.rry}
        fill={MASCOT_COLORS.body}
        stroke={MASCOT_COLORS.bodySeam}
        strokeWidth="1"
        transform={`rotate(${config.ra} ${config.rax} ${config.ray})`}
      />
      <ellipse
        cx={config.llx}
        cy={config.lly}
        rx={config.llrx}
        ry={config.llry}
        fill={MASCOT_COLORS.body}
        stroke={MASCOT_COLORS.bodySeam}
        strokeWidth="1"
        transform={`rotate(${config.llrot} ${config.llx} ${config.lly})`}
      />
      <ellipse
        cx={config.rlx}
        cy={config.rly}
        rx={config.rlrx}
        ry={config.rlry}
        fill={MASCOT_COLORS.body}
        stroke={MASCOT_COLORS.bodySeam}
        strokeWidth="1"
        transform={`rotate(${config.rlrot} ${config.rlx} ${config.rly})`}
      />
    </g>
  );
}

function VinylDefs() {
  return (
    <defs>
      <linearGradient id="vinylFrontShade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={MASCOT_COLORS.bodyHighlight} />
        <stop offset="100%" stopColor={MASCOT_COLORS.bodyShadow} stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id="vinylFrontShade7" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={MASCOT_COLORS.bodyHighlight} />
        <stop offset="100%" stopColor={MASCOT_COLORS.bodyShadow} stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="vinylSideShade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={MASCOT_COLORS.bodyHighlight} />
        <stop offset="100%" stopColor={MASCOT_COLORS.bodyShadow} stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="vinylBackShade" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={MASCOT_COLORS.bodyHighlight} />
        <stop offset="100%" stopColor={MASCOT_COLORS.bodyShadow} stopOpacity="0.3" />
      </linearGradient>
    </defs>
  );
}

function MascotFigure({
  bodyVariant,
  pose = "neutral",
  flip = false,
  showGuides = false,
}: {
  bodyVariant: "front" | "side" | "back" | "threeQuarter";
  pose?: MascotPose;
  flip?: boolean;
  showGuides?: boolean;
}) {
  const config = getPoseConfig(pose);
  const rot = config.bodyRot ?? 0;
  const dy = config.bodyY ?? 0;

  return (
    <g transform={`rotate(${rot} 100 ${140 + dy}) translate(0 ${dy})`}>
      <Limbs config={config} />
      <VinylBody variant={bodyVariant} flip={flip} />
      {showGuides ? (
        <rect
          x="40"
          y="36"
          width="160"
          height="230"
          fill="none"
          stroke={MASCOT_COLORS.bodySeam}
          strokeWidth="0.5"
          strokeDasharray="4 4"
          opacity="0.4"
        />
      ) : null}
    </g>
  );
}

export function The67Mascot({
  view = "front",
  pose = "neutral",
  flip = false,
  width = "100%",
  height = "100%",
  className = "",
  showGuides = false,
}: The67MascotProps) {
  const bodyMap: Record<string, "front" | "side" | "back" | "threeQuarter"> = {
    front: "front",
    side: "side",
    back: "back",
    threeQuarter: "threeQuarter",
  };

  if (view === "material") {
    return (
      <svg
        viewBox="0 0 200 120"
        width={width}
        height={height}
        className={className}
        aria-label="THE67 mascot material reference"
      >
        <rect width="200" height="120" fill={MASCOT_COLORS.void} />
        <rect x="24" y="24" width="72" height="72" rx="4" fill={MASCOT_COLORS.body} stroke={MASCOT_COLORS.bodySeam} />
        <rect x="24" y="24" width="72" height="72" rx="4" fill="url(#vinylFrontShade)" />
        <text x="108" y="44" fill={MASCOT_COLORS.body} fontSize="9" fontFamily="system-ui" opacity="0.8">Matte Vinyl</text>
        <text x="108" y="58" fill={MASCOT_COLORS.bodySeam} fontSize="7" fontFamily="system-ui">#FFFFFF body</text>
        <text x="108" y="70" fill={MASCOT_COLORS.bodySeam} fontSize="7" fontFamily="system-ui">Soft diffuse highlight</text>
        <text x="108" y="82" fill={MASCOT_COLORS.bodySeam} fontSize="7" fontFamily="system-ui">No gloss · No metallic</text>
        <VinylDefs />
      </svg>
    );
  }

  if (view === "scale") {
    return (
      <svg
        viewBox="0 0 280 200"
        width={width}
        height={height}
        className={className}
        aria-label="THE67 mascot scale reference"
      >
        <rect width="280" height="200" fill={MASCOT_COLORS.void} />
        <VinylDefs />
        <g transform="translate(20 10) scale(0.55)">
          <MascotFigure bodyVariant="front" pose="neutral" />
        </g>
        <line x1="150" y1="30" x2="150" y2="170" stroke={MASCOT_COLORS.bodySeam} strokeWidth="1" />
        <line x1="145" y1="30" x2="155" y2="30" stroke={MASCOT_COLORS.bodySeam} strokeWidth="1" />
        <line x1="145" y1="170" x2="155" y2="170" stroke={MASCOT_COLORS.bodySeam} strokeWidth="1" />
        <text x="162" y="104" fill={MASCOT_COLORS.bodySeam} fontSize="8" fontFamily="system-ui">72mm</text>
        <text x="162" y="118" fill={MASCOT_COLORS.body} fontSize="9" fontFamily="system-ui" opacity="0.7">Height M</text>
        <line x1="20" y1="180" x2="260" y2="180" stroke={MASCOT_COLORS.bodySeam} strokeWidth="0.8" />
        {["0", "25", "50", "75", "100mm"].map((label, i) => (
          <g key={label}>
            <line x1={20 + i * 60} y1="176" x2={20 + i * 60} y2="184" stroke={MASCOT_COLORS.bodySeam} strokeWidth="0.8" />
            <text x={20 + i * 60} y="196" fill={MASCOT_COLORS.bodySeam} fontSize="7" fontFamily="system-ui" textAnchor="middle">{label}</text>
          </g>
        ))}
      </svg>
    );
  }

  const bodyVariant = bodyMap[view] ?? "front";

  return (
    <svg
      viewBox="0 0 200 280"
      width={width}
      height={height}
      className={className}
      aria-label={`THE67 mascot ${view} view`}
      role="img"
    >
      <rect width="200" height="280" fill={MASCOT_COLORS.void} />
      <VinylDefs />
      <MascotFigure
        bodyVariant={bodyVariant}
        pose={pose}
        flip={flip}
        showGuides={showGuides}
      />
    </svg>
  );
}

export function MascotTurnaround() {
  const angles: Array<{ label: string; variant: "front" | "threeQuarter" | "side" | "back"; flip?: boolean }> = [
    { label: "Front", variant: "front" },
    { label: "3/4", variant: "threeQuarter" },
    { label: "Side", variant: "side" },
    { label: "3/4 Back", variant: "threeQuarter", flip: true },
    { label: "Back", variant: "back" },
  ];

  return (
    <svg viewBox="0 0 520 200" width="100%" aria-label="THE67 mascot turnaround sheet" role="img">
      <rect width="520" height="200" fill={MASCOT_COLORS.void} />
      <VinylDefs />
      {angles.map((angle, i) => (
        <g key={angle.label} transform={`translate(${i * 104} 0)`}>
          <g transform="translate(12 10) scale(0.38)">
            <MascotFigure bodyVariant={angle.variant} pose="neutral" flip={angle.flip} />
          </g>
          <text x="52" y="188" fill={MASCOT_COLORS.bodySeam} fontSize="8" fontFamily="system-ui" textAnchor="middle">
            {angle.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function MascotExpressionSheet() {
  const poses: MascotPose[] = ["neutral", "curious", "playful", "bold", "gentle", "dreamy"];
  const labels = ["Neutral", "Curious", "Playful", "Bold", "Gentle", "Dreamy"];

  return (
    <svg viewBox="0 0 620 200" width="100%" aria-label="THE67 mascot expression sheet" role="img">
      <rect width="620" height="200" fill={MASCOT_COLORS.void} />
      <VinylDefs />
      {poses.map((pose, i) => (
        <g key={pose} transform={`translate(${i * 103} 0)`}>
          <g transform="translate(8 8) scale(0.36)">
            <MascotFigure bodyVariant="front" pose={pose} />
          </g>
          <text x="52" y="188" fill={MASCOT_COLORS.bodySeam} fontSize="8" fontFamily="system-ui" textAnchor="middle">
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

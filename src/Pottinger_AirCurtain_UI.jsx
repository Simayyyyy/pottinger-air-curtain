import { useState, useEffect } from "react";

// Air Curtain (Luftvorhang) — Interactive UI Demo
// Pöttinger × Kunstuniversität Linz · Summer 2024 · Design by Simay Uslu
// Sized for iPhone 13 (390 × 844)

const GREEN = "#2E6B30";
const GREEN_LIGHT = "#4A9E4E";
const AIR_BLUE = "#5B9BD5";

const AirCurtainDevice = ({ active, pressure }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!active) { setFrame(0); return; }
    const interval = setInterval(() => setFrame(f => (f + 1) % 4), 160);
    return () => clearInterval(interval);
  }, [active]);

  const airOpacity = active ? (0.3 + (pressure / 100) * 0.4) : 0;
  const numStreams = Math.round(4 + (pressure / 100) * 5);

  return (
    <svg viewBox="0 0 310 185" width={310} height={185}>
      {/* Mower arm */}
      <rect x={8} y={52} width={294} height={18} rx={4} fill="#555"/>
      <rect x={8} y={52} width={294} height={5} rx={4} fill="#666"/>
      <rect x={8} y={63} width={294} height={3} rx={0} fill="#C8102E" opacity={0.7}/>

      {/* Air curtain unit */}
      <rect x={52} y={72} width={206} height={24} rx={4} fill="#D8D8D0"/>
      <rect x={54} y={74} width={202} height={10} rx={2.5} fill="#E8E8E0"/>
      {Array.from({length:20}).map((_,i)=>(
        <rect key={i} x={57+i*9} y={75.5} width={6} height={7} rx={1} fill="#BBBBAF"/>
      ))}
      <text x={155} y={92} textAnchor="middle" fill="#888" fontSize={5.5} fontFamily="system-ui" letterSpacing={1}>
        AIR CURTAIN — PÖTTINGER
      </text>
      <circle cx={62} cy={90} r={2.5} fill={active ? GREEN_LIGHT : "#444"}/>

      {/* SensoSafe yellow bracket */}
      <rect x={245} y={72} width={8} height={24} rx={1.5} fill="#F5C518" opacity={0.9}/>

      {/* ISOBUS line */}
      <path d="M 52 60 Q 28 44 18 35" stroke="#888" strokeWidth={1.2} strokeDasharray="3 2" fill="none"/>
      <circle cx={18} cy={35} r={3} fill="#333"/>
      <text x={20} y={31} fill="#666" fontSize={5.5} fontFamily="system-ui">ISOBUS</text>

      {/* Air streams */}
      {active && Array.from({length:numStreams}).map((_,i)=>{
        const xPos = 57 + (i * (196/(numStreams-1)));
        const yOff = (frame+i)%4 * 5;
        return (
          <g key={i}>
            {[0,1,2,3].map(j=>(
              <line key={j} x1={xPos} y1={98+j*16+yOff} x2={xPos} y2={106+j*16+yOff}
                stroke={AIR_BLUE} strokeWidth={1.1} opacity={airOpacity*(1-j*0.2)}/>
            ))}
            <polygon points={`${xPos-2.5},${162+yOff} ${xPos+2.5},${162+yOff} ${xPos},${167+yOff}`}
              fill={AIR_BLUE} opacity={airOpacity*0.6}/>
          </g>
        );
      })}

      {/* Curtain overlay */}
      {active && (
        <rect x={54} y={97} width={202} height={72} fill={AIR_BLUE}
          opacity={0.05+(pressure/100)*0.07} style={{transition:"opacity 0.5s"}}/>
      )}

      {/* Ground */}
      <rect x={0} y={175} width={310} height={10} fill="#3A6B2A" opacity={0.25}/>
      {[20,55,90,128,165,200,240,278].map((x,i)=>(
        <ellipse key={i} cx={x} cy={175} rx={3.5} ry={4.5} fill="#4A8A35" opacity={0.45}/>
      ))}

      {/* Insects - scattered when active */}
      <text x={active?18:36} y={active?145:158} fontSize={11} style={{transition:"all 0.9s ease"}} opacity={active?0.25:0.8}>🦋</text>
      <text x={active?272:240} y={active?140:160} fontSize={11} style={{transition:"all 0.9s ease"}} opacity={active?0.25:0.8}>🐝</text>
      <text x={active?140:155} y={active?168:175} fontSize={10} style={{transition:"all 0.9s ease"}} opacity={active?0.15:0.7}>🦟</text>
    </svg>
  );
};

const Toggle = ({ label, sub, active, onToggle, color=GREEN, disabled=false }) => (
  <button onClick={disabled?undefined:onToggle} style={{
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"13px 16px", borderRadius:12, width:"100%", marginBottom:8,
    border: active ? `2px solid ${color}` : "2px solid #2A2A2A",
    background: active ? "#0A0F1A" : "#1A1A1A",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition:"all 0.2s",
  }}>
    <div style={{textAlign:"left"}}>
      <div style={{color:active?"#fff":"#666",fontSize:14,fontWeight:700,fontFamily:"system-ui"}}>{label}</div>
      {sub && <div style={{color:active?color:"#444",fontSize:11,fontFamily:"system-ui",marginTop:2}}>{sub}</div>}
    </div>
    <div style={{width:44,height:24,borderRadius:12,background:active?color:"#333",position:"relative",transition:"background 0.2s",flexShrink:0}}>
      <div style={{position:"absolute",top:2,left:active?22:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
    </div>
  </button>
);

export default function AirCurtainUI() {
  const [mowerRunning, setMowerRunning] = useState(false);
  const [active, setActive] = useState(false);
  const [autoStart, setAutoStart] = useState(true);
  const [pressure, setPressure] = useState(75);

  useEffect(() => {
    if (mowerRunning && autoStart) setActive(true);
    if (!mowerRunning) setActive(false);
  }, [mowerRunning, autoStart]);

  const curtainOn = active && mowerRunning;

  return (
    <div style={{
      minHeight:"100vh", background:"#E8E6E1",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"system-ui,-apple-system,sans-serif", padding:"32px 20px",
    }}>
      <style>{`@keyframes pulse{0%,100%{opacity:0.4;}50%{opacity:1;}}`}</style>

      {/* iPhone 13 shell */}
      <div style={{
        width:390, height:844,
        background:"#111",
        borderRadius:54,
        boxShadow:"0 40px 120px rgba(0,0,0,0.55), inset 0 0 0 1.5px #3A3A3A, 0 0 0 10px #1C1C1C, 0 0 0 11px #3A3A3A",
        position:"relative", overflow:"hidden",
        display:"flex", flexDirection:"column",
      }}>
        {/* Side buttons */}
        <div style={{position:"absolute",left:-3,top:140,width:3,height:32,background:"#2A2A2A",borderRadius:"2px 0 0 2px"}}/>
        <div style={{position:"absolute",left:-3,top:190,width:3,height:56,background:"#2A2A2A",borderRadius:"2px 0 0 2px"}}/>
        <div style={{position:"absolute",left:-3,top:260,width:3,height:56,background:"#2A2A2A",borderRadius:"2px 0 0 2px"}}/>
        <div style={{position:"absolute",right:-3,top:180,width:3,height:80,background:"#2A2A2A",borderRadius:"0 2px 2px 0"}}/>

        {/* Screen */}
        <div style={{
          flex:1, background:"#181818",
          borderRadius:48, margin:2,
          overflow:"hidden", display:"flex", flexDirection:"column",
          position:"relative",
        }}>
          {/* Notch */}
          <div style={{
            position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
            width:148, height:33, background:"#111", borderRadius:"0 0 22px 22px",
            zIndex:10, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            <div style={{width:10,height:10,borderRadius:"50%",background:"#222"}}/>
            <div style={{width:42,height:10,borderRadius:5,background:"#1A1A1A"}}/>
          </div>

          {/* Status bar */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 24px 0",paddingTop:44}}>
            <span style={{color:"#fff",fontSize:13,fontWeight:600}}>9:41</span>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <span style={{color:"#fff",fontSize:11}}>●●●●</span>
              <span style={{color:"#fff",fontSize:11}}>WiFi</span>
              <span style={{color:"#fff",fontSize:11}}>🔋</span>
            </div>
          </div>

          {/* App header */}
          <div style={{padding:"12px 20px 10px",borderBottom:"1px solid #222"}}>
            <div style={{color:AIR_BLUE,fontSize:16,fontWeight:800,letterSpacing:2}}>AIR CURTAIN</div>
            <div style={{color:"#444",fontSize:10,letterSpacing:1.5,marginTop:1}}>PÖTTINGER LANDTECHNIK · PRODUCT 1</div>
          </div>

          {/* Scrollable content */}
          <div style={{flex:1,overflowY:"auto",padding:"0 20px 32px"}}>

            {/* Status badge */}
            <div style={{display:"flex",justifyContent:"center",marginTop:12,marginBottom:8}}>
              <div style={{
                display:"inline-flex",alignItems:"center",gap:6,
                padding:"5px 14px",borderRadius:20,
                background:curtainOn?"#0F1F0F":"#1A1A1A",
                border:`1px solid ${curtainOn?GREEN:"#2A2A2A"}`,
                transition:"all 0.3s",
              }}>
                <div style={{width:7,height:7,borderRadius:"50%",background:curtainOn?GREEN_LIGHT:"#444",boxShadow:curtainOn?`0 0 6px ${GREEN_LIGHT}`:"none",animation:curtainOn?"pulse 1.2s ease-in-out infinite":"none"}}/>
                <span style={{fontSize:11,fontWeight:700,color:curtainOn?GREEN_LIGHT:"#555",letterSpacing:1}}>
                  {curtainOn?"CURTAIN ACTIVE":"CURTAIN OFF"}
                </span>
              </div>
            </div>

            {/* Device illustration */}
            <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
              <AirCurtainDevice active={curtainOn} pressure={pressure}/>
            </div>

            {/* Mower start button */}
            <button
              onClick={()=>setMowerRunning(m=>!m)}
              style={{
                width:"100%",padding:"16px",borderRadius:14,border:"none",
                background:mowerRunning?"#1A0800":GREEN,
                color:mowerRunning?"#FF6B6B":"#fff",
                fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:1,
                marginBottom:10,
                boxShadow:mowerRunning?"inset 0 0 0 2px #FF6B6B40":"none",
                transition:"all 0.3s",
              }}>
              {mowerRunning?"■  STOP MOWER":"▶  START MOWER"}
            </button>

            {/* Air curtain toggle */}
            <Toggle
              label="Air Curtain"
              sub={!mowerRunning?"Start mower to activate":curtainOn?"Compressed air flowing":"Manually off"}
              active={curtainOn}
              onToggle={()=>mowerRunning&&setActive(a=>!a)}
              color={AIR_BLUE}
              disabled={!mowerRunning}
            />

            {/* Auto-start */}
            <div style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"11px 16px",borderRadius:12,marginBottom:8,
              border:`1px solid ${autoStart?GREEN+"50":"#222"}`,
              background:"#141414",
            }}>
              <div>
                <div style={{color:"#aaa",fontSize:13,fontWeight:600}}>Auto-start with Mower</div>
                <div style={{color:"#555",fontSize:11,marginTop:1}}>Activates when mowing begins</div>
              </div>
              <button onClick={()=>setAutoStart(a=>!a)} style={{
                width:40,height:22,borderRadius:11,background:autoStart?GREEN:"#333",
                border:"none",position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0,
              }}>
                <div style={{position:"absolute",top:2,left:autoStart?20:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
              </button>
            </div>

            {/* Pressure slider */}
            <div style={{padding:"12px 16px",borderRadius:12,border:"2px solid #2A2A2A",background:"#1A1A1A",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{color:curtainOn?"#ccc":"#555",fontSize:13,fontWeight:600}}>Air Pressure</span>
                <span style={{color:curtainOn?AIR_BLUE:"#444",fontSize:13,fontWeight:700}}>{pressure}%</span>
              </div>
              <input type="range" min={20} max={100} value={pressure}
                onChange={e=>setPressure(Number(e.target.value))}
                disabled={!curtainOn}
                style={{width:"100%",accentColor:AIR_BLUE,cursor:curtainOn?"pointer":"not-allowed",opacity:curtainOn?1:0.35}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:10,color:"#555"}}>LOW FLOW</span>
                <span style={{fontSize:10,color:"#555"}}>FULL PRESSURE</span>
              </div>
            </div>

            {/* Info strip */}
            <div style={{padding:"9px 14px",borderRadius:10,background:"#0A100A",border:`1px solid ${GREEN}30`,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:GREEN_LIGHT,flexShrink:0}}/>
              <span style={{fontSize:11,color:"#4A8A4E"}}>SensoSafe compatible · ISOBUS connected · Steel housing</span>
            </div>
          </div>

          {/* Home indicator */}
          <div style={{display:"flex",justifyContent:"center",paddingBottom:8,paddingTop:4}}>
            <div style={{width:130,height:5,borderRadius:3,background:"#3A3A3A"}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

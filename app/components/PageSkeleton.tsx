// Wiederverwendbare Skeleton-Komponente für Ladezustände
export default function PageSkeleton() {
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 20px" }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0 }
          100% { background-position: 600px 0 }
        }
        .sk {
          background: linear-gradient(90deg, #F3F4F6 25%, #E9EAEC 50%, #F3F4F6 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 10px;
        }
      `}</style>

      {/* Header skeleton */}
      <div style={{ marginBottom:28 }}>
        <div className="sk" style={{ height:14, width:120, marginBottom:10 }} />
        <div className="sk" style={{ height:28, width:280, marginBottom:6 }} />
        <div className="sk" style={{ height:14, width:180 }} />
      </div>

      {/* Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, marginBottom:28 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:16, padding:20 }}>
            <div className="sk" style={{ height:12, width:80, marginBottom:12 }} />
            <div className="sk" style={{ height:28, width:60, marginBottom:8 }} />
            <div className="sk" style={{ height:10, width:100 }} />
          </div>
        ))}
      </div>

      {/* List */}
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:16, overflow:"hidden" }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ padding:"16px 20px", borderBottom:"1px solid #F3F4F6", display:"flex", alignItems:"center", gap:16 }}>
            <div className="sk" style={{ width:40, height:40, borderRadius:"50%", flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div className="sk" style={{ height:13, width:"40%", marginBottom:8 }} />
              <div className="sk" style={{ height:11, width:"60%" }} />
            </div>
            <div className="sk" style={{ height:28, width:72, borderRadius:20 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

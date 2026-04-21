"use client"
import React, { useState, useEffect } from 'react'
import { agentUpdateField, getFieldById, Field, AgentUpdateInput } from '@/utils/api'
import {
  Button,
  // Textarea,
  Chip,
  Card,
  TextArea,
  // CardBody,
} from '@heroui/react'

interface FieldUpdateProps {
  fieldId?: number
  onUpdateComplete?: () => void
}

const stageConfig = {
  Planted:   { color:'#5A9BE8', bg:'rgba(90,155,232,0.10)',  icon:'🌱', border:'rgba(90,155,232,0.25)', desc:'Seeds are in the ground, beginning to germinate.', heroColor:'primary' as const },
  Growing:   { color:'#5EC47A', bg:'rgba(94,196,122,0.10)',  icon:'🌿', border:'rgba(94,196,122,0.25)', desc:'Crops are actively developing — track water and nutrients.', heroColor:'success' as const },
  Ready:     { color:'#E8B84B', bg:'rgba(232,184,75,0.10)',  icon:'🌾', border:'rgba(232,184,75,0.25)', desc:'Crops are mature. Plan harvesting schedule now.', heroColor:'warning' as const },
  Harvested: { color:'#E87A5A', bg:'rgba(232,122,90,0.10)',  icon:'✅', border:'rgba(232,122,90,0.25)', desc:'Harvest complete. Record yield data and prepare for next cycle.', heroColor:'danger' as const },
}

const stages = ['Planted','Growing','Ready','Harvested'] as const

export const FieldUpdate: React.FC<FieldUpdateProps> = ({ fieldId, onUpdateComplete }) => {
  const [field, setField] = useState<Field|null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [updateData, setUpdateData] = useState<AgentUpdateInput>({ current_stage:'Planted', insights:'' })

  useEffect(() => { if (fieldId) fetchFieldDetails() }, [fieldId])

  const fetchFieldDetails = async () => {
    if (!fieldId) return
    setLoading(true)
    try {
      const fieldData = await getFieldById(fieldId)
      setField(fieldData)
      setUpdateData({ current_stage:fieldData.current_stage, insights:fieldData.insights||'' })
    } catch (err: any) {
      setError(err.message||'Failed to fetch field details')
    } finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fieldId) return
    setSubmitting(true)
    setError('')
    try {
      await agentUpdateField(fieldId, updateData)
      setSuccess(true)
      setTimeout(() => { setSuccess(false); if (onUpdateComplete) onUpdateComplete() }, 1500)
    } catch (err: any) {
      setError(err.message||'Failed to update field')
    } finally { setSubmitting(false) }
  }

  const activeStageIdx = stages.indexOf(updateData.current_stage as typeof stages[number])
  const cfg = stageConfig[updateData.current_stage as keyof typeof stageConfig]||stageConfig.Planted

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", background:'#0A0E08', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', color:'#E8E4DA' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .stage-btn { flex:1; padding:12px 8px; border-radius:12px; cursor:pointer; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02); transition:all 0.2s; text-align:center; min-width:0; }
        .stage-btn:hover { border-color:rgba(255,255,255,0.15); background:rgba(255,255,255,0.04); }

        @media (max-width: 480px) {
          .stage-btns { flex-wrap: wrap !important; }
          .stage-btn { flex: 1 1 calc(50% - 6px) !important; }
          .info-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ width:'100%', maxWidth:580 }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#4E8B3A,#7AB85A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🌿</div>
            <span style={{ fontFamily:'Instrument Serif', fontSize:18, color:'#F0EDE4' }}>CropSync</span>
          </div>
          <h1 style={{ fontFamily:'Instrument Serif', fontSize:'clamp(26px,5vw,32px)', color:'#F0EDE4', letterSpacing:'-0.02em', marginBottom:8 }}>Update Field Status</h1>
          {field && <p style={{ fontSize:14, color:'#888', fontWeight:300 }}>{field.field_name} · {field.field_location} · {field.crop_type}</p>}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:60, color:'#666' }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🌿</div>Loading field data…
          </div>
        ) : (
          <>
            {/* Field info */}
            {field && (
              <div style={{ background:'rgba(78,139,58,0.07)', border:'1px solid rgba(78,139,58,0.2)', borderRadius:14, padding:20, marginBottom:28, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }} className="info-grid">
                {[
                  {l:'Current Status',v:field.computed_status},
                  {l:'Planted',v:new Date(field.planting_date).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'})},
                  {l:'Harvest',v:new Date(field.harvesting_date).toLocaleDateString('en-KE',{day:'numeric',month:'short',year:'numeric'})},
                ].map(item=>(
                  <div key={item.l}>
                    <div style={{ fontSize:10, color:'#7AB85A', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{item.l}</div>
                    <div style={{ fontSize:13, color:'#C8C4BB', fontWeight:500 }}>{item.v}</div>
                  </div>
                ))}
              </div>
            )}

            {error && <div style={{ background:'rgba(220,53,69,0.1)', border:'1px solid rgba(220,53,69,0.25)', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:14, color:'#FF8088' }}>{error}</div>}
            {success && <div style={{ background:'rgba(78,139,58,0.15)', border:'1px solid rgba(78,139,58,0.4)', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:14, color:'#7AB85A' }}>✅ Field updated successfully!</div>}

            <form onSubmit={handleSubmit}>
              {/* Stage selector */}
              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:12, color:'#888', display:'block', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.06em' }}>Current Growth Stage</label>
                <div className="stage-btns" style={{ display:'flex', gap:8 }}>
                  {stages.map((s,i)=>{
                    const c=stageConfig[s]
                    const isActive=updateData.current_stage===s
                    const isPast=i<activeStageIdx
                    return (
                      <button key={s} type="button" className="stage-btn" onClick={()=>setUpdateData({...updateData,current_stage:s})}
                        style={{ border:isActive?`1px solid ${c.color}55`:isPast?'1px solid rgba(255,255,255,0.12)':'1px solid rgba(255,255,255,0.06)', background:isActive?c.bg:isPast?'rgba(255,255,255,0.03)':'rgba(255,255,255,0.01)' }}>
                        <div style={{ fontSize:20, marginBottom:6 }}>{c.icon}</div>
                        <div style={{ fontSize:11, fontWeight:isActive?500:400, color:isActive?c.color:isPast?'#C8C4BB':'#666', marginBottom:2 }}>{s}</div>
                        {isActive && <div style={{ width:20, height:2, background:c.color, borderRadius:1, margin:'4px auto 0' }} />}
                      </button>
                    )
                  })}
                </div>
                <div style={{ marginTop:12, padding:'12px 14px', background:cfg.bg, border:`1px solid ${cfg.color}33`, borderRadius:8, fontSize:13, color:cfg.color, lineHeight:1.5 }}>
                  {cfg.icon} {cfg.desc}
                </div>
              </div>

              {/* Insights */}
              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:12, color:'#888', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Field Observations & Insights</label>
                <TextArea
                  placeholder={`Record your observations:\n\n• Crop health and vigour\n• Weather impact on growth\n• Signs of pest or disease\n• Irrigation and soil moisture\n• Estimated days to next stage`}
                  value={updateData.insights}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setUpdateData({...updateData,insights:e.target.value})}
                  required
                  rows={6}
                  variant="secondary"
                  className="text-[#E8E4DA]"
                />
                <div style={{ fontSize:11, color:'#555', marginTop:6 }}>Detailed observations help admins make better decisions.</div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom:28, padding:'18px 20px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:12, color:'#888' }}>Season Progress</span>
                  <span style={{ fontSize:12, color:cfg.color }}>{Math.round(((activeStageIdx+1)/stages.length)*100)}% complete</span>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  {stages.map((s,i)=>(
                    <div key={s} style={{ flex:1, height:5, borderRadius:3, background:i<=activeStageIdx?stageConfig[s].color:'rgba(255,255,255,0.06)', transition:'background 0.3s' }} />
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', gap:12 }}>
                {onUpdateComplete && (
                  <Button type="button" variant="outline" onPress={onUpdateComplete} style={{ flex:1, color:'#888', borderColor:'rgba(255,255,255,0.1)' }}>Cancel</Button>
                )}
                <Button type="submit" variant="primary" isDisabled={submitting||success} style={{ flex:2, fontWeight:500, background: 'rgba(94,196,122,0.2)', borderColor: 'rgba(94,196,122,0.4)', color: '#7AB85A' }}>
                  {success?'✅ Saved!':submitting?'Saving…':'Save Field Update'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
export default FieldUpdate
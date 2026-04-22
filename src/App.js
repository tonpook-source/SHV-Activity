import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  BarChart3 as StatsIcon, // Aliased to fix the ReferenceError
  PlayCircle, 
  ClipboardCheck, 
  Users, 
  ChevronRight, 
  Award,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  Save,
  ArrowLeft,
  User,
  Info,
  Tv,
  PenTool,
  Search,
  CheckCircle,
  FileText,
  TrendingUp,
  Download,
  CheckSquare,
  History,
  Edit3,
  XCircle,
  Flag,
  Filter,
} from 'lucide-react';

// --- Global Styles ---
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const style = document.createElement('style');
style.textContent = `
  body { 
    font-family: 'Sarabun', sans-serif; 
    background-color: #f8fafc;
    color: #1e293b;
    margin: 0;
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(style);

// --- Constants (Global Scope) ---

const activitiesList = [
  { id: 1, title: 'กิจกรรมที่ 1: การปรับฐานความคิดต้านทุจริต', color: 'bg-blue-600' },
  { id: 2, title: 'กิจกรรมที่ 2: การแยกแยะสินบนและประโยชน์ทับซ้อน', color: 'bg-blue-700' },
  { id: 3, title: 'กิจกรรมที่ 3: การวิเคราะห์ความเสี่ยงจากสินบน', color: 'bg-blue-800' },
  { id: 4, title: 'กิจกรรมที่ 4: สร้างสังคมไม่ทนต่อการทุจริต', color: 'bg-[#800000]' },
  { id: 5, title: 'กิจกรรมที่ 5: ต่อต้านทุจริตด้วยจิตพอเพียง', color: 'bg-red-700' },
  { id: 6, title: 'กิจกรรมที่ 6: ยกระดับดัชนี สร้างพลเมืองดี', color: 'bg-slate-700' },
  { id: 7, title: 'กิจกรรมที่ 7: จิตอาสาด้วยเทคโนโลยีดิจิทัล', color: 'bg-blue-900' },
];

const selfEvalQuestions = [
  "1 ฉันคิดว่าการซื้อ/ขายของบนทางเท้าเป็นเรื่องธรรมดาเพราะเป็นผลประโยชน์ของฉัน",
  "2 ถึงแม้จะต้องเสียประโยชน์ส่วนตัวไปบ้าง ฉันก็ยินดีที่จะทำเพื่อส่วนรวม",
  "3 ฉันไม่จอดรถในที่ห้ามจอดเพราะกีดขวางทางจราจรและไม่รักษาประโยชน์ส่วนรวม",
  "4 ฉันรู้สึกอายที่จะทำในสิ่งที่ไม่ถูกไม่ควร",
  "5 ฉันแอบรับเงินจากผู้สมัครผู้ใหญ่บ้าน",
  "6 ฉันชอบเด็ดดอกไม้สวนสาธารณะมาปักแจกันที่บ้านตนเอง",
  "7 ฉันไม่สนใจกับความทุกข์ของผู้อื่นที่ฉันไม่รู้จัก",
  "8 ฉันรู้สึกลำบากใจในการทำสิ่งใดสิ่งหนึ่งเพื่อผู้อื่น",
  "9 ฉันทนไม่ได้เมื่อต้องอยู่ในสถานที่ที่มีกฎระเบียบขัดกับความเคยชินของฉัน",
  "10 ฉันไม่ชอบจอดรถในที่ห้ามจอด"
];

const teacherEvalCriteria = [
  "1. ร่วมกันวางแผนงานบนพื้นฐานของการมีส่วนร่วม",
  "2. มีส่วนร่วมในการเสนอแนวความคิด หรือหนทางหรือวิธีการแก้ปัญหา",
  "3. ให้ความร่วมมือในการทำงาน ให้คำปรึกษาและแลกเปลี่ยนเรียนรู้",
  "4. เปิดใจและยอมรับต่อคำวิจารณ์จากเพื่อนด้วยกัน",
  "5. ตั้งมั่นในการทำงานของตนหรือทีมให้บรรลุเป้าหมาย"
];

const initialStudentsData = [
  { id: "66301010001", name: "นายสมชาย ใจสุจริต", progress: 85, scores: { 1: {selfBefore: [2,3,3,4,2,2,2,2,2,3], selfAfter: [1,4,4,4,1,1,1,1,1,4], quiz: 9, status: 'passed', teacherScore: [4,4,3,4,4]}, 2: {selfBefore: [2,2,2,2,2,2,2,2,2,2], selfAfter: [1,4,4,4,1,1,1,1,1,4], quiz: 8, status: 'passed', teacherScore: [4,3,3,4,3]} } },
  { id: "66301010002", name: "นางสาววิภาดา เรียนดี", progress: 100, scores: { 1: {selfBefore: [3,4,4,4,1,1,1,1,1,4], selfAfter: [1,4,4,4,1,1,1,1,1,4], quiz: 10, status: 'passed', teacherScore: [4,4,4,4,4]}, 2: {selfBefore: [1,1,1,1,1,1,1,1,1,1], selfAfter:[4,4,4,4,4,4,4,4,4,4], quiz: 10, status: 'passed'} } },
  { id: "66301010003", name: "นายธนาวัฒน์ ขยันทำ", progress: 30, scores: { 1: {selfBefore: [4,2,2,2,4,4,4,4,4,2], selfAfter: [2,4,4,4,2,2,2,2,2,4], quiz: 6, status: 'passed', teacherScore: [3,2,2,3,2]} } },
  { id: "66301010004", name: "นางสาวกมลวรรณ จิตอาสา", progress: 65, scores: { 1: {selfBefore: [2,3,3,3,2,2,2,2,2,3], selfAfter: [1,4,4,4,1,1,1,1,1,4], quiz: 8, status: 'passed', teacherScore: [4,4,3,4,4]} } },
  { id: "66301010005", name: "นายปกรณ์ ซื่อสัตย์", progress: 50, scores: { 1: {selfBefore: [1,4,4,4,1,1,1,1,1,4], selfAfter: [1,4,4,4,1,1,1,1,1,4], quiz: 8, status: 'passed', teacherScore: [3,3,3,3,3]} } }
];

// --- Shared Components ---

const RadarChart = ({ values, size = 300, color = "#1e3a8a", labels = [], compareValues = null, maxValue = 4 }) => {
  const padding = 65;
  const center = size / 2;
  const radius = (size / 2) - padding;
  const numPoints = labels.length || 7;
  const angleStep = (Math.PI * 2) / numPoints;

  const getPoints = (vals) => {
    return vals.map((val, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = radius * (val / maxValue);
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');
  };

  const gridLevels = [0.25, 0.5, 0.75, 1].map((level, i) => {
    const points = Array.from({length: numPoints}).map((_, j) => {
      const angle = j * angleStep - Math.PI / 2;
      const r = radius * level;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');
    return <polygon key={i} points={points} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />;
  });

  return (
    <div className="flex flex-col items-center max-w-full">
      <div className="overflow-visible w-full flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible max-w-full h-auto">
          {gridLevels}
          {Array.from({length: numPoints}).map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
          })}
          
          {compareValues && (
            <polygon points={getPoints(compareValues)} fill="rgba(128, 0, 0, 0.1)" stroke="#800000" strokeWidth="2" strokeDasharray="4,2" />
          )}
          
          <polygon points={getPoints(values)} fill={`${color}22`} stroke={color} strokeWidth={3} strokeLinejoin="round" />
          
          {labels.map((label, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + (radius + 28) * Math.cos(angle);
            const y = center + (radius + 15) * Math.sin(angle);
            return <text key={i} x={x} y={y} fontSize="8" textAnchor="middle" className="fill-slate-500 font-bold" style={{fontFamily: 'Sarabun'}}>{label}</text>;
          })}
        </svg>
      </div>
      {compareValues && (
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-[10px] font-bold uppercase tracking-widest px-4 text-center">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#800000] rounded-full"></div> ก่อนร่วมกิจกรรม</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#1e3a8a] rounded-full"></div> หลังร่วมกิจกรรม</div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [userRole, setUserRole] = useState('student');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedActId, setSelectedActId] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentsData[0].id);
  const [students, setStudents] = useState(initialStudentsData);
  const [studentSelfBefore, setStudentSelfBefore] = useState(new Array(10).fill(0));
  const [studentSelfAfter, setStudentSelfAfter] = useState(new Array(10).fill(0));
  const [toast, setToast] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const selectedStudent = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);
  const currentActivity = activitiesList.find(a => a.id === selectedActId);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const isStudentPassSubject = (s) => {
    const passedCount = activitiesList.filter(a => s.scores[a.id]?.status === 'passed').length;
    return passedCount === 7;
  };

  // --- Handlers ---
  const handleTeacherApproval = (sid, aid, status) => {
    setStudents(prev => prev.map(s => {
      if (s.id === sid) {
        const nextScores = { ...s.scores, [aid]: { ...(s.scores[aid] || {}), status: status } };
        const passedCount = activitiesList.filter(a => nextScores[a.id]?.status === 'passed').length;
        return { ...s, scores: nextScores, progress: Math.round((passedCount/7)*100) };
      }
      return s;
    }));
    showToast(`อัปเดตสถานะการอนุมัติกิจกรรมที่ ${aid} สำเร็จ`);
  };

  const handleBulkTeacherScore = (sid, criterionIdx, val) => {
    setStudents(prev => prev.map(s => {
      if (s.id === sid) {
        const studentScores = s.scores || {};
        const currentActData = studentScores[selectedActId] || {};
        const newTeacherScores = [...(currentActData.teacherScore || new Array(5).fill(0))];
        newTeacherScores[criterionIdx] = val;
        return {
           ...s,
           scores: {
             ...studentScores,
             [selectedActId]: { ...currentActData, teacherScore: newTeacherScores }
           }
        };
      }
      return s;
    }));
  };

  const handleStudentSelfEvalSave = () => {
    setStudents(prev => prev.map(s => {
      if (s.id === "66301010001") { 
        return {
          ...s,
          scores: {
            ...s.scores,
            [selectedActId]: { 
              ...s.scores[selectedActId], 
              selfBefore: studentSelfBefore, 
              selfAfter: studentSelfAfter 
            }
          }
        };
      }
      return s;
    }));
    showToast("บันทึกการประเมินตนเอง และส่งข้อมูลวิเคราะห์ให้ครูแล้ว");
  };

  const downloadCSV = () => {
    const header = "รหัสนักศึกษา,ชื่อ-นามสกุล,เฉลี่ยสอบ,เฉลี่ยประเมินตนเอง,ก.1,ก.2,ก.3,ก.4,ก.5,ก.6,ก.7,ผลสรุปวิชา\n";
    const rows = students.map(s => {
      const qMean = (activitiesList.reduce((a,b) => a + (s.scores[b.id]?.quiz || 0), 0)/7).toFixed(1);
      const sMean = (activitiesList.reduce((a,b) => a + (s.scores[b.id]?.selfAfter?.[0] || 0), 0)/7).toFixed(1);
      const acts = activitiesList.map(a => s.scores[a.id]?.status === 'passed' ? 'ผ่าน' : 'ไม่ผ่าน');
      return `${s.id},${s.name},${qMean},${sMean},${acts.join(',')},${isStudentPassSubject(s) ? 'ผ่านวิชา' : 'ไม่ผ่าน'}\n`;
    });
    const blob = new Blob(["\uFEFF" + header + rows.join("")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `integrity_report_${new Date().toLocaleDateString()}.csv`;
    link.click();
    showToast("ดาวน์โหลดรายงานความสัมพันธ์ข้อมูลสำเร็จ");
  };

  // --- Views ---

  const StudentDashboard = () => (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <header className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center border-l-8 border-blue-900">
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">แดชบอร์ดความก้าวหน้าการเรียน</h2>
          <div className="text-slate-400 text-xs md:text-sm font-medium mt-1 uppercase tracking-widest text-left">Strengthen Honesty & Volunteerism Progress</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100 min-w-[140px]">
           <div className="text-[10px] font-bold text-blue-900 uppercase tracking-widest mb-1">ความสำเร็จรวม</div>
           <div className="text-2xl md:text-3xl font-black text-blue-900">85%</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-4 bg-white p-6 md:p-10 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
           <h3 className="text-xs font-bold text-slate-400 uppercase mb-8 md:mb-12 tracking-[0.2em] text-center border-b-2 border-red-200 pb-2 underline decoration-red-700">สมรรถนะพฤติกรรมสุจริต</h3>
           <RadarChart values={[4, 4, 3, 4, 5, 4, 4]} labels={["ก.1", "ก.2", "ก.3", "ก.4", "ก.5", "ก.6", "ก.7"]} maxValue={5} size={250} />
        </div>
        <div className="lg:col-span-8 space-y-3 md:space-y-4">
          <h3 className="font-bold text-slate-700 text-sm px-4 flex items-center gap-2 mb-2"><LayoutDashboard size={18} className="text-blue-600"/> รายการกิจกรรม</h3>
          {activitiesList.map(act => {
            const st = students.find(s=>s.id==="66301010001");
            const isPassed = st.scores[act.id]?.status === 'passed';
            return (
              <div key={act.id} onClick={() => { setSelectedActId(act.id); setActiveTab('activity'); }} className={`group p-4 md:p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedActId === act.id ? 'bg-white border-blue-600 shadow-xl' : 'bg-white border-slate-50 hover:border-blue-200'}`}>
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`w-10 h-10 md:w-14 md:h-14 ${act.color} text-white rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl shadow-lg group-hover:scale-110 transition-transform`}>{act.id}</div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-slate-800">{act.title}</h4>
                    <div className="flex gap-4 mt-1">
                        <div className={`text-[10px] md:text-[11px] font-bold uppercase ${isPassed ? 'text-green-600' : 'text-orange-500'}`}>
                          {isPassed ? 'อนุมัติผ่านแล้ว' : 'รอดำเนินการอนุมัติ'}
                        </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-6 text-right">
                  <div className="hidden sm:block">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Quiz Result</div>
                    <div className="text-sm md:text-lg font-bold text-blue-900">{(st.scores[act.id]?.quiz || 0)}/10</div>
                  </div>
                  <ChevronRight size={24} className="text-slate-200 group-hover:text-blue-900 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const StudentSelfEval = () => (
    <div className="space-y-4 md:space-y-6">
       <div className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center border-l-[12px] border-blue-800">
          <div className="flex items-center gap-4">
             <div className={`p-3 rounded-2xl ${currentActivity.color} text-white shadow-xl`}><PenTool size={24}/></div>
             <div className="text-center md:text-left">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-none uppercase">{currentActivity.title}</h2>
                <div className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">แบบประเมินพฤติกรรมตนเอง (ก่อน-หลัง)</div>
             </div>
          </div>
          <div className="bg-slate-50 px-5 py-2.5 rounded-full flex items-center gap-3 border border-slate-100">
             <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Real-time Analysis Linked</span>
          </div>
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
          <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-[1.5rem] shadow-sm border border-slate-100 space-y-6 max-h-[750px] overflow-y-auto pr-2 md:pr-6 scrollbar-thin">
             <div className="flex justify-between items-center border-b border-slate-100 pb-6 px-4 sticky top-0 bg-white z-20">
                <div className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">รายการประเมิน 10 ข้อ</div>
                <div className="flex gap-10 md:gap-20 mr-4 md:mr-12 text-center whitespace-nowrap">
                   <div className="text-[9px] md:text-[10px] font-bold text-red-700 uppercase tracking-tighter w-16 md:w-24">ก่อนร่วม</div>
                   <div className="text-[9px] md:text-[10px] font-bold text-blue-900 uppercase tracking-tighter w-16 md:w-24">หลังร่วม</div>
                </div>
             </div>
             {selfEvalQuestions.map((q, i) => (
               <div key={i} className="p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-300 transition-all group shadow-sm hover:shadow-xl text-left">
                  <div className="text-sm font-medium text-slate-700 leading-relaxed mb-6 group-hover:text-slate-900">{q}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                     <div className="space-y-2">
                        <div className="flex justify-between gap-1">
                           {[1, 2, 3, 4].map(v => (
                             <button key={v} onClick={() => { let n = [...studentSelfBefore]; n[i] = v; setStudentSelfBefore(n); }} className={`flex-1 py-2 md:py-3 rounded-xl text-[10px] font-bold border-2 transition-all ${studentSelfBefore[i] === v ? 'bg-[#800000] border-[#800000] text-white shadow-lg' : 'bg-white border-slate-100 text-slate-300 hover:border-red-200'}`}>{v}</button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between gap-1">
                           {[1, 2, 3, 4].map(v => (
                             <button key={v} onClick={() => { let n = [...studentSelfAfter]; n[i] = v; setStudentSelfAfter(n); }} className={`flex-1 py-2 md:py-3 rounded-xl text-[11px] font-bold border-2 transition-all ${studentSelfAfter[i] === v ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-300 hover:border-blue-200'}`}>{v}</button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
             ))}
             <div className="sticky bottom-0 pt-8 bg-gradient-to-t from-white via-white to-transparent">
                <button onClick={handleStudentSelfEvalSave} className="w-full py-5 md:py-6 bg-slate-900 text-white rounded-2xl md:rounded-[2.5rem] font-bold text-base md:text-xl flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-900 transition-all active:scale-95 border-b-8 border-red-700">
                    <Save size={24}/> บันทึกการประเมินตนเอง และส่งผลวิเคราะห์
                </button>
             </div>
          </div>
          <div className="lg:col-span-4 bg-white p-6 md:p-10 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center lg:sticky lg:top-28 h-fit">
             <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8 md:mb-12 text-center leading-relaxed italic">กราฟวิเคราะห์พฤติกรรมเปรียบเทียบ<br/><span className="text-blue-900 not-italic font-black">กิจกรรมที่ {selectedActId}</span></h3>
             <RadarChart values={studentSelfAfter} compareValues={studentSelfBefore} size={250} labels={Array.from({length:10}).map((_,i)=>`ข้อ${i+1}`)} />
             <div className="mt-8 md:mt-12 space-y-4 w-full text-center p-6 md:p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="flex justify-between items-center py-2 px-4 bg-white rounded-xl shadow-sm border border-slate-100">
                   <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-tighter">ก่อนเข้าร่วม:</div>
                   <div className="text-base md:text-lg font-bold text-red-500">{(studentSelfBefore.reduce((a,b)=>a+b,0)/10).toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-center py-2 px-4 bg-white rounded-xl shadow-sm border border-slate-100">
                   <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-tighter">หลังเข้าร่วม:</div>
                   <div className="text-base md:text-lg font-bold text-blue-900">{(studentSelfAfter.reduce((a,b)=>a+b,0)/10).toFixed(2)}</div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const StudentQuiz = () => (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700 px-2 md:px-0">
       <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 text-center relative overflow-hidden border-b-8 border-red-400">
          <div className="absolute top-0 left-0 right-0 h-3 bg-blue-900"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight uppercase leading-none">แบบทดสอบหลังทำกิจกรรม</h2>
          <div className="text-[10px] md:text-[11px] text-slate-400 mt-3 uppercase font-bold tracking-[0.3em]">{currentActivity.title}</div>
       </div>
       <div className="space-y-4 md:space-y-6 pb-32">
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <div key={i} className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[1.5rem] shadow-sm border border-slate-100 hover:border-blue-900 transition-all group text-left">
               <div className="text-sm md:text-base font-medium text-slate-700 mb-6 md:mb-8 leading-relaxed flex gap-3 md:gap-4"><span className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center font-bold flex-shrink-0 text-sm md:text-base">Q{i}</span> โจทย์แบบทดสอบประเมินความรู้และความเข้าใจเกี่ยวกับหลักการสุจริต ข้อที่ {i} ของเนื้อหากิจกรรมที่ {selectedActId}</div>
               <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {['ตัวเลือก ก. (คำตอบที่ถูกต้อง)', 'ตัวเลือก ข. (ตัวหลอก)', 'ตัวเลือก ค. (ตัวหลอก)', 'ตัวเลือก ง. (ตัวหลอก)'].map((ans, idx) => (
                    <button key={idx} className="text-left p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold border-2 border-transparent hover:border-blue-900 hover:bg-blue-50 transition-all group-hover:bg-slate-100/50">{ans}</button>
                  ))}
               </div>
            </div>
          ))}
          <button onClick={() => showToast("บันทึกคะแนนสอบ: 10/10 คะแนนเรียบร้อย")} className="w-full py-6 md:py-8 bg-blue-900 text-white rounded-[2rem] font-bold text-xl md:text-2xl shadow-2xl hover:bg-black transition-all active:scale-95 border-b-8 border-red-400">ยืนยันการส่งคำตอบและบันทึกคะแนน</button>
       </div>
    </div>
  );

  const StudentMedia = () => (
    <div className="space-y-6 md:space-y-8 px-2 md:px-0">
       <div className="bg-blue-900 p-10 md:p-16 rounded-[2rem] md:rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-2xl border-b-[12px] border-red-400 text-center md:text-left">
          <div className="relative z-10">
             <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase leading-none">คลังสื่อการเรียนรู้สุจริต</h2>
             <div className="text-blue-300 text-xs md:text-sm font-bold uppercase tracking-[0.4em] mt-4 flex items-center justify-center md:justify-start gap-3">
                <Flag size={20} className="text-red-400 fill-red-400 animate-pulse"/> Honesty & Volunteerism Media
             </div>
          </div>
          <Tv size={180} className="absolute right-[-20px] bottom-[-20px] text-white/5 rotate-12 hidden md:block" />
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 text-left">
          {activitiesList.map(act => (
            <div key={act.id} className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-2">
               <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                  <PlayCircle className="text-white/20 group-hover:text-red-400 transition-all group-hover:scale-110" size={72} />
                  <div className={`absolute top-4 left-4 md:top-6 md:left-6 ${act.color} text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase shadow-2xl`}>{act.title.split(":")[0]}</div>
               </div>
               <div className="p-6 md:p-8">
                  <h4 className="text-base md:text-lg font-bold text-slate-800 line-clamp-2 h-14 leading-relaxed">{act.title}</h4>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                     <div className="text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2"><History size={14}/> Vocational Video</div>
                     <div className="text-[10px] md:text-[11px] font-bold bg-blue-50 text-blue-900 px-3 py-1 rounded-full uppercase tracking-tighter">08:45 MIN</div>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  const TeacherDashboard = () => (
    <div className="space-y-6 md:space-y-8 font-prompt">
       <div className="bg-white p-6 md:p-10 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center border-l-[12px] border-blue-900 text-center md:text-left">
          <div>
             <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight uppercase leading-none">Teacher Tracking Dashboard</h2>
             <div className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-3 italic text-left">วิเคราะห์ความก้าวหน้าและผลการประเมินรายบุคคล (กลุ่มตัวอย่าง 5 คน)</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-inner w-full md:w-auto">
             <Search size={18} className="text-slate-400 ml-2"/><input type="text" placeholder="ค้นหารหัส..." className="bg-transparent border-none text-xs w-full md:w-48 focus:ring-0 font-bold"/>
          </div>
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 pb-10">
          <div className="lg:col-span-4 space-y-4 text-left order-2 lg:order-1 px-1">
             <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] px-4 mb-2 flex items-center gap-2"><Filter size={14}/> รายชื่อนักศึกษา</h3>
             {students.map(s => (
               <div key={s.id} onClick={() => setSelectedStudentId(s.id)} className={`p-4 md:p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer flex items-center justify-between ${selectedStudentId === s.id ? 'bg-blue-900 border-blue-900 text-white shadow-2xl scale-[1.03]' : 'bg-white border-slate-50 hover:border-blue-200 shadow-sm'}`}>
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${selectedStudentId === s.id ? 'bg-white/20' : 'bg-slate-100 text-slate-300'}`}>{s.name.charAt(0)}</div>
                    <div>
                       <div className="text-xs md:text-sm font-bold tracking-tight">{s.name}</div>
                       <div className={`text-[10px] font-bold mt-0.5 ${selectedStudentId === s.id ? 'text-blue-200' : 'text-slate-400'}`}>ID: {s.id}</div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-[11px] font-bold uppercase tracking-tighter mb-1">{s.progress}%</div>
                    <div className="h-1 w-12 md:w-16 bg-slate-200/30 rounded-full overflow-hidden">
                       <div className="h-full bg-red-400" style={{width: `${s.progress}%`}}></div>
                    </div>
                 </div>
               </div>
             ))}
          </div>
          <div className="lg:col-span-8 bg-white p-6 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden text-left order-1 lg:order-2">
             <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 border-4 border-white rounded-[2rem] flex items-center justify-center text-slate-300 shadow-2xl font-black text-2xl uppercase">ST</div>
                   <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight leading-none uppercase">{selectedStudent.name}</h3>
                      <div className="flex flex-wrap gap-2 md:gap-4 mt-4">
                         <span className="text-[9px] md:text-[10px] font-bold text-blue-900 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-sm text-left">สาขาอิเล็กทรอนิกส์</span>
                         <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-sm ${isStudentPassSubject(selectedStudent) ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-100'}`}>
                            {isStudentPassSubject(selectedStudent) ? 'ผ่านวิชาสมบูรณ์' : 'รอดำเนินการวิเคราะห์'}
                         </span>
                      </div>
                   </div>
                </div>
                <div className="bg-slate-900 text-white p-4 md:p-5 rounded-[1.5rem] text-center shadow-xl border-b-4 border-red-400 w-full md:w-auto">
                   <div className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-1">Pass Index</div>
                   <div className="text-2xl font-bold">{activitiesList.filter(a => selectedStudent.scores[a.id]?.status === 'passed').length}/7</div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 border-t border-slate-50 pt-12">
                <div className="flex flex-col items-center">
                   <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-8 md:mb-10 tracking-[0.3em] text-center border-b-2 border-red-400 pb-2 leading-relaxed italic underline-offset-4">พัฒนาการพฤติกรรมรายหน่วย<br/><span className="text-red-700 not-italic uppercase font-black tracking-tighter text-xs">กิจกรรมที่ {selectedActId}</span></h4>
                   <RadarChart values={selectedStudent.scores[selectedActId]?.selfAfter || new Array(10).fill(0)} compareValues={selectedStudent.scores[selectedActId]?.selfBefore || new Array(10).fill(0)} size={240} labels={Array.from({length:10}).map((_,i)=>`ข.${i+1}`)} />
                </div>
                <div className="space-y-4 md:space-y-6 text-left">
                   <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50 pb-4 flex items-center gap-3 italic"><Award size={18} className="text-red-400"/> ผลคะแนนแบบทดสอบ</h4>
                   {activitiesList.map(act => (
                     <div key={act.id} className="flex items-center justify-between group p-2 md:p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-default border border-transparent hover:border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-900 transition-colors uppercase tracking-widest leading-none">{act.title.split(":")[0]}</span>
                        <div className="flex items-center gap-3 md:gap-5">
                           <div className="w-20 md:w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-blue-900 transition-all duration-1000" style={{ width: `${(selectedStudent.scores[act.id]?.quiz || 0) * 10}%` }}></div></div>
                           <span className="text-xs md:text-sm font-bold text-slate-800">{(selectedStudent.scores[act.id]?.quiz || 0)}/10</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const TeacherEvaluation = () => {
    return (
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 text-left px-2 md:px-0 font-prompt">
         <div className="bg-white p-8 md:p-10 rounded-3xl md:rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 border-l-[15px] border-red-600">
            <div className="flex-1 text-center md:text-left">
               <h2 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight leading-none uppercase italic underline decoration-blue-900 decoration-8 underline-offset-8 mb-4">Bulk Assessment</h2>
               <div className="text-slate-400 text-sm font-bold uppercase tracking-[0.4em] mt-6">ประเมินการมีส่วนร่วมของนักเรียนทั้งห้อง (กิจกรรมที่ {selectedActId})</div>
            </div>
            <div className="bg-blue-900 p-3 md:p-4 rounded-2xl md:rounded-[1.5rem] flex items-center gap-4 md:gap-8 shadow-3xl border-b-8 border-red-500 w-full md:w-auto">
               <span className="text-[10px] md:text-[12px] font-bold text-blue-200 uppercase tracking-widest px-4 md:px-6 border-r border-blue-800 whitespace-nowrap">เลือกกิจกรรมประเมินกลุ่ม:</span>
               <select value={selectedActId} onChange={(e) => setSelectedActId(Number(e.target.value))} className="bg-transparent border-none text-white text-xs font-bold focus:ring-0 uppercase tracking-widest cursor-pointer pr-10">
                  {activitiesList.map(a => <option key={a.id} value={a.id} className="text-slate-800">{a.title.split(":")[0]}</option>)}
               </select>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-8 md:gap-10 pb-48">
            {students.map((s) => {
              const currentEval = s.scores[selectedActId]?.teacherScore || new Array(5).fill(0);
              const selfMean = (s.scores[selectedActId]?.selfAfter?.reduce((a,b)=>a+b,0)/10).toFixed(1) || "0.0";
              return (
                <div key={s.id} className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] shadow-sm border border-slate-100 transition-all hover:border-red-600 hover:shadow-2xl group relative overflow-hidden">
                   <div className="absolute top-6 right-6 md:top-12 md:right-12">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] flex flex-col items-center justify-center shadow-2xl group-hover:bg-red-50 transition-all">
                         <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase group-hover:text-red-700 tracking-tighter">Total Score</div>
                         <div className="text-xl md:text-3xl font-bold text-slate-800 group-hover:text-red-700">{currentEval.reduce((a,b)=>a+b,0)}</div>
                      </div>
                   </div>
                   
                   <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 mb-8 md:mb-12 pb-8 md:pb-12 border-b border-slate-50">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-50 border-4 border-white rounded-[1.5rem] flex items-center justify-center text-blue-900 font-bold text-xl md:text-3xl shadow-xl uppercase font-black">ST</div>
                      <div className="flex-1">
                         <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tighter leading-none uppercase">{s.name}</h3>
                         <div className="flex flex-wrap gap-6 mt-4 md:mt-6 items-center">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">ID: {s.id}</div>
                            <div className="hidden md:block h-6 w-px bg-slate-200"></div>
                            <div className="text-xs font-bold text-blue-900 uppercase tracking-widest italic flex items-center gap-2">
                               <PenTool size={14} className="text-red-400"/> นักเรียนประเมินตนเอง: {selfMean} / 4.00
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10">
                      {teacherEvalCriteria.map((q, i) => (
                         <div key={i} className="space-y-4 md:space-y-6 p-2 md:p-4 rounded-2xl hover:bg-slate-50 transition-colors text-left">
                            <div className="text-[10px] md:text-[11px] font-medium text-slate-500 leading-relaxed h-auto md:h-20 overflow-hidden italic border-l-4 border-red-100 pl-4">{q}</div>
                            <div className="flex gap-1.5 md:gap-2.5">
                               {[1,2,3,4].map(v => (
                                 <button 
                                   key={v} 
                                   onClick={() => handleBulkTeacherScore(s.id, i, v)}
                                   className={`flex-1 py-3 md:py-4 rounded-xl md:border-2 font-bold text-xs md:text-sm transition-all transform active:scale-90 ${currentEval[i] === v ? 'bg-red-500 border-red-500 text-white shadow-xl scale-110' : 'bg-white border-slate-100 text-slate-300 hover:border-red-300 hover:text-red-500 hover:shadow-lg'}`}
                                 >
                                    {v}
                                 </button>
                               ))}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              );
            })}
         </div>
         
         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full px-4 max-w-md">
            <button onClick={() => showToast("บันทึกฐานข้อมูลการประเมินนักเรียนครบทุกคนสำเร็จ")} className="w-full py-5 md:py-8 bg-slate-900 text-white rounded-[2rem] md:rounded-[4rem] font-bold text-lg md:text-2xl shadow-[0_40px_100px_rgba(30,58,138,0.4)] flex items-center justify-center gap-4 md:gap-8 hover:bg-black transition-all transform hover:scale-105 active:scale-95 border-b-[10px] border-red-500 uppercase tracking-tighter shadow-blue-900/40 font-prompt">
               <Save size={32}/> บันทึกการประเมินวิชาสุจริต
            </button>
         </div>
      </div>
    );
  };

  const TeacherApproval = () => (
    <div className="space-y-6 md:space-y-10 animate-in slide-in-from-bottom-10 duration-700 text-left font-prompt">
       <div className="bg-white p-8 md:p-12 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-center border-l-[20px] border-blue-900">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tighter uppercase leading-none mb-4 text-blue-900">Final Activity Approval</h2>
            <div className="text-slate-400 text-sm font-bold uppercase tracking-[0.4em] mt-4 flex items-center justify-center md:justify-start gap-3">
               <Flag size={18} className="text-red-500"/> ต้องอนุมัติครบทุกกิจกรรม 1-7 เพื่อ "ผ่านรายวิชา"
            </div>
          </div>
          <div className="flex items-center gap-8 md:gap-12 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-inner">
             <div className="flex items-center gap-3 md:gap-4 text-green-600 font-black"><CheckCircle size={32}/> อนุมัติแล้ว</div>
             <div className="flex items-center gap-3 md:gap-4 text-orange-500 font-black"><AlertCircle size={32}/> รอดำเนินการ</div>
          </div>
       </div>
       <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden border-b-[20px] border-blue-900">
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-blue-900 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-white">
                      <th className="px-8 md:px-16 py-8 md:py-12">ข้อมูลพื้นฐานนักศึกษา</th>
                      {activitiesList.map(a => <th key={a.id} className="px-3 md:px-4 py-8 md:py-12 text-center whitespace-nowrap">กิจกรรม {a.id}</th>)}
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {students.map(s => (
                     <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 md:px-16 py-8 md:py-12 border-r border-slate-50 min-w-[250px]">
                           <div className="text-lg md:text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-900 transition-colors uppercase">{s.name}</div>
                           <div className="text-[10px] md:text-[11px] text-slate-400 font-bold mt-2 tracking-[0.2em] italic">STUDENT UNIQUE ID: {s.id}</div>
                        </td>
                        {activitiesList.map(act => (
                          <td key={act.id} className="px-2 md:px-4 py-8 md:py-12 text-center">
                             <button 
                               onClick={() => handleTeacherApproval(s.id, act.id, s.scores[act.id]?.status === 'passed' ? 'pending' : 'passed')}
                               className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.2rem] flex items-center justify-center mx-auto shadow-xl transition-all transform active:scale-50 border-2 md:border-4 ${s.scores[act.id]?.status === 'passed' ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100' : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'}`}
                             >
                                {s.scores[act.id]?.status === 'passed' ? <CheckCircle size={32}/> : <AlertCircle size={32}/>}
                             </button>
                          </td>
                        ))}
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );

  const TeacherReport = () => {
    return (
      <div className="space-y-6 md:space-y-12 pb-32 text-left font-prompt px-2 md:px-0">
         <div className="bg-[#800000] p-10 md:p-20 rounded-[2rem] md:rounded-[3rem] text-white flex flex-col lg:flex-row justify-between items-center gap-10 shadow-[0_40px_100px_rgba(128,0,0,0.3)] relative overflow-hidden border-b-[20px] border-red-950">
            <div className="relative z-10 text-center lg:text-left">
               <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase">Analytical Report Center</h2>
               <div className="text-red-200 text-sm md:text-lg font-bold uppercase tracking-[0.5em] mt-6 md:mt-8">ระบบสรุปผลการเรียนรู้และข้อมูลสถิติงานวิจัย</div>
            </div>
            <button onClick={downloadCSV} className="relative z-10 bg-white text-red-900 px-10 md:px-16 py-6 md:py-8 rounded-[2rem] md:rounded-[1.5rem] font-bold text-xl md:text-2xl flex items-center justify-center gap-6 shadow-3xl hover:bg-blue-900 hover:text-white transition-all transform hover:scale-110 active:scale-95 group border-b-8 border-slate-200 w-full md:w-auto font-prompt">
               <Download size={40} className="group-hover:animate-bounce"/> EXPORT CSV
            </button>
            <StatsIcon size={300} className="absolute right-[-80px] bottom-[-80px] text-white/5 rotate-12 hidden lg:block" />
         </div>
         
         <div className="grid grid-cols-1 gap-6 md:gap-10">
            {students.map(s => {
              const quizAvg = (activitiesList.reduce((a,b) => a + (s.scores[b.id]?.quiz || 0), 0)/7).toFixed(1);
              const selfAvg = (activitiesList.reduce((a,b) => a + (s.scores[b.id]?.selfAfter?.[0] || 0), 0)/7).toFixed(1);
              const tAvg = (activitiesList.reduce((a,b) => a + (s.scores[b.id]?.teacherScore?.reduce((x,y)=>x+y,0) || 0), 0)/7).toFixed(2);
              const passCount = activitiesList.filter(a => s.scores[a.id]?.status === 'passed').length;
              const completed = isStudentPassSubject(s);
              
              return (
                <div key={s.id} className="bg-white p-8 md:p-14 rounded-[2rem] md:rounded-[3rem] border border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-8 md:gap-16 shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all border-b-[20px] border-slate-50 hover:border-blue-900 group">
                   <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 flex-1 w-full md:min-w-[400px]">
                      <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-50 border-[6px] border-white rounded-[2rem] flex items-center justify-center font-bold text-slate-300 text-3xl md:text-5xl shadow-2xl group-hover:bg-blue-50 group-hover:text-blue-900 transition-all uppercase font-black">ST</div>
                      <div className="text-center md:text-left">
                        <h4 className="font-bold text-slate-800 text-2xl md:text-4xl tracking-tighter leading-none group-hover:text-blue-950 transition-colors uppercase">{s.name}</h4>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mt-6">
                           <span className={`text-[10px] md:text-[12px] font-bold uppercase px-4 md:px-8 py-2 md:py-3 rounded-2xl border-2 shadow-sm flex items-center gap-3 ${completed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-800 border-red-100'}`}>
                              {completed ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                              {completed ? 'ผ่านวิชาสมบูรณ์' : 'รอดำเนินการ (' + passCount + '/7)'}
                           </span>
                           <span className="text-[10px] md:text-[12px] font-bold uppercase px-4 md:px-8 py-2 md:py-3 rounded-2xl bg-slate-50 text-slate-400 border-2 border-slate-100 tracking-widest uppercase">ID: {s.id}</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex flex-wrap gap-10 md:gap-20 items-center justify-center xl:justify-end w-full lg:w-auto">
                      <div className="text-center border-r-4 border-slate-50 pr-8 md:pr-20"><div className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Quiz Mean</div><div className="text-4xl md:text-6xl font-black text-blue-900">{quizAvg}</div></div>
                      <div className="text-center border-r-4 border-slate-50 pr-8 md:pr-20"><div className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">T-Assess</div><div className="text-4xl md:text-6xl font-black text-red-600">{tAvg}</div></div>
                      <button 
                        onClick={() => { setSelectedStudentId(s.id); setShowReportModal(true); }}
                        className="p-6 md:p-10 bg-slate-50 text-slate-300 rounded-[2.5rem] hover:bg-blue-900 hover:text-white transition-all shadow-xl group active:scale-90 border-4 border-white"
                      >
                         <FileText size={48} className="group-hover:scale-110 transition-transform" />
                      </button>
                   </div>
                </div>
              );
            })}
         </div>

         {/* Individual Report Modal */}
         {showReportModal && (
           <div className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10">
              <div className="bg-white w-full max-w-5xl rounded-[3rem] md:rounded-[4rem] shadow-[0_60px_150px_rgba(0,0,0,0.7)] overflow-hidden animate-in zoom-in-95 duration-700 border-b-[30px] border-blue-900 relative">
                 <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-red-800 p-10 md:p-20 text-white flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
                    <div>
                       <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase">สรุปรายงานรายบุคคล</h3>
                       <div className="text-blue-200 text-[10px] md:text-base font-medium uppercase tracking-[0.5em] mt-6 md:mt-8">Educational Progress Statement</div>
                    </div>
                    <button onClick={() => setShowReportModal(false)} className="w-16 h-16 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-3xl transform hover:rotate-90"><XCircle size={40}/></button>
                 </div>
                 <div className="p-10 md:p-20 space-y-12 text-left">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 pb-12 border-b-4 border-slate-50 text-center md:text-left">
                       <div className="w-24 h-24 md:w-36 md:h-36 bg-slate-50 border-[8px] border-white rounded-[2rem] md:rounded-[4rem] flex items-center justify-center font-black text-4xl md:text-6xl text-slate-300 shadow-3xl uppercase">ST</div>
                       <div>
                          <h4 className="text-3xl md:text-6xl font-black text-slate-800 tracking-tighter leading-none uppercase font-prompt">{selectedStudent.name}</h4>
                          <div className="text-xs md:text-xl font-medium text-slate-400 uppercase tracking-[0.4em] mt-6 md:mt-8 flex items-center justify-center md:justify-start gap-4">
                             <div className="w-4 h-4 bg-red-700 rounded-full animate-bounce"></div> RAJBURI TECHNICAL COLLEGE
                          </div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                       <div className="p-8 md:p-16 bg-slate-50 rounded-[3rem] border-4 border-white shadow-2xl relative">
                          <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-l-8 border-blue-900 pl-4">คะแนนรวมเฉลี่ย</div>
                          <div className="text-6xl md:text-8xl font-black text-blue-900 leading-none">{(activitiesList.reduce((a,b) => a + (selectedStudent.scores[b.id]?.teacherScore?.reduce((x,y)=>x+y,0) || 0), 0)/7).toFixed(2)} <span className="text-xl opacity-20 font-bold uppercase tracking-widest ml-4">/ 20.00</span></div>
                       </div>
                       <div className="p-8 md:p-16 bg-slate-50 rounded-[3rem] border-4 border-white shadow-2xl text-center">
                          <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-8 border-l-8 border-red-600 pl-4 text-left">สถานะการอนุมัติ</div>
                          <div className={`text-2xl md:text-5xl font-black uppercase leading-tight ${isStudentPassSubject(selectedStudent) ? 'text-green-600' : 'text-red-700'}`}>
                              {isStudentPassSubject(selectedStudent) ? 'PASSED & APPROVED' : 'PENDING EVALUATION'}
                          </div>
                       </div>
                    </div>

                    <button onClick={() => showToast("ระบบกำลังสร้างไฟล์รายงานสรุปผล (PDF) คุณภาพสูง...")} className="w-full py-8 md:py-10 bg-slate-900 text-white rounded-[2rem] md:rounded-[4rem] font-bold text-2xl md:text-3xl shadow-3xl flex items-center justify-center gap-6 hover:bg-blue-900 transition-all border-b-[15px] border-red-700 active:scale-95 group shadow-black/30 font-prompt">
                       <Download size={40} className="group-hover:animate-bounce"/> DOWNLOAD PDF
                    </button>
                 </div>
              </div>
           </div>
         )}
      </div>
    );
  };

  // --- Main Layout ---

  return (
    <div className="min-h-screen pb-48 md:pb-20 font-prompt overflow-x-hidden">
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[2000] bg-slate-900 text-white px-8 md:px-14 py-5 md:py-8 rounded-full md:rounded-[4rem] shadow-2xl flex items-center gap-6 animate-in fade-in slide-in-from-top-20 border border-slate-700 w-[90%] md:w-auto">
          <div className="w-10 h-10 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center shadow-3xl font-prompt"><CheckCircle2 size={32} className="text-white"/></div>
          <span className="font-bold text-lg md:text-2xl tracking-tighter leading-none">{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-b border-slate-100 z-[800] px-4 md:px-14 h-24 md:h-32 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4 md:gap-8 group cursor-pointer">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-[#800000] rounded-2xl flex items-center justify-center text-white shadow-[0_20px_50px_rgba(128,0,0,0.3)] group-hover:rotate-12 transition-all duration-500 transform group-hover:scale-110">
               <Flag size={32} className="fill-white"/>
            </div>
            <div className="text-left font-prompt">
               <h1 className="text-sm md:text-3xl font-bold text-slate-800 uppercase tracking-tighter leading-none">วิชากิจกรรมเสริมสร้างสุจริต จิตอาสา</h1>
               <div className="hidden md:flex text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] mt-4 items-center gap-4">
                  <div className="w-3 h-3 bg-blue-900 rounded-full animate-pulse"></div> Strengthening Honesty & Volunteerism (ปวส.)
               </div>
            </div>
         </div>
         <div className="bg-slate-100 p-1 rounded-xl md:rounded-[1rem] flex text-[10px] md:text-[13px] font-bold uppercase tracking-[0.1em] shadow-inner border border-slate-200">
            <button onClick={() => {setUserRole('student'); setActiveTab('dashboard');}} className={`px-4 md:px-16 py-3 md:py-6 rounded-lg md:rounded-2xl transition-all duration-700 ${userRole === 'student' ? 'bg-blue-900 text-white shadow-3xl transform scale-105' : 'text-slate-500 hover:bg-white'}`}>STUDENT</button>
            <button onClick={() => {setUserRole('teacher'); setActiveTab('dashboard');}} className={`px-4 md:px-16 py-3 md:py-6 rounded-lg md:rounded-2xl transition-all duration-700 ${userRole === 'teacher' ? 'bg-blue-900 text-white shadow-3xl transform scale-105' : 'text-slate-500 hover:bg-white'}`}>TEACHER</button>
         </div>
      </header>

      {/* Navigation - Sidebar for Desktop, Bottom Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-48 md:left-14 md:w-36 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.15)] border-t md:border-t-0 md:border border-slate-100 rounded-t-3xl md:rounded-[6rem] flex md:flex-col items-center justify-around md:justify-center gap-4 md:gap-16 py-4 md:py-24 z-[700] border-l-0 md:border-l-[15px] border-l-red-700 transition-all hover:border-l-[25px]">
        {[
          { id: 'dashboard', icon: userRole === 'student' ? <LayoutDashboard size={40}/> : <Users size={40}/>, label: userRole === 'student' ? 'HOME' : 'CLASS' },
          { id: 'activity', icon: userRole === 'student' ? <PenTool size={40}/> : <ClipboardCheck size={40}/>, label: userRole === 'student' ? 'ASSESS' : 'EVAL' },
          { id: 'media', icon: userRole === 'student' ? <Tv size={40}/> : <CheckSquare size={40}/>, label: userRole === 'student' ? 'MEDIA' : 'STATUS' },
          { id: 'quiz', icon: userRole === 'student' ? <BookOpen size={40}/> : <FileText size={40}/>, label: userRole === 'student' ? 'QUIZ' : 'DATA' },
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)} 
            className={`p-4 md:p-7 rounded-2xl md:rounded-[2rem] transition-all transform active:scale-50 group relative ${activeTab === item.id ? 'bg-blue-900 text-white shadow-xl rotate-[360deg] scale-110' : 'text-slate-300 hover:text-blue-900'}`}
          >
            {item.icon}
            <span className="hidden md:block absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto pt-32 md:pt-48 md:ml-64 lg:ml-72 px-4 md:px-16 pb-40">
        {userRole === 'student' && activeTab !== 'dashboard' && (
          <div className="flex gap-3 overflow-x-auto pb-8 md:pb-14 scrollbar-hide px-2">
            {activitiesList.map(a => (
              <button 
                key={a.id} 
                onClick={() => { setSelectedActId(a.id); }} 
                className={`px-8 md:px-14 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] text-xs md:text-[15px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-700 border-4 shadow-sm ${selectedActId === a.id ? 'bg-slate-900 text-white border-slate-900 shadow-4xl scale-110 transform translate-y-[-5px]' : 'bg-white text-slate-400 border-slate-50 hover:border-red-400 shadow-md'}`}
              >
                {a.title.split(":")[0]}
              </button>
            ))}
          </div>
        )}

        {userRole === 'student' ? (
          <>
            {activeTab === 'dashboard' && <StudentDashboard />}
            {activeTab === 'activity' && <StudentSelfEval />}
            {activeTab === 'quiz' && <StudentQuiz />}
            {activeTab === 'media' && <StudentMedia />}
          </>
        ) : (
          <>
            {activeTab === 'dashboard' && <TeacherDashboard />}
            {activeTab === 'activity' && <TeacherEvaluation />}
            {activeTab === 'media' && <TeacherApproval />}
            {activeTab === 'quiz' && <TeacherReport />}
          </>
        )}
      </main>

      <footer className="max-w-[1500px] mx-auto md:ml-64 lg:ml-72 mt-20 pt-16 border-t-2 border-slate-100 text-center space-y-4 pb-48 opacity-40 px-4">
         <div className="text-base md:text-xl font-bold uppercase tracking-[0.4em] text-blue-900 leading-none">Strengthening Honesty & Volunteerism Framework v12.0</div>
         <div className="text-[10px] md:text-[12px] font-medium text-red-800 uppercase tracking-[0.2em] leading-relaxed">
           Educational Research Design & Evaluation Project | Independent Study<br/>
           Master of Education (Computer Technology) | Rajburi Technical College
         </div>
      </footer>
    </div>
  );
};

export default App;
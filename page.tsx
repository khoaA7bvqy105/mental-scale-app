"use client";

import React, { useState, useRef } from "react";
import { Activity, Printer, Save, Smartphone, CheckCircle, BrainCircuit } from "lucide-react";

// ==========================================
// 1. DATA STRUCTURES (Cấu trúc câu hỏi & Thang điểm)
// ==========================================

const BECK_QUESTIONS = [
  { id: 1, text: "Nỗi buồn", options: ["Tôi không cảm thấy buồn.", "Nhiều lúc tôi cảm thấy buồn buồn.", "Lúc nào tôi cũng buồn và không thể nguôi được.", "Tôi quá buồn hoặc tuyệt vọng đến mức đau khổ."] },
  { id: 2, text: "Bi quan", options: ["Tôi không nản lòng về tương lai.", "Tôi cảm thấy nản lòng về tương lai hơn trước.", "Tôi cảm thấy chẳng có gì để mong đợi ở tương lai cả.", "Tôi cảm thấy tương lai hoàn toàn tuyệt vọng và mọi thứ chỉ có thể tồi tệ hơn."] },
  { id: 3, text: "Sự thất bại", options: ["Tôi không cảm thấy như một người thất bại.", "Tôi cảm thấy mình đã thất bại hơn một người bình thường.", "Nhìn lại cuộc đời, tôi thấy mình có quá nhiều thất bại.", "Tôi cảm thấy mình là một người thất bại hoàn toàn."] },
  { id: 4, text: "Mất sự thỏa mãn", options: ["Tôi vẫn tìm được những điều thích thú như trước đây.", "Tôi không còn tận hưởng được những điều thích thú như trước nữa.", "Tôi tìm được rất ít sự thỏa mãn từ những việc tôi vẫn thường làm.", "Tôi hoàn toàn không tìm thấy sự thỏa mãn từ bất kỳ việc gì nữa."] },
  { id: 5, text: "Cảm giác có lỗi", options: ["Tôi không cảm thấy mình có lỗi gì đặc biệt.", "Tôi cảm thấy có lỗi về nhiều việc tôi đã làm.", "Hầu như lúc nào tôi cũng cảm thấy mình có lỗi.", "Tôi cảm thấy mình hoàn toàn là người đầy lỗi lầm."] },
];

const HAMILTON_QUESTIONS = [
  { id: 1, text: "Tâm trạng trầm cảm (U sầu, vô vọng, bất lực, vô giá trị)", options: ["Không có", "Nghi ngờ hoặc thoáng qua", "Rõ ràng nhưng thay đổi được", "Thường xuyên, ảnh hưởng chức năng", "Liên tục, mất chức năng hoàn toàn"] },
  { id: 2, text: "Cảm giác có tội (Tự trách mình, cảm thấy là gánh nặng)", options: ["Không có", "Tự trách mình, thấy làm khổ người khác", "Ý tưởng bị tội hoặc suy diễn tội lỗi", "Bệnh nhân cho rằng mình bị trừng phạt do tội lỗi", "Có ảo giác bị buộc tội hoặc kết tội"] },
  { id: 3, text: "Ý tưởng tự sát (Cảm thấy cuộc sống không đáng sống)", options: ["Không có", "Cảm thấy cuộc sống vô vị", "Ước gì mình chết hoặc có ý nghĩ về cái chết", "Có ý định hoặc hành vi tự sát", "Mưu toan tự sát nghiêm trọng"] },
  { id: 4, text: "Rối loạn giấc ngủ - Vào giấc (Khó ngủ ban đầu)", options: ["Không khó khăn", "Đôi khi khó ngủ (hơn 30 phút)", "Đêm nào cũng khó ngủ"] },
  { id: 5, text: "Lo âu tâm thần (Căng thẳng, kém tập trung, lo lắng vô cớ)", options: ["Không có", "Căng thẳng nhẹ và dễ cáu gắt", "Lo lắng về các vấn đề nhỏ nhặt", "Thái độ lo sợ hiện rõ trên nét mặt", "Hoảng sợ kinh hoàng"] },
];

const ZUNG_QUESTIONS = [
  { id: 1, text: "Tôi cảm thấy u sầu và buồn bã", reverse: false },
  { id: 2, text: "Buổi sáng là lúc tôi cảm thấy tốt nhất", reverse: true },
  { id: 3, text: "Tôi có những trận khóc hoặc muốn khóc", reverse: false },
  { id: 4, text: "Tôi bị khó ngủ vào ban đêm", reverse: false },
  { id: 5, text: "Tôi ăn ngon miệng như bình thường", reverse: true },
];

const ZUNG_OPTIONS = [
  { text: "Hiếm khi / Không bao giờ", value: 1 },
  { text: "Thỉnh thoảng", value: 2 },
  { text: "Thường xuyên", value: 3 },
  { text: "Hầu như luôn luôn", value: 4 },
];

// ==========================================
// 2. HELPER FUNCTIONS (Tính điểm & Phân loại)
// ==========================================

const evaluateBeck = (score: number) => {
  if (score <= 13) return { label: "Bình thường / Trầm cảm tối thiểu", color: "text-green-600 bg-green-50 border-green-200" };
  if (score <= 19) return { label: "Trầm cảm nhẹ", color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
  if (score <= 29) return { label: "Trầm cảm vừa", color: "text-orange-600 bg-orange-50 border-orange-200" };
  return { label: "Trầm cảm nặng", color: "text-red-600 bg-red-50 border-red-200" };
};

const evaluateHamilton = (score: number) => {
  if (score < 8) return { label: "Bình thường", color: "text-green-600 bg-green-50 border-green-200" };
  if (score <= 13) return { label: "Trầm cảm nhẹ", color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
  if (score <= 18) return { label: "Trầm cảm vừa", color: "text-orange-600 bg-orange-50 border-orange-200" };
  return { label: "Trầm cảm nặng", color: "text-red-600 bg-red-50 border-red-200" };
};

const evaluateZung = (score: number) => {
  if (score < 50) return { label: "Bình thường", color: "text-green-600 bg-green-50 border-green-200" };
  if (score <= 59) return { label: "Trầm cảm nhẹ", color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
  if (score <= 69) return { label: "Trầm cảm vừa", color: "text-orange-600 bg-orange-50 border-orange-200" };
  return { label: "Trầm cảm nặng", color: "text-red-600 bg-red-50 border-red-200" };
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function MentalScaleApp() {
  const [activeTab, setActiveTab] = useState<"beck" | "hamilton" | "zung">("beck");
  
  // Thông tin hành chính
  const [patientInfo, setPatientInfo] = useState({ name: "", age: "", gender: "Nam", id: "" });
  
  // Trạng thái câu trả lời
  const [beckAnswers, setBeckAnswers] = useState<Record<number, number>>({});
  const [hamiltonAnswers, setHamiltonAnswers] = useState<Record<number, number>>({});
  const [zungAnswers, setZungAnswers] = useState<Record<number, number>>({});
  
  // Lịch sử lưu trữ tạm thời (Production cần kết nối API)
  const [savedRecords, setSavedRecords] = useState<any[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  // Tính tổng điểm hiện tại
  const getBeckTotal = () => Object.values(beckAnswers).reduce((a, b) => a + b, 0);
  const getHamiltonTotal = () => Object.values(hamiltonAnswers).reduce((a, b) => a + b, 0);
  const getZungTotal = () => {
    return Object.entries(zungAnswers).reduce((total, [qId, value]) => {
      const q = ZUNG_QUESTIONS.find((q) => q.id === parseInt(qId));
      const finalValue = q?.reverse ? 5 - value : value;
      return total + finalValue;
    }, 0);
  };

  // Hàm xử lý In PDF bằng lệnh in của trình duyệt (Chuẩn hóa CSS in)
  const handlePrint = () => {
    window.print();
  };

  // Hàm xử lý lưu trữ
  const handleSave = () => {
    if (!patientInfo.name) {
      alert("Vui lòng nhập tên bệnh nhân trước khi lưu!");
      return;
    }
    const record = {
      ...patientInfo,
      date: new Date().toLocaleString("vi-VN"),
      beck: getBeckTotal(),
      hamilton: getHamiltonTotal(),
      zung: getZungTotal(),
    };
    setSavedRecords([record, ...savedRecords]);
    alert("Đã lưu kết quả vào hệ thống thành công!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* HEADER BAR (Có logo Bệnh viện giả lập cấu trúc chuyên nghiệp) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-200">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Bệnh Viện Đa Khoa Trung Ương</h1>
              <p className="text-xs font-semibold text-blue-600 tracking-wider uppercase">Khoa Thần Kinh - Tâm Thần</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
              <Save className="w-4 h-4" /> Lưu Kết Quả
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
              <Printer className="w-4 h-4" /> In Báo Cáo (PDF)
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6" ref={printRef}>
        
        {/* LEFT COLUMN: THÔNG TIN HÀNH CHÍNH & KẾT QUẢ IN */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card thông tin bệnh nhân */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:border-none print:p-0">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span> Hành Chính Bệnh Nhân
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Mã số BN</label>
                <input type="text" placeholder="Ví dụ: BN9921" value={patientInfo.id} onChange={(e) => setPatientInfo({ ...patientInfo, id: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Họ và Tên</label>
                <input type="text" placeholder="Nguyễn Văn A" value={patientInfo.name} onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Tuổi</label>
                  <input type="number" placeholder="30" value={patientInfo.age} onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Giới tính</label>
                  <select value={patientInfo.gender} onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card Tổng hợp điểm số & Phân loại tự động */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:border-none print:p-0">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span> Kết Luận Lâm Sàng
            </h2>
            <div className="space-y-4">
              {/* Thang Beck */}
              <div className="p-3 border rounded-lg transition-all">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">Thang điểm BECK:</span>
                  <span className="font-mono font-bold text-lg text-blue-600">{getBeckTotal()} đ</span>
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-md border font-medium ${evaluateBeck(getBeckTotal()).color}`}>
                  {evaluateBeck(getBeckTotal()).label}
                </div>
              </div>

              {/* Thang Hamilton */}
              <div className="p-3 border rounded-lg transition-all">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">Thang điểm HAMILTON:</span>
                  <span className="font-mono font-bold text-lg text-blue-600">{getHamiltonTotal()} đ</span>
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-md border font-medium ${evaluateHamilton(getHamiltonTotal()).color}`}>
                  {evaluateHamilton(getHamiltonTotal()).label}
                </div>
              </div>

              {/* Thang Zung */}
              <div className="p-3 border rounded-lg transition-all">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">Thang điểm ZUNG:</span>
                  <span className="font-mono font-bold text-lg text-blue-600">{getZungTotal()} đ</span>
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-md border font-medium ${evaluateZung(getZungTotal()).color}`}>
                  {evaluateZung(getZungTotal()).label}
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách bản ghi đã lưu tạm thời (Ẩn khi in) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:hidden">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" /> Nhật Ký Đã Lưu ({savedRecords.length})
            </h2>
            <div className="max-h-40 overflow-y-auto space-y-2 text-xs">
              {savedRecords.length === 0 ? (
                <p className="text-slate-400 italic">Chưa có bản ghi nào được lưu.</p>
              ) : (
                savedRecords.map((r, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-700">{r.name} ({r.age}t)</p>
                      <p className="text-[10px] text-slate-400">{r.date}</p>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-600">
                      B:{r.beck} | H:{r.hamilton} | Z:{r.zung}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: KHU VỰC TRẮC NGHIỆM ĐÁP ỨNG RESPONSIVE */}
        <div className="lg:col-span-2 print:hidden">
          
          {/* TABS CHUYỂN ĐỔI THANG ĐO */}
          <div className="flex bg-slate-200 p-1 rounded-xl mb-4 gap-1">
            <button onClick={() => setActiveTab("beck")} className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "beck" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-950"}`}>
              Thang Beck
            </button>
            <button onClick={() => setActiveTab("hamilton")} className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "hamilton" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-950"}`}>
              Thang Hamilton
            </button>
            <button onClick={() => setActiveTab("zung")} className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "zung" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-950"}`}>
              Thang Zung
            </button>
          </div>

          {/* GIAO DIỆN THANG ĐO BECK */}
          {activeTab === "beck" && (
            <div className="space-y-4 animate-fadeIn">
              {BECK_QUESTIONS.map((q) => (
                <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="font-bold text-slate-900 mb-3 text-sm sm:text-base">{q.id}. {q.text}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, val) => (
                      <button key={val} onClick={() => setBeckAnswers({ ...beckAnswers, [q.id]: val })} className={`w-full text-left px-4 py-3 rounded-lg text-xs sm:text-sm border transition-all flex items-center justify-between ${beckAnswers[q.id] === val ? "bg-blue-50 border-blue-400 text-blue-700 font-semibold" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"}`}>
                        <span>{opt}</span>
                        <span className="font-mono text-xs opacity-60 bg-white px-1.5 py-0.5 rounded border ml-2">{val} đ</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GIAO DIỆN THANG ĐO HAMILTON */}
          {activeTab === "hamilton" && (
            <div className="space-y-4">
              {HAMILTON_QUESTIONS.map((q) => (
                <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="font-bold text-slate-900 mb-3 text-sm sm:text-base">{q.id}. {q.text}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, val) => (
                      <button key={val} onClick={() => setHamiltonAnswers({ ...hamiltonAnswers, [q.id]: val })} className={`w-full text-left px-4 py-3 rounded-lg text-xs sm:text-sm border transition-all flex items-center justify-between ${hamiltonAnswers[q.id] === val ? "bg-blue-50 border-blue-400 text-blue-700 font-semibold" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"}`}>
                        <span>{opt}</span>
                        <span className="font-mono text-xs opacity-60 bg-white px-1.5 py-0.5 rounded border ml-2">{val} đ</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GIAO DIỆN THANG ĐO ZUNG */}
          {activeTab === "zung" && (
            <div className="space-y-4">
              {ZUNG_QUESTIONS.map((q) => (
                <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <p className="font-bold text-slate-900 text-sm sm:text-base">{q.id}. {q.text}</p>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {q.reverse ? "Câu đảo ngược" : "Câu thuận"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ZUNG_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => setZungAnswers({ ...zungAnswers, [q.id]: opt.value })} className={`w-full text-left px-4 py-3 rounded-lg text-xs sm:text-sm border transition-all flex items-center justify-between ${zungAnswers[q.id] === opt.value ? "bg-blue-50 border-blue-400 text-blue-700 font-semibold" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"}`}>
                        <span>{opt.text}</span>
                        <span className="font-mono text-xs opacity-60 bg-white px-1.5 py-0.5 rounded border ml-2">
                          {q.reverse ? 5 - opt.value : opt.value} đ
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* CSS THIẾT LẬP RIÊNG CHO IN ẤN (PRINT MEDIA BUDGET) */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #fff !important;
            color: #000 !important;
            font-size: 12pt;
          }
          header, .print\:hidden {
            display: none !important;
          }
          main {
            display: block !important;
            max-w-full !important;
            padding: 0 !important;
          }
          .print\:border-none {
            border: none !important;
          }
          .print\:p-0 {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

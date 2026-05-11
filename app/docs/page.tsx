const DOCS = [
  {
    category: "시작하기",
    items: [
      { title: "ClientOS 소개", desc: "시스템 개요와 주요 기능을 안내합니다.", badge: "필독" },
      { title: "빠른 시작 가이드", desc: "처음 시작하는 분들을 위한 단계별 안내입니다." },
      { title: "권한 및 역할 설정", desc: "사용자 권한과 역할을 설정하는 방법을 설명합니다." },
    ],
  },
  {
    category: "고객사 관리",
    items: [
      { title: "고객사 등록 방법", desc: "새로운 고객사를 등록하는 절차를 안내합니다." },
      { title: "정보 수정 및 삭제", desc: "등록된 고객사 정보를 수정하거나 삭제하는 방법입니다." },
      { title: "VIP 고객사 지정", desc: "VIP 고객사 지정 기준과 혜택을 설명합니다." },
    ],
  },
  {
    category: "작업 & 히스토리",
    items: [
      { title: "작업 기록 남기기", desc: "작업 히스토리를 기록하고 관리하는 방법입니다." },
      { title: "파일 첨부 가이드", desc: "작업에 파일을 첨부하는 방법과 지원 형식을 안내합니다." },
      { title: "체크리스트 활용", desc: "작업 체크리스트를 효율적으로 활용하는 팁입니다." },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900 mb-1">문서</h1>
        <p className="text-[13px] text-gray-400">
          ClientOS 사용 방법과 가이드를 확인하세요.
        </p>
      </div>

      <div className="space-y-8">
        {DOCS.map((section) => (
          <div key={section.category}>
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
              {section.category}
            </h2>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {section.items.map((item) => (
                <button
                  key={item.title}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm text-gray-800">{item.title}</span>
                      {"badge" in item && item.badge && (
                        <span className="text-[10px] bg-blue-50 text-blue-500 border border-blue-100 rounded px-1.5 py-0.5">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-400">{item.desc}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-200 group-hover:text-gray-400 transition-colors shrink-0 ml-4"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface DocMeta {
  slug: string;
  product: string;
  subcategory: string;
  title: string;
  desc: string;
}

const make = (product: string, subcategory: string, title: string, desc: string): DocMeta => ({
  slug: `${product.toLowerCase()}-${subcategory.toLowerCase().replace(/\s+/g, "-")}-${title.replace(/\s+|[()]/g, "-").toLowerCase()}`,
  product,
  subcategory,
  title,
  desc,
});

export const DOCS_LIST: { product: string; badge?: string; subcategories: { name: string; items: DocMeta[] }[] }[] = [
  {
    product: "Luna",
    badge: "주력 제품",
    subcategories: [
      {
        name: "Luna Client",
        items: [
          make("Luna", "Luna Client", "클라이언트 버전 리스트", "출시된 모든 클라이언트 버전 목록과 릴리즈 날짜를 확인합니다."),
          make("Luna", "Luna Client", "버전 별 특징", "각 클라이언트 버전의 주요 변경사항과 개선 내용을 설명합니다."),
        ],
      },
      {
        name: "Firmware",
        items: [
          make("Luna", "Firmware", "펌웨어 리스트 (FIPS)", "FIPS 인증 펌웨어 버전 목록을 제공합니다."),
          make("Luna", "Firmware", "버전 별 특징", "펌웨어 버전별 기능 변경사항을 설명합니다."),
        ],
      },
      {
        name: "이슈사항",
        items: [
          make("Luna", "이슈사항", "QnA", "자주 묻는 질문과 답변을 정리한 페이지입니다."),
          make("Luna", "이슈사항", "버그", "알려진 버그 목록과 임시 해결방법을 안내합니다."),
        ],
      },
    ],
  },
  {
    product: "PSE",
    subcategories: [
      {
        name: "PTK",
        items: [
          make("PSE", "PTK", "클라이언트 버전 리스트", "출시된 모든 PTK 버전 목록과 릴리즈 날짜를 확인합니다."),
          make("PSE", "PTK", "버전 별 특징", "각 PTK 버전의 주요 변경사항과 개선 내용을 설명합니다."),
        ],
      },
      {
        name: "Firmware",
        items: [
          make("PSE", "Firmware", "펌웨어 리스트 (FIPS)", "PSE FIPS 인증 펌웨어 버전 목록을 제공합니다."),
          make("PSE", "Firmware", "버전 별 특징", "PSE 펌웨어 버전별 기능 변경사항을 설명합니다."),
        ],
      },
      {
        name: "이슈사항",
        items: [
          make("PSE", "이슈사항", "QnA", "PSE 관련 자주 묻는 질문과 답변을 정리한 페이지입니다."),
          make("PSE", "이슈사항", "버그", "PSE 알려진 버그 목록과 임시 해결방법을 안내합니다."),
        ],
      },
    ],
  },
];

// slug → meta 빠른 조회
export const DOCS_META: Record<string, DocMeta> = Object.fromEntries(
  DOCS_LIST.flatMap((p) => p.subcategories.flatMap((s) => s.items)).map((m) => [m.slug, m])
);

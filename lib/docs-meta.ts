export interface DocMeta {
  slug: string;
  product: string;
  subcategory: string;
  title: string;
  desc: string;
}

export const DOCS_LIST: {
  product: string;
  badge?: string;
  subcategories: { name: string; items: DocMeta[] }[];
}[] = [
  {
    product: "Luna",
    badge: "주력 제품",
    subcategories: [
      {
        name: "Luna Client",
        items: [
          { slug: "luna-client-version-list",     product: "Luna", subcategory: "Luna Client", title: "클라이언트 버전 리스트",   desc: "출시된 모든 클라이언트 버전 목록과 릴리즈 날짜를 확인합니다." },
          { slug: "luna-client-version-features", product: "Luna", subcategory: "Luna Client", title: "버전 별 특징",             desc: "각 클라이언트 버전의 주요 변경사항과 개선 내용을 설명합니다." },
        ],
      },
      {
        name: "Firmware",
        items: [
          { slug: "luna-firmware-list-fips",      product: "Luna", subcategory: "Firmware", title: "펌웨어 리스트 (FIPS)", desc: "FIPS 인증 펌웨어 버전 목록을 제공합니다." },
          { slug: "luna-firmware-features",       product: "Luna", subcategory: "Firmware", title: "버전 별 특징",         desc: "펌웨어 버전별 기능 변경사항을 설명합니다." },
        ],
      },
      {
        name: "이슈사항",
        items: [
          { slug: "luna-issue-qna",  product: "Luna", subcategory: "이슈사항", title: "QnA", desc: "자주 묻는 질문과 답변을 정리한 페이지입니다." },
          { slug: "luna-issue-bugs", product: "Luna", subcategory: "이슈사항", title: "버그", desc: "알려진 버그 목록과 임시 해결방법을 안내합니다." },
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
          { slug: "pse-ptk-version-list",     product: "PSE", subcategory: "PTK", title: "클라이언트 버전 리스트", desc: "출시된 모든 PTK 버전 목록과 릴리즈 날짜를 확인합니다." },
          { slug: "pse-ptk-version-features", product: "PSE", subcategory: "PTK", title: "버전 별 특징",           desc: "각 PTK 버전의 주요 변경사항과 개선 내용을 설명합니다." },
        ],
      },
      {
        name: "Firmware",
        items: [
          { slug: "pse-firmware-list-fips", product: "PSE", subcategory: "Firmware", title: "펌웨어 리스트 (FIPS)", desc: "PSE FIPS 인증 펌웨어 버전 목록을 제공합니다." },
          { slug: "pse-firmware-features",  product: "PSE", subcategory: "Firmware", title: "버전 별 특징",         desc: "PSE 펌웨어 버전별 기능 변경사항을 설명합니다." },
        ],
      },
      {
        name: "이슈사항",
        items: [
          { slug: "pse-issue-qna",  product: "PSE", subcategory: "이슈사항", title: "QnA", desc: "PSE 관련 자주 묻는 질문과 답변을 정리한 페이지입니다." },
          { slug: "pse-issue-bugs", product: "PSE", subcategory: "이슈사항", title: "버그", desc: "PSE 알려진 버그 목록과 임시 해결방법을 안내합니다." },
        ],
      },
    ],
  },
];

export const DOCS_META: Record<string, DocMeta> = Object.fromEntries(
  DOCS_LIST.flatMap((p) => p.subcategories.flatMap((s) => s.items)).map((m) => [m.slug, m])
);

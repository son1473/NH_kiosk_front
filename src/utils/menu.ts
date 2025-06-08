// 문자열을 키로 가지고, 숫자를 값으로 가지는 딕셔너리
interface StringNumberDictionary {
  [key: string]: number;
}

export const MENU: StringNumberDictionary= {
  "믹스커피(ICE)": 2000,
  "믹스커피(HOT)": 2000,
  "아메리카노(ICE)": 2000,
  "아메리카노(HOT)": 2000,
  "아이스티(ICE)": 3000,
  "레몬에이드(ICE)": 3000,
  "슬러시(ICE)": 4000,
  "쿠키": 2000,
};

export const menuKey = Object.keys(MENU);

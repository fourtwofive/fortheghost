
/**
 * 간단한 축 정렬 사각형 충돌(AABB) 판정 유틸
 * @param ghostX 유령 중심 X좌표
 * @param ghostY 유령 중심 Y좌표
 * @param ghostWidth 유령의 실제 표시 폭
 * @param ghostHeight 유령의 실제 표시 높이
 * @param itemX 아이템 중심 X좌표
 * @param itemY 아이템 중심 Y좌표
 * @param itemWidth 아이템 폭
 * @param itemHeight 아이템 높이
 * @param ghostScale 유령 히트박스 스케일 (0~1)
 * @param itemScale 아이템 히트박스 스케일 (0~1)
 * @returns 충돌 여부 (boolean)
 */
export function checkCollision(
  ghostX: number,
  ghostY: number,
  ghostWidth: number,
  ghostHeight: number,
  itemX: number,
  itemY: number,
  itemWidth: number,
  itemHeight: number,
  ghostScale: number = 0.7,
  itemScale: number = 0.6
): boolean {
  const g = {
    left: ghostX - (ghostWidth * ghostScale) / 2,
    right: ghostX + (ghostWidth * ghostScale) / 2,
    top: ghostY - (ghostHeight * ghostScale) / 2,
    bottom: ghostY + (ghostHeight * ghostScale) / 2,
  };

  const i = {
    left: itemX - (itemWidth * itemScale) / 2,
    right: itemX + (itemWidth * itemScale) / 2,
    top: itemY - (itemHeight * itemScale) / 2,
    bottom: itemY + (itemHeight * itemScale) / 2,
  };

  return (
    g.right > i.left &&
    g.left < i.right &&
    g.bottom > i.top &&
    g.top < i.bottom
  );
}

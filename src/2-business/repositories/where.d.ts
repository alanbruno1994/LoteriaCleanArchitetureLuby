// C vai indicar o nome de coluna ou dado que referencia coluna e o V
// vai se referir ao tipo de valor da coluna
export interface IWhere<C, V> {
  column: C
  value: V
}

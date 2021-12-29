// Um dos usos disso e para usar em uma consulta com dados de
// uma tabela relacionado
export interface IRelation<TN = string, CTC = string, FJC = string> {
  tableName: TN
  currentTableColumn: CTC
  foreignJoinColumn: FJC
}

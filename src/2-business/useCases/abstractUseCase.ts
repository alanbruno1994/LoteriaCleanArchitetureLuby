export interface IAbstractUseCase<I, O> {
  exec: (props: I, ...args: any[]) => Promise<O>
}

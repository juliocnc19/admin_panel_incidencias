export default interface DataResponse<T> {
  data: T
  detail: string
  token?: string
  length?:number
}

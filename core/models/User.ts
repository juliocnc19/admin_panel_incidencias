import Role from "./Role"

export default interface User {
  id: number
  first_name: string
  last_name: string
  cedula:string
  email: string
  username: string
  password: string
  role_id: number
  created_at: string
  updated_at: string
  token:string
  role:Role
}

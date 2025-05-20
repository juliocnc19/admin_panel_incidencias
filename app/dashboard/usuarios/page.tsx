"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon, EditIcon, TrashIcon } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useGetUsers } from "@/hooks/users/useGetUsers"
import { useCreateUser } from "@/hooks/users/useCreateUser"
import { useUpdateUser } from "@/hooks/users/useUpdateUser"
import { useDeleteUser } from "@/hooks/users/useDeleteUser"
import User from "@/core/models/User"
import { useGetRoles } from "@/hooks/roles/useGetRoles"
import { UserRoleBadge } from "@/components/ui/translations"

export default function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    role_id: currentUser?.role_id,
    cedula: ""
  })
  const { toast } = useToast()
  const itemsPerPage = 5

  // Hooks
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers()
  const { data: rolesData } = useGetRoles()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  useEffect(() => {
    if (usersData?.data) {
      setFilteredUsers(usersData.data)
    }
  }, [usersData])

  useEffect(() => {
    if (searchTerm && usersData?.data) {
      const filtered = usersData.data.filter(
        (user) =>
          `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
      setCurrentPage(1)
    } else if (usersData?.data) {
      setFilteredUsers(usersData.data)
    }
  }, [searchTerm, usersData])

  // Cálculo para paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setCurrentUser(user)
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        password: user.password,
        role_id: user.role_id,
        cedula: user.cedula
      })
    } else {
      setCurrentUser(null)
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        password: "",
        role_id: undefined,
        cedula: ""
      })
    }
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (user: User) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentUser) {
        // Editar usuario existente - excluir password
        const { password, ...updateData } = formData
        await updateUser.mutateAsync({
          ...updateData,
          id: currentUser.id
        })
        toast({
          title: "Usuario actualizado",
          description: `El usuario ${formData.first_name} ${formData.last_name} ha sido actualizado correctamente.`,
        })
      } else {
        // Crear nuevo usuario
        await createUser.mutateAsync(formData)
        toast({
          title: "Usuario creado",
          description: `El usuario ${formData.first_name} ${formData.last_name} ha sido creado correctamente.`,
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al procesar la solicitud.",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async () => {
    if (currentUser) {
      try {
        await deleteUser.mutateAsync(currentUser.id)
        toast({
          title: "Usuario eliminado",
          description: `El usuario ${currentUser.first_name} ${currentUser.last_name} ha sido eliminado correctamente.`,
        })
        setIsDeleteDialogOpen(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al eliminar el usuario.",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <Button onClick={() => handleOpenDialog()}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gestión de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar usuarios..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoadingUsers ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Cédula</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.cedula}</TableCell>
                          <TableCell>
                            <UserRoleBadge role={user.role?.name || 'user'} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(user)}>
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(user)}>
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No se encontraron usuarios
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar usuario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                required
              />
            </div>
            {!currentUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.role_id?.toString()}
                onValueChange={(value) => setFormData({ ...formData, role_id: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData?.data?.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      <UserRoleBadge role={role.name} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
                {currentUser ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Está seguro que desea eliminar al usuario {currentUser?.first_name} {currentUser?.last_name}?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteUser.isPending}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

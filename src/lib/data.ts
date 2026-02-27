import { fakerAR } from '@faker-js/faker'
export type UserTable = {
  name: string
  email: string
  phoneNumber: string
  createAt: string
  status: string
}

const createUsers = (numUser: number) => {
  const users: UserTable[] = []
  for (let i = 0; i < numUser; i++) {
    users.push({
      name: fakerAR.company.name(),
      email: fakerAR.internet.email(),
      phoneNumber: fakerAR.phone.number(),
      createAt: fakerAR.date.past().toISOString().split('T')[0],
      status: fakerAR.helpers.arrayElement(['موثوق', 'قيد التحقق', 'مرفوض']),
    })
  }
  return users
}

export const data: UserTable[] = [...createUsers(100)]

import { Outlet } from 'react-router'

import { EmployeeHeader } from './components/employee-header'
import { EmployeeSidebar } from './components/employee-sidebar'

export function EmployeeLayout() {
  return (
    <div className='flex h-screen overflow-hidden bg-neutral-100'>
      <EmployeeSidebar />
      <main className='flex flex-1 flex-col overflow-hidden'>
        <EmployeeHeader />
        <div className='flex-1 overflow-y-auto bg-neutral-100 p-8'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

import { Head } from 'components/Head'
import { ChangePassword } from '../components/ChangePassword'

export function Account() {
  return (
    <>
      <Head title="Hotel" />
      <div className="px-4 sm:px-6 lg:px-8">
        <ChangePassword />
      </div>
    </>
  )
}

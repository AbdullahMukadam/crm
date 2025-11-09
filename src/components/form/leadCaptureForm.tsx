
import LeadForm from '../ui/form'

interface LeadCaptureFormProps {
  username: string
}
function LeadCaptureForm({ username }: LeadCaptureFormProps) {

  return (
    <div className='w-full bg-zinc-900 h-screen flex items-center justify-center text-white'>
      <LeadForm  username={username} />
    </div>
  )
}

export default LeadCaptureForm
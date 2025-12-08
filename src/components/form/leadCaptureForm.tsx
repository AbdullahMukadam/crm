import LeadForm from '../ui/form'

interface LeadCaptureFormProps {
  username: string
}

function LeadCaptureForm({ username }: LeadCaptureFormProps) {
  return (
    <div className='w-full min-h-screen relative flex items-center justify-center overflow-hidden bg-zinc-950'>
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
      
      {/* Form Container */}
      <div className="relative z-10 w-full">
        <LeadForm username={username} />
      </div>
    </div>
  )
}

export default LeadCaptureForm
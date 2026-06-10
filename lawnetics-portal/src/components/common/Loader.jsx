export default function Loader({ size = 'md', className = '' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sz} rounded-full border-[3px] border-bg-2 border-t-org animate-spin`} />
    </div>
  )
}

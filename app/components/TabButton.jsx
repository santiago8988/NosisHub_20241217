import { cn } from '@/lib/utils/utils.js'


export default function TabButton({
  value,
  activeTab,
  isPending,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        activeTab === value ? 'bg-white text-blue-800' : 'bg-gray-100',
        isPending && 'opacity-50',
        'h-8 rounded-lg text-sm'
      )}
      {...props}
    >
      {isPending ? 'loading' : children}
    </button>
  )
}
import { MdCheckCircle, MdError, MdInfo, MdClose } from 'react-icons/md'
import { useUIStore } from '../../store'

const CONFIG = {
  ok: { Icon: MdCheckCircle, cls: 'border-l-[3px] border-green', iconCls: 'text-green' },
  er: { Icon: MdError,       cls: 'border-l-[3px] border-red',   iconCls: 'text-red'   },
  in: { Icon: MdInfo,        cls: 'border-l-[3px] border-cyan',  iconCls: 'text-cyan'  },
}

function Toast({ id, message, type }) {
  const { removeToast } = useUIStore()
  const { Icon, cls, iconCls } = CONFIG[type] || CONFIG.in

  return (
    <div
      className={`flex items-center gap-[0.58rem] bg-dark text-white px-[1rem] py-[0.62rem] rounded-[8px] max-w-[300px] shadow-lg pointer-events-auto ${cls}`}
      style={{ animation: 'slideLeft 0.25s ease' }}
    >
      <Icon className={`w-[14px] h-[14px] flex-shrink-0 ${iconCls}`} />
      <span className="text-[0.76rem] flex-1">{message}</span>
      <button onClick={() => removeToast(id)} className="ml-auto text-white/40 hover:text-white transition-colors">
        <MdClose className="w-[12px] h-[12px]" />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts } = useUIStore()
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 right-6 z-[5000] flex flex-col gap-[0.4rem] pointer-events-none">
      {toasts.map((t) => <Toast key={t.id} {...t} />)}
    </div>
  )
}

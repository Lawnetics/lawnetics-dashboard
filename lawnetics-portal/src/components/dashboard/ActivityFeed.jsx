import { activityDotColor } from '../../utils/helpers'

export default function ActivityFeed({ items }) {
  return (
    <div className="flex flex-col divide-y divide-border">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-[0.58rem] py-[0.46rem]">
          <span
            className="w-[7px] h-[7px] rounded-full mt-[0.3rem] flex-shrink-0"
            style={{ background: activityDotColor(item.color) }}
          />
          <span
            className="text-[0.75rem] text-text-2 flex-1 leading-[1.5]"
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
          <span className="text-[0.62rem] text-text-3 whitespace-nowrap">{item.time}</span>
        </div>
      ))}
    </div>
  )
}

import { Level } from'../types';  

export default function LevelCard({ title, subtitle, color }: Level) {
  return (
    <div
      className={`p-6 bg-[#1e1e1e] border-l-4 ${color} rounded-xl hover:scale-[1.02] transition-transform cursor-pointer shadow-xl`}
    >
      <h3 className='text-2xl font-bold'>{title}</h3>
      <p className='text-gray-400 font-medium'>{subtitle}</p>
    </div>
  );
}
